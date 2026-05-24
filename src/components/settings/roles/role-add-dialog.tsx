import { useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'
import type { RoleFormErrors } from '@/services/roleService'

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

type RoleAddDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (payload: { name: string }) => Promise<boolean>
  errors?: RoleFormErrors
}

export function RoleAddDialog({ open, onOpenChange, onAdd, errors }: RoleAddDialogProps) {
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const isFormValid = useMemo(() => name.trim() !== '', [name])

  const resetForm = () => setName('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsLoading(true)
    try {
      const success = await onAdd({ name: name.trim() })
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

  const generalError = errors?.general?.[0]
  const nameError = errors?.name?.[0]

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogForm onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Tambah Peran</DialogTitle>
            <DialogDescription>Silakan masukkan nama peran baru</DialogDescription>
          </DialogHeader>

          <DialogBody className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="role-name" className="text-slate-600 font-medium">
                Nama Peran*
              </Label>
              <Input
                id="role-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama peran"
                className="h-auto min-h-12 w-full px-4 py-3"
              />
              {nameError ? <p className="text-sm text-destructive">{nameError}</p> : null}
            </div>
            {generalError ? <p className="text-sm text-destructive">{generalError}</p> : null}
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
