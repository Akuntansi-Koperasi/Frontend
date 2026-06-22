import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { z } from "zod";

import type { RekeningSimpananRecord } from "@/components/simpanan/rekening-simpanan/types";
import {
  MOCK_ANGGOTA_OPTIONS,
  MOCK_PRODUK_SIMPANAN_OPTIONS,
  MOCK_REKENING_SIMPANAN,
} from "@/components/simpanan/rekening-simpanan/types";
import { RekeningSimpananTable } from "@/components/simpanan/rekening-simpanan/rekening-simpanan-table";
import HeaderComp from "@/components/shared/header-comp";
import { SearchBar } from "@/components/shared/search-bar";

const rekeningSimpananSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  per_page: z.number().int().positive().catch(10),
  search: z.string().optional(),
});

export const Route = createFileRoute("/_auth/simpanan/rekening-simpanan")({
  validateSearch: rekeningSimpananSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const search = Route.useSearch();

  const [data, setData] = React.useState<Array<RekeningSimpananRecord>>(
    MOCK_REKENING_SIMPANAN,
  );
  const [addOpen, setAddOpen] = React.useState(false);

  const page = search.page || 1;
  const perPage = search.per_page || 10;
  const searchQuery = (search.search ?? "").trim().toLowerCase();

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;

    const anggotaById = new Map(
      MOCK_ANGGOTA_OPTIONS.map((anggota) => [anggota.id, anggota.nama]),
    );
    const produkById = new Map(
      MOCK_PRODUK_SIMPANAN_OPTIONS.map((produk) => [produk.id, produk.nama]),
    );

    return data.filter((item) => {
      const anggotaNama = (anggotaById.get(item.anggotaId) ?? "").toLowerCase();
      const produkNama = (produkById.get(item.produkId) ?? "").toLowerCase();
      const nomor = item.nomorRekening.toLowerCase();

      return (
        anggotaNama.includes(searchQuery) ||
        produkNama.includes(searchQuery) ||
        nomor.includes(searchQuery)
      );
    });
  }, [data, searchQuery]);

  const pageCount = Math.max(1, Math.ceil(filteredData.length / perPage));
  const safePage = Math.min(Math.max(page, 1), pageCount);
  const pageIndex = safePage - 1;
  const paginatedData = filteredData.slice(
    pageIndex * perPage,
    pageIndex * perPage + perPage,
  );
  const pagination = {
    pageIndex,
    pageSize: perPage,
    pageCount,
    total: filteredData.length,
  };

  React.useEffect(() => {
    if (safePage !== page) {
      navigate({
        to: "/simpanan/rekening-simpanan",
        search: (prev: any) => ({ ...prev, page: safePage }),
        replace: true,
      });
    }
  }, [navigate, page, safePage]);

  const handlePageChange = (newPageIndex: number) => {
    navigate({
      to: "/simpanan/rekening-simpanan",
      search: (prev: any) => ({ ...prev, page: newPageIndex + 1 }),
      replace: true,
    });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    navigate({
      to: "/simpanan/rekening-simpanan",
      search: (prev: any) => ({ ...prev, per_page: newPageSize, page: 1 }),
      replace: true,
    });
  };

  const handleSearchChange = (value: string) => {
    navigate({
      to: "/simpanan/rekening-simpanan",
      search: (prev: any) => ({
        ...prev,
        search: value === "" ? undefined : value,
        page: 1,
      }),
      replace: true,
    });
  };

  const handleAdd = (
    payload: Omit<RekeningSimpananRecord, "id" | "statusTagih"> & {
      statusTagih?: RekeningSimpananRecord["statusTagih"];
    },
  ) => {
    const id = Math.max(0, ...data.map((item) => item.id)) + 1;
    setData((prev) => [
      {
        id,
        ...payload,
        statusTagih: payload.statusTagih ?? "Tagih",
      },
      ...prev,
    ]);
  };

  const handleEdit = (payload: RekeningSimpananRecord) => {
    setData((prev) =>
      prev.map((item) => (item.id === payload.id ? payload : item)),
    );
  };

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      <HeaderComp
        title="Rekening Simpanan"
        description="Kelola rekening simpanan"
        icon={<Plus />}
        actionLabel="Tambah Rekening"
        onAction={() => setAddOpen(true)}
      />

      <SearchBar
        placeholder="Cari periode buku..."
        className="mb-4"
        value={search.search ?? ""}
        onChange={(event) => handleSearchChange(event.target.value)}
      />

      <RekeningSimpananTable
        data={paginatedData}
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addOpen={addOpen}
        onAddOpenChange={setAddOpen}
      />
    </>
  );
}
