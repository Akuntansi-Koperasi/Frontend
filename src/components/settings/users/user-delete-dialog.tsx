import { AlertTriangle, Loader2 } from "lucide-react"
import type { UserRecord } from "@/services/userService"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface UserDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserRecord | null
  onConfirm: (id: number) => void
  isDeleting: boolean
}

export function UserDeleteDialog({ 
  open, 
  onOpenChange, 
  user, 
  onConfirm, 
  isDeleting 
}: UserDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="h-5 w-5" />
            <AlertDialogTitle>Hapus User?</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus user <b>{user?.name}</b>? 
            <br />
            Tindakan ini tidak dapat dibatalkan dan user tidak akan bisa login lagi.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} className="md:w-[50%] w-full bg-slate-900 text-white hover:text-white hover:bg-slate-800 h-12 cursor-pointer">Batal</AlertDialogCancel>
          <AlertDialogAction 
            className="bg-rose-600 hover:bg-rose-700 md:w-[50%] w-full h-12 cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              if (user) onConfirm(user.id)
            }}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              "Ya, Hapus"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}