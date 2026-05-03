import HeaderComp from '@/components/shared/header-comp'
import { SearchBar } from '@/components/shared/search-bar'
import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

export const Route = createFileRoute('/_auth/settings/roles')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <HeaderComp
        title="Manajemen Peran"
        description="Kelola peran"
        icon={<Plus />}
        actionLabel="Tambah Peran"
      />
      <SearchBar placeholder="Cari peran..." className="mb-4" />
    </>
  )
}
