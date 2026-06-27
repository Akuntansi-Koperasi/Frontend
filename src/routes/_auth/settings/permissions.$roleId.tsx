import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import type { PermissionLevel } from "@/components/settings/roles/types";
import { PermissionsTable } from "@/components/settings/roles/permissions-table";
import HeaderComp from "@/components/shared/header-comp";
import { SearchBar } from "@/components/shared/search-bar";
import { getPermissionAccess } from "@/services/permissionService";
import {
  getAllPermissions,
  getRolePermissions,
  updateRolePermissions,
} from "@/services/rolePermissionService";
import { getRoleDropdown } from "@/services/roleService";

const permissionsSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  per_page: z.number().int().positive().catch(10),
  search: z.string().optional(),
});

export const Route = createFileRoute("/_auth/settings/permissions/$roleId")({
  validateSearch: permissionsSearchSchema,
  component: RouteComponent,
});

// ALL_MENUS removed — master menu list is derived from API or role permissions

function RouteComponent() {
  const { roleId } = Route.useParams();
  const navigate = useNavigate();
  const [roleName, setRoleName] = useState<string | null>(null);

  const { canManage, canDelete } = useMemo(
    () => getPermissionAccess("peran"),
    [],
  );

  if (!canManage && !canDelete) {
    throw notFound();
  }

  const { page, per_page, search: searchQuery } = Route.useSearch();

  const [levels, setLevels] = useState<Record<string, PermissionLevel>>({});

  const queryClient = useQueryClient();

  const getRolePermissionsFn = useServerFn(getRolePermissions);
  const getRoleDropdownFn = useServerFn(getRoleDropdown);
  const getAllPermissionsFn = useServerFn(getAllPermissions);
  const updateRolePermissionsFn = useServerFn(updateRolePermissions);

  const rolePermissionsQuery = useQuery({
    queryKey: ["roles", "permissions", roleId],
    queryFn: () => getRolePermissionsFn({ data: { roleId } }),
    staleTime: 1000 * 60 * 2,
  });

  const roleDropdownQuery = useQuery({
    queryKey: ["roles", "dropdown"],
    queryFn: () => getRoleDropdownFn(),
    staleTime: 1000 * 60 * 10,
  });

  const allPermissionsQuery = useQuery({
    queryKey: ["permissions", "all"],
    queryFn: () => getAllPermissionsFn(),
    staleTime: 1000 * 60 * 60,
  });

  const masterMenus = useMemo(() => {
    if (
      Array.isArray(allPermissionsQuery.data) &&
      allPermissionsQuery.data.length > 0
    ) {
      const items = allPermissionsQuery.data;
      const map = new Map<string, string>();
      items.forEach((p) => map.set(p.class, p.menu));
      return Array.from(map.entries()).map(([key, label]) => ({ key, label }));
    }

    if (
      rolePermissionsQuery.data &&
      Array.isArray(rolePermissionsQuery.data.permissions) &&
      rolePermissionsQuery.data.permissions.length > 0
    ) {
      const items = rolePermissionsQuery.data.permissions;
      const map = new Map<string, string>();
      items.forEach((p) => map.set(p.class, p.menu));
      return Array.from(map.entries()).map(([key, label]) => ({ key, label }));
    }

    return [];
  }, [allPermissionsQuery.data, rolePermissionsQuery.data]);

  useEffect(() => {
    const perms = rolePermissionsQuery.data?.permissions ?? [];
    if (perms.length > 0 || masterMenus.length > 0) {
      const nextLevels: Record<string, PermissionLevel> = Object.fromEntries(
        masterMenus.map((m) => [m.key, "tanpa_akses"] as const),
      );
      perms.forEach((p) => {
        if (
          p.class &&
          Object.prototype.hasOwnProperty.call(nextLevels, p.class)
        ) {
          nextLevels[p.class] = p.level;
        }
      });
      setLevels(nextLevels);
    }

    if (roleDropdownQuery.data) {
      const found = roleDropdownQuery.data.find(
        (r) => String(r.id) === String(roleId),
      );
      if (found) setRoleName(found.name);
    }
  }, [masterMenus, rolePermissionsQuery.data, roleDropdownQuery.data, roleId]);

  const normalizeApiErrors = (
    err: unknown,
    fallbackMessage: string,
  ): Partial<Record<string, Array<string>>> => {
    const error = err as {
      apiErrors?: Partial<Record<string, Array<string>>>;
      errors?: Partial<Record<string, Array<string>>>;
      message?: string;
    };
    const apiErrors = error.apiErrors ?? error.errors ?? {};
    const message = error.message ?? fallbackMessage;

    return {
      ...apiErrors,
      general: apiErrors.general?.length ? apiErrors.general : [message],
    };
  };

  const updateMutation = useMutation({
    mutationFn: ({
      roleId,
      permissions,
    }: {
      roleId: string | number;
      permissions: Array<{ class: string; level: string }>;
    }) => updateRolePermissionsFn({ data: { roleId, permissions } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({
        queryKey: ["roles", "permissions", roleId],
      });
    },
  });

  const filtered = useMemo(() => {
    if (!searchQuery) return masterMenus;
    const q = searchQuery.toLowerCase();
    return masterMenus.filter((m) => m.label.toLowerCase().includes(q));
  }, [searchQuery, masterMenus]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / per_page));
  const safePage = Math.min(Math.max(page, 1), pageCount);
  const pageIndex = safePage - 1;
  const paginated = filtered.slice(
    pageIndex * per_page,
    pageIndex * per_page + per_page,
  );

  const pagination = {
    pageIndex,
    pageSize: per_page,
    pageCount,
  };

  const handlePageChange = (newPageIndex: number) => {
    navigate({
      to: "/settings/permissions/$roleId",
      params: { roleId },
      search: (prev: any) => ({ ...prev, page: newPageIndex + 1 }),
      replace: true,
    });
  };

  const handleSearchChange = (value: string) => {
    navigate({
      to: "/settings/permissions/$roleId",
      params: { roleId },
      search: (prev: any) => ({
        ...prev,
        search: value === "" ? undefined : value,
        page: 1,
      }),
      replace: true,
    });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    navigate({
      to: "/settings/permissions/$roleId",
      params: { roleId },
      search: (prev: any) => ({ ...prev, per_page: newPageSize, page: 1 }),
      replace: true,
    });
  };

  const handleChangeLevel = (menuKey: string, level: PermissionLevel) => {
    setLevels((prev) => ({ ...prev, [menuKey]: level }));
  };

  const handleSave = async (): Promise<boolean> => {
    if (!canManage) return false;
    const payload = Object.entries(levels)
      .filter(([, level]) => level !== "tanpa_akses")
      .map(([cls, level]) => ({ class: cls, level }));
    try {
      await updateMutation.mutateAsync({ roleId, permissions: payload });
      toast.success("Hak akses peran berhasil diperbarui");
      return true;
    } catch (err) {
      const apiErrors = normalizeApiErrors(
        err,
        "Gagal menyimpan hak akses peran",
      );
      const error = err as { message?: string };
      const toastMessage =
        error.message ??
        apiErrors.general?.[0] ??
        "Gagal memperbarui hak akses peran";
      toast.error(toastMessage);
      return false;
    }
  };

  useEffect(() => {
    if (safePage !== page) {
      navigate({
        to: "/settings/permissions/$roleId",
        params: { roleId },
        search: (prev: any) => ({ ...prev, page: safePage }),
        replace: true,
      });
    }
  }, [navigate, page, roleId, safePage]);

  return (
    <>
      <HeaderComp
        title={`Hak Akses Peran ${roleName}`}
        description="Kelola hak akses peran"
        icon={<Save />}
        actionLabel="Simpan Hak Akses Peran"
        onAction={handleSave}
      />

      <SearchBar
        placeholder="Cari menu..."
        className="mb-4"
        value={searchQuery ?? ""}
        onChange={(event) => handleSearchChange(event.target.value)}
      />

      <PermissionsTable
        roleName={roleName ?? `Peran #${roleId}`}
        menus={paginated}
        totalMenus={masterMenus.length}
        levels={levels}
        onChangeLevel={handleChangeLevel}
        disabled={!canManage}
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
}
