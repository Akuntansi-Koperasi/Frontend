import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { JENIS_PINJAMAN, PERIODE_PINJAMAN } from './types'
import type { JenisPinjaman, PeriodePinjaman, ProdukPinjamanRecord } from './types'

import { Button } from '@/components/ui/button'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ProdukPinjamanAddDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (payload: Omit<ProdukPinjamanRecord, 'id'>) => void
}

export function ProdukPinjamanAddDialog({
  open,
  onOpenChange,
  onAdd,
}: ProdukPinjamanAddDialogProps) {
  const [nama, setNama] = React.useState('')
  const [jenis, setJenis] = React.useState<JenisPinjaman>('Menurun')
  const [periode, setPeriode] = React.useState<PeriodePinjaman>('Harian')
  const [bunga, setBunga] = React.useState('')
  const [keterangan, setKeterangan] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const isFormValid = React.useMemo(
    () => nama.trim() !== '' && bunga.trim() !== '',
    [bunga, nama],
  )

  const resetForm = React.useCallback(() => {
    setNama('')
    setJenis('Menurun')
    setPeriode('Harian')
    setBunga('')
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

    setIsLoading(true)
    try {
      await Promise.resolve()
      onAdd({
        nama: nama.trim(),
        jenis,
        periode,
        bunga: parseFloat(bunga),
        keterangan: keterangan.trim(),
      })
      toast.success('Produk pinjaman berhasil ditambahkan')
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
            <DialogTitle className="text-2xl font-bold">Tambah Produk Pinjaman</DialogTitle>
            <DialogDescription>Silakan masukkan data produk pinjaman baru</DialogDescription>
          </DialogHeader>

          <DialogBody className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nama" className="text-slate-600 font-medium">
                Nama *
              </Label>
              <Input
                id="nama"
                placeholder="Masukkan Nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="h-auto min-h-12 w-full px-4 py-3"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="jenis" className="text-slate-600 font-medium">
                Jenis Pinjaman *
              </Label>
              <Select value={jenis} onValueChange={(value) => setJenis(value as JenisPinjaman)}>
                <SelectTrigger id="jenis" className="h-auto min-h-12 cursor-pointer w-full px-4 py-3">
                  <SelectValue placeholder="Pilih Jenis Pinjaman" />
                </SelectTrigger>
                <SelectContent>
                  {JENIS_PINJAMAN.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="periode" className="text-slate-600 font-medium">
                Jenis Periode Pinjaman *
              </Label>
              <Select value={periode} onValueChange={(value) => setPeriode(value as PeriodePinjaman)}>
                <SelectTrigger id="periode" className="h-auto min-h-12 cursor-pointer w-full px-4 py-3">
                  <SelectValue placeholder="Pilih Periode Pinjaman" />
                </SelectTrigger>
                <SelectContent>
                  {PERIODE_PINJAMAN.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bunga" className="text-slate-600 font-medium">
                Suku Bunga Tahunan (%) *
              </Label>
              <Input
                id="bunga"
                type="number"
                placeholder="Bunga dalam persen"
                value={bunga}
                onChange={(e) => setBunga(e.target.value)}
                step="0.01"
                className="h-auto min-h-12 w-full px-4 py-3"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="keterangan" className="text-slate-600 font-medium">
                Keterangan
              </Label>
              <textarea
                id="keterangan"
                placeholder="Tambahkan keterangan akun..."
                value={keterangan}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setKeterangan(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
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
