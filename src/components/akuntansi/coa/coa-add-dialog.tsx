import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { KATEGORI_OPTIONS } from './types'
import type { CoaRecord } from './types'

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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CoaAddDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (payload: Omit<CoaRecord, 'id'>) => void
}

export function CoaAddDialog({
  open,
  onOpenChange,
  onAdd,
}: CoaAddDialogProps) {
  const [kode, setKode] = React.useState('')
  const [namaAkun, setNamaAkun] = React.useState('')
  const [kategori, setKategori] = React.useState<string>('')
  const [keterangan, setKeterangan] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const isFormValid = React.useMemo(
    () => namaAkun.trim() !== '' && kategori !== '',
    [namaAkun, kategori],
  )

  const resetForm = React.useCallback(() => {
    setKode('')
    setNamaAkun('')
    setKategori('')
    setKeterangan('')
  }, [])

  const handleOpenChange = (val: boolean) => {
    if (!val) resetForm()
    onOpenChange(val)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid) {
      toast.error('Semua field wajib harus diisi')
      return
    }

    const generatedKode = kode.trim() || String(Date.now()).slice(-9)

    setIsLoading(true)
    try {
      await Promise.resolve()
      onAdd({
        kode: generatedKode,
        namaAkun: namaAkun.trim(),
        kategori: kategori as CoaRecord['kategori'],
        keterangan: keterangan.trim(),
      })
      toast.success('COA berhasil ditambahkan')
      onOpenChange(false)
      resetForm()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogForm onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Tambah COA</DialogTitle>
            <DialogDescription>Silakan tambah data COA</DialogDescription>
          </DialogHeader>

          <DialogBody className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="kode-akun" className="text-slate-600 font-medium">
                Kode Akun <span className="text-slate-400 font-normal">* jika dikosongkan akan tergenerate otomatis</span>
              </Label>
              <Input
                id="kode-akun"
                type="text"
                placeholder=""
                value={kode}
                onChange={(e) => setKode(e.target.value)}
                className="h-auto min-h-12 w-full px-4 py-3"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nama-akun" className="text-slate-600 font-medium">
                Nama Akun <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nama-akun"
                type="text"
                placeholder=""
                value={namaAkun}
                onChange={(e) => setNamaAkun(e.target.value)}
                className="h-auto min-h-12 w-full px-4 py-3"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="kategori" className="text-slate-600 font-medium">
                Kategori <span className="text-red-500">*</span>
              </Label>
              <Select value={kategori} onValueChange={setKategori}>
                <SelectTrigger id="kategori" className="h-auto min-h-12 cursor-pointer w-full px-4 py-3">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {KATEGORI_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="keterangan" className="text-slate-600 font-medium">
                Keterangan
              </Label>
              <Input
                id="keterangan"
                type="text"
                placeholder="Tambahkan keterangan akun..."
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                className="h-auto min-h-12 w-full px-4 py-3"
              />
            </div>
          </DialogBody>

          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              className="md:w-[50%] w-full h-12"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="md:w-[50%] w-full bg-slate-900 text-white hover:bg-slate-800 h-12"
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
