import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import type {
  AnggotaOption,
  ProdukSimpananOption,
  RekeningSimpananRecord,
} from './types'

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

interface RekeningSimpananAddDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  anggotaOptions: Array<AnggotaOption>
  produkOptions: Array<ProdukSimpananOption>
  onAdd: (
    payload: Omit<RekeningSimpananRecord, 'id' | 'statusTagih'> & {
      statusTagih?: RekeningSimpananRecord['statusTagih']
    },
  ) => void
}

export function RekeningSimpananAddDialog({
  open,
  onOpenChange,
  anggotaOptions,
  produkOptions,
  onAdd,
}: RekeningSimpananAddDialogProps) {
  const [anggotaId, setAnggotaId] = React.useState<string>('')
  const [produkId, setProdukId] = React.useState<string>('')
  const [nominal, setNominal] = React.useState('')
  const [bungaTahunan, setBungaTahunan] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const isFormValid = React.useMemo(
    () => anggotaId !== '' && produkId !== '' && nominal.trim() !== '' && bungaTahunan.trim() !== '',
    [anggotaId, bungaTahunan, nominal, produkId],
  )

  const resetForm = React.useCallback(() => {
    setAnggotaId('')
    setProdukId('')
    setNominal('')
    setBungaTahunan('')
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

    const nowIdPart = String(Date.now()).slice(-3)
    const rekeningNumber = `006 - 1056 - ${nowIdPart}`

    setIsLoading(true)
    try {
      await Promise.resolve()
      onAdd({
        anggotaId: Number(anggotaId),
        produkId: Number(produkId),
        nomorRekening: rekeningNumber,
        nominal: parseInt(nominal, 10),
        bungaTahunan: parseFloat(bungaTahunan),
        statusTagih: 'Tagih',
      })
      toast.success('Rekening simpanan berhasil ditambahkan')
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
            <DialogTitle className="text-2xl font-bold">Tambah Rekening Simpanan</DialogTitle>
            <DialogDescription>Silakan masukkan data rekening simpanan baru</DialogDescription>
          </DialogHeader>

          <DialogBody className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="anggota" className="text-slate-600 font-medium">
                Anggota*
              </Label>
              <Select value={anggotaId} onValueChange={setAnggotaId}>
                <SelectTrigger id="anggota" className="h-auto min-h-12 cursor-pointer w-full px-4 py-3">
                  <SelectValue placeholder="Pilih anggota" />
                </SelectTrigger>
                <SelectContent>
                  {anggotaOptions.map((anggota) => (
                    <SelectItem key={anggota.id} value={String(anggota.id)}>
                      {anggota.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="produk" className="text-slate-600 font-medium">
                Produk Simpanan*
              </Label>
              <Select value={produkId} onValueChange={setProdukId}>
                <SelectTrigger id="produk" className="h-auto min-h-12 cursor-pointer w-full px-4 py-3">
                  <SelectValue placeholder="Pilih Produk Simpanan" />
                </SelectTrigger>
                <SelectContent>
                  {produkOptions.map((produk) => (
                    <SelectItem key={produk.id} value={String(produk.id)}>
                      {produk.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nominal" className="text-slate-600 font-medium">
                Nominal/Jumlah (Rp)
              </Label>
              <Input
                id="nominal"
                type="number"
                placeholder="Masukkan Nominal"
                value={nominal}
                onChange={(e) => setNominal(e.target.value)}
                className="h-auto min-h-12 w-full px-4 py-3"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bunga" className="text-slate-600 font-medium">
                Suku Bunga Tahunan (%) *
              </Label>
              <Input
                id="bunga"
                type="number"
                placeholder="Bunga dalam persen"
                value={bungaTahunan}
                onChange={(e) => setBungaTahunan(e.target.value)}
                step="0.01"
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
