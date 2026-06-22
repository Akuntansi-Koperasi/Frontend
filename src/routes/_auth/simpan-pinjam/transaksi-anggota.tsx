import { createFileRoute } from "@tanstack/react-router";
import HeaderComp from "@/components/shared/header-comp";

export const Route = createFileRoute("/_auth/simpan-pinjam/transaksi-anggota")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <HeaderComp
        title="Rekapitulasi Simpanan"
        description="Kelola akun akses koperasi"
      />
    </>
  );
}
