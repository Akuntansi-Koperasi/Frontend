import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import type { RoleFormErrors, RoleParams } from "@/services/roleService";

import { RoleAddDialog } from "@/components/settings/roles/role-add-dialog";
import { RolesTable } from "@/components/settings/roles/roles-table";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import HeaderComp from "@/components/shared/header-comp";
import { SearchBar } from "@/components/shared/search-bar";
import {
  createRole,
  deleteRole,
  getRoleList,
  updateRole,
} from "@/services/roleService";
import { getPermissionAccess } from "@/services/permissionService";

const rolesSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  per_page: z.number().int().positive().catch(10),
  search: z.string().optional(),
});

export const Route = createFileRoute("/_auth/settings/roles")({
  validateSearch: rolesSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const search = Route.useSearch();
  const { canView, canManage, canDelete } = useMemo(
    () => getPermissionAccess("peran"),
    [],
  );

  if (!canView && !canManage && !canDelete) {
    throw notFound();
  }

  const { page, per_page, search: searchQuery } = search;

  const [openAdd, setOpenAdd] = useState(false);
  const [addErrors, setAddErrors] = useState<RoleFormErrors>(null);
  const [editErrors, setEditErrors] = useState<RoleFormErrors>(null);

  const getRoleListFn = useServerFn(getRoleList);
  const createRoleFn = useServerFn(createRole);
  const updateRoleFn = useServerFn(updateRole);
  const deleteRoleFn = useServerFn(deleteRole);

  const params: RoleParams = {
    page,
    per_page,
    search: searchQuery?.trim() || undefined,
  };

  const rolesQuery = useQuery({
    queryKey: ["roles", params],
    queryFn: () => getRoleListFn({ data: { params } }),
    staleTime: 1000 * 60 * 2,
    enabled: canView,
  });

  const createMutation = useMutation({
    mutationFn: ({ payload }: { payload: { name: string } }) =>
      createRoleFn({ data: { payload } }),
    onSuccess: () => queryClient.invalidateQueries(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { name: string } }) =>
      updateRoleFn({ data: { id, payload } }),
    onSuccess: () => queryClient.invalidateQueries(),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }: { id: number }) => deleteRoleFn({ data: { id } }),
    onSuccess: () => queryClient.invalidateQueries(),
  });

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

  const total = rolesQuery.data ? rolesQuery.data.total : 0;
  const pageCount = rolesQuery.data
    ? Math.max(1, Math.ceil(rolesQuery.data.total / rolesQuery.data.per_page))
    : 1;
  const safePage = Math.min(Math.max(page, 1), pageCount);
  const pageIndex = safePage - 1;

  useEffect(() => {
    if (safePage !== page) {
      navigate({
        to: "/settings/roles",
        search: {
          page: safePage,
          per_page,
          search: searchQuery,
        },
        replace: true,
      });
    }
  }, [navigate, page, per_page, safePage, searchQuery]);

  const handleSearchChange = (value: string) => {
    navigate({
      to: "/settings/roles",
      search: {
        page: 1,
        per_page,
        search: value === "" ? undefined : value,
      },
      replace: true,
    });
  };

  const pagination = {
    pageIndex,
    pageSize: per_page,
    pageCount,
    total,
  };

  const handleAdd = async (payload: { name: string }) => {
    try {
      await createMutation.mutateAsync({ payload });
      setAddErrors(null);
      toast.success("Peran berhasil ditambahkan");
      return true;
    } catch (err) {
      setAddErrors(normalizeApiErrors(err, "Gagal menambahkan peran"));
      const error = err as { message?: string };
      toast.error(error.message ?? "Gagal menambahkan peran");
      return false;
    }
  };

  const handleEdit = async ({ id, name }: { id: number; name: string }) => {
    try {
      await updateMutation.mutateAsync({ id, payload: { name } });
      setEditErrors(null);
      toast.success("Peran berhasil diperbarui");
      return true;
    } catch (err) {
      setEditErrors(normalizeApiErrors(err, "Gagal memperbarui peran"));
      const error = err as { message?: string };
      toast.error(error.message ?? "Gagal memperbarui peran");
      return false;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Peran berhasil dihapus");
      return true;
    } catch (err) {
      const error = err as { message?: string };
      toast.error(error.message ?? "Gagal menghapus peran");
      return false;
    }
  };

  return (
    <>
      {rolesQuery.isLoading ? (
        <div className="flex flex-col gap-6">
          <div className="h-10 rounded-lg bg-slate-200 animate-pulse" />
          <div className="h-10 rounded-lg bg-slate-100 animate-pulse" />
          <div className="rounded-lg border-2 border-slate-200 bg-white overflow-hidden">
            <TableSkeleton columns={4} rows={10} />
          </div>
        </div>
      ) : (
        <>
          <HeaderComp
            title="Manajemen Peran"
            description="Kelola peran"
            icon={<Plus />}
            actionLabel={canManage ? "Tambah Peran" : undefined}
            onAction={canManage ? () => setOpenAdd(true) : undefined}
          />
          <RoleAddDialog
            open={openAdd}
            onOpenChange={(isOpen) => {
              setOpenAdd(isOpen);
              if (!isOpen) setAddErrors(null);
            }}
            onAdd={handleAdd}
            errors={addErrors}
          />
          <SearchBar
            placeholder="Cari peran..."
            className="mb-4"
            value={search.search ?? ""}
            onChange={(event) => handleSearchChange(event.target.value)}
          />

          <RolesTable
            data={rolesQuery.data?.data ?? []}
            pagination={pagination}
            canManage={canManage}
            canDelete={canDelete}
            onEdit={handleEdit}
            onDelete={handleDelete}
            editErrors={editErrors}
            onPageChange={(newPageIndex: number) => {
              navigate({
                to: "/settings/roles",
                search: {
                  page: newPageIndex + 1,
                  per_page,
                  search: searchQuery,
                },
                replace: true,
              });
            }}
            onPageSizeChange={(newPageSize: number) => {
              navigate({
                to: "/settings/roles",
                search: {
                  page: 1,
                  per_page: newPageSize,
                  search: searchQuery,
                },
                replace: true,
              });
            }}
          />
        </>
      )}
    </>
  );
}
