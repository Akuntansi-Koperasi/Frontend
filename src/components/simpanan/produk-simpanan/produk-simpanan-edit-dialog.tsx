import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { JENIS_SIMPANAN } from './types'
import type { ProdukSimpananRecord } from './types'

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

interface ProdukSimpananEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (payload: ProdukSimpananRecord) => void
  produk?: ProdukSimpananRecord
  isEditing?: boolean
}

export function ProdukSimpananEditDialog({
  open,
  onOpenChange,
  onEdit,
  produk,
  isEditing = false,
}: ProdukSimpananEditDialogProps) {
  const [nama, setNama] = React.useState('')
  const [jenis, setJenis] = React.useState<'Sukarela' | 'Wajib'>('Sukarela')
  const [bunga, setBunga] = React.useState('')
  const [nominal, setNominal] = React.useState('')
  const [keterangan, setKeterangan] = React.useState('')

  const isFormValid = React.useMemo(
    () => nama.trim() !== '' && bunga.trim() !== '' && nominal.trim() !== '' && Boolean(produk),
    [bunga, nama, nominal, produk],
  )

  React.useEffect(() => {
    if (produk && open) {
      setNama(produk.nama)
      setJenis(produk.jenis)
      setBunga(produk.bunga.toString())
      setNominal(produk.nominal.toString())
      setKeterangan(produk.keterangan)
    }
  }, [produk, open])

  const resetForm = React.useCallback(() => {
    setNama('')
    setJenis('Sukarela')
    setBunga('')
    setNominal('')
    setKeterangan('')
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!produk) return

    if (!isFormValid) {
      toast.error('Semua field wajib harus diisi')
      return
    }

    try {
      await Promise.resolve()
      onEdit({
        id: produk.id,
        nama: nama.trim(),
        jenis,
        bunga: parseFloat(bunga),
        nominal: parseInt(nominal, 10),
        keterangan: keterangan.trim(),
      })
      toast.success('Produk simpanan berhasil diperbarui')
      onOpenChange(false)
      resetForm()
    } catch {
      toast.error('Gagal memperbarui produk simpanan')
    }
  }

  const handleOpenChange = (val: boolean) => {
    if (!val) resetForm()
    onOpenChange(val)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogForm onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Produk Simpanan</DialogTitle>
            <DialogDescription>Silakan ubah data produk simpanan</DialogDescription>
          </DialogHeader>

          <DialogBody className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nama" className="text-slate-600 font-medium">
                Nama*
              </Label>
              <Input
                id="nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama produk simpanan"
                className="h-auto min-h-12 w-full px-4 py-3"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="jenis" className="text-slate-600 font-medium">
                Jenis Simpanan*
              </Label>
              <Select value={jenis} onValueChange={(value) => setJenis(value as 'Sukarela' | 'Wajib')}>
                <SelectTrigger id="jenis" className="h-auto min-h-12 cursor-pointer w-full px-4 py-3">
                  <SelectValue placeholder="Pilih jenis simpanan" />
                </SelectTrigger>
                <SelectContent>
                  {JENIS_SIMPANAN.map((j) => (
                    <SelectItem key={j} value={j}>
                      {j}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bunga" className="text-slate-600 font-medium">
                Suku Bunga Tahunan (%)*
              </Label>
              <Input
                id="bunga"
                type="number"
                value={bunga}
                onChange={(e) => setBunga(e.target.value)}
                step="0.01"
                className="h-auto min-h-12 w-full px-4 py-3"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nominal" className="text-slate-600 font-medium">
                Nominal/Jumlah (Rp)*
              </Label>
              <Input
                id="nominal"
                type="number"
                value={nominal}
                onChange={(e) => setNominal(e.target.value)}
                className="h-auto min-h-12 w-full px-4 py-3"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="keterangan" className="text-slate-600 font-medium">
                Keterangan
              </Label>
              <textarea
                id="keterangan"
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
              disabled={isEditing}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="md:w-[50%] w-full bg-slate-900 text-white hover:bg-slate-800 h-12 cursor-pointer"
              disabled={isEditing || !isFormValid}
            >
              {isEditing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogForm>
      </DialogContent>
    </Dialog>
  )
}
