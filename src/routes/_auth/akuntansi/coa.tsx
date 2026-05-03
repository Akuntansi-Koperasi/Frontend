import HeaderComp from '@/components/shared/header-comp'
import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

export const Route = createFileRoute('/_auth/akuntansi/coa')({
  component: RouteComponent,
})

function RouteComponent() {
    return (
    <>
      <HeaderComp
        title="COA TODO: Bikin Header Sendiri Cik"
        description="Kelola anggota koperasi"
        icon={<Plus />}
        actionLabel="Tambah Anggota"
      />
    </>
  )
}
