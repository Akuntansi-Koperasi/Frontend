import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'

import type { JabatanOption, PengurusFormErrors, PengurusRecord, PengurusUpsertPayload } from './types'

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

type PengurusEditDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  pengurus: PengurusRecord | null
  jabatanOptions: Array<JabatanOption>
  onEdit: (payload: PengurusUpsertPayload & { id: number }) => Promise<boolean>
  errors?: PengurusFormErrors
}

export function PengurusEditDialog({
  open,
  onOpenChange,
  pengurus,
  jabatanOptions,
  onEdit,
  errors,
}: PengurusEditDialogProps) {
  const [jabatanId, setJabatanId] = useState('')
  const [mulaiMenjabat, setMulaiMenjabat] = useState('')
  const [selesaiMenjabat, setSelesaiMenjabat] = useState('')
  const [status, setStatus] = useState<'aktif' | 'selesai'>('aktif')
  const [isLoading, setIsLoading] = useState(false)

  const generalError = errors?.general?.[0]
  const jabatanError = errors?.jabatan_id?.[0] ?? errors?.jabatan?.[0]
  const mulaiError = errors?.mulai?.[0]
  const selesaiError = errors?.selesai?.[0]
  const statusError = errors?.status?.[0]

  useEffect(() => {
    if (open && pengurus) {
      setJabatanId(String(pengurus.jabatanId))
      setMulaiMenjabat(String(pengurus.mulaiMenjabat))
      setSelesaiMenjabat(pengurus.selesaiMenjabat == null ? '' : String(pengurus.selesaiMenjabat))
      setStatus(pengurus.status)
    }
  }, [open, pengurus])

  const selectedJabatan = jabatanOptions.find((item) => String(item.id) === jabatanId)
  const currentJabatanOption = pengurus
    ? jabatanOptions.find((item) => String(item.id) === String(pengurus.jabatanId)) ?? {
        id: pengurus.jabatanId,
        nama_posisi: pengurus.jabatan,
        jenis_posisi: pengurus.kategori,
        multiple: false,
      }
    : null
  const editJabatanOptions = currentJabatanOption
    ? [
        currentJabatanOption,
        ...jabatanOptions.filter((item) => String(item.id) !== String(currentJabatanOption.id)),
      ]
    : jabatanOptions

  const isFormValid = useMemo(
    () =>
      jabatanId.trim() !== '' &&
      mulaiMenjabat.trim() !== '' &&
      Boolean(selectedJabatan) &&
      Boolean(pengurus),
    [jabatanId, mulaiMenjabat, selectedJabatan, pengurus]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pengurus || !isFormValid || !selectedJabatan) return

    setIsLoading(true)
    try {
      const success = await onEdit({
        id: pengurus.id,
        anggotaId: pengurus.anggotaId,
        jabatanId: Number(jabatanId),
        mulaiMenjabat: Number(mulaiMenjabat),
        selesaiMenjabat: selesaiMenjabat.trim() === '' ? null : Number(selesaiMenjabat),
        status,
      })

      if (success) {
        onOpenChange(false)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (val: boolean) => {
    if (!val) {
      setJabatanId('')
      setMulaiMenjabat('')
      setSelesaiMenjabat('')
      setStatus('aktif')
    }
    onOpenChange(val)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogForm onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Pengurus Koperasi</DialogTitle>
            <DialogDescription>Silakan ubah data pengurus koperasi</DialogDescription>
          </DialogHeader>

          <DialogBody className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">Anggota</Label>
              <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="font-medium text-slate-900">{pengurus?.nama ?? '-'}</p>
                <p className="text-xs text-muted-foreground">{pengurus?.email ?? ''}</p>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-pengurus-jabatan" className="text-slate-600 font-medium">
                Jabatan *
              </Label>
              <Select value={jabatanId} onValueChange={setJabatanId}>
                <SelectTrigger id="edit-pengurus-jabatan" className="h-auto min-h-12 w-full px-4 py-3 text-left">
                  <SelectValue placeholder="Pilih jabatan" />
                </SelectTrigger>
                <SelectContent>
                  {editJabatanOptions.map((jabatan) => (
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
                <Label htmlFor="edit-pengurus-mulai" className="text-slate-600 font-medium">
                  Mulai Menjabat *
                </Label>
                <Input
                  id="edit-pengurus-mulai"
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
                <Label htmlFor="edit-pengurus-selesai" className="text-slate-600 font-medium">
                  Selesai Menjabat
                </Label>
                <Input
                  id="edit-pengurus-selesai"
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
              <Label htmlFor="edit-pengurus-status" className="text-slate-600 font-medium">
                Status *
              </Label>
              <Select value={status} onValueChange={(value) => setStatus(value as 'aktif' | 'selesai')}>
                <SelectTrigger id="edit-pengurus-status" className="h-auto min-h-12 w-full px-4 py-3 text-left">
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