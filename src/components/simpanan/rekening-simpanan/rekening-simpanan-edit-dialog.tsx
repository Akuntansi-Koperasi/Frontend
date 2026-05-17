import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import type { RekeningSimpananRecord } from './types'

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

interface RekeningSimpananEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rekening?: RekeningSimpananRecord
  onEdit: (payload: RekeningSimpananRecord) => void
  isEditing?: boolean
}

export function RekeningSimpananEditDialog({
  open,
  onOpenChange,
  rekening,
  onEdit,
  isEditing = false,
}: RekeningSimpananEditDialogProps) {
  const [nominal, setNominal] = React.useState('')
  const [bungaTahunan, setBungaTahunan] = React.useState('')

  const isFormValid = React.useMemo(
    () => nominal.trim() !== '' && bungaTahunan.trim() !== '' && Boolean(rekening),
    [bungaTahunan, nominal, rekening],
  )

  React.useEffect(() => {
    if (rekening && open) {
      setNominal(rekening.nominal.toString())
      setBungaTahunan(rekening.bungaTahunan?.toString() ?? '')
    }
  }, [rekening, open])

  const resetForm = React.useCallback(() => {
    setNominal('')
    setBungaTahunan('')
  }, [])

  const handleOpenChange = (val: boolean) => {
    if (!val) resetForm()
    onOpenChange(val)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!rekening) return

    if (!isFormValid) {
      toast.error('Semua field wajib harus diisi')
      return
    }

    try {
      await Promise.resolve()
      onEdit({
        ...rekening,
        nominal: parseInt(nominal, 10),
        bungaTahunan: parseFloat(bungaTahunan),
      })
      toast.success('Rekening simpanan berhasil diperbarui')
      onOpenChange(false)
      resetForm()
    } catch {
      toast.error('Gagal memperbarui rekening simpanan')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogForm onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Rekening Simpanan</DialogTitle>
            <DialogDescription>Silakan Edit data rekening simpanan</DialogDescription>
          </DialogHeader>

          <DialogBody className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nominal-edit" className="text-slate-600 font-medium">
                Nominal/Jumlah (Rp)
              </Label>
              <Input
                id="nominal-edit"
                type="number"
                value={nominal}
                onChange={(e) => setNominal(e.target.value)}
                className="h-auto min-h-12 w-full px-4 py-3"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bunga-edit" className="text-slate-600 font-medium">
                Suku Bunga Tahunan (%) *
              </Label>
              <Input
                id="bunga-edit"
                type="number"
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
              disabled={isEditing}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="md:w-[50%] w-full bg-slate-900 text-white hover:bg-slate-800 h-12"
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
