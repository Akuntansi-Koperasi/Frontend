import { useMemo, useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { AnggotaGender, AnggotaRecord, AnggotaStatus } from "./types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogForm,
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

type AnggotaAddDialogProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onCreate: (payload: Omit<AnggotaRecord, "id">) => void
}

export function AnggotaAddDialog({ open, onOpenChange, onCreate }: AnggotaAddDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = open !== undefined && onOpenChange !== undefined
  const dialogOpen = isControlled ? open : internalOpen
  const setDialogOpen = isControlled ? onOpenChange : setInternalOpen

  const [nama, setNama] = useState("")
  const [email, setEmail] = useState("")
  const [nomorKtp, setNomorKtp] = useState("")
  const [nomorTelepon, setNomorTelepon] = useState("")
  const [gender, setGender] = useState<AnggotaGender | "">("")
  const [tanggalMasuk, setTanggalMasuk] = useState("")
  const [status, setStatus] = useState<AnggotaStatus | "">("")
  const [isLoading, setIsLoading] = useState(false)

  const isFormValid = useMemo(() => {
    return nama.trim() !== "" && email.trim() !== ""
  }, [nama, email])

  const resetForm = () => {
    setNama("")
    setEmail("")
    setNomorKtp("")
    setNomorTelepon("")
    setGender("")
    setTanggalMasuk("")
    setStatus("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsLoading(true)
    try {
      // dummy; API nanti
      await new Promise((r) => setTimeout(r, 400))
      onCreate({
        nama,
        email,
        photo_profile: null,
        nomor_ktp: nomorKtp.trim() === "" ? null : nomorKtp.trim(),
        nomor_telepon: nomorTelepon.trim() === "" ? null : nomorTelepon.trim(),
        gender: gender === "" ? null : gender,
        tanggal_masuk: tanggalMasuk.trim() === "" ? null : tanggalMasuk.trim(),
        status: status === "" ? "aktif" : status,
        akses_sistem: false,
        role: null,
        tanggal_keluar: null,
      })
      toast.success("Anggota berhasil ditambahkan")
      setDialogOpen(false)
      resetForm()
    } catch {
      toast.error("Gagal menambahkan anggota")
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
        <DialogForm onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Tambah Anggota Baru</DialogTitle>
            <DialogDescription>Silakan masukkan data anggota baru</DialogDescription>
          </DialogHeader>

          <DialogBody className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">Nama Lengkap*</Label>
              <Input
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama"
                className="h-auto min-h-12 w-full px-4 py-3"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">Email*</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan Email"
                className="h-auto min-h-12 w-full px-4 py-3"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">Nomor KTP</Label>
              <Input
                value={nomorKtp}
                onChange={(e) => setNomorKtp(e.target.value)}
                placeholder="Masukkan Nomor KTP"
                className="h-auto min-h-12 w-full px-4 py-3"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">Nomor Telepon</Label>
              <Input
                value={nomorTelepon}
                onChange={(e) => setNomorTelepon(e.target.value)}
                placeholder="Masukkan Nomor Telepon"
                className="h-auto min-h-12 w-full px-4 py-3"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">Gender</Label>
              <Select
                value={gender}
                onValueChange={(v) => {
                  if (v === "Laki-Laki" || v === "Perempuan") setGender(v)
                  else setGender("")
                }}
              >
                <SelectTrigger className="h-auto min-h-12 cursor-pointer w-full px-4 py-3">
                  <SelectValue placeholder="Pilih Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Laki-Laki">Laki-Laki</SelectItem>
                  <SelectItem value="Perempuan">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">Tanggal Masuk</Label>
              <Input
                type="date"
                value={tanggalMasuk}
                onChange={(e) => setTanggalMasuk(e.target.value)}
                className="h-auto min-h-12 w-full px-4 py-3"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">Status</Label>
              <Select
                value={status}
                onValueChange={(v) => {
                  if (v === "aktif" || v === "tidak_aktif") setStatus(v)
                  else setStatus("")
                }}
              >
                <SelectTrigger className="h-auto min-h-12 cursor-pointer w-full px-4 py-3">
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aktif">Aktif</SelectItem>
                  <SelectItem value="tidak_aktif">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </DialogBody>

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
        </DialogForm>
      </DialogContent>
    </Dialog>
  )
}
