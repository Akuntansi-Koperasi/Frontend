import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { z } from 'zod'

import type { ProdukPinjamanRecord } from '@/components/pinjaman/produk-pinjaman/types'
import { MOCK_PRODUK_PINJAMAN } from '@/components/pinjaman/produk-pinjaman/types'
import { ProdukPinjamanTable } from '@/components/pinjaman/produk-pinjaman/produk-pinjaman-table'
import HeaderComp from '@/components/shared/header-comp'
import { SearchBar } from '@/components/shared/search-bar'

const produkPinjamanSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  per_page: z.number().int().positive().catch(10),
  search: z.string().optional(),
})

export const Route = createFileRoute('/_auth/pinjaman/produk-pinjaman')({
  validateSearch: produkPinjamanSearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const search = Route.useSearch()

  const [data, setData] = React.useState<Array<ProdukPinjamanRecord>>(MOCK_PRODUK_PINJAMAN)
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
        item.periode.toLowerCase().includes(searchQuery) ||
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
        to: '/pinjaman/produk-pinjaman',
        search: (prev: any) => ({ ...prev, page: safePage }),
        replace: true,
      })
    }
  }, [navigate, page, safePage])

  const handlePageChange = (newPageIndex: number) => {
    navigate({
      to: '/pinjaman/produk-pinjaman',
      search: (prev: any) => ({ ...prev, page: newPageIndex + 1 }),
      replace: true,
    })
  }

  const handlePageSizeChange = (newPageSize: number) => {
    navigate({
      to: '/pinjaman/produk-pinjaman',
      search: (prev: any) => ({ ...prev, per_page: newPageSize, page: 1 }),
      replace: true,
    })
  }

  const handleSearchChange = (value: string) => {
    navigate({
      to: '/pinjaman/produk-pinjaman',
      search: (prev: any) => ({
        ...prev,
        search: value === '' ? undefined : value,
        page: 1,
      }),
      replace: true,
    })
  }

  const handleAdd = (payload: Omit<ProdukPinjamanRecord, 'id'>) => {
    const id = Math.max(0, ...data.map((item) => item.id)) + 1
    setData((prev) => [{ id, ...payload }, ...prev])
  }

  const handleEdit = (payload: ProdukPinjamanRecord) => {
    setData((prev) => prev.map((item) => (item.id === payload.id ? payload : item)))
  }

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <>
      <HeaderComp
        title="Manajemen Produk Pinjaman"
        description="Kelola produk pinjaman"
        icon={<Plus />}
        actionLabel="Tambah Produk"
        onAction={() => setAddOpen(true)}
      />

      <SearchBar
        placeholder="Cari produk pinjaman..."
        className="mb-4"
        value={search.search ?? ''}
        onChange={(event) => handleSearchChange(event.target.value)}
      />

      <ProdukPinjamanTable
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
