import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { ProdukSimpananAddDialog } from "./produk-simpanan-add-dialog";
import { ProdukSimpananEditDialog } from "./produk-simpanan-edit-dialog";
import { ProdukSimpananDeleteDialog } from "./produk-simpanan-delete-dialog";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import type { ProdukSimpananRecord } from "./types";
import { Toaster } from "@/components/ui/sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DataTablePagination } from "@/components/data-table-pagination";

interface ProdukSimpananTableProps {
  data: Array<ProdukSimpananRecord>;
  pagination: {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
  onPageChange: (newPageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onAdd: (payload: Omit<ProdukSimpananRecord, "id">) => Promise<boolean>;
  onEdit: (payload: ProdukSimpananRecord) => Promise<boolean>;
  onDelete: (id: number) => void;
  addOpen: boolean;
  onAddOpenChange: (open: boolean) => void;
  isLoading?: boolean;
  canManage: boolean;
  canDelete: boolean;
  addErrors?: Partial<Record<string, Array<string>>> | null;
  editErrors?: Partial<Record<string, Array<string>>> | null;
  onEditClose?: () => void;
}

export function ProdukSimpananTable({
  data,
  pagination,
  onPageChange,
  onPageSizeChange,
  onAdd,
  onEdit,
  onDelete,
  addOpen,
  onAddOpenChange,
  isLoading,
  canManage,
  canDelete,
  addErrors,
  editErrors,
  onEditClose,
}: ProdukSimpananTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<
    ProdukSimpananRecord | undefined
  >();
  const [deleting, setDeleting] = React.useState<
    ProdukSimpananRecord | undefined
  >();
  const [isDeletingLocal, setIsDeletingLocal] = React.useState(false);

  const handleDeleteConfirm = (id: number) => {
    setIsDeletingLocal(true);
    try {
      onDelete(id);
      setDeleteOpen(false);
      setDeleting(undefined);
    } finally {
      setIsDeletingLocal(false);
    }
  };

  const columns: Array<ColumnDef<ProdukSimpananRecord>> = [
    {
      accessorKey: "id",
      header: () => (
        <div className="text-center font-semibold text-slate-900">No.</div>
      ),
      cell: ({ row }) => (
        <div className="text-center font-medium text-muted-foreground">
          {row.index + 1 + pagination.pageIndex * pagination.pageSize}.
        </div>
      ),
    },
    {
      accessorKey: "nama",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent font-semibold text-slate-900 justify-start cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium text-slate-900">{row.original.nama}</div>
      ),
    },
    {
      accessorKey: "jenis",
      header: () => (
        <div className="text-center font-semibold text-slate-900">Jenis</div>
      ),
      cell: ({ row }) => (
        <div className="text-center font-medium text-slate-700">
          {row.original.jenis}
        </div>
      ),
    },
    {
      accessorKey: "bunga",
      header: () => (
        <div className="text-center font-semibold text-slate-900">Bunga</div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge
            variant="purple"
            className="cursor-default rounded-full h-8 px-3 font-bold"
          >
            {row.original.bunga.toFixed(2)}%
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "nominal",
      header: () => (
        <div className="text-center font-semibold text-slate-900">
          Nominal/Jumlah (Rp)
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge
            variant="green"
            className="cursor-default rounded-full h-8 px-3 font-bold"
          >
            Rp {row.original.nominal.toLocaleString("id-ID")}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "keterangan",
      header: () => (
        <div className="text-left font-semibold text-slate-900">Keterangan</div>
      ),
      cell: ({ row }) => (
        <div className="text-slate-700">{row.original.keterangan}</div>
      ),
    },
  ];

  if (canManage || canDelete) {
    columns.push({
      id: "actions",
      header: () => (
        <div className="text-center font-semibold text-slate-900">Action</div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 justify-center">
          {canManage && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
              onClick={() => {
                setEditing(row.original);
                setEditOpen(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {canDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
              onClick={() => {
                setDeleting(row.original);
                setDeleteOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    });
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <>
      <Card className="shadow-lg border-3 border-slate-200 p-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header, index) => {
                    let alignClass = "text-center";
                    if (index === 1 || index === 5) alignClass = "text-left";

                    return (
                      <TableHead
                        key={header.id}
                        className={`font-semibold text-slate-900 ${alignClass}`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading && !table.getRowModel().rows.length ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-slate-50">
                    {row.getVisibleCells().map((cell, index) => {
                      let alignClass = "text-center";
                      if (index === 1 || index === 5) alignClass = "text-left";

                      return (
                        <TableCell
                          key={cell.id}
                          className={`py-3 ${alignClass}`}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Tidak ada data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <DataTablePagination
            pageIndex={pagination.pageIndex}
            pageCount={pagination.pageCount}
            pageSize={pagination.pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </CardContent>
      </Card>

      {canManage && (
        <ProdukSimpananAddDialog
          open={addOpen}
          onOpenChange={onAddOpenChange}
          onAdd={onAdd}
          errors={addErrors}
        />
      )}

      {canManage && (
        <ProdukSimpananEditDialog
          open={editOpen}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setEditing(undefined);
              onEditClose?.();
            }
            setEditOpen(isOpen);
          }}
          onEdit={onEdit}
          produk={editing}
          errors={editErrors}
        />
      )}

      {canDelete && (
        <ProdukSimpananDeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onConfirm={handleDeleteConfirm}
          produk={deleting}
          isDeleting={isDeletingLocal}
        />
      )}

      <Toaster position="top-right" richColors closeButton theme="light" />
    </>
  );
}
