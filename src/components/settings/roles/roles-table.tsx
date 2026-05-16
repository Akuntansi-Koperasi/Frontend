import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useNavigate, Link } from '@tanstack/react-router'
import { ArrowUpDown, Eye, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { RoleDeleteDialog } from './role-delete-dialog'
import { RoleEditDialog } from './role-edit-dialog'

import type { ColumnDef, SortingState } from '@tanstack/react-table'
import type { RoleRecord } from './types'

import { DataTablePagination } from '@/components/data-table-pagination'
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

interface RolesTableProps {
  data: Array<RoleRecord>
  pagination: {
    pageIndex: number
    pageSize: number
    pageCount: number
    total: number
  }
  onEdit: (payload: { id: number; name: string }) => void
  onDelete: (id: number) => void
}

export function RolesTable({ data, pagination, onEdit, onDelete }: RolesTableProps) {
  const navigate = useNavigate()
  const [sorting, setSorting] = React.useState<SortingState>([])

  const [roleToDelete, setRoleToDelete] = React.useState<RoleRecord | null>(null)
  const [roleToEdit, setRoleToEdit] = React.useState<RoleRecord | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handlePageChange = (newPageIndex: number) => {
    navigate({
      to: '/settings/roles',
      search: (prev: any) => ({ ...prev, page: newPageIndex + 1 }),
      replace: true,
    })
  }

  const handlePageSizeChange = (newPageSize: number) => {
    navigate({
      to: '/settings/roles',
      search: (prev: any) => ({ ...prev, per_page: newPageSize, page: 1 }),
      replace: true,
    })
  }

  const columns: Array<ColumnDef<RoleRecord>> = [
    {
      id: 'index',
      header: 'No.',
      cell: ({ row, table }) => {
        const index =
          row.index +
          1 +
          table.getState().pagination.pageIndex * table.getState().pagination.pageSize
        return <span className="text-muted-foreground font-medium">{index}.</span>
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
          Nama Peran
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-semibold text-slate-900 text-sm">{row.original.name}</span>
      ),
    },
    {
      id: 'permission',
      header: 'Permission',
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
            title="Lihat / Atur Hak Akses"
          >
            <Link
              to="/settings/permissions/$roleId"
              params={{ roleId: String(row.original.id) }}
              search={{ page: 1, per_page: 10 }}
            >
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
            onClick={() => setRoleToEdit(row.original)}
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
            onClick={() => setRoleToDelete(row.original)}
            title="Hapus"
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
    state: { sorting },
    onSortingChange: setSorting,
    manualPagination: true,
    pageCount: pagination.pageCount,
  })

  const handleDelete = async (id: number) => {
    setIsDeleting(true)
    try {
      await new Promise((r) => setTimeout(r, 350))
      onDelete(id)
      toast.success('Peran berhasil dihapus')
      setRoleToDelete(null)
    } catch {
      toast.error('Gagal menghapus peran')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Card className="shadow-lg border-3 border-slate-200 p-0">
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
                        {flexRender(header.column.columnDef.header, header.getContext())}
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
                      if (index === 1) alignClass = 'text-left'
                      return (
                        <TableCell key={cell.id} className={`py-3 ${alignClass}`}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Tidak ada peran ditemukan.
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

      <RoleEditDialog
        open={!!roleToEdit}
        onOpenChange={(isOpen) => !isOpen && setRoleToEdit(null)}
        role={roleToEdit}
        onEdit={(payload) => {
          onEdit(payload)
          setRoleToEdit(null)
        }}
      />

      <RoleDeleteDialog
        open={!!roleToDelete}
        onOpenChange={(isOpen) => !isOpen && setRoleToDelete(null)}
        role={roleToDelete}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  )
}
