import type { ProdukSimpananRecord } from './types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface ProdukSimpananDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (id: number) => void
  produk?: ProdukSimpananRecord
  isDeleting?: boolean
}

export function ProdukSimpananDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  produk,
  isDeleting = false,
}: ProdukSimpananDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Data Produk Simpanan?</AlertDialogTitle>
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
