import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import type { JabatanRecord } from './types'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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

type JabatanEditDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  jabatan: JabatanRecord | null
  onEdit: (payload: { id: number; nama: string; kategori: string; multiple: boolean }) => Promise<boolean>
  errors?: Partial<Record<string, Array<string>>> | null
}

export function JabatanEditDialog({ open, onOpenChange, jabatan, onEdit, errors }: JabatanEditDialogProps) {
  const [nama, setNama] = useState('')
  const [kategori, setKategori] = useState('')
  const [multiple, setMultiple] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const generalError = errors?.general?.[0]
  const namaError = errors?.nama_posisi?.[0] ?? errors?.nama?.[0]
  const kategoriError = errors?.jenis_posisi?.[0]

  useEffect(() => {
    if (open && jabatan) {
      setNama(jabatan.nama)
      setKategori(jabatan.kategori)
      setMultiple(jabatan.multiple)
    }
  }, [open, jabatan])

  const isFormValid = useMemo(() => nama.trim() !== '' && kategori.trim() !== '' && Boolean(jabatan), [nama, kategori, jabatan])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!jabatan || !isFormValid) return

    setIsLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 350))
      const success = await onEdit({ id: jabatan.id, nama: nama.trim(), kategori: kategori.trim(), multiple })
      if (success) {
        toast.success('Jabatan berhasil diperbarui')
        onOpenChange(false)
      }
    } catch {
      toast.error('Gagal memperbarui jabatan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (val: boolean) => {
    if (!val) {
      setNama('')
      setKategori('')
      setMultiple(false)
    }
    onOpenChange(val)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogForm onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Jabatan</DialogTitle>
            <DialogDescription>Silakan ubah data jabatan</DialogDescription>
          </DialogHeader>

          <DialogBody className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-jabatan-nama" className="text-slate-600 font-medium">
                Nama Jabatan*
              </Label>
              <Input
                id="edit-jabatan-nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama"
                className="h-auto min-h-12 w-full px-4 py-3"
              />
              {namaError ? <p className="text-sm text-destructive mt-1">{namaError}</p> : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-jabatan-kategori" className="text-slate-600 font-medium">
                Kategori*
              </Label>
              <Select value={kategori} onValueChange={(v) => setKategori(v)}>
                <SelectTrigger id="edit-jabatan-kategori" className="h-auto min-h-12 w-full px-4 py-3 text-left">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ketua">Ketua</SelectItem>
                  <SelectItem value="sekretaris">Sekretaris</SelectItem>
                  <SelectItem value="bendahara">Bendahara</SelectItem>
                  <SelectItem value="lain-lain">Lain-lain</SelectItem>
                </SelectContent>
              </Select>
              {kategoriError ? <p className="text-sm text-destructive mt-1">{kategoriError}</p> : null}
            </div>

            <div className="flex items-center gap-3">
              <Switch id="edit-jabatan-multiple" checked={multiple} onCheckedChange={(v) => setMultiple(Boolean(v))} />
              <Label htmlFor="edit-jabatan-multiple" className="font-medium">
                Multiple
              </Label>
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
