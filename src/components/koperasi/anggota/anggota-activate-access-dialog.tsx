import { useEffect, useMemo, useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { AnggotaAccessRole, AnggotaRecord } from "./types"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const ROLE_OPTIONS: Array<{ id: AnggotaAccessRole; name: string }> = [
  { id: "admin", name: "Admin" },
  { id: "employee", name: "Pegawai" },
]

type AnggotaActivateAccessDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  anggota: AnggotaRecord | null
  onActivate: (payload: { id: number; role: AnggotaAccessRole }) => void
}

export function AnggotaActivateAccessDialog({
  open,
  onOpenChange,
  anggota,
  onActivate,
}: AnggotaActivateAccessDialogProps) {
  const [role, setRole] = useState<AnggotaAccessRole | "">("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setRole((anggota?.role ?? "") as any)
    }
  }, [open, anggota])

  const isFormValid = useMemo(() => role !== "" && Boolean(anggota), [role, anggota])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!anggota || role === "") return

    setIsLoading(true)
    try {
      // dummy; API nanti
      await new Promise((r) => setTimeout(r, 400))
      onActivate({ id: anggota.id, role })
      toast.success(`Akun akses berhasil diaktifkan untuk ${anggota.nama}`)
      onOpenChange(false)
    } catch {
      toast.error("Gagal mengaktifkan akun akses anggota")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (val: boolean) => {
    if (!val) setRole("")
    onOpenChange(val)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Aktifkan Akun Akses Anggota</DialogTitle>
            <DialogDescription>
              Silakan ubah data anggota{anggota ? `: ${anggota.nama}` : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">Peran*</Label>
              <Select value={role} onValueChange={(v) => setRole(v as any)}>
                <SelectTrigger className="h-auto min-h-12 cursor-pointer w-full px-4 py-3">
                  <SelectValue placeholder="Pilih Peran" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id}>
                      {opt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              className="md:w-[50%] w-full h-12 cursor-pointer"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="md:w-[50%] w-full bg-slate-900 text-white hover:bg-slate-800 h-12 cursor-pointer"
              disabled={isLoading || !isFormValid}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
