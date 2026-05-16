import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { z } from 'zod'
import type { ProdukSimpananRecord } from '@/components/simpanan/produk-simpanan/types'
import { MOCK_PRODUK_SIMPANAN } from '@/components/simpanan/produk-simpanan/types'
import HeaderComp from '@/components/shared/header-comp'
import { SearchBar } from '@/components/shared/search-bar'
import { ProdukSimpananTable } from '@/components/simpanan/produk-simpanan/produk-simpanan-table'

const produkSimpananSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  per_page: z.number().int().positive().catch(10),
  search: z.string().optional(),
})

export const Route = createFileRoute('/_auth/simpanan/produk-simpanan')({
  validateSearch: produkSimpananSearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const search = Route.useSearch()

  const [data, setData] = React.useState<Array<ProdukSimpananRecord>>(MOCK_PRODUK_SIMPANAN)
  const [addOpen, setAddOpen] = React.useState(false)

  const page = search.page || 1
  const perPage = search.per_page || 10
  const pageIndex = page - 1
  const paginatedData = data.slice(pageIndex * perPage, pageIndex * perPage + perPage)

  const handleAdd = (payload: Omit<ProdukSimpananRecord, 'id'>) => {
    const id = Math.max(0, ...data.map((d) => d.id)) + 1
    setData((prev) => [{ id, ...payload }, ...prev])
  }

  const handleEdit = (payload: ProdukSimpananRecord) => {
    setData((prev) => prev.map((d) => (d.id === payload.id ? { ...d, ...payload } : d)))
  }

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((d) => d.id !== id))
  }

  const handlePageChange = (newPage: number) => {
    navigate({
      to: '/simpanan/produk-simpanan',
      search: (prev: any) => ({ ...prev, page: newPage }),
      replace: true,
    })
  }

  const handlePageSizeChange = (newPageSize: number) => {
    navigate({
      to: '/simpanan/produk-simpanan',
      search: (prev: any) => ({ ...prev, per_page: newPageSize, page: 1 }),
      replace: true,
    })
  }

  return (
    <>
      <HeaderComp
        title="Manajemen Produk Simpanan"
        description="Kelola produk simpanan"
        icon={<Plus />}
        actionLabel="Tambah Simpanan"
        onAction={() => setAddOpen(true)}
      />
      <SearchBar placeholder="Cari produk simpanan..." className="mb-4" />

      <ProdukSimpananTable
        data={paginatedData}
        pageIndex={pageIndex}
        pageSize={perPage}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addOpen={addOpen}
        onAddOpenChange={setAddOpen}
      />
    </>
  )
}
