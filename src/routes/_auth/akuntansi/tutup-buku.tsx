import HeaderComp from '@/components/shared/header-comp'
import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

export const Route = createFileRoute('/_auth/akuntansi/tutup-buku')({
  component: RouteComponent,
})

function RouteComponent() {
    return (
    <>
      <HeaderComp 
        title="Tutup Buku (Simpan Pinjam)"
        description="TODO: Custom Header untuk Tutup Buku"
        icon={<Plus />}
        actionLabel="Tambah Tutup Buku"
      />
    </>
  )
}
