import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown, Eye, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { MOCK_COA_TRANSACTIONS } from './types'
import { CoaAddDialog } from './coa-add-dialog'
import { CoaDeleteDialog } from './coa-delete-dialog'
import { CoaEditDialog } from './coa-edit-dialog'
import { CoaTransactionsDialog } from './coa-transactions-dialog'

import type { ColumnDef, SortingState } from '@tanstack/react-table'
import type { CoaRecord, CoaTransaction } from './types'

import { DataTablePagination } from '@/components/data-table-pagination'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface CoaTableProps {
  data: Array<CoaRecord>
  pagination: {
    pageIndex: number
    pageSize: number
    pageCount: number
    total: number
  }
  onPageChange: (newPageIndex: number) => void
  onPageSizeChange: (pageSize: number) => void
  onAdd: (payload: Omit<CoaRecord, 'id'>) => void
  onEdit: (payload: CoaRecord) => void
  onDelete: (id: number) => void
  addOpen: boolean
  onAddOpenChange: (open: boolean) => void
}

const formatRupiah = (value: number) => `${value.toLocaleString('id-ID')}`

export function CoaTable({
  data,
  pagination,
  onPageChange,
  onPageSizeChange,
  onAdd,
  onEdit,
  onDelete,
  addOpen,
  onAddOpenChange,
}: CoaTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const [editOpen, setEditOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [transactionsOpen, setTransactionsOpen] = React.useState(false)

  const [editing, setEditing] = React.useState<CoaRecord | undefined>()
  const [deleting, setDeleting] = React.useState<CoaRecord | undefined>()
  const [selectedCoa, setSelectedCoa] = React.useState<CoaRecord | undefined>()

  const [isDeletingLocal, setIsDeletingLocal] = React.useState(false)

  const selectedTransactions = React.useMemo<Array<CoaTransaction>>(
    () =>
      selectedCoa
        ? MOCK_COA_TRANSACTIONS.filter(
            (transaction) => transaction.coaId === selectedCoa.id,
          )
        : [],
    [selectedCoa],
  )

  const formattedSelectedTransactions = React.useMemo(() => {
    return selectedTransactions.map((t) => ({
      id: t.id,
      tanggal: new Date(t.tanggal).toISOString().slice(0, 10),
      jenisTransaksi: t.jenisTransaksi,
      deskripsi: t.deskripsi,
      debitDisplay: formatRupiah(t.debit),
      kreditDisplay: formatRupiah(t.kredit),
      saldoDisplay: formatRupiah(t.saldo),
    }))
  }, [selectedTransactions])

  const finalSaldoDisplay = React.useMemo(() => {
    if (!selectedTransactions.length) return '0'
    const last = selectedTransactions[selectedTransactions.length - 1]
    return formatRupiah(last.saldo)
  }, [selectedTransactions])

  const handleDeleteConfirm = async (id: number) => {
    setIsDeletingLocal(true)
    try {
      await Promise.resolve()
      onDelete(id)
      toast.success('COA berhasil dihapus')
      setDeleteOpen(false)
      setDeleting(undefined)
    } catch {
      toast.error('Gagal menghapus COA')
    } finally {
      setIsDeletingLocal(false)
    }
  }

  const columns: Array<ColumnDef<CoaRecord>> = [
    {
      id: 'index',
      header: () => <div className="text-center font-semibold text-slate-900">No.</div>,
      cell: ({ row }) => (
        <div className="text-center font-medium text-muted-foreground">
          {row.index + 1 + pagination.pageIndex * pagination.pageSize}.
        </div>
      ),
    },
    {
      accessorKey: 'kode',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent font-semibold text-slate-900 justify-start cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Kode
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium text-slate-700">{row.original.kode}</div>
      ),
    },
    {
      accessorKey: 'namaAkun',
      header: () => <div className="font-semibold text-slate-900">Nama Akun</div>,
      cell: ({ row }) => (
        <div className="font-medium text-slate-700">{row.original.namaAkun}</div>
      ),
    },
    {
      accessorKey: 'kategori',
      header: () => <div className="text-center font-semibold text-slate-900">Kategori</div>,
      cell: ({ row }) => (
        <div className="text-center font-medium text-slate-700">{row.original.kategori}</div>
      ),
    },
    {
      accessorKey: 'keterangan',
      header: () => <div className="text-center font-semibold text-slate-900">Keterangan</div>,
      cell: ({ row }) => (
        <div className="text-center font-medium text-slate-500">{row.original.keterangan || 'Keterangan'}</div>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-center font-semibold text-slate-900">Aksi</div>,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
            onClick={() => {
              setSelectedCoa(row.original)
              setTransactionsOpen(true)
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
            onClick={() => {
              setEditing(row.original)
              setEditOpen(true)
            }}
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
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

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
                    if (index === 1 || index === 2) alignClass = 'text-left'

                    return (
                      <TableHead
                        key={header.id}
                        className={`font-semibold text-slate-900 ${alignClass}`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
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
                      if (index === 1 || index === 2) alignClass = 'text-left'

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
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    Tidak ada data
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

      <CoaAddDialog
        open={addOpen}
        onOpenChange={onAddOpenChange}
        onAdd={onAdd}
      />

      <CoaEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        coa={editing}
        onEdit={onEdit}
      />

      <CoaDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        coa={deleting}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeletingLocal}
      />

      <CoaTransactionsDialog
        open={transactionsOpen}
        onOpenChange={setTransactionsOpen}
        namaAkun={selectedCoa ? `${selectedCoa.namaAkun}` : undefined}
        kodeAkun={selectedCoa?.kode}
        transactions={formattedSelectedTransactions}
        finalSaldoDisplay={finalSaldoDisplay}
      />
    </>
  )
}
