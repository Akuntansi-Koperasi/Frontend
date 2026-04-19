import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, Calendar, Clock } from "lucide-react"
import type {
  ColumnDef,
  SortingState} from "@tanstack/react-table";

import type { DashboardStats } from "@/services/dashboardService"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Activity = DashboardStats['pulang_laporan_setoran'][0]

const formatRp = (val: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val)
}

export const columns: Array<ColumnDef<Activity>> = [
  {
    accessorKey: "user.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent font-bold text-slate-900 justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Karyawan
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const user = row.original.user
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-slate-200">
            <AvatarImage src={user.profile_image || ""} alt={user.name} />
            <AvatarFallback className="bg-orange-100 text-orange-600 font-medium">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-left">
            <span className="font-semibold text-slate-900 text-sm">{user.name}</span>
            <span className="text-xs text-muted-foreground">@{user.username}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "date",
    header: "Tanggal",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2 text-slate-600 font-bold">
        <Calendar className="h-4 w-4 text-slate-800" />
        {row.original.date}
      </div>
    ),
  },
  {
    accessorKey: "time",
    header: "Jam Pulang",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2 text-slate-600 font-bold">
        <Clock className="h-4 w-4 text-slate-800" />
        {row.original.time}
      </div>
    ),
  },
  {
    accessorKey: "pemasukan",
    header: "Jumlah Pemasukan",
    cell: ({ row }) => (
      <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold px-3 py-1">
        {formatRp(row.original.pemasukan)}
      </Badge>
    ),
  },
  {
    accessorKey: "pengeluaran",
    header: "Jumlah Pengeluaran",
    cell: ({ row }) => (
      <Badge variant="outline" className="bg-rose-50 text-rose-600 border-rose-100 font-bold px-3 py-1">
        {formatRp(row.original.pengeluaran)}
      </Badge>
    ),
  },
  {
    accessorKey: "deposit",
    header: "Setoran Koperasi",
    cell: ({ row }) => (
      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 font-bold px-3 py-1">
        {formatRp(row.original.deposit)}
      </Badge>
    ),
  },
]

export function DashboardTable({ activities }: { activities: Array<Activity> }) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data: activities,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    initialState: {
        pagination: {
            pageSize: 8
        }
    }
  })

  return (
    <Card className="shadow-lg my-0 pt-4 gap-0 border-3 border-slate-200">
      <CardHeader className="border-b border-slate-100 py-0 pb-4">
        <CardTitle className="text-2xl font-bold">Aktivitas Terkini (Pulang & Setoran)</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead 
                      key={header.id} 
                      className="font-bold text-slate-900 text-center first:text-left first:pl-6"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-slate-50 border-b border-slate-100"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      key={cell.id} 
                      className="py-3 text-center first:text-left first:pl-6"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Belum ada aktivitas terkini.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}