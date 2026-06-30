import * as React from "react";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { CoaTable } from "@/components/akuntansi/coa/coa-table";
import { SearchBar } from "@/components/shared/search-bar";
import HeaderComp from "@/components/shared/header-comp";
import { TableSkeleton } from "@/components/ui/table-skeleton";

import {
  createCoa,
  deleteCoa,
  getCoaList,
  getKategoriCoaDropdown,
  updateCoa,
} from "@/services/coaService";
import { getPermissionAccess } from "@/services/permissionService";

const coaSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  per_page: z.number().int().positive().catch(10),
  search: z.string().optional(),
});

export const Route = createFileRoute("/_auth/akuntansi/coa")({
  validateSearch: coaSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const queryClient = useQueryClient();
  const { canView, canManage, canDelete } = React.useMemo(
    () => getPermissionAccess("coa"),
    [],
  );

  if (!canView && !canManage && !canDelete) {
    throw notFound();
  }

  const { page, per_page, search: searchQuery } = search;

  const params = { page, per_page, search: searchQuery?.trim() || undefined };

  const getCoaListFn = useServerFn(getCoaList);
  const createCoaFn = useServerFn(createCoa);
  const updateCoaFn = useServerFn(updateCoa);
  const deleteCoaFn = useServerFn(deleteCoa);

  const coaQuery = useQuery({
    queryKey: ["coa", params],
    queryFn: () => getCoaListFn({ data: { params } }),
    staleTime: 1000 * 60 * 2,
    enabled: canView,
  });

  const kategoriQuery = useQuery({
    queryKey: ["kategori-coa-dropdown"],
    queryFn: useServerFn(getKategoriCoaDropdown),
    staleTime: 1000 * 60 * 10,
    enabled: canManage,
  });

  const createMutation = useMutation({
    mutationFn: ({ payload }: { payload: any }) =>
      createCoaFn({ data: { payload } }),
    onSuccess: () => queryClient.invalidateQueries(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      updateCoaFn({ data: { id, payload } }),
    onSuccess: () => queryClient.invalidateQueries(),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }: { id: number }) => deleteCoaFn({ data: { id } }),
    onSuccess: () => queryClient.invalidateQueries(),
  });

  const total = coaQuery.data ? coaQuery.data.total : 0;
  const pageCount = coaQuery.data
    ? Math.max(1, coaQuery.data.last_page)
    : 1;
  const safePage = Math.min(Math.max(page, 1), pageCount);
  const pageIndex = safePage - 1;

  const pagination = {
    pageIndex,
    pageSize: per_page,
    pageCount,
    total,
  };

  const [addOpen, setAddOpen] = React.useState(false);

  React.useEffect(() => {
    if (safePage !== page) {
      navigate({
        to: "/akuntansi/coa",
        search: (prev: any) => ({ ...prev, page: safePage }),
        replace: true,
      });
    }
  }, [navigate, page, safePage]);

  const handleSearchChange = (value: string) => {
    navigate({
      to: "/akuntansi/coa",
      search: (prev: any) => ({
        ...prev,
        search: value === "" ? undefined : value,
        page: 1,
      }),
      replace: true,
    });
  };

  const handleAdd = async (payload: {
    kategori_coa_id: number;
    nama: string;
    kode?: string;
    keterangan?: string;
  }) => {
    try {
      await createMutation.mutateAsync({ payload });
      toast.success("COA berhasil ditambahkan");
      setAddOpen(false);
      return true;
    } catch (err: any) {
      toast.error(err?.message ?? "Gagal menambahkan COA");
      return false;
    }
  };

  const handleEdit = async (payload: {
    id: number;
    kategori_coa_id: number;
    nama: string;
    kode?: string;
    keterangan?: string;
  }) => {
    try {
      await updateMutation.mutateAsync({ id: payload.id, payload });
      toast.success("COA berhasil diperbarui");
      return true;
    } catch (err: any) {
      toast.error(err?.message ?? "Gagal memperbarui COA");
      return false;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("COA berhasil dihapus");
      return true;
    } catch (err: any) {
      toast.error(err?.message ?? "Gagal menghapus COA");
      return false;
    }
  };

  const handlePageChange = (newPageIndex: number) => {
    navigate({
      to: "/akuntansi/coa",
      search: (prev: any) => ({ ...prev, page: newPageIndex + 1 }),
      replace: true,
    });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    navigate({
      to: "/akuntansi/coa",
      search: (prev: any) => ({ ...prev, per_page: newPageSize, page: 1 }),
      replace: true,
    });
  };

  return (
    <>
      {coaQuery.isLoading ? (
        <div className="flex flex-col gap-6">
          <div className="h-10 rounded-lg bg-slate-200 animate-pulse" />
          <div className="h-10 rounded-lg bg-slate-100 animate-pulse" />
          <div className="rounded-lg border-2 border-slate-200 bg-white overflow-hidden">
            <TableSkeleton columns={5} rows={10} />
          </div>
        </div>
      ) : (
        <>
          <HeaderComp
            title="Chart of Accounts"
            description="Kelola Chart of Accounts"
            icon={<Plus />}
            actionLabel={canManage ? "Tambah COA" : undefined}
            onAction={canManage ? () => setAddOpen(true) : undefined}
          />

          <SearchBar
            placeholder="Cari COA..."
            className="mb-4"
            value={search.search ?? ""}
            onChange={(event) => handleSearchChange(event.target.value)}
          />

          <CoaTable
            data={coaQuery.data?.data ?? []}
            pagination={pagination}
            canManage={canManage}
            canDelete={canDelete}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            addOpen={addOpen}
            onAddOpenChange={setAddOpen}
            kategoriOptions={kategoriQuery.data ?? []}
          />
        </>
      )}
    </>
  );
}
