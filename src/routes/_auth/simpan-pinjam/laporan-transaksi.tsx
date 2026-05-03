import HeaderComp from '@/components/shared/header-comp'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/simpan-pinjam/laporan-transaksi')({
  component: RouteComponent,
})

function RouteComponent() {
    return (
    <>
      <HeaderComp
        title="Transaksi Anggota"
        description="Lakukan transaksi anggota"
      />
    </>
  )
}
