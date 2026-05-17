import type { RekeningSimpananRecord } from './types'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface RekeningSimpananDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rekening?: RekeningSimpananRecord
  onConfirm: (id: number) => void
  isDeleting?: boolean
}

export function RekeningSimpananDeleteDialog({
  open,
  onOpenChange,
  rekening,
  onConfirm,
  isDeleting = false,
}: RekeningSimpananDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Data Rekening Simpanan?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex gap-3">
          <AlertDialogCancel className="flex-1">Batal</AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={() => rekening !== undefined && onConfirm(rekening.id)}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
