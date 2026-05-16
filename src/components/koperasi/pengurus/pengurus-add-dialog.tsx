import { useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { MOCK_ANGGOTA_KOPERASI } from './types'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type PengurusAddDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (payload: {
    anggotaId: string
    nama: string
    email: string
    avatar?: string
    jabatan: string
    mulaiMenjabat: number
    selesaiMenjabat: number
    status: 'Aktif' | 'Tidak Aktif'
  }) => void
}

export function PengurusAddDialog({ open, onOpenChange, onAdd }: PengurusAddDialogProps) {
  const [anggotaId, setAnggotaId] = useState('')
  const [jabatan, setJabatan] = useState('')
  const [mulaiMenjabat, setMulaiMenjabat] = useState('')
  const [selesaiMenjabat, setSelesaiMenjabat] = useState('')
  const [status, setStatus] = useState('Aktif')
  const [isLoading, setIsLoading] = useState(false)

  const selectedAnggota = MOCK_ANGGOTA_KOPERASI.find((a) => a.id === anggotaId)

  const isFormValid = useMemo(
    () =>
      anggotaId.trim() !== '' &&
      jabatan.trim() !== '' &&
      mulaiMenjabat.trim() !== '' &&
      selesaiMenjabat.trim() !== '',
    [anggotaId, jabatan, mulaiMenjabat, selesaiMenjabat]
  )

  const resetForm = () => {
    setAnggotaId('')
    setJabatan('')
    setMulaiMenjabat('')
    setSelesaiMenjabat('')
    setStatus('Aktif')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid || !selectedAnggota) return

    setIsLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 350))
      onAdd({
        anggotaId: anggotaId.trim(),
        nama: selectedAnggota.nama,
        email: selectedAnggota.email,
        avatar: selectedAnggota.avatar,
        jabatan: jabatan.trim(),
        mulaiMenjabat: parseInt(mulaiMenjabat),
        selesaiMenjabat: parseInt(selesaiMenjabat),
        status: status as 'Aktif' | 'Tidak Aktif',
      })
      toast.success('Pengurus berhasil ditambahkan')
      onOpenChange(false)
      resetForm()
    } catch {
      toast.error('Gagal menambahkan pengurus')
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
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Tambah Pengurus Koperasi Baru</DialogTitle>
            <DialogDescription>Silakan masukkan data pengurus koperasi</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="pengurus-anggota" className="text-slate-600 font-medium">
                Anggota *
              </Label>
              <Select value={anggotaId} onValueChange={setAnggotaId}>
                <SelectTrigger id="pengurus-anggota" className="h-auto min-h-12 w-full px-4 py-3 text-left">
                  <SelectValue placeholder="Pilih anggota" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_ANGGOTA_KOPERASI.map((anggota) => (
                    <SelectItem key={anggota.id} value={anggota.id}>
                      <span className="font-medium">{anggota.nama}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pengurus-jabatan" className="text-slate-600 font-medium">
                Jabatan *
              </Label>
              <Select value={jabatan} onValueChange={setJabatan}>
                <SelectTrigger id="pengurus-jabatan" className="h-auto min-h-12 w-full px-4 py-3 text-left">
                  <SelectValue placeholder="Pilih jabatan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ketua">Ketua</SelectItem>
                  <SelectItem value="Wakil Ketua">Wakil Ketua</SelectItem>
                  <SelectItem value="Sekretaris">Sekretaris</SelectItem>
                  <SelectItem value="Bendahara">Bendahara</SelectItem>
                  <SelectItem value="Anggota">Anggota</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pengurus-mulai" className="text-slate-600 font-medium">
                  Mulai Menjabat *
                </Label>
                <input
                  id="pengurus-mulai"
                  type="number"
                  value={mulaiMenjabat}
                  onChange={(e) => setMulaiMenjabat(e.target.value)}
                  placeholder="2025"
                  className="h-auto min-h-12 w-full px-4 py-3 border border-input rounded-md"
                  min="2000"
                  max={new Date().getFullYear()}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pengurus-selesai" className="text-slate-600 font-medium">
                  Selesai Menjabat *
                </Label>
                <input
                  id="pengurus-selesai"
                  type="number"
                  value={selesaiMenjabat}
                  onChange={(e) => setSelesaiMenjabat(e.target.value)}
                  placeholder="2026"
                  className="h-auto min-h-12 w-full px-4 py-3 border border-input rounded-md"
                  min="2000"
                  max="2099"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pengurus-status" className="text-slate-600 font-medium">
                Status *
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="pengurus-status" className="h-auto min-h-12 w-full px-4 py-3 text-left">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
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
