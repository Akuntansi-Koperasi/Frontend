import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { ArrowUpDown, Calendar, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { DataTablePagination } from '../data-table-pagination'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import type { DepositRecord } from '@/services/depositService'
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
import { Input } from '@/components/ui/input'
import { verifyDeposit } from '@/services/depositService'

interface SetoranTableProps {
  data: Array<DepositRecord>
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

const VerificationCell = ({ row }: { row: DepositRecord }) => {
  const queryClient = useQueryClient()
  const [code, setCode] = React.useState(row.verified_key || '')
  const [isEditing, setIsEditing] = React.useState(!row.verified_key)

  React.useEffect(() => {
    setCode(row.verified_key || '')
    setIsEditing(!row.verified_key)
  }, [row.verified_key])

  const mutation = useMutation({
    mutationFn: (newCode: string) => verifyDeposit(row.id, newCode),
    onSuccess: () => {
      toast.success('Kode verifikasi diperbarui')
      queryClient.invalidateQueries({ queryKey: ['deposit'] })
      setIsEditing(false)
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message || 'Gagal memverifikasi setoran'
      toast.error(msg)
    },
  })

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!code.trim()) {
        toast.error('Kode verifikasi tidak boleh kosong')
        return
      }
      mutation.mutate(code)
    }
  }

  if (!isEditing && row.verified_key) {
    return (
      <div
        className="group relative w-full max-w-[140px] mx-auto cursor-pointer"
        onClick={() => setIsEditing(true)}
        title="Klik untuk mengubah kode"
      >
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono py-1.5 px-3 rounded text-center font-bold truncate">
          {row.verified_key}
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded transition-opacity bg-emerald-200 border border-emerald-700">
          <Pencil className="w-3 h-3 text-emerald-800" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative max-w-[140px] mx-auto">
      <Input
        placeholder="Input Kode..."
        className="h-8 text-xs bg-white pr-8 font-mono"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        disabled={mutation.isPending}
        onKeyDown={handleKeyDown}
        autoFocus={isEditing && !!row.verified_key}
        onBlur={() => {
          if (row.verified_key) {
            setCode(row.verified_key)
            setIsEditing(false)
          }
        }}
      />
    </div>
  )
}

const columns: Array<ColumnDef<DepositRecord>> = [
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
    accessorKey: 'for_name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 hover:bg-transparent font-bold text-slate-900 justify-start"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Nama Anggota
        <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 border border-slate-200">
          <AvatarFallback className="bg-slate-100 text-slate-600 font-medium">
            {row.original.for_name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className="font-semibold text-slate-900 text-sm">
          {row.original.for_name}
        </span>
      </div>
    ),
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
      const employee = row.original.user
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border border-slate-200">
            <AvatarImage src={employee.profile_image || ''} />
            <AvatarFallback className="bg-slate-100 text-slate-600 font-medium">
              {employee.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-left">
            <span className="font-semibold text-slate-900 text-sm">
              {employee.name}
            </span>
            <span className="text-xs text-muted-foreground">
              @{employee.username}
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
      const isSimpanan = row.original.type === 'simpanan'
      const label =
        row.original.type.charAt(0).toUpperCase() + row.original.type.slice(1)

      return (
        <Badge
          variant="outline"
          className={`px-3 py-0.5 rounded-full border ${
            isSimpanan
              ? 'bg-blue-50 text-blue-600 border-blue-200'
              : 'bg-purple-50 text-purple-600 border-purple-200'
          }`}
        >
          {label}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'value',
    header: 'Jumlah',
    cell: ({ row }) => (
      <span className="font-bold text-emerald-600">
        {formatRp(row.original.value)}
      </span>
    ),
  },
  {
    id: 'verified_key',
    header: 'Kode Verifikasi',
    cell: ({ row }) => <VerificationCell row={row.original} />,
  },
]

export function SetoranTable({ data, pagination }: SetoranTableProps) {
  const navigate = useNavigate()
  const [sorting, setSorting] = React.useState<SortingState>([])

  const handlePageChange = (newPageIndex: number) => {
    navigate({
      to: '/setoran',
      search: (prev: any) => ({ ...prev, page: newPageIndex + 1 }),
      replace: true,
    })
  }

  const handlePageSizeChange = (newPageSize: number) => {
    navigate({
      to: '/setoran',
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header, index) => {
                    let alignClass = 'text-center'
                    if (index === 1 || index === 3) alignClass = 'text-left'

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
                      if (index === 1 || index === 3) alignClass = 'text-left'

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
                    Tidak ada data setoran.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

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
