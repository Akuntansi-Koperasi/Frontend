import * as React from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { JENIS_SIMPANAN } from "./types";
import type { ProdukSimpananRecord } from "./types";

import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProdukSimpananAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (payload: Omit<ProdukSimpananRecord, "id">) => Promise<boolean>;
  errors?: Partial<Record<string, Array<string>>> | null;
}

export function ProdukSimpananAddDialog({
  open,
  onOpenChange,
  onAdd,
  errors,
}: ProdukSimpananAddDialogProps) {
  const [nama, setNama] = React.useState("");
  const [jenis, setJenis] = React.useState<"Sukarela" | "Wajib" | "Pokok">(
    "Sukarela",
  );
  const [bunga, setBunga] = React.useState("");
  const [nominal, setNominal] = React.useState("");
  const [keterangan, setKeterangan] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const generalError = errors?.general?.[0];
  const namaError = errors?.nama?.[0];
  const jenisError = errors?.tipe?.[0];
  const bungaError = errors?.suku_bunga?.[0];
  const nominalError = errors?.jumlah?.[0];
  const keteranganError = errors?.keterangan?.[0];

  const isFormValid = React.useMemo(
    () => nama.trim() !== "" && bunga.trim() !== "" && nominal.trim() !== "",
    [bunga, nama, nominal],
  );

  const resetForm = React.useCallback(() => {
    setNama("");
    setJenis("Sukarela");
    setBunga("");
    setNominal("");
    setKeterangan("");
  }, []);

  const handleOpenChange = (val: boolean) => {
    if (!val) resetForm();
    onOpenChange(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Semua field wajib harus diisi");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 350));
      const success = await onAdd({
        nama: nama.trim(),
        jenis,
        bunga: parseFloat(bunga),
        nominal: parseInt(nominal, 10),
        keterangan: keterangan.trim(),
      });
      if (success) {
        onOpenChange(false);
        resetForm();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogForm onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Tambah Produk Simpanan
            </DialogTitle>
            <DialogDescription>
              Silakan masukkan data produk simpanan baru
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nama" className="text-slate-600 font-medium">
                Nama*
              </Label>
              <Input
                id="nama"
                placeholder="Masukkan nama produk simpanan"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="h-auto min-h-12 w-full px-4 py-3"
              />
              {namaError ? (
                <p className="text-sm text-destructive mt-1">{namaError}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="jenis" className="text-slate-600 font-medium">
                Jenis Simpanan*
              </Label>
              <Select
                value={jenis}
                onValueChange={(value) =>
                  setJenis(value as "Sukarela" | "Wajib" | "Pokok")
                }
              >
                <SelectTrigger
                  id="jenis"
                  className="h-auto min-h-12 cursor-pointer w-full px-4 py-3"
                >
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
              {jenisError ? (
                <p className="text-sm text-destructive mt-1">{jenisError}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bunga" className="text-slate-600 font-medium">
                Suku Bunga Tahunan (%)*
              </Label>
              <Input
                id="bunga"
                type="number"
                placeholder="Bunga dalam persen"
                value={bunga}
                onChange={(e) => setBunga(e.target.value)}
                step="0.01"
                className="h-auto min-h-12 w-full px-4 py-3"
              />
              {bungaError ? (
                <p className="text-sm text-destructive mt-1">{bungaError}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nominal" className="text-slate-600 font-medium">
                Nominal/Jumlah (Rp)*
              </Label>
              <Input
                id="nominal"
                type="number"
                placeholder="Masukkan nominal"
                value={nominal}
                onChange={(e) => setNominal(e.target.value)}
                className="h-auto min-h-12 w-full px-4 py-3"
              />
              {nominalError ? (
                <p className="text-sm text-destructive mt-1">{nominalError}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="keterangan"
                className="text-slate-600 font-medium"
              >
                Keterangan
              </Label>
              <textarea
                id="keterangan"
                placeholder="Tambahkan keterangan produk simpanan..."
                value={keterangan}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setKeterangan(e.target.value)
                }
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {keteranganError ? (
                <p className="text-sm text-destructive mt-1">
                  {keteranganError}
                </p>
              ) : null}
            </div>

            {generalError ? (
              <div className="flex items-center gap-2 p-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="h-4 w-4" />
                {generalError}
              </div>
            ) : null}
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
  );
}
