import { useMemo, useState } from "react"
import { Loader2 } from "lucide-react"
import type { AnggotaFormErrors, AnggotaGender, AnggotaStatus, AnggotaUpsertPayload } from "./types"
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
  onCreate: (payload: AnggotaUpsertPayload) => Promise<boolean>
  errors?: AnggotaFormErrors
}

export function AnggotaAddDialog({ open, onOpenChange, onCreate, errors }: AnggotaAddDialogProps) {
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
  const generalError = errors?.general?.[0]
  const namaError = errors?.nama?.[0]
  const emailError = errors?.email?.[0]
  const ktpError = errors?.ktp?.[0]
  const telpError = errors?.telp?.[0]
  const genderError = errors?.gender?.[0]
  const statusError = errors?.status?.[0]
  const tanggalMasukError = errors?.tanggal_masuk?.[0]

  const isFormValid = useMemo(() => {
    return (
      nama.trim() !== "" &&
      email.trim() !== "" &&
      nomorTelepon.trim() !== "" &&
      gender !== "" &&
      tanggalMasuk.trim() !== "" &&
      status !== ""
    )
  }, [nama, email, nomorTelepon, gender, tanggalMasuk, status])

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
      const success = await onCreate({
        nama,
        email,
        ktp: nomorKtp.trim() === "" ? null : nomorKtp.trim(),
        telp: nomorTelepon.trim(),
        gender: gender as AnggotaGender,
        photo_profile: null,
        tanggal_masuk: tanggalMasuk.trim(),
        tanggal_keluar: null,
        status: status as AnggotaStatus,
      })
      if (success) {
        setDialogOpen(false)
        resetForm()
      }
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
              {namaError ? <p className="text-sm text-destructive">{namaError}</p> : null}
            </div>

            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">Email*</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan Email"
                className="h-auto min-h-12 w-full px-4 py-3"
              />
              {emailError ? <p className="text-sm text-destructive">{emailError}</p> : null}
            </div>

            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">Nomor KTP</Label>
              <Input
                value={nomorKtp}
                onChange={(e) => setNomorKtp(e.target.value)}
                placeholder="Masukkan Nomor KTP"
                className="h-auto min-h-12 w-full px-4 py-3"
              />
              {ktpError ? <p className="text-sm text-destructive">{ktpError}</p> : null}
            </div>

            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">Nomor Telepon*</Label>
              <Input
                value={nomorTelepon}
                onChange={(e) => setNomorTelepon(e.target.value)}
                placeholder="Masukkan Nomor Telepon"
                className="h-auto min-h-12 w-full px-4 py-3"
              />
              {telpError ? <p className="text-sm text-destructive">{telpError}</p> : null}
            </div>

            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">Gender*</Label>
              <Select
                value={gender}
                onValueChange={(v) => {
                  if (v === "pria" || v === "wanita") setGender(v)
                  else setGender("")
                }}
              >
                <SelectTrigger className="h-auto min-h-12 cursor-pointer w-full px-4 py-3">
                  <SelectValue placeholder="Pilih Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pria">Pria</SelectItem>
                  <SelectItem value="wanita">Wanita</SelectItem>
                </SelectContent>
              </Select>
              {genderError ? <p className="text-sm text-destructive">{genderError}</p> : null}
            </div>

            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">Tanggal Masuk*</Label>
              <Input
                type="date"
                value={tanggalMasuk}
                onChange={(e) => setTanggalMasuk(e.target.value)}
                className="h-auto min-h-12 w-full px-4 py-3"
              />
              {tanggalMasukError ? <p className="text-sm text-destructive">{tanggalMasukError}</p> : null}
            </div>

            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">Status*</Label>
              <Select
                value={status}
                onValueChange={(v) => {
                  if (v === "tetap" || v === "tidak tetap" || v === "keluar") setStatus(v)
                  else setStatus("")
                }}
              >
                <SelectTrigger className="h-auto min-h-12 cursor-pointer w-full px-4 py-3">
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tetap">Tetap</SelectItem>
                  <SelectItem value="tidak tetap">Tidak Tetap</SelectItem>
                  <SelectItem value="keluar">Keluar</SelectItem>
                </SelectContent>
              </Select>
              {statusError ? <p className="text-sm text-destructive">{statusError}</p> : null}
            </div>

            {generalError ? <p className="text-sm text-destructive">{generalError}</p> : null}
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
