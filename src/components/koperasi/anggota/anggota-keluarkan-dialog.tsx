import { useEffect, useMemo, useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { AnggotaRecord } from "./types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

type AnggotaKeluarkanDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  anggota: AnggotaRecord | null
  onConfirm: (payload: { id: number; tanggal_keluar: string }) => void
}

export function AnggotaKeluarkanDialog({
  open,
  onOpenChange,
  anggota,
  onConfirm,
}: AnggotaKeluarkanDialogProps) {
  const [tanggalKeluar, setTanggalKeluar] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setTanggalKeluar(anggota?.tanggal_keluar ?? "")
    }
  }, [open, anggota])

  const isFormValid = useMemo(
    () => Boolean(anggota) && tanggalKeluar.trim() !== "",
    [anggota, tanggalKeluar],
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!anggota || tanggalKeluar.trim() === "") return

    setIsLoading(true)
    try {
      // dummy; API nanti
      await new Promise((r) => setTimeout(r, 400))
      onConfirm({ id: anggota.id, tanggal_keluar: tanggalKeluar })
      toast.success(`Anggota ${anggota.nama} berhasil dikeluarkan`)
      onOpenChange(false)
    } catch {
      toast.error("Gagal mengeluarkan anggota")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (val: boolean) => {
    if (!val) setTanggalKeluar("")
    onOpenChange(val)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogForm onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Keluarkan Anggota Ini</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin mengeluarkan anggota ini?
              {anggota ? (
                <>
                  {" "}
                  <b>{anggota.nama}</b>
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">Tanggal Keluar*</Label>
              <Input
                type="date"
                value={tanggalKeluar}
                onChange={(e) => setTanggalKeluar(e.target.value)}
                className="h-auto min-h-12 cursor-pointer w-full px-4 py-3"
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
              Ya, Keluarkan
            </Button>
          </DialogFooter>
        </DialogForm>
      </DialogContent>
    </Dialog>
  )
}
