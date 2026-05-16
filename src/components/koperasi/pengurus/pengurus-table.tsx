import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown, Pencil, Power, Trash2 } from 'lucide-react'
import { PengurusAddDialog } from './pengurus-add-dialog'
import { PengurusEditDialog } from './pengurus-edit-dialog'
import { PengurusDeleteDialog } from './pengurus-delete-dialog'
import { PengurusAkhiriDialog } from './pengurus-akhiri-dialog'

import type { ColumnDef, SortingState } from '@tanstack/react-table'
import type { PengurusRecord } from './types'

import { DataTablePagination } from '@/components/data-table-pagination'
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

interface PengurusTableProps {
  data: Array<PengurusRecord>
  pagination: {
    pageIndex: number
    pageSize: number
    pageCount: number
    total: number
  }
  onEdit: (payload: {
    id: number
    anggotaId: string
    nama: string
    email: string
    avatar?: string
    jabatan: string
    mulaiMenjabat: number
    selesaiMenjabat: number
    status: 'Aktif' | 'Tidak Aktif'
  }) => void
  onDelete: (id: number) => void
  onStatusChange: (id: number, status: 'Aktif' | 'Tidak Aktif') => void
  onPageChange: (newPageIndex: number) => void
  onPageSizeChange: (newPageSize: number) => void
  addOpen: boolean
  onAddOpenChange: (open: boolean) => void
  onAdd: (payload: {
    anggotaId: string
    nama: string
    email: string
    avatar?: string
    jabatan: string
    mulaiMenjabat: number
    selesaiMenjabat: number
    status: 'Aktif' | 'Tidak Aktif'
  }) => void
}

export function PengurusTable({
  data,
  pagination,
  onEdit,
  onDelete,
  onStatusChange,
  onPageChange,
  onPageSizeChange,
  addOpen,
  onAddOpenChange,
  onAdd,
}: PengurusTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [editOpen, setEditOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [akhiriOpen, setAkhiriOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<PengurusRecord | null>(null)
  const [deleting, setDeleting] = React.useState<PengurusRecord | null>(null)
  const [akhiring, setAkhiring] = React.useState<PengurusRecord | null>(null)
  const [isDeletingLocal, setIsDeletingLocal] = React.useState(false)
  const [isAkhiriLoading, setIsAkhiriLoading] = React.useState(false)

  const columns: Array<ColumnDef<PengurusRecord>> = [
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
          Anggota
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-slate-200">
            <AvatarImage src={row.original.avatar || ''} />
            <AvatarFallback className="bg-orange-100 text-orange-600 font-medium">
              {row.original.nama.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-left">
            <span className="font-semibold text-slate-900 text-sm">{row.original.nama}</span>
            <span className="text-xs text-muted-foreground">{row.original.email}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'jabatan',
      header: 'Jabatan',
      cell: ({ row }) => <span className="text-sm">{row.original.jabatan}</span>,
    },
    {
      accessorKey: 'mulaiMenjabat',
      header: 'Mulai Menjabat',
      cell: ({ row }) => <span className="text-sm">{row.original.mulaiMenjabat}</span>,
    },
    {
      accessorKey: 'selesaiMenjabat',
      header: 'Selesai Menjabat',
      cell: ({ row }) => <span className="text-sm">{row.original.selesaiMenjabat}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        row.original.status === 'Aktif' ? (
          <Badge variant={'green'}>Aktif</Badge>
        ) : (
          <Badge variant={'secondary'}>Tidak Aktif</Badge>
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

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
            onClick={() => {
              setAkhiring(row.original)
              setAkhiriOpen(true)
            }}
            title="Akhiri Jabatan"
          >
            <Power className="h-4 w-4" />
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

  const handleDeleteConfirm = (id: number) => {
    setIsDeletingLocal(true)
    try {
      onDelete(id)
      setDeleteOpen(false)
      setDeleting(null)
    } finally {
      setIsDeletingLocal(false)
    }
  }

  const handleAkhiriConfirm = (id: number) => {
    setIsAkhiriLoading(true)
    try {
      onStatusChange(id, 'Tidak Aktif')
      setAkhiriOpen(false)
      setAkhiring(null)
    } finally {
      setIsAkhiriLoading(false)
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
                    Tidak ada pengurus ditemukan.
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

      <PengurusAddDialog open={addOpen} onOpenChange={onAddOpenChange} onAdd={onAdd} />

      {editing && (
        <PengurusEditDialog open={editOpen} onOpenChange={setEditOpen} pengurus={editing} onEdit={onEdit} />
      )}

      {deleting && (
        <PengurusDeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          pengurus={deleting}
          onConfirm={handleDeleteConfirm}
          isDeleting={isDeletingLocal}
        />
      )}

      {akhiring && (
        <PengurusAkhiriDialog
          open={akhiriOpen}
          onOpenChange={setAkhiriOpen}
          pengurus={akhiring}
          onConfirm={handleAkhiriConfirm}
          isLoading={isAkhiriLoading}
        />
      )}
    </>
  )
}
