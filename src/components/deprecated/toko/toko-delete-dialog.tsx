import { AlertTriangle, Loader2 } from "lucide-react";
import type { TokoRecord } from "@/services/deprecated/tokoService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TokoDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  toko: TokoRecord | null;
  onConfirm: (id: number) => void;
  isDeleting: boolean;
}

export function TokoDeleteDialog({
  open,
  onOpenChange,
  toko,
  onConfirm,
  isDeleting,
}: TokoDeleteDialogProps) {
  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    if (toko) {
      onConfirm(toko.id);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="h-5 w-5" />
            <AlertDialogTitle>Hapus Toko?</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus <b>{toko?.name}</b>?
            <br />
            Data yang dihapus tidak dapat dikembalikan dan presensi di lokasi
            ini tidak akan valid lagi.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isDeleting}
            className="md:w-[50%] w-full bg-slate-900 text-white hover:text-white hover:bg-slate-800 h-12 cursor-pointer"
          >
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-rose-600 hover:bg-rose-700 md:w-[50%] w-full h-12 cursor-pointer"
            onClick={handleConfirm}
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
  );
}
