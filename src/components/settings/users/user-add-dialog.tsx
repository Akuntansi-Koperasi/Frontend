import {  useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type {FormEvent} from "react";
import type { AnggotaDropdownOption } from "@/services/anggotaService"
import type { RoleOption } from "@/services/roleService"
import type { UserFormErrors } from "@/services/userService"
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

// options and handlers are provided by parent route

// ─── Types ────────────────────────────────────────────────────────────────────
type UserAddDialogProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onCreate: (payload: { anggota_id: number; role_id: number }) => Promise<boolean>
  errors?: UserFormErrors
  anggotaOptions: Array<AnggotaDropdownOption>
  roleOptions: Array<RoleOption>
}

// ─── Component ────────────────────────────────────────────────────────────────
export function UserAddDialog({ open, onOpenChange, onCreate, errors: _errors, anggotaOptions, roleOptions }: UserAddDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = typeof open === "boolean" && typeof onOpenChange === "function"
  const dialogOpen = isControlled ? (open) : internalOpen
  const setDialogOpen = isControlled
    ? (onOpenChange as (o: boolean) => void)
    : setInternalOpen

  const [anggotaId, setAnggotaId] = useState("")
  const [peranId, setPeranId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  // parent handles query invalidation

  const isFormValid = anggotaId !== "" && peranId !== ""

  const resetForm = () => {
    setAnggotaId("")
    setPeranId("")
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsLoading(true)
    try {
      const success = await onCreate({ anggota_id: parseInt(anggotaId, 10), role_id: parseInt(peranId, 10) })
      if (success) {
        setDialogOpen(false)
        resetForm()
      }
    } catch {
      toast.error("Gagal mengaktifkan akun akses anggota")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (val: boolean) => {
    if (!val) resetForm()
    setDialogOpen(val)
  }

  const generalError = _errors?.general?.[0]
  const anggotaError = _errors?.anggota_id?.[0] ?? _errors?.anggota?.[0]
  const peranError = _errors?.role_id?.[0] ?? _errors?.role?.[0]

  // options are provided by parent via props

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogForm onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Aktifkan Akun Akses Anggota
            </DialogTitle>
            <DialogDescription>Silahkan pilih anggota dan peran</DialogDescription>
          </DialogHeader>

          <DialogBody className="grid gap-4 py-4">
            {/* Anggota */}
            <div className="grid gap-2">
              <Label htmlFor="anggota-select" className="text-slate-600 font-medium">
                Anggota*
              </Label>
              <Select value={anggotaId} onValueChange={setAnggotaId}>
                <SelectTrigger id="anggota-select" className="h-auto min-h-12 cursor-pointer w-full px-4 py-3">
                  <SelectValue placeholder="Pilih anggota" />
                </SelectTrigger>
                <SelectContent>
                  {anggotaOptions.map((anggota) => (
                    <SelectItem key={anggota.id} value={anggota.id.toString()}>
                      <span className="font-medium">{anggota.nama}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {anggotaError ? <p className="text-sm text-destructive">{anggotaError}</p> : null}
            </div>

            {/* Peran */}
            <div className="grid gap-2">
              <Label htmlFor="peran-select" className="text-slate-600 font-medium">
                Peran*
              </Label>
              <Select value={peranId} onValueChange={setPeranId}>
                <SelectTrigger id="peran-select" className="h-auto min-h-12 cursor-pointer w-full px-4 py-3">
                  <SelectValue placeholder="Pilih Peran" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((peran) => (
                    <SelectItem key={peran.id} value={peran.id.toString()}>
                      {peran.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {peranError ? <p className="text-sm text-destructive">{peranError}</p> : null}
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