import { Printer } from 'lucide-react'

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface FormattedTransaction {
  id: number
  tanggal: string // pre-formatted date e.g. '2026-05-17'
  jenis: string
  keterangan: string
  debitDisplay: string
  kreditDisplay: string
  saldoDisplay: string
}

interface RekeningSimpananTransactionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  nomorRekening?: string
  transactions: Array<FormattedTransaction>
  finalSaldoDisplay: string
}

export function RekeningSimpananTransactionsDialog({
  open,
  onOpenChange,
  nomorRekening,
  transactions,
  finalSaldoDisplay,
}: RekeningSimpananTransactionsDialogProps) {
  const handlePrint = () => {
    try {
      const printWindow = window.open('', '_blank')
      if (!printWindow) return

      const tableRows = transactions
        .map(
          (t) => `
            <tr>
              <td style="padding:8px">${t.tanggal}</td>
              <td style="padding:8px">${t.jenis}</td>
              <td style="padding:8px">${t.keterangan}</td>
              <td style="padding:8px;text-align:right">${t.debitDisplay}</td>
              <td style="padding:8px;text-align:right">${t.kreditDisplay}</td>
              <td style="padding:8px;text-align:right">${t.saldoDisplay}</td>
            </tr>
          `,
        )
        .join('')

      const html = `
        <html>
          <head>
            <meta charset="utf-8" />
            <title>Transaksi Rekening</title>
            <style>
              :root { color-scheme: light dark; }
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; padding: 18px; color: #0f172a }
              h1 { font-size: 20px; margin: 0 0 6px 0 }
              .muted { color: #6b7280; font-size: 13px }
              .card { border: 1px solid #e6edf3; border-radius: 8px; overflow: hidden }
              table { width: 100%; border-collapse: collapse; font-size: 14px }
              thead th { background: #f8fafc; color: #334155; text-align: left; font-weight: 700; padding: 12px }
              tbody td { padding: 12px; border-bottom: 1px solid #eef2f6; color: #374151 }
              .right { text-align: right }
              .col-date { width: 110px }
              .col-jenis { width: 140px }
              .col-num { width: 110px }
              .saldo { font-weight: 700; color: #4f46e5 }
            </style>
          </head>
          <body>
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
              <div>
                <h1>Transaksi Rekening</h1>
                <div class="muted">${nomorRekening ?? ''}</div>
              </div>
            </div>
            <div class="card">
              <table>
                <thead>
                  <tr>
                    <th class="col-date">Tanggal</th>
                    <th class="col-jenis">Jenis Transaksi</th>
                    <th>Keterangan</th>
                    <th class="col-num right">Debit</th>
                    <th class="col-num right">Kredit</th>
                    <th class="col-num right">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableRows}
                </tbody>
              </table>
            </div>
            <div style="margin-top:18px; text-align:right; font-weight:700">Saldo Akhir: <span class="saldo">${finalSaldoDisplay}</span></div>
          </body>
        </html>
      `

      printWindow.document.write(html)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
      // do not close immediately to allow print dialog in some browsers
    } catch (err) {
      console.error('print error', err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[960px]">
        <DialogHeader className="px-6 pt-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl font-bold text-slate-900">Transaksi Rekening</DialogTitle>
              <DialogDescription className="text-sm text-slate-600 mt-1">
                {nomorRekening ?? '-'}
              </DialogDescription>
            </div>
            <Button
              type="button"
              size="sm"
              className="bg-slate-900 text-white hover:bg-slate-800 px-4"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </DialogHeader>

        <DialogBody className="grid py-4 px-4">
          <Table className="w-full table-fixed">
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-slate-50">
                <TableHead className="w-[110px] font-semibold text-slate-700">Tanggal</TableHead>
                <TableHead className="w-[140px] font-semibold text-slate-700">Jenis Transaksi</TableHead>
                <TableHead className="font-semibold text-slate-700">Keterangan</TableHead>
                <TableHead className="w-[110px] text-right font-semibold text-slate-700">Debit</TableHead>
                <TableHead className="w-[110px] text-right font-semibold text-slate-700">Kredit</TableHead>
                <TableHead className="w-[110px] text-right font-semibold text-slate-700">Saldo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length ? (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-slate-50/60">
                    <TableCell className="font-medium text-slate-700">{transaction.tanggal}</TableCell>
                    <TableCell className="text-slate-700">{transaction.jenis}</TableCell>
                    <TableCell className="text-slate-700 truncate max-w-0">
                      <span className="block truncate" title={transaction.keterangan}>
                        {transaction.keterangan}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-slate-700">{transaction.debitDisplay}</TableCell>
                    <TableCell className="text-right text-slate-700">{transaction.kreditDisplay}</TableCell>
                    <TableCell className="text-right font-semibold text-slate-900">{transaction.saldoDisplay}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Tidak ada transaksi.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DialogBody>

        <div className="flex items-center justify-end gap-4 px-6 py-4 border-t border-slate-200">
          <span className="text-lg font-semibold text-slate-700">Saldo Akhir</span>
          <span className="text-lg font-bold text-[#4F46E5]">{finalSaldoDisplay}</span>
        </div>

        <DialogFooter className="px-6">
          <Button
            type="button"
            variant="destructive"
            className="h-11 min-w-28"
            onClick={() => onOpenChange(false)}
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
