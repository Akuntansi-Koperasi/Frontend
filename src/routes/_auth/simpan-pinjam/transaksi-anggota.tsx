import HeaderComp from '@/components/shared/header-comp'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/simpan-pinjam/transaksi-anggota')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <HeaderComp
        title="Rekapitulasi Simpanan"
        description="Kelola akun akses koperasi"
      />
    </>
  )
}
