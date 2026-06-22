import * as React from "react";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

import type { JabatanParams } from "@/services/jabatanService";
import HeaderComp from "@/components/shared/header-comp";
import { SearchBar } from "@/components/shared/search-bar";
import { getPermissionAccess } from "@/services/permissionService";

import { JabatanTable } from "@/components/koperasi/jabatan/jabatan-table";
import {
  createJabatan,
  deleteJabatan,
  getJabatanList,
  updateJabatan,
} from "@/services/jabatanService";

const jabatanSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  per_page: z.number().int().positive().catch(10),
  search: z.string().optional(),
});

export const Route = createFileRoute("/_auth/koperasi/jabatan")({
  validateSearch: jabatanSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const page = search.page;
  const perPage = search.per_page;
  const searchQuery = (search.search ?? "").trim();

  const queryClient = useQueryClient();
  const { canView, canManage, canDelete } = React.useMemo(
    () => getPermissionAccess("jabatan"),
    [],
  );
  if (!canView && !canManage && !canDelete) {
    throw notFound();
  }

  const [addOpen, setAddOpen] = React.useState(false);
  const [addErrors, setAddErrors] = React.useState<Partial<
    Record<string, Array<string>>
  > | null>(null);
  const [editErrors, setEditErrors] = React.useState<Partial<
    Record<string, Array<string>>
  > | null>(null);

  const params: JabatanParams = {
    page,
    per_page: perPage,
    search: searchQuery || undefined,
  };

  const { data, isLoading } = useQuery<any>({
    queryKey: ["jabatan", params],
    queryFn: () => getJabatanList(params),
    staleTime: 1000 * 60 * 2,
    enabled: canView,
  });

  const createMutation = useMutation({
    mutationFn: createJabatan,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jabatan"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      updateJabatan(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jabatan"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteJabatan(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jabatan"] }),
  });

  const normalizeApiErrors = (
    err: any,
    fallbackMessage: string,
  ): Partial<Record<string, Array<string>>> => {
    const apiErrors = err?.apiErrors ?? err?.errors ?? {};
    const message = err?.message ?? fallbackMessage;

    return {
      ...apiErrors,
      general: apiErrors.general?.length ? apiErrors.general : [message],
    };
  };

  const safePage = Math.max(1, page);
  const pageIndex = safePage - 1;

  const pagination = {
    pageIndex,
    pageSize: perPage,
    pageCount: data ? Math.max(1, Math.ceil(data.total / data.per_page)) : 1,
    total: data ? data.total : 0,
  };

  React.useEffect(() => {
    if (page < 1) {
      navigate({
        to: "/koperasi/jabatan",
        search: (prev: any) => ({ ...prev, page: 1 }),
        replace: true,
      });
    }
  }, [navigate, page]);

  const handleAdd = async (payload: {
    nama: string;
    kategori: string;
    multiple: boolean;
  }) => {
    try {
      await createMutation.mutateAsync(payload);
      setAddErrors(null);
      toast.success("Jabatan berhasil ditambahkan");
      return true;
    } catch (err: any) {
      setAddErrors(normalizeApiErrors(err, "Gagal menambahkan jabatan"));
      toast.error(err?.message ?? "Gagal menambahkan jabatan");
      return false;
    }
  };

  const handleEdit = async (payload: {
    id: number;
    nama: string;
    kategori: string;
    multiple: boolean;
  }) => {
    try {
      await updateMutation.mutateAsync({
        id: payload.id,
        payload: {
          nama: payload.nama,
          kategori: payload.kategori,
          multiple: payload.multiple,
        },
      });
      setEditErrors(null);
      toast.success("Jabatan berhasil diperbarui");
      return true;
    } catch (err: any) {
      setEditErrors(normalizeApiErrors(err, "Gagal memperbarui jabatan"));
      toast.error(err?.message ?? "Gagal memperbarui jabatan");
      return false;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Jabatan berhasil dihapus");
    } catch (err: any) {
      toast.error(err?.message ?? "Gagal menghapus jabatan");
    }
  };

  const handlePageChange = (newPageIndex: number) => {
    navigate({
      to: "/koperasi/jabatan",
      search: (prev: any) => ({ ...prev, page: newPageIndex + 1 }),
      replace: true,
    });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    navigate({
      to: "/koperasi/jabatan",
      search: (prev: any) => ({ ...prev, per_page: newPageSize, page: 1 }),
      replace: true,
    });
  };

  const handleSearchChange = (value: string) => {
    navigate({
      to: "/koperasi/jabatan",
      search: (prev: any) => ({
        ...prev,
        search: value === "" ? undefined : value,
        page: 1,
      }),
      replace: true,
    });
  };

  return (
    <>
      <HeaderComp
        title="Manajemen Pengaturan Jabatan"
        description="Kelola jabatan koperasi"
        icon={<Plus />}
        actionLabel={canManage ? "Tambah Jabatan" : undefined}
        onAction={canManage ? () => setAddOpen(true) : undefined}
      />

      <SearchBar
        placeholder="Cari jabatan..."
        className="mb-4"
        value={search.search ?? ""}
        onChange={(event) => handleSearchChange(event.target.value)}
      />

      <JabatanTable
        data={data?.data ?? []}
        isLoading={isLoading}
        pagination={pagination}
        canManage={canManage}
        canDelete={canDelete}
        addOpen={addOpen}
        onAddOpenChange={(isOpen: boolean) => {
          setAddOpen(isOpen);
          if (!isOpen) setAddErrors(null);
        }}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={(id) => handleDelete(id)}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        addErrors={addErrors}
        editErrors={editErrors}
        onEditClose={() => setEditErrors(null)}
      />
    </>
  );
}
