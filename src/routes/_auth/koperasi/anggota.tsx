import { SearchBar } from '@/components/nav-sidebar/search-bar';
import HeaderComp from '@/components/shared/header-comp'
import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

export const Route = createFileRoute('/_auth/koperasi/anggota')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <HeaderComp
        title="Manajemen Anggota"
        description="Kelola anggota koperasi"
        icon={<Plus />}
        actionLabel="Tambah Anggota"
      />
      <SearchBar placeholder="Cari anggota..." className="mb-4" />
    </>
  )
}
