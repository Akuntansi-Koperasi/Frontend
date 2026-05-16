import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
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

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_ANGGOTA = [
  { id: "1", nama: "Budi Santoso"},
  { id: "2", nama: "Siti Rahayu"},
  { id: "3", nama: "Ahmad Fauzi"},
  { id: "4", nama: "Dewi Lestari"},
  { id: "5", nama: "Rudi Hartono"},
  { id: "6", nama: "Eka Wulandari"},
  { id: "7", nama: "Hendra Gunawan"},
  { id: "8", nama: "Nita Permata"},
  { id: "9", nama: "Yusuf Ibrahim"},
  { id: "10", nama: "Rina Marlina"},
  { id: "11", nama: "Fajar Nugraha"},
  { id: "12", nama: "Laila Sari"},
]

const MOCK_PERAN = [
  { id: "admin", name: "Admin" },
  { id: "bendahara", name: "Bendahara" },
  { id: "kasir", name: "Kasir" },
  { id: "manager", name: "Manager" },
  { id: "pengawas", name: "Pengawas" },
  { id: "anggota", name: "Anggota" },
]

// ─── Types ────────────────────────────────────────────────────────────────────
type UserAddDialogProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

// ─── Component ────────────────────────────────────────────────────────────────
export function UserAddDialog({ open, onOpenChange }: UserAddDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = typeof open === "boolean" && typeof onOpenChange === "function"
  const dialogOpen = isControlled ? (open) : internalOpen
  const setDialogOpen = isControlled
    ? (onOpenChange as (o: boolean) => void)
    : setInternalOpen

  const [anggotaId, setAnggotaId] = useState("")
  const [peranId, setPeranId] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const isFormValid = anggotaId !== "" && peranId !== ""

  const resetForm = () => {
    setAnggotaId("")
    setPeranId("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsLoading(true)
    try {
      // TODO: Ganti dengan API call sesungguhnya
      await new Promise((res) => setTimeout(res, 800))

      const anggota = MOCK_ANGGOTA.find((a) => a.id === anggotaId)
      const peran = MOCK_PERAN.find((p) => p.id === peranId)

      toast.success(
        `Akun akses berhasil diaktifkan untuk ${anggota?.nama} sebagai ${peran?.name}`
      )
      setDialogOpen(false)
      resetForm()
    } catch {
      toast.error("Gagal mengaktifkan akun akses anggota")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (val: boolean) => {
    if (!val) resetForm()
    setDialogOpen(val)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Aktifkan Akun Akses Anggota
            </DialogTitle>
            <DialogDescription>Silahkan pilih anggota dan peran</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Anggota */}
            <div className="grid gap-2">
              <Label htmlFor="anggota-select" className="text-slate-600 font-medium">
                Anggota*
              </Label>
              <Select value={anggotaId} onValueChange={setAnggotaId}>
                <SelectTrigger id="anggota-select" className="h-auto min-h-12 cursor-pointer w-full px-4 py-3">
                  <SelectValue placeholder="Pilih anggota" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_ANGGOTA.map((anggota) => (
                    <SelectItem key={anggota.id} value={anggota.id}>
                      <span className="font-medium">{anggota.nama}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Peran */}
            <div className="grid gap-2">
              <Label htmlFor="peran-select" className="text-slate-600 font-medium">
                Peran*
              </Label>
              <Select value={peranId} onValueChange={setPeranId}>
                <SelectTrigger id="peran-select" className="h-auto min-h-12 cursor-pointer w-full px-4 py-3">
                  <SelectValue placeholder="Pilih Peran" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_PERAN.map((peran) => (
                    <SelectItem key={peran.id} value={peran.id}>
                      {peran.name}
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