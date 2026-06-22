import * as React from "react";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

import type { ProdukSimpananParams } from "@/services/produkSimpananService";
import type { ProdukSimpananRecord } from "@/components/simpanan/produk-simpanan/types";
import {
  createProdukSimpanan,
  deleteProdukSimpanan,
  getProdukSimpananList,
  updateProdukSimpanan,
} from "@/services/produkSimpananService";
import { getPermissionAccess } from "@/services/permissionService";

import HeaderComp from "@/components/shared/header-comp";
import { SearchBar } from "@/components/shared/search-bar";
import { ProdukSimpananTable } from "@/components/simpanan/produk-simpanan/produk-simpanan-table";

const produkSimpananSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  per_page: z.number().int().positive().catch(10),
  search: z.string().optional(),
});

export const Route = createFileRoute("/_auth/simpanan/produk-simpanan")({
  validateSearch: produkSimpananSearchSchema,
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
    () => getPermissionAccess("produksimpanan"),
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

  const params: ProdukSimpananParams = {
    page,
    per_page: perPage,
    search: searchQuery || undefined,
  };

  const { data, isLoading } = useQuery<any>({
    queryKey: ["produk-simpanan", params],
    queryFn: () => getProdukSimpananList(params),
    staleTime: 1000 * 60 * 2,
    enabled: canView,
  });

  const createMutation = useMutation({
    mutationFn: createProdukSimpanan,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["produk-simpanan"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Omit<ProdukSimpananRecord, "id">;
    }) => updateProdukSimpanan(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["produk-simpanan"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProdukSimpanan(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["produk-simpanan"] }),
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
        to: "/simpanan/produk-simpanan",
        search: (prev: any) => ({ ...prev, page: 1 }),
        replace: true,
      });
    }
  }, [navigate, page]);

  const handleAdd = async (payload: Omit<ProdukSimpananRecord, "id">) => {
    try {
      await createMutation.mutateAsync(payload);
      setAddErrors(null);
      toast.success("Produk simpanan berhasil ditambahkan");
      return true;
    } catch (err: any) {
      setAddErrors(
        normalizeApiErrors(err, "Gagal menambahkan produk simpanan"),
      );
      toast.error(err?.message ?? "Gagal menambahkan produk simpanan");
      return false;
    }
  };

  const handleEdit = async (payload: ProdukSimpananRecord) => {
    try {
      const { id, ...rest } = payload;
      await updateMutation.mutateAsync({ id, payload: rest });
      setEditErrors(null);
      toast.success("Produk simpanan berhasil diperbarui");
      return true;
    } catch (err: any) {
      setEditErrors(
        normalizeApiErrors(err, "Gagal memperbarui produk simpanan"),
      );
      toast.error(err?.message ?? "Gagal memperbarui produk simpanan");
      return false;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Produk simpanan berhasil dihapus");
    } catch (err: any) {
      toast.error(err?.message ?? "Gagal menghapus produk simpanan");
    }
  };

  const handlePageChange = (newPageIndex: number) => {
    navigate({
      to: "/simpanan/produk-simpanan",
      search: (prev: any) => ({ ...prev, page: newPageIndex + 1 }),
      replace: true,
    });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    navigate({
      to: "/simpanan/produk-simpanan",
      search: (prev: any) => ({ ...prev, per_page: newPageSize, page: 1 }),
      replace: true,
    });
  };

  const handleSearchChange = (value: string) => {
    navigate({
      to: "/simpanan/produk-simpanan",
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
        title="Manajemen Produk Simpanan"
        description="Kelola produk simpanan"
        icon={<Plus />}
        actionLabel={canManage ? "Tambah Simpanan" : undefined}
        onAction={canManage ? () => setAddOpen(true) : undefined}
      />
      <SearchBar
        placeholder="Cari produk simpanan..."
        className="mb-4"
        value={search.search ?? ""}
        onChange={(event) => handleSearchChange(event.target.value)}
      />

      <ProdukSimpananTable
        data={data?.data ?? []}
        isLoading={isLoading}
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
  );
}
