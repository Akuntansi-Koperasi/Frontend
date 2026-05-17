import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react'
import { JabatanAddDialog } from './jabatan-add-dialog'
import { JabatanEditDialog } from './jabatan-edit-dialog'
import { JabatanDeleteDialog } from './jabatan-delete-dialog'

import type { ColumnDef, SortingState } from '@tanstack/react-table'
import type { JabatanRecord } from './types'

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
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Toaster } from 'src/components/ui/sonner';

interface JabatanTableProps {
  data: Array<JabatanRecord>
  pagination: {
    pageIndex: number
    pageSize: number
    pageCount: number
    total: number
  }
  onEdit: (payload: { id: number; nama: string; kategori: string; multiple: boolean }) => Promise<boolean>
  onDelete: (id: number) => void
  onPageChange: (newPageIndex: number) => void
  onPageSizeChange: (newPageSize: number) => void
  addOpen: boolean
  onAddOpenChange: (open: boolean) => void
  onAdd: (payload: { nama: string; kategori: string; multiple: boolean }) => Promise<boolean>
  addErrors?: Partial<Record<string, Array<string>>> | null
  editErrors?: Partial<Record<string, Array<string>>> | null
  onEditClose?: () => void
}

export function JabatanTable({ data, pagination, onEdit, onDelete, onPageChange, onPageSizeChange, addOpen, onAddOpenChange, onAdd, addErrors, editErrors, onEditClose }: JabatanTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [editOpen, setEditOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<JabatanRecord | null>(null)
  const [deleting, setDeleting] = React.useState<JabatanRecord | null>(null)

  // handlers are provided by parent

  const columns: Array<ColumnDef<JabatanRecord>> = [
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
      accessorKey: 'nama',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent font-bold text-slate-900 justify-start cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nama Jabatan
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-semibold text-slate-900 text-sm">{row.original.nama}</span>,
    },
    {
      accessorKey: 'kategori',
      header: 'Kategori',
      cell: ({ row }) => <span className="text-sm">{row.original.kategori}</span>,
    },
    {
      id: 'multiple',
      header: 'Multiple',
      cell: ({ row }) => (
        row.original.multiple ? (
          <Badge variant={'green'}>Ya</Badge>
        ) : (
          <Badge variant={'destructive'}>Tidak</Badge>
        )
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
            onClick={() => {
              setEditing(row.original)
              setEditOpen(true)
            }}
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
            onClick={() => {
              setDeleting(row.original)
              setDeleteOpen(true)
            }}
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

  // deletion handled by parent via onDelete

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
                    Tidak ada jabatan ditemukan.
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
      {/* Dialogs moved into table (add/edit/delete) */}
      <JabatanAddDialog
        open={addOpen}
        onOpenChange={(isOpen) => onAddOpenChange(isOpen)}
        onAdd={onAdd}
        errors={addErrors}
      />

      <JabatanEditDialog
        open={editOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setEditing(null)
            onEditClose?.()
          }
          setEditOpen(isOpen)
        }}
        jabatan={editing}
        onEdit={onEdit}
        errors={editErrors}
      />

      <JabatanDeleteDialog
        open={deleteOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleting(null)
          setDeleteOpen(isOpen)
        }}
        jabatan={deleting}
        onConfirm={(id) => {
          onDelete(id)
          setDeleteOpen(false)
          setDeleting(null)
        }}
        isDeleting={false}
      />

      <Toaster
        position="top-right"
        richColors
        closeButton
        theme="light"
      />
    </>
  )
}
