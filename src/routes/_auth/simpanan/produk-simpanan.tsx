import HeaderComp from '@/components/shared/header-comp'
import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

export const Route = createFileRoute('/_auth/simpanan/produk-simpanan')({
  component: RouteComponent,
})

function RouteComponent() {
    return (
    <>
      <HeaderComp
        title="Manajemen Produk Simpanan"
        description="Kelola produk simpanan"
        icon={<Plus />}
        actionLabel="Tambah Simpanan"
      />
    </>
  )
}
