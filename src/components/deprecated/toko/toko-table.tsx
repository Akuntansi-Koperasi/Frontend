import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowUpDown, MapPin, Pencil, Store, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { DataTablePagination } from '../data-table-pagination'
import { TokoEditDialog } from './toko-edit-dialog'
import { TokoDeleteDialog } from './toko-delete-dialog'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import type { TokoRecord } from '@/services/tokoService'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { deleteToko } from '@/services/tokoService'

interface TokoTableProps {
  data: Array<TokoRecord>
  pagination: {
    pageIndex: number
    pageSize: number
    pageCount: number
    total: number
  }
}

export function TokoTable({ data, pagination }: TokoTableProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [tokoToEdit, setTokoToEdit] = React.useState<TokoRecord | null>(null)
  const [tokoToDelete, setTokoToDelete] = React.useState<TokoRecord | null>(
    null,
  )
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteToko(id),
    onSuccess: () => {
      toast.success('Toko berhasil dihapus')
      queryClient.invalidateQueries({ queryKey: ['toko'] })
      setTokoToDelete(null)
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Gagal menghapus toko'
      toast.error(errorMessage)
    },
  })

  const handlePageChange = (newPageIndex: number) => {
    navigate({
      to: '/toko',
      search: (prev: any) => ({ ...prev, page: newPageIndex + 1 }),
      replace: true,
    })
  }

  const handlePageSizeChange = (newPageSize: number) => {
    navigate({
      to: '/toko',
      search: (prev: any) => ({ ...prev, per_page: newPageSize, page: 1 }),
      replace: true,
    })
  }

  const columns: Array<ColumnDef<TokoRecord>> = [
    {
      id: 'index',
      header: 'No.',
      cell: ({ row, table }) => {
        const index =
          row.index +
          1 +
          table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize
        return (
          <span className="text-muted-foreground font-medium">{index}.</span>
        )
      },
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent font-bold text-slate-900 justify-start cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nama Toko
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-start gap-3">
          <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center border border-slate-200">
            <Store className="h-4 w-4 text-slate-600" />
          </div>
          <span className="font-semibold text-slate-900 text-sm">
            {row.original.name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'address',
      header: 'Alamat',
      cell: ({ row }) => (
        <span
          className="text-sm font-medium text-slate-700 block max-w-[250px] truncate"
          title={row.original.address}
        >
          {row.original.address || '-'}
        </span>
      ),
    },
    {
      accessorKey: 'latitude',
      header: 'Latitude',
      cell: ({ row }) => (
        <span className="text-sm font-mono text-slate-700 font-medium">
          {row.original.latitude}
        </span>
      ),
    },
    {
      accessorKey: 'longitude',
      header: 'Longitude',
      cell: ({ row }) => (
        <span className="text-sm font-mono text-slate-700 font-medium">
          {row.original.longitude}
        </span>
      ),
    },
    {
      accessorKey: 'max_distance',
      header: 'Jarak Presensi',
      cell: ({ row }) => (
        <span className="text-sm font-medium text-slate-600">
          {row.original.max_distance} Meter
        </span>
      ),
    },
    {
      id: 'maps',
      header: 'Maps',
      cell: ({ row }) =>
        row.original.maps ? (
          <Button
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white gap-1.5 h-8 px-3 cursor-pointer"
            onClick={() => window.open(row.original.maps, '_blank')}
          >
            <MapPin className="h-3.5 w-3.5" />
            <span className="text-xs">Buka Map</span>
          </Button>
        ) : (
          <span className="text-muted-foreground text-xs">-</span>
        ),
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
            onClick={() => setTokoToEdit(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
            onClick={() => setTokoToDelete(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), 
    onSortingChange: setSorting,
    state: { sorting },
    manualPagination: true,
    pageCount: pagination.pageCount,
  })

  return (
    <>
      <Card className="shadow-lg border-3 border-slate-200 p-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    const isTextLeft =
                      header.id === 'name' || header.id === 'address'
                    return (
                      <TableHead
                        key={header.id}
                        className={`font-semibold text-slate-900 whitespace-nowrap ${isTextLeft ? 'text-left' : 'text-center'}`}
                      >
                        {flexRender(
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
                    {row.getVisibleCells().map((cell) => {
                      const isTextLeft =
                        cell.column.id === 'name' ||
                        cell.column.id === 'address'
                      return (
                        <TableCell
                          key={cell.id}
                          className={`py-3 ${isTextLeft ? 'text-left' : 'text-center'}`}
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
                    Tidak ada data toko ditemukan.
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

      <TokoEditDialog
        open={!!tokoToEdit}
        onOpenChange={(isOpen) => !isOpen && setTokoToEdit(null)}
        toko={tokoToEdit}
      />

      <TokoDeleteDialog
        open={!!tokoToDelete}
        onOpenChange={(isOpen) => !isOpen && setTokoToDelete(null)}
        toko={tokoToDelete}
        onConfirm={(id) => deleteMutation.mutate(id)}
        isDeleting={deleteMutation.isPending}
      />
    </>
  )
}