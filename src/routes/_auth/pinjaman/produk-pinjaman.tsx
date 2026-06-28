import * as React from "react";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";

import type {
  ProdukPinjamanListResult,
  ProdukPinjamanParams,
  ProdukPinjamanRecord,
} from "@/services/produkPinjamanService";
import { ProdukPinjamanTable } from "@/components/pinjaman/produk-pinjaman/produk-pinjaman-table";
import HeaderComp from "@/components/shared/header-comp";
import { SearchBar } from "@/components/shared/search-bar";
import { getPermissionAccess } from "@/services/permissionService";
import {
  createProdukPinjaman,
  deleteProdukPinjaman,
  getProdukPinjamanList,
  updateProdukPinjaman,
} from "@/services/produkPinjamanService";
import { TableSkeleton } from "@/components/ui/table-skeleton";

const produkPinjamanSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  per_page: z.number().int().positive().catch(10),
  search: z.string().optional(),
});

export const Route = createFileRoute("/_auth/pinjaman/produk-pinjaman")({
  validateSearch: produkPinjamanSearchSchema,
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
    () => getPermissionAccess("produkpinjaman"),
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

  const getProdukPinjamanListFn = useServerFn(getProdukPinjamanList);
  const createProdukPinjamanFn = useServerFn(createProdukPinjaman);
  const updateProdukPinjamanFn = useServerFn(updateProdukPinjaman);
  const deleteProdukPinjamanFn = useServerFn(deleteProdukPinjaman);

  const params: ProdukPinjamanParams = {
    page,
    per_page: perPage,
    search: searchQuery || undefined,
  };

  const { data, isLoading } = useQuery<ProdukPinjamanListResult>({
    queryKey: ["produk-pinjaman", params],
    queryFn: () => getProdukPinjamanListFn({ data: { params } }),
    staleTime: 1000 * 60 * 2,
    enabled: canView,
  });

  const createMutation = useMutation({
    mutationFn: ({ payload }: { payload: Omit<ProdukPinjamanRecord, "id"> }) =>
      createProdukPinjamanFn({ data: { payload } }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["produk-pinjaman"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Omit<ProdukPinjamanRecord, "id">;
    }) => updateProdukPinjamanFn({ data: { id, payload } }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["produk-pinjaman"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }: { id: number }) =>
      deleteProdukPinjamanFn({ data: { id } }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["produk-pinjaman"] }),
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
        to: "/pinjaman/produk-pinjaman",
        search: (prev: any) => ({ ...prev, page: 1 }),
        replace: true,
      });
    }
  }, [navigate, page]);

  const handleAdd = async (payload: Omit<ProdukPinjamanRecord, "id">) => {
    try {
      await createMutation.mutateAsync({ payload });
      setAddErrors(null);
      toast.success("Produk pinjaman berhasil ditambahkan");
      return true;
    } catch (err: any) {
      setAddErrors(
        normalizeApiErrors(err, "Gagal menambahkan produk pinjaman"),
      );
      toast.error(err?.message ?? "Gagal menambahkan produk pinjaman");
      return false;
    }
  };

  const handleEdit = async (payload: ProdukPinjamanRecord) => {
    try {
      const { id, ...rest } = payload;
      await updateMutation.mutateAsync({ id, payload: rest });
      setEditErrors(null);
      toast.success("Produk pinjaman berhasil diperbarui");
      return true;
    } catch (err: any) {
      setEditErrors(
        normalizeApiErrors(err, "Gagal memperbarui produk pinjaman"),
      );
      toast.error(err?.message ?? "Gagal memperbarui produk pinjaman");
      return false;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Produk pinjaman berhasil dihapus");
    } catch (err: any) {
      toast.error(err?.message ?? "Gagal menghapus produk pinjaman");
    }
  };

  const handlePageChange = (newPageIndex: number) => {
    navigate({
      to: "/pinjaman/produk-pinjaman",
      search: (prev: any) => ({ ...prev, page: newPageIndex + 1 }),
      replace: true,
    });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    navigate({
      to: "/pinjaman/produk-pinjaman",
      search: (prev: any) => ({ ...prev, per_page: newPageSize, page: 1 }),
      replace: true,
    });
  };

  const handleSearchChange = (value: string) => {
    navigate({
      to: "/pinjaman/produk-pinjaman",
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
      {isLoading ? (
        <div className="flex flex-col gap-6">
          <div className="h-10 rounded-lg bg-slate-200 animate-pulse" />
          <div className="h-10 rounded-lg bg-slate-100 animate-pulse" />
          <div className="rounded-lg border-2 border-slate-200 bg-white overflow-hidden">
            <TableSkeleton columns={6} rows={10} />
          </div>
        </div>
      ) : (
        <>
          <HeaderComp
            title="Manajemen Produk Pinjaman"
            description="Kelola produk pinjaman"
            icon={<Plus />}
            actionLabel={canManage ? "Tambah Produk" : undefined}
            onAction={canManage ? () => setAddOpen(true) : undefined}
          />

          <SearchBar
            placeholder="Cari produk pinjaman..."
            className="mb-4"
            value={search.search ?? ""}
            onChange={(event) => handleSearchChange(event.target.value)}
          />

          <ProdukPinjamanTable
            data={data?.data ?? []}
            pagination={pagination}
            canManage={canManage}
            canDelete={canDelete}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            addOpen={addOpen}
            onAddOpenChange={(isOpen: boolean) => {
              setAddOpen(isOpen);
              if (!isOpen) setAddErrors(null);
            }}
            addErrors={addErrors}
            editErrors={editErrors}
            onEditClose={() => setEditErrors(null)}
          />
        </>
      )}
    </>
  );
}
