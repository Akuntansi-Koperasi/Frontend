import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pencil, Power, Trash2, UserMinus } from "lucide-react";

import { AnggotaActivateAccessDialog } from "./anggota-activate-access-dialog";
import { AnggotaDeleteDialog } from "./anggota-delete-dialog";
import { AnggotaEditDialog } from "./anggota-edit-dialog";
import { AnggotaKeluarkanDialog } from "./anggota-keluarkan-dialog";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import type {
  AnggotaFormErrors,
  AnggotaRecord,
  AnggotaUpsertPayload,
  RoleOption,
} from "./types";

import { DataTablePagination } from "@/components/data-table-pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AnggotaTableProps {
  data: Array<AnggotaRecord>;
  pagination: {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
  canManage: boolean;
  canDelete: boolean;
  canActivateAccess: boolean;
  roleOptions: Array<RoleOption>;
  onPageChange: (newPageIndex: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  onUpdate: (
    payload: AnggotaUpsertPayload & { id: number },
  ) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
  onActivateAccess: (payload: {
    id: number;
    roleId: number;
  }) => Promise<boolean>;
  onKeluarkan: (payload: {
    id: number;
    tanggal_keluar: string;
  }) => Promise<boolean>;
  editErrors?: AnggotaFormErrors;
}

function formatStatusLabel(status: AnggotaRecord["status"]) {
  if (status === "tetap") return "Tetap";
  if (status === "tidak tetap") return "Tidak Tetap";
  return "Keluar";
}

function StatusBadge({ status }: { status: AnggotaRecord["status"] }) {
  const label = formatStatusLabel(status);
  const variant =
    status === "tetap"
      ? "green"
      : status === "tidak tetap"
        ? "secondary"
        : "destructive";
  return (
    <Badge
      variant={variant}
      className="cursor-default rounded-full h-8 px-3 font-bold"
    >
      {label}
    </Badge>
  );
}

function AksesBadge({ akses }: { akses: string | null }) {
  const aktif = akses === "Aktif";
  return (
    <Badge
      variant={aktif ? "green" : "destructive"}
      className="cursor-default rounded-full h-8 px-3 font-bold"
    >
      {akses ?? "Tidak Aktif"}
    </Badge>
  );
}

export function AnggotaTable({
  data,
  pagination,
  canManage,
  canDelete,
  canActivateAccess,
  roleOptions,
  onPageChange,
  onPageSizeChange,
  onUpdate,
  onDelete,
  onActivateAccess,
  onKeluarkan,
  editErrors,
}: AnggotaTableProps) {
  const [sorting] = React.useState<SortingState>([]);

  const [anggotaToEdit, setAnggotaToEdit] =
    React.useState<AnggotaRecord | null>(null);
  const [anggotaToDelete, setAnggotaToDelete] =
    React.useState<AnggotaRecord | null>(null);
  const [anggotaToActivate, setAnggotaToActivate] =
    React.useState<AnggotaRecord | null>(null);
  const [anggotaToKeluarkan, setAnggotaToKeluarkan] =
    React.useState<AnggotaRecord | null>(null);

  const columns = React.useMemo<Array<ColumnDef<AnggotaRecord>>>(
    () => [
      {
        id: "index",
        header: "No.",
        cell: ({ row }) => {
          const index =
            row.index + 1 + pagination.pageIndex * pagination.pageSize;
          return (
            <span className="text-muted-foreground font-medium">{index}.</span>
          );
        },
      },
      {
        accessorKey: "nama",
        header: "Anggota",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-slate-200">
              <AvatarImage src={row.original.photo_profile || ""} />
              <AvatarFallback className="bg-orange-100 text-orange-600 font-medium">
                {row.original.nama.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-left">
              <span className="font-semibold text-slate-900 text-sm">
                {row.original.nama}
              </span>
              <span className="text-xs text-muted-foreground">
                {row.original.email}
              </span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "nomor_ktp",
        header: "Nomor KTP",
        cell: ({ row }) => row.original.ktp || "—",
      },
      {
        accessorKey: "telp",
        header: "Nomor Telepon",
        cell: ({ row }) => row.original.telp || "—",
      },
      {
        accessorKey: "gender",
        header: "Gender",
        cell: ({ row }) => (row.original.gender === "pria" ? "Pria" : "Wanita"),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "akses",
        header: "Akses Sistem",
        cell: ({ row }) => <AksesBadge akses={row.original.akses} />,
      },
      {
        accessorKey: "tanggal_keluar",
        header: "Tanggal Keluar",
        cell: ({ row }) => row.original.tanggal_keluar || "—",
      },
    ],
    [pagination.pageIndex, pagination.pageSize],
  );

  if (canManage || canDelete || canActivateAccess) {
    columns.push({
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 justify-center">
          {canActivateAccess && row.original.akses !== "Aktif" ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 cursor-pointer"
              onClick={() => setAnggotaToActivate(row.original)}
              title="Aktifkan akun akses"
            >
              <Power className="h-4 w-4" />
            </Button>
          ) : null}

          {canManage ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
              onClick={() => setAnggotaToEdit(row.original)}
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          ) : null}

          {canDelete ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
              onClick={() => setAnggotaToDelete(row.original)}
              title="Hapus"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          ) : null}

          {canManage && row.original.status !== "keluar" ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-600 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
              onClick={() => setAnggotaToKeluarkan(row.original)}
              title="Keluarkan"
            >
              <UserMinus className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      ),
    });
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { sorting },
    manualPagination: true,
    pageCount: pagination.pageCount,
  });

  const hasRows = table.getRowModel().rows.length > 0;

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
                    if (index === 1) alignClass = "text-left";
                    return (
                      <TableHead
                        key={header.id}
                        className={`font-semibold text-slate-900 ${alignClass}`}
                      >
                        {flexRender(
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
              {hasRows ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-slate-50">
                    {row.getVisibleCells().map((cell, index) => {
                      let alignClass = "text-center";
                      if (index === 1) alignClass = "text-left";
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
                    Tidak ada anggota ditemukan.
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

      <AnggotaEditDialog
        open={!!anggotaToEdit}
        onOpenChange={(isOpen) => !isOpen && setAnggotaToEdit(null)}
        anggota={anggotaToEdit}
        onSave={(payload) => {
          return onUpdate(payload);
        }}
        errors={editErrors}
      />

      <AnggotaActivateAccessDialog
        open={!!anggotaToActivate}
        onOpenChange={(isOpen) => !isOpen && setAnggotaToActivate(null)}
        anggota={anggotaToActivate}
        roleOptions={roleOptions}
        onActivate={onActivateAccess}
      />

      <AnggotaKeluarkanDialog
        open={!!anggotaToKeluarkan}
        onOpenChange={(isOpen) => !isOpen && setAnggotaToKeluarkan(null)}
        anggota={anggotaToKeluarkan}
        onConfirm={onKeluarkan}
      />

      <AnggotaDeleteDialog
        open={!!anggotaToDelete}
        onOpenChange={(isOpen) => !isOpen && setAnggotaToDelete(null)}
        anggota={anggotaToDelete}
        onConfirm={onDelete}
      />
    </>
  );
}
