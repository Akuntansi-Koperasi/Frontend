import HeaderComp from '@/components/shared/header-comp'
import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

export const Route = createFileRoute('/_auth/simpanan/tagihan')({
  component: RouteComponent,
})

function RouteComponent() {
    return (
    <>
      <HeaderComp 
        title="Manajemen Tagihan"
        description="Kelola tagihan koperasi"
        icon={<Plus />}
        actionLabel="Buat Tagihan"
      />
    </>
  )
}
