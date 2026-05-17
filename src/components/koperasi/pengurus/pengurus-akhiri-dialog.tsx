import { AlertTriangle, Loader2 } from 'lucide-react'

import type { PengurusRecord } from './types'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface PengurusAkhiriDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pengurus: PengurusRecord | null
  onConfirm: (id: number) => Promise<boolean>
  isLoading: boolean
}

export function PengurusAkhiriDialog({ open, onOpenChange, pengurus, onConfirm, isLoading }: PengurusAkhiriDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            <AlertDialogTitle>Akhiri jabatan pengurus ini</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            Apakah Anda yakin ingin mengakhiri jabatan pengurus ini? Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isLoading}
            className="md:w-[50%] w-full bg-slate-900 text-white hover:text-white hover:bg-slate-800 h-12 cursor-pointer"
          >
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-rose-600 hover:bg-rose-700 md:w-[50%] w-full h-12 cursor-pointer"
            onClick={async (e) => {
              e.preventDefault()
              if (pengurus) await onConfirm(pengurus.id)
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengakhiri...
              </>
            ) : (
              'Ya, Akhiri'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
