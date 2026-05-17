import { useMemo, useState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'

import type { AnggotaOption, JabatanOption, PengurusFormErrors, PengurusUpsertPayload } from './types'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogForm,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type PengurusAddDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  anggotaOptions: Array<AnggotaOption>
  jabatanOptions: Array<JabatanOption>
  onAdd: (payload: PengurusUpsertPayload) => Promise<boolean>
  errors?: PengurusFormErrors
}

export function PengurusAddDialog({ open, onOpenChange, anggotaOptions, jabatanOptions, onAdd, errors }: PengurusAddDialogProps) {
  const [anggotaId, setAnggotaId] = useState('')
  const [jabatanId, setJabatanId] = useState('')
  const [mulaiMenjabat, setMulaiMenjabat] = useState('')
  const [selesaiMenjabat, setSelesaiMenjabat] = useState('')
  const [status, setStatus] = useState<'aktif' | 'selesai'>('aktif')
  const [isLoading, setIsLoading] = useState(false)

  const generalError = errors?.general?.[0]
  const anggotaError = errors?.anggota_id?.[0] ?? errors?.anggota?.[0]
  const jabatanError = errors?.jabatan_id?.[0] ?? errors?.jabatan?.[0]
  const mulaiError = errors?.mulai?.[0]
  const selesaiError = errors?.selesai?.[0]
  const statusError = errors?.status?.[0]

  const selectedAnggota = anggotaOptions.find((item) => String(item.id) === anggotaId)
  const selectedJabatan = jabatanOptions.find((item) => String(item.id) === jabatanId)

  const isFormValid = useMemo(
    () =>
      anggotaId.trim() !== '' &&
      jabatanId.trim() !== '' &&
      mulaiMenjabat.trim() !== '' &&
      Boolean(selectedAnggota) &&
      Boolean(selectedJabatan),
    [anggotaId, jabatanId, mulaiMenjabat, selectedAnggota, selectedJabatan]
  )

  const resetForm = () => {
    setAnggotaId('')
    setJabatanId('')
    setMulaiMenjabat('')
    setSelesaiMenjabat('')
    setStatus('aktif')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid || !selectedAnggota || !selectedJabatan) return

    setIsLoading(true)
    try {
      const success = await onAdd({
        anggotaId: Number(anggotaId),
        jabatanId: Number(jabatanId),
        mulaiMenjabat: Number(mulaiMenjabat),
        selesaiMenjabat: selesaiMenjabat.trim() === '' ? null : Number(selesaiMenjabat),
        status,
      })

      if (success) {
        onOpenChange(false)
        resetForm()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (val: boolean) => {
    if (!val) resetForm()
    onOpenChange(val)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogForm onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Tambah Pengurus Koperasi</DialogTitle>
            <DialogDescription>Silakan masukkan data pengurus koperasi</DialogDescription>
          </DialogHeader>

          <DialogBody className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="pengurus-anggota" className="text-slate-600 font-medium">
                Anggota *
              </Label>
              <Select value={anggotaId} onValueChange={setAnggotaId}>
                <SelectTrigger id="pengurus-anggota" className="h-auto min-h-12 w-full px-4 py-3 text-left">
                  <SelectValue placeholder="Pilih anggota" />
                </SelectTrigger>
                <SelectContent>
                  {anggotaOptions.map((anggota) => (
                    <SelectItem key={anggota.id} value={String(anggota.id)}>
                      <span className="font-medium">{anggota.nama}</span>
                      <span className="text-muted-foreground ml-2 text-xs">{anggota.email}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {anggotaError ? <p className="text-sm text-destructive">{anggotaError}</p> : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pengurus-jabatan" className="text-slate-600 font-medium">
                Jabatan *
              </Label>
              <Select value={jabatanId} onValueChange={setJabatanId}>
                <SelectTrigger id="pengurus-jabatan" className="h-auto min-h-12 w-full px-4 py-3 text-left">
                  <SelectValue placeholder="Pilih jabatan" />
                </SelectTrigger>
                <SelectContent>
                  {jabatanOptions.map((jabatan) => (
                    <SelectItem key={jabatan.id} value={String(jabatan.id)}>
                      <span className="font-medium">{jabatan.nama_posisi}</span>
                      <span className="text-muted-foreground ml-2 text-xs capitalize">{jabatan.jenis_posisi}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {jabatanError ? <p className="text-sm text-destructive">{jabatanError}</p> : null}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pengurus-mulai" className="text-slate-600 font-medium">
                  Mulai Menjabat *
                </Label>
                <Input
                  id="pengurus-mulai"
                  type="number"
                  value={mulaiMenjabat}
                  onChange={(e) => setMulaiMenjabat(e.target.value)}
                  placeholder="2025"
                  min="2000"
                  max={new Date().getFullYear() + 1}
                />
                {mulaiError ? <p className="text-sm text-destructive">{mulaiError}</p> : null}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pengurus-selesai" className="text-slate-600 font-medium">
                  Selesai Menjabat
                </Label>
                <Input
                  id="pengurus-selesai"
                  type="number"
                  value={selesaiMenjabat}
                  onChange={(e) => setSelesaiMenjabat(e.target.value)}
                  placeholder="2026"
                  min="2000"
                  max="2099"
                />
                {selesaiError ? <p className="text-sm text-destructive">{selesaiError}</p> : null}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pengurus-status" className="text-slate-600 font-medium">
                Status *
              </Label>
              <Select value={status} onValueChange={(value) => setStatus(value as 'aktif' | 'selesai')}>
                <SelectTrigger id="pengurus-status" className="h-auto min-h-12 w-full px-4 py-3 text-left">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aktif">Aktif</SelectItem>
                  <SelectItem value="selesai">Selesai</SelectItem>
                </SelectContent>
              </Select>
              {statusError ? <p className="text-sm text-destructive">{statusError}</p> : null}
            </div>

            {generalError ? (
              <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="h-4 w-4" />
                {generalError}
              </div>
            ) : null}
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