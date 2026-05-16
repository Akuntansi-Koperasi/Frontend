import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { z } from 'zod'
import type { PengurusRecord } from '@/components/koperasi/pengurus/types'
import { MOCK_ANGGOTA_KOPERASI } from '@/components/koperasi/pengurus/types'
import HeaderComp from '@/components/shared/header-comp'
import { SearchBar } from '@/components/shared/search-bar'
import { PengurusTable } from '@/components/koperasi/pengurus/pengurus-table'

const pengurusSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  per_page: z.number().int().positive().catch(10),
  search: z.string().optional(),
})

export const Route = createFileRoute('/_auth/koperasi/pengurus')({
  validateSearch: pengurusSearchSchema,
  component: RouteComponent,
})

const MOCK_DATA: Array<PengurusRecord> = Array.from({ length: 12 }).map((_, i) => {
  const anggota = MOCK_ANGGOTA_KOPERASI[i % MOCK_ANGGOTA_KOPERASI.length]
  return {
    id: i + 1,
    anggotaId: anggota.id,
    nama: anggota.nama,
    email: anggota.email,
    avatar: anggota.avatar,
    jabatan: ['Sekretaris', 'Wakil Ketua', 'Ketua', 'Bendahara', 'Anggota'][i % 5],
    mulaiMenjabat: 2025,
    selesaiMenjabat: 2026,
    status: i % 3 === 0 ? 'Tidak Aktif' : 'Aktif',
  }
})

function RouteComponent() {
  const navigate = useNavigate()
  const [data, setData] = React.useState<Array<PengurusRecord>>(MOCK_DATA)
  const { page: pageSearch, per_page: perPageSearch } = Route.useSearch()
  const page = pageSearch
  const perPage = perPageSearch

  const [addOpen, setAddOpen] = React.useState(false)

  const total = data.length
  const pageCount = Math.max(1, Math.ceil(total / perPage))
  const pageIndex = page - 1
  const paginated = data.slice(pageIndex * perPage, pageIndex * perPage + perPage)

  const pagination = {
    pageIndex,
    pageSize: perPage,
    pageCount,
    total,
  }

  const handleAdd = (payload: {
    anggotaId: string
    nama: string
    email: string
    avatar?: string
    jabatan: string
    mulaiMenjabat: number
    selesaiMenjabat: number
    status: 'Aktif' | 'Tidak Aktif'
  }) => {
    const id = Math.max(0, ...data.map((d) => d.id)) + 1
    setData((prev) => [{ id, ...payload }, ...prev])
  }

  const handleEdit = (payload: {
    id: number
    anggotaId: string
    nama: string
    email: string
    avatar?: string
    jabatan: string
    mulaiMenjabat: number
    selesaiMenjabat: number
    status: 'Aktif' | 'Tidak Aktif'
  }) => {
    setData((prev) => prev.map((d) => (d.id === payload.id ? { ...d, ...payload } : d)))
  }

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((d) => d.id !== id))
  }

  const handleStatusChange = (id: number, status: 'Aktif' | 'Tidak Aktif') => {
    setData((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)))
  }

  const handlePageChange = (newPageIndex: number) => {
    navigate({
      to: '/koperasi/pengurus',
      search: (prev: any) => ({ ...prev, page: newPageIndex + 1 }),
      replace: true,
    })
  }

  const handlePageSizeChange = (newPageSize: number) => {
    navigate({
      to: '/koperasi/pengurus',
      search: (prev: any) => ({ ...prev, per_page: newPageSize, page: 1 }),
      replace: true,
    })
  }

  return (
    <>
      <HeaderComp
        title="Manajemen Pengurus Koperasi"
        description="Kelola anggota pengurus koperasi"
        icon={<Plus />}
        actionLabel="Tambah Struktur"
        onAction={() => setAddOpen(true)}
      />

      <SearchBar placeholder="Cari nama pengurus..." className="mb-4" />

      <PengurusTable
        data={paginated}
        pagination={pagination}
        addOpen={addOpen}
        onAddOpenChange={setAddOpen}
        onAdd={handleAdd}
        onEdit={(payload) => {
          handleEdit(payload)
        }}
        onDelete={(id) => {
          handleDelete(id)
        }}
        onStatusChange={handleStatusChange}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  )
}
