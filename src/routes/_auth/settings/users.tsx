import HeaderComp from '@/components/shared/header-comp'
import { Plus } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'
import { SearchBar } from '@/components/shared/search-bar'

export const Route = createFileRoute('/_auth/settings/users')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <HeaderComp
        title="Manajemen Pengguna"
        description="Kelola akun akses anggota"
        icon={<Plus />}
        actionLabel='Aktifkan Pengguna'
      />
      <SearchBar placeholder="Cari pengguna..." className="mb-4" />
    </>
  )
}
