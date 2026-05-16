import { useEffect, useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import type { RoleRecord } from './types'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

type RoleEditDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: RoleRecord | null
  onEdit: (payload: { id: number; name: string }) => void
}

export function RoleEditDialog({ open, onOpenChange, role, onEdit }: RoleEditDialogProps) {
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open && role) {
      setName(role.name)
    }
  }, [open, role])

  const isFormValid = useMemo(() => name.trim() !== '' && Boolean(role), [name, role])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role || !isFormValid) return

    setIsLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 350))
      onEdit({ id: role.id, name: name.trim() })
      toast.success('Peran berhasil diperbarui')
      onOpenChange(false)
    } catch {
      toast.error('Gagal memperbarui peran')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (val: boolean) => {
    if (!val) setName('')
    onOpenChange(val)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogForm onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Peran</DialogTitle>
            <DialogDescription>Silakan ubah nama peran</DialogDescription>
          </DialogHeader>

          <DialogBody className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-role-name" className="text-slate-600 font-medium">
                Nama Peran*
              </Label>
              <Input
                id="edit-role-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama peran"
                className="h-auto min-h-12 w-full px-4 py-3"
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
