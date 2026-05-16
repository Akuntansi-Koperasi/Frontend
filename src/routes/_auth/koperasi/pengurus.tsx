import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import HeaderComp from '@/components/shared/header-comp'
import { SearchBar } from '@/components/shared/search-bar'

export const Route = createFileRoute('/_auth/koperasi/pengurus')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <HeaderComp
        title="Manajemen Pengurus Koperasi"
        description="Kelola anggota pengurus koperasi"
        icon={<Plus />}
        actionLabel="Tambah Struktur"
      />
      <SearchBar placeholder="Cari nama pengurus..." className="mb-4" />
    </>
  )
}
