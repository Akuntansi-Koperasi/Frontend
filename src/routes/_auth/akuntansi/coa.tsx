import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BookOpen, HelpCircle, Plus } from "lucide-react";
import { z } from "zod";

import type { CoaRecord } from "@/components/akuntansi/coa/types";
import { MOCK_COA } from "@/components/akuntansi/coa/types";
import { CoaTable } from "@/components/akuntansi/coa/coa-table";
import { SearchBar } from "@/components/shared/search-bar";
import { Button } from "@/components/ui/button";

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

  const [data, setData] = React.useState<Array<CoaRecord>>(MOCK_COA);
  const [addOpen, setAddOpen] = React.useState(false);

  const page = search.page || 1;
  const perPage = search.per_page || 10;
  const searchQuery = (search.search ?? "").trim().toLowerCase();

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;

    return data.filter((item) => {
      const kode = item.kode.toLowerCase();
      const nama = item.namaAkun.toLowerCase();
      const kategori = item.kategori.toLowerCase();
      const keterangan = item.keterangan.toLowerCase();

      return (
        kode.includes(searchQuery) ||
        nama.includes(searchQuery) ||
        kategori.includes(searchQuery) ||
        keterangan.includes(searchQuery)
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
        to: "/akuntansi/coa",
        search: (prev: any) => ({ ...prev, page: safePage }),
        replace: true,
      });
    }
  }, [navigate, page, safePage]);

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

  const handleAdd = (payload: Omit<CoaRecord, "id">) => {
    const id = Math.max(0, ...data.map((item) => item.id)) + 1;
    setData((prev) => [{ id, ...payload }, ...prev]);
  };

  const handleEdit = (payload: CoaRecord) => {
    setData((prev) =>
      prev.map((item) => (item.id === payload.id ? payload : item)),
    );
  };

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Chart of Accounts</h1>
          <p className="text-sm text-gray-500">Kelola Chart of Accounts</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Jurnal Umum
          </Button>
          <Button variant="orange" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            Panduan
          </Button>
          <Button variant="green" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" />
            Tambah COA
          </Button>
        </div>
      </div>

      <SearchBar
        placeholder="Cari periode buku..."
        className="mb-4 mt-4"
        value={search.search ?? ""}
        onChange={(event) => handleSearchChange(event.target.value)}
      />

      <CoaTable
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
