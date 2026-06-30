import * as React from "react";
import { Loader2 } from "lucide-react";

import type { CoaRecord } from "./types";

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogForm,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CoaEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coa?: CoaRecord;
  onEdit: (payload: {
    id: number;
    kategori_coa_id: number;
    nama: string;
    kode?: string;
    keterangan?: string;
  }) => Promise<boolean>;
  isEditing?: boolean;
}

export function CoaEditDialog({
  open,
  onOpenChange,
  coa,
  onEdit,
  isEditing = false,
}: CoaEditDialogProps) {
  const [namaAkun, setNamaAkun] = React.useState("");
  const [keterangan, setKeterangan] = React.useState("");

  const isFormValid = React.useMemo(
    () => namaAkun.trim() !== "" && Boolean(coa),
    [namaAkun, coa],
  );

  React.useEffect(() => {
    if (coa && open) {
      setNamaAkun(coa.namaAkun);
      setKeterangan(coa.keterangan);
    }
  }, [coa, open]);

  const resetForm = React.useCallback(() => {
    setNamaAkun("");
    setKeterangan("");
  }, []);

  const handleOpenChange = (val: boolean) => {
    if (!val) resetForm();
    onOpenChange(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!coa) return;

    if (!isFormValid) {
      return;
    }

    try {
      const success = await onEdit({
        id: coa.id,
        kategori_coa_id: coa.kategori_coa_id,
        nama: namaAkun.trim(),
        keterangan: keterangan.trim() || undefined,
      });
      if (success) {
        onOpenChange(false);
        resetForm();
      }
    } catch {
      // error handled by parent
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogForm onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Edit Data COA
            </DialogTitle>
            <DialogDescription>Silakan ubah data COA</DialogDescription>
          </DialogHeader>

          <DialogBody className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">Kode Akun</Label>
              <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="font-medium text-slate-900">{coa?.kode ?? "-"}</p>
              </div>
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="nama-akun-edit"
                className="text-slate-600 font-medium"
              >
                Nama Akun <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nama-akun-edit"
                type="text"
                value={namaAkun}
                onChange={(e) => setNamaAkun(e.target.value)}
                className="h-auto min-h-12 w-full px-4 py-3"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-slate-600 font-medium">Kategori</Label>
              <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="font-medium text-slate-900">
                  {coa?.kategori ?? "-"}
                </p>
              </div>
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="keterangan-edit"
                className="text-slate-600 font-medium"
              >
                Keterangan
              </Label>
              <Input
                id="keterangan-edit"
                type="text"
                placeholder="Tambahkan keterangan akun..."
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
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
  );
}
