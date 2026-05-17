import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown, Eye, Pencil, ReceiptText, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import {
  MOCK_ANGGOTA_OPTIONS,
  MOCK_PRODUK_SIMPANAN_OPTIONS,
  MOCK_REKENING_TRANSACTIONS,
} from './types'
import { RekeningSimpananAddDialog } from './rekening-simpanan-add-dialog'
import { RekeningSimpananDeleteDialog } from './rekening-simpanan-delete-dialog'
import { RekeningSimpananEditDialog } from './rekening-simpanan-edit-dialog'
import { RekeningSimpananTransactionsDialog } from './rekening-simpanan-transactions-dialog'

import type { ColumnDef, SortingState } from '@tanstack/react-table'
import type { RekeningSimpananRecord, RekeningTransaction } from './types'

import { DataTablePagination } from '@/components/data-table-pagination'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
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

interface RekeningSimpananTableProps {
  data: Array<RekeningSimpananRecord>
  pagination: {
    pageIndex: number
    pageSize: number
    pageCount: number
    total: number
  }
  onPageChange: (newPageIndex: number) => void
  onPageSizeChange: (pageSize: number) => void
  onAdd: (
    payload: Omit<RekeningSimpananRecord, 'id' | 'statusTagih'> & {
      statusTagih?: RekeningSimpananRecord['statusTagih']
    },
  ) => void
  onEdit: (payload: RekeningSimpananRecord) => void
  onDelete: (id: number) => void
  addOpen: boolean
  onAddOpenChange: (open: boolean) => void
}

const formatRupiah = (value: number) => `Rp ${value.toLocaleString('id-ID')}`

export function RekeningSimpananTable({
  data,
  pagination,
  onPageChange,
  onPageSizeChange,
  onAdd,
  onEdit,
  onDelete,
  addOpen,
  onAddOpenChange,
}: RekeningSimpananTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const [editOpen, setEditOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [transactionsOpen, setTransactionsOpen] = React.useState(false)

  const [editing, setEditing] = React.useState<RekeningSimpananRecord | undefined>()
  const [deleting, setDeleting] = React.useState<RekeningSimpananRecord | undefined>()
  const [selectedRekening, setSelectedRekening] = React.useState<RekeningSimpananRecord | undefined>()

  const [isDeletingLocal, setIsDeletingLocal] = React.useState(false)

  const anggotaById = React.useMemo(() => {
    return new Map(MOCK_ANGGOTA_OPTIONS.map((anggota) => [anggota.id, anggota]))
  }, [])

  const produkById = React.useMemo(() => {
    return new Map(MOCK_PRODUK_SIMPANAN_OPTIONS.map((produk) => [produk.id, produk]))
  }, [])

  const selectedTransactions = React.useMemo<Array<RekeningTransaction>>(
    () =>
      selectedRekening
        ? MOCK_REKENING_TRANSACTIONS.filter(
            (transaction) => transaction.rekeningId === selectedRekening.id,
          )
        : [],
    [selectedRekening],
  )

  const formattedSelectedTransactions = React.useMemo(() => {
    const formatMoney = (v: number) => `Rp ${v.toLocaleString('id-ID')}`
    return selectedTransactions.map((t) => ({
      id: t.id,
      tanggal: new Date(t.tanggal).toISOString().slice(0, 10),
      jenis: t.jenis,
      keterangan: t.keterangan,
      debitDisplay: formatMoney(t.debit),
      kreditDisplay: formatMoney(t.kredit),
      saldoDisplay: formatMoney(t.saldo),
    }))
  }, [selectedTransactions])

  const finalSaldoDisplay = React.useMemo(() => {
    if (!selectedTransactions.length) return `Rp 0`
    const last = selectedTransactions[selectedTransactions.length - 1]
    return `Rp ${last.saldo.toLocaleString('id-ID')}`
  }, [selectedTransactions])

  const handleDeleteConfirm = async (id: number) => {
    setIsDeletingLocal(true)
    try {
      await Promise.resolve()
      onDelete(id)
      toast.success('Rekening simpanan berhasil dihapus')
      setDeleteOpen(false)
      setDeleting(undefined)
    } catch {
      toast.error('Gagal menghapus rekening simpanan')
    } finally {
      setIsDeletingLocal(false)
    }
  }

  const columns: Array<ColumnDef<RekeningSimpananRecord>> = [
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
      accessorKey: 'anggota',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent font-semibold text-slate-900 justify-start cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Anggota
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      ),
      accessorFn: (row) => anggotaById.get(row.anggotaId)?.nama ?? '',
      cell: ({ row }) => {
        const anggota = anggotaById.get(row.original.anggotaId)
        const fallback = anggota
          ? anggota.nama
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()
          : 'NA'

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-slate-200">
              <AvatarImage src={anggota?.avatarUrl} alt={anggota?.nama ?? 'Anggota'} />
              <AvatarFallback className="bg-orange-100 text-orange-600 font-medium">
                {fallback}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-left">
              <span className="font-semibold text-slate-900 text-sm">{anggota?.nama ?? '-'}</span>
              <span className="text-xs text-muted-foreground">{anggota?.email ?? '-'}</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'produk',
      header: () => <div className="font-semibold text-slate-900">Produk Simpanan</div>,
      cell: ({ row }) => (
        <div className="font-medium text-slate-700">
          {produkById.get(row.original.produkId)?.nama ?? '-'}
        </div>
      ),
    },
    {
      accessorKey: 'nomorRekening',
      header: () => <div className="font-semibold text-slate-900">Nomor rekening</div>,
      cell: ({ row }) => <div className="font-medium text-slate-700">{row.original.nomorRekening}</div>,
    },
    {
      accessorKey: 'nominal',
      header: () => <div className="text-center font-semibold text-slate-900">Nominal/Jumlah (Rp)</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge variant="green" className="rounded-full h-8 px-3 font-bold cursor-default">
            {formatRupiah(row.original.nominal)}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: 'bungaTahunan',
      header: () => <div className="text-center font-semibold text-slate-900">Bunga</div>,
      cell: ({ row }) =>
        row.original.bungaTahunan === null ? (
          <div className="flex justify-center">
            <Badge variant="outline" className="rounded-full h-8 w-8 p-0 text-slate-500">
              -
            </Badge>
          </div>
        ) : (
          <div className="flex justify-center">
            <Badge variant="purple" className="rounded-full h-8 px-3 font-bold cursor-default">
              {row.original.bungaTahunan.toFixed(2)}%
            </Badge>
          </div>
        ),
    },
    {
      accessorKey: 'tagih',
      header: () => <div className="text-center font-semibold text-slate-900">Tagih</div>,
      cell: () => (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
          >
            <ReceiptText className="h-3.5 w-3.5" />
            Tagih
          </Button>
        </div>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-center font-semibold text-slate-900">Action</div>,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
            onClick={() => {
              setSelectedRekening(row.original)
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
                    if (index === 1 || index === 2 || index === 3) alignClass = 'text-left'

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
                      if (index === 1 || index === 2 || index === 3) alignClass = 'text-left'

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

      <RekeningSimpananAddDialog
        open={addOpen}
        onOpenChange={onAddOpenChange}
        anggotaOptions={MOCK_ANGGOTA_OPTIONS}
        produkOptions={MOCK_PRODUK_SIMPANAN_OPTIONS}
        onAdd={onAdd}
      />

      <RekeningSimpananEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        rekening={editing}
        onEdit={onEdit}
      />

      <RekeningSimpananDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        rekening={deleting}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeletingLocal}
      />

      <RekeningSimpananTransactionsDialog
        open={transactionsOpen}
        onOpenChange={setTransactionsOpen}
        nomorRekening={selectedRekening?.nomorRekening}
        transactions={formattedSelectedTransactions}
        finalSaldoDisplay={finalSaldoDisplay}
      />
    </>
  )
}
