import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { z } from 'zod'
import type { JabatanRecord } from '@/components/koperasi/jabatan/types'
import HeaderComp from '@/components/shared/header-comp'
import { SearchBar } from '@/components/shared/search-bar'

import { JabatanTable } from '@/components/koperasi/jabatan/jabatan-table'

const jabatanSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  per_page: z.number().int().positive().catch(10),
  search: z.string().optional(),
})

export const Route = createFileRoute('/_auth/koperasi/jabatan')({
  validateSearch: jabatanSearchSchema,
  component: RouteComponent,
})

const MOCK_DATA: Array<JabatanRecord> = Array.from({ length: 22 }).map((_, i) => ({
  id: i + 1,
  nama: ['Sekretaris', 'Wakil Ketua', 'Ketua', 'Bendahara', 'Anggota'][i % 5] + ` ${i + 1}`,
  kategori: 'Pengurus',
  multiple: i % 3 === 0,
}))

function RouteComponent() {
  const navigate = useNavigate()
  const [data, setData] = React.useState<Array<JabatanRecord>>(MOCK_DATA)
  const search = Route.useSearch()
  const page = search.page
  const perPage = search.per_page
  const searchQuery = (search.search ?? '').trim().toLowerCase()

  const [addOpen, setAddOpen] = React.useState(false)

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data
    return data.filter((item) => {
      return (
        item.nama.toLowerCase().includes(searchQuery) ||
        item.kategori.toLowerCase().includes(searchQuery)
      )
    })
  }, [data, searchQuery])

  const total = filteredData.length
  const pageCount = Math.max(1, Math.ceil(total / perPage))
  const safePage = Math.min(Math.max(page, 1), pageCount)
  const pageIndex = safePage - 1
  const paginated = filteredData.slice(pageIndex * perPage, pageIndex * perPage + perPage)

  const pagination = {
    pageIndex,
    pageSize: perPage,
    pageCount,
    total,
  }

  React.useEffect(() => {
    if (safePage !== page) {
      navigate({
        to: '/koperasi/jabatan',
        search: (prev: any) => ({ ...prev, page: safePage }),
        replace: true,
      })
    }
  }, [navigate, page, safePage])

  const handleAdd = (payload: { nama: string; kategori: string; multiple: boolean }) => {
    const id = Math.max(0, ...data.map((d) => d.id)) + 1
    setData((prev) => [{ id, ...payload }, ...prev])
  }

  const handleEdit = (payload: { id: number; nama: string; kategori: string; multiple: boolean }) => {
    setData((prev) => prev.map((d) => (d.id === payload.id ? { ...d, ...payload } : d)))
  }

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((d) => d.id !== id))
  }

  const handlePageChange = (newPageIndex: number) => {
    navigate({
      to: '/koperasi/jabatan',
      search: (prev: any) => ({ ...prev, page: newPageIndex + 1 }),
      replace: true,
    })
  }

  const handlePageSizeChange = (newPageSize: number) => {
    navigate({
      to: '/koperasi/jabatan',
      search: (prev: any) => ({ ...prev, per_page: newPageSize, page: 1 }),
      replace: true,
    })
  }

  const handleSearchChange = (value: string) => {
    navigate({
      to: '/koperasi/jabatan',
      search: (prev: any) => ({
        ...prev,
        search: value === '' ? undefined : value,
        page: 1,
      }),
      replace: true,
    })
  }

  return (
    <>
      <HeaderComp
        title="Manajemen Pengaturan Jabatan"
        description="Kelola jabatan koperasi"
        icon={<Plus />}
        actionLabel="Tambah Jabatan"
        onAction={() => setAddOpen(true)}
      />

      <SearchBar
        placeholder="Cari jabatan..."
        className="mb-4"
        value={search.search ?? ''}
        onChange={(event) => handleSearchChange(event.target.value)}
      />

      <JabatanTable
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
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  )
}
