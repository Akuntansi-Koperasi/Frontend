import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  PermissionLevel,
  PermissionMenuItem,
} from "@/components/settings/roles/types";
import type { ColumnDef } from "@tanstack/react-table";

import { Card, CardContent } from "@/components/ui/card";
import { DataTablePagination } from "@/components/data-table-pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DEFAULT_LEVEL_OPTIONS: Array<{ id: PermissionLevel; label: string }> = [
  { id: "tanpa_akses", label: "Tanpa Akses" },
  { id: "lihat", label: "Lihat" },
  { id: "modifikasi", label: "Modifikasi" },
  { id: "admin", label: "Admin" },
];

interface PermissionsTableProps {
  roleName: string;
  menus: Array<PermissionMenuItem>;
  totalMenus: number;
  levels: Record<string, PermissionLevel>;
  onChangeLevel: (menuKey: string, level: PermissionLevel) => void;
  disabled?: boolean;
  levelOptions?: Array<{ id: PermissionLevel; label: string }>;
  pagination: {
    pageIndex: number;
    pageCount: number;
    pageSize: number;
  };
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function PermissionsTable({
  menus,
  levels,
  onChangeLevel,
  disabled = false,
  levelOptions = DEFAULT_LEVEL_OPTIONS,
  pagination,
  onPageChange,
  onPageSizeChange,
}: PermissionsTableProps) {
  const columns: Array<ColumnDef<PermissionMenuItem>> = [
    {
      id: "index",
      header: "No.",
      cell: ({ row }) => (
        <span className="text-muted-foreground font-medium">
          {pagination.pageIndex * pagination.pageSize + row.index + 1}.
        </span>
      ),
    },
    {
      accessorKey: "label",
      header: "Menu",
      cell: ({ row }) => (
        <span className="font-semibold text-slate-900 text-sm">
          {row.original.label}
        </span>
      ),
    },
    {
      id: "level",
      header: "Izin",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Select
            value={levels[row.original.key] ?? "tanpa_akses"}
            onValueChange={(v) =>
              onChangeLevel(row.original.key, v as PermissionLevel)
            }
          >
            <SelectTrigger
              className="h-9 w-auto min-w-fit bg-white cursor-pointer text-sm"
              disabled={disabled}
            >
              <SelectValue placeholder="Pilih level" />
            </SelectTrigger>
            <SelectContent>
              {levelOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id} className="text-sm">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: menus,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-slate-50">
                  {row.getVisibleCells().map((cell, index) => {
                    let alignClass = "text-center";
                    if (index === 1) alignClass = "text-left";

                    return (
                      <TableCell key={cell.id} className={`py-3 ${alignClass}`}>
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
                <TableCell colSpan={3} className="h-24 text-center">
                  Tidak ada menu ditemukan.
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
  );
}
