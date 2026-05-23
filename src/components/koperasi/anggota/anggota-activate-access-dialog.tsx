import { useEffect, useMemo, useState } from "react"
import { Loader2 } from "lucide-react"
import type { AnggotaRecord, RoleOption } from "./types"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogForm,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type AnggotaActivateAccessDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  anggota: AnggotaRecord | null
  roleOptions: Array<RoleOption>
  onActivate: (payload: { id: number; roleId: number }) => Promise<boolean>
}

export function AnggotaActivateAccessDialog({
  open,
  onOpenChange,
  anggota,
  roleOptions,
  onActivate,
}: AnggotaActivateAccessDialogProps) {
  const [roleId, setRoleId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setRoleId(anggota?.role?.id ? String(anggota.role.id) : "")
    }
  }, [open, anggota])

  const isFormValid = useMemo(() => roleId !== "" && Boolean(anggota), [roleId, anggota])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!anggota || roleId === "") return

    setIsLoading(true)
    try {
      const success = await onActivate({ id: anggota.id, roleId: Number(roleId) })
      if (success) {
        onOpenChange(false)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (val: boolean) => {
    if (!val) setRoleId("")
    onOpenChange(val)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogForm onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Aktifkan Akun Akses Anggota</DialogTitle>
            <DialogDescription>
              Silakan ubah data anggota{anggota ? `: ${anggota.nama}` : ""}
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">Peran*</Label>
              <Select value={roleId} onValueChange={(v) => setRoleId(v)}>
                <SelectTrigger className="h-auto min-h-12 cursor-pointer w-full px-4 py-3">
                  <SelectValue placeholder="Pilih Peran" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((opt) => (
                    <SelectItem key={opt.id} value={String(opt.id)}>
                      {opt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
