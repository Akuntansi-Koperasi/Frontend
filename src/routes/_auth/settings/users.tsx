import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import type { UserFormErrors, UserParams } from "@/services/userService";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "@/services/userService";
import { getAnggotaNoUserDropdown } from "@/services/anggotaService";
import { getRoleDropdown } from "@/services/roleService";
import { getPermissionAccess } from "@/services/permissionService";

import { UserAddDialog } from "@/components/settings/users/user-add-dialog";
import { UsersTable } from "@/components/settings/users/users-table";
import HeaderComp from "@/components/shared/header-comp";
import { SearchBar } from "@/components/shared/search-bar";

// ─── Search Params Schema ─────────────────────────────────────────────────────
const usersSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  per_page: z.number().int().positive().catch(10),
  search: z.string().optional(),
  role: z.enum(["admin", "employee"]).optional(),
});

export const Route = createFileRoute("/_auth/settings/users")({
  validateSearch: usersSearchSchema,
  component: RouteComponent,
});

// Data fetched from API via `getUsers`

// ─── Route Component ──────────────────────────────────────────────────────────
function RouteComponent() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const queryClient = useQueryClient();
  const { canView, canManage, canDelete } = useMemo(
    () => getPermissionAccess("pengguna"),
    [],
  );

  if (!canView && !canManage && !canDelete) {
    throw notFound();
  }

  const { page, per_page, search: searchQuery } = search;

  const params: UserParams = {
    page,
    per_page,
    search: searchQuery?.trim() || undefined,
  };

  const usersQuery = useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    staleTime: 1000 * 60 * 2,
    enabled: canView,
  });

  const anggotaDropdownQuery = useQuery({
    queryKey: ["anggota", "no-user-dropdown"],
    queryFn: getAnggotaNoUserDropdown,
    staleTime: 1000 * 60 * 10,
    enabled: canManage,
  });

  const roleDropdownQuery = useQuery({
    queryKey: ["role", "dropdown"],
    queryFn: getRoleDropdown,
    staleTime: 1000 * 60 * 10,
    enabled: canManage,
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      updateUser(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const total = usersQuery.data ? usersQuery.data.total : 0;
  const pageCount = usersQuery.data
    ? Math.max(1, Math.ceil(usersQuery.data.total / usersQuery.data.per_page))
    : 1;
  const safePage = Math.min(Math.max(page, 1), pageCount);
  const pageIndex = safePage - 1;

  const pagination = {
    pageIndex,
    pageSize: per_page,
    pageCount,
    total,
  };

  const [open, setOpen] = useState(false);
  const [addErrors, setAddErrors] = useState<UserFormErrors>(null);
  const [editErrors, setEditErrors] = useState<UserFormErrors>(null);

  const normalizeApiErrors = (
    err: any,
    fallbackMessage: string,
  ): UserFormErrors => {
    const apiErrors = err?.apiErrors ?? err?.errors ?? {};
    const message = err?.message ?? fallbackMessage;

    return {
      ...apiErrors,
      general: apiErrors.general?.length ? apiErrors.general : [message],
    };
  };

  useEffect(() => {
    if (safePage !== page) {
      navigate({
        to: "/settings/users",
        search: (prev: any) => ({ ...prev, page: safePage }),
        replace: true,
      });
    }
  }, [navigate, page, safePage]);

  const handleSearchChange = (value: string) => {
    navigate({
      to: "/settings/users",
      search: (prev: any) => ({
        ...prev,
        search: value === "" ? undefined : value,
        page: 1,
      }),
      replace: true,
    });
  };
  const handleAdd = async (payload: Parameters<typeof createUser>[0]) => {
    try {
      await createMutation.mutateAsync(payload);
      setAddErrors(null);
      toast.success("Pengguna berhasil dibuat");
      return true;
    } catch (err: any) {
      const apiErr = normalizeApiErrors(err, "Gagal membuat pengguna");
      setAddErrors(apiErr);
      toast.error(err?.message ?? "Gagal membuat pengguna");
      return false;
    }
  };

  const handleEdit = async ({
    id,
    role_id,
  }: {
    id: number;
    role_id: number;
  }) => {
    try {
      await updateMutation.mutateAsync({ id, payload: { role_id } });
      setEditErrors(null);
      toast.success("Pengguna berhasil diperbarui");
      return true;
    } catch (err: any) {
      const apiErr = normalizeApiErrors(err, "Gagal memperbarui pengguna");
      setEditErrors(apiErr);
      toast.error(err?.message ?? "Gagal memperbarui pengguna");
      return false;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Pengguna berhasil dihapus");
      return true;
    } catch (err: any) {
      toast.error(err?.message ?? "Gagal menghapus pengguna");
      return false;
    }
  };

  return (
    <>
      <HeaderComp
        title="Manajemen Pengguna"
        description="Kelola akun akses anggota"
        icon={<Plus />}
        actionLabel={canManage ? "Aktifkan Pengguna" : undefined}
        onAction={canManage ? () => setOpen(true) : undefined}
      />

      <UserAddDialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) setAddErrors(null);
        }}
        onCreate={handleAdd}
        errors={addErrors}
        anggotaOptions={anggotaDropdownQuery.data ?? []}
        roleOptions={roleDropdownQuery.data ?? []}
      />

      <SearchBar
        placeholder="Cari pengguna..."
        className="mb-4"
        value={searchQuery ?? ""}
        onChange={(event) => handleSearchChange(event.target.value)}
      />

      <UsersTable
        data={usersQuery.data?.data ?? []}
        isLoading={usersQuery.isLoading}
        pagination={pagination}
        canManage={canManage}
        canDelete={canDelete}
        onPageChange={(newPageIndex: number) => {
          navigate({
            to: "/settings/users",
            search: (prev: any) => ({ ...prev, page: newPageIndex + 1 }),
            replace: true,
          });
        }}
        onPageSizeChange={(newPageSize: number) => {
          navigate({
            to: "/settings/users",
            search: (prev: any) => ({
              ...prev,
              per_page: newPageSize,
              page: 1,
            }),
            replace: true,
          });
        }}
        onUpdate={handleEdit}
        onDelete={handleDelete}
        editErrors={editErrors}
        roleOptions={roleDropdownQuery.data ?? []}
      />
    </>
  );
}
