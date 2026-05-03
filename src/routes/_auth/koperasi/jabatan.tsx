import HeaderComp from '@/components/shared/header-comp'
import { SearchBar } from '@/components/shared/search-bar'
import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

export const Route = createFileRoute('/_auth/koperasi/jabatan')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <HeaderComp
        title="Manajemen Pengaturan Jabatan"
        description="Kelola jabatan koperasi"
        icon={<Plus />}
        actionLabel="Tambah Jabatan"
      />
      <SearchBar placeholder="Cari jabatan..." className="mb-4" />
    </>
  )
}
