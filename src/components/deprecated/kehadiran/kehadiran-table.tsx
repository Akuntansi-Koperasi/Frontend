import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown, Calendar } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { DataTablePagination } from '../data-table-pagination'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import type { AttendanceRecord } from '@/services/attendanceService'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface KehadiranTableProps {
  data: Array<AttendanceRecord>
  pagination: {
    pageIndex: number
    pageSize: number
    pageCount: number
    total: number
  }
}

const columns: Array<ColumnDef<AttendanceRecord>> = [
  {
    id: 'index',
    header: 'No.',
    cell: ({ row, table }) => {
      const index =
        row.index +
        1 +
        table.getState().pagination.pageIndex *
          table.getState().pagination.pageSize
      return <span className="text-muted-foreground font-medium">{index}.</span>
    },
  },
  {
    accessorKey: 'user.name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 hover:bg-transparent font-bold text-slate-900 justify-start"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Karyawan
        <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
      </Button>
    ),
    cell: ({ row }) => {
      const user = row.original.user
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-slate-200">
            <AvatarImage src={user.profile_image || ''} />
            <AvatarFallback className="bg-orange-100 text-orange-600 font-medium">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900 text-sm">
              {user.name}
            </span>
            <span className="text-xs text-muted-foreground">
              @{user.username}
            </span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'date',
    header: 'Tanggal',
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2 font-medium text-slate-700">
        <Calendar className="h-4 w-4 text-slate-800" />
        {row.original.date}
      </div>
    ),
  },
  {
    accessorKey: 'jam_masuk',
    header: 'Jam Masuk',
    cell: ({ row }) => (
      <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs border border-emerald-100">
        {row.original.jam_masuk}
      </span>
    ),
  },
  {
    accessorKey: 'jam_pulang',
    header: 'Jam Pulang',
    cell: ({ row }) => (
      <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded text-xs border border-rose-100">
        {row.original.jam_pulang}
      </span>
    ),
  },
  {
    accessorKey: 'work_duration_text',
    header: 'Total Jam Kerja',
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-50"
      >
        {row.original.work_duration_text}
      </Badge>
    ),
  },
]

export function KehadiranTable({ data, pagination }: KehadiranTableProps) {
  const navigate = useNavigate()
  const [sorting, setSorting] = React.useState<SortingState>([])

  const handlePageChange = (newPageIndex: number) => {
    navigate({
      to: '/kehadiran',
      search: (prev: any) => ({ ...prev, page: newPageIndex + 1 }),
      replace: true,
    })
  }

  const handlePageSizeChange = (newPageSize: number) => {
    navigate({
      to: '/kehadiran',
      search: (prev: any) => ({ ...prev, per_page: newPageSize, page: 1 }),
      replace: true,
    })
  }

  const table = useReactTable({
    data,
    columns,
    pageCount: pagination.pageCount,
    state: {
      sorting,
      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
    },
    manualPagination: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <Card className="shadow-lg border-slate-200 border-3 p-0">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header, index) => {
                  let alignClass = 'text-center'
                  if (index === 1) alignClass = 'text-left'

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
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-slate-50 border-b border-slate-100"
                >
                  {row.getVisibleCells().map((cell, index) => {
                    let alignClass = 'text-center'
                    if (index === 1) alignClass = 'text-left'

                    return (
                      <TableCell key={cell.id} className={`py-4 ${alignClass}`}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Tidak ada data kehadiran.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <DataTablePagination
          pageIndex={pagination.pageIndex}
          pageCount={pagination.pageCount}
          pageSize={pagination.pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </CardContent>
    </Card>
  )
}
