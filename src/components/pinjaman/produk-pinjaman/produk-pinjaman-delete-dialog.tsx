import type { ProdukPinjamanRecord } from './types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface ProdukPinjamanDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (id: number) => void
  produk?: ProdukPinjamanRecord
  isDeleting?: boolean
}

export function ProdukPinjamanDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  produk,
  isDeleting = false,
}: ProdukPinjamanDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Data Produk Pinjaman?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-3">
          <AlertDialogCancel className="flex-1">Batal</AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={() => produk !== undefined && onConfirm(produk.id)}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
