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
  const searchQuery = (search.search ?? '').trim().toLowerCase()

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data

    return data.filter((item) => {
      return (
        item.nama.toLowerCase().includes(searchQuery) ||
        item.jenis.toLowerCase().includes(searchQuery) ||
        item.keterangan.toLowerCase().includes(searchQuery)
      )
    })
  }, [data, searchQuery])

  const pageCount = Math.max(1, Math.ceil(filteredData.length / perPage))
  const safePage = Math.min(Math.max(page, 1), pageCount)
  const pageIndex = safePage - 1
  const paginatedData = filteredData.slice(pageIndex * perPage, pageIndex * perPage + perPage)
  const pagination = {
    pageIndex,
    pageSize: perPage,
    pageCount,
    total: filteredData.length,
  }

  React.useEffect(() => {
    if (safePage !== page) {
      navigate({
        to: '/simpanan/produk-simpanan',
        search: (prev: any) => ({ ...prev, page: safePage }),
        replace: true,
      })
    }
  }, [navigate, page, safePage])

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

  const handlePageChange = (newPageIndex: number) => {
    navigate({
      to: '/simpanan/produk-simpanan',
      search: (prev: any) => ({ ...prev, page: newPageIndex + 1 }),
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

  const handleSearchChange = (value: string) => {
    navigate({
      to: '/simpanan/produk-simpanan',
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
        title="Manajemen Produk Simpanan"
        description="Kelola produk simpanan"
        icon={<Plus />}
        actionLabel="Tambah Simpanan"
        onAction={() => setAddOpen(true)}
      />
      <SearchBar
        placeholder="Cari produk simpanan..."
        className="mb-4"
        value={search.search ?? ''}
        onChange={(event) => handleSearchChange(event.target.value)}
      />

      <ProdukSimpananTable
        data={paginatedData}
        pagination={pagination}
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
