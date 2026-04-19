import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  ArrowDownRight,
  ArrowUpDown,
  ArrowUpRight,
  Calendar,
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { DataTablePagination } from '../data-table-pagination'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import type { CashflowRecord } from '@/services/cashflowService'
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

interface KeuanganTableProps {
  data: Array<CashflowRecord>
  pagination: {
    pageIndex: number
    pageSize: number
    pageCount: number
    total: number
  }
}

const formatRp = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val)
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const columns: Array<ColumnDef<CashflowRecord>> = [
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
    accessorKey: 'user.name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 hover:bg-transparent font-bold text-slate-900 justify-start"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Penginput
        <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
      </Button>
    ),
    cell: ({ row }) => {
      const user = row.original.user
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-slate-200">
            <AvatarImage src={user.profile_image || ''} />
            <AvatarFallback className="bg-slate-100 text-slate-600 font-medium">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-left">
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
    accessorKey: 'type',
    header: 'Tipe',
    cell: ({ row }) => {
      const isIncome = row.original.type === 'pemasukan'
      return (
        <Badge
          variant="outline"
          className={`px-3 py-0.5 rounded-full border gap-1 ${
            isIncome
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
              : 'bg-rose-50 text-rose-600 border-rose-200'
          }`}
        >
          {isIncome ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          {capitalize(row.original.type)}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'value',
    header: 'Jumlah Uang',
    cell: ({ row }) => {
      const isIncome = row.original.type === 'pemasukan'
      return (
        <span
          className={`font-bold ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}
        >
          {isIncome ? '+' : '-'}
          {formatRp(row.original.value)}
        </span>
      )
    },
  },
]

export function KeuanganTable({ data, pagination }: KeuanganTableProps) {
  const navigate = useNavigate()
  const [sorting, setSorting] = React.useState<SortingState>([])

  const handlePageChange = (newPageIndex: number) => {
    navigate({
      to: '/keuangan',
      search: (prev: any) => ({ ...prev, page: newPageIndex + 1 }),
      replace: true,
    })
  }

  const handlePageSizeChange = (newPageSize: number) => {
    navigate({
      to: '/keuangan',
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
    <Card className="shadow-lg border-3 border-slate-200 p-0">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header, index) => {
                  let alignClass = 'text-center'
                  if (index === 2) alignClass = 'text-left'

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
                <TableRow key={row.id} className="hover:bg-slate-50">
                  {row.getVisibleCells().map((cell, index) => {
                    let alignClass = 'text-center'
                    if (index === 2) alignClass = 'text-left'

                    return (
                      <TableCell key={cell.id} className={`py-3 ${alignClass}`}>
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
                  Tidak ada data keuangan.
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
