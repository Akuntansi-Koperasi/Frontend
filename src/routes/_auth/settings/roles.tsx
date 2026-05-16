import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { z } from 'zod'

import type { RoleRecord } from '@/components/settings/roles/types'

import { RoleAddDialog } from '@/components/settings/roles/role-add-dialog'
import { RolesTable } from '@/components/settings/roles/roles-table'
import HeaderComp from '@/components/shared/header-comp'
import { SearchBar } from '@/components/shared/search-bar'

const rolesSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  per_page: z.number().int().positive().catch(10),
  search: z.string().optional(),
})

export const Route = createFileRoute('/_auth/settings/roles')({
  validateSearch: rolesSearchSchema,
  component: RouteComponent,
})

const INITIAL_ROLES: Array<RoleRecord> = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Anggota' },
  { id: 3, name: 'Super Admin' },
  { id: 4, name: 'Karyawan' },
  { id: 5, name: 'Test' },
  { id: 6, name: 'Test' },
  { id: 7, name: 'Test' },
  { id: 8, name: 'Test' },
  { id: 9, name: 'Test' },
  { id: 10, name: 'Test' },
]

function RouteComponent() {
  const search = Route.useSearch()
  const { page, per_page, search: searchQuery } = search

  const [roles, setRoles] = useState<Array<RoleRecord>>(() => INITIAL_ROLES)
  const [openAdd, setOpenAdd] = useState(false)

  const filtered = useMemo(() => {
    if (!searchQuery) return roles
    const q = searchQuery.toLowerCase()
    return roles.filter((r) => r.name.toLowerCase().includes(q))
  }, [roles, searchQuery])

  const total = filtered.length
  const pageCount = Math.max(1, Math.ceil(total / per_page))
  const safePageIndex = Math.min(page - 1, pageCount - 1)
  const paginatedData = filtered.slice(
    safePageIndex * per_page,
    safePageIndex * per_page + per_page,
  )

  const pagination = {
    pageIndex: safePageIndex,
    pageSize: per_page,
    pageCount,
    total,
  }

  return (
    <>
      <HeaderComp
        title="Manajemen Peran"
        description="Kelola peran"
        icon={<Plus />}
        actionLabel="Tambah Peran"
        onAction={() => setOpenAdd(true)}
      />
      <RoleAddDialog
        open={openAdd}
        onOpenChange={setOpenAdd}
        onAdd={({ name }) => {
          setRoles((prev) => {
            const nextId = prev.length ? Math.max(...prev.map((r) => r.id)) + 1 : 1
            return [{ id: nextId, name }, ...prev]
          })
        }}
      />
      <SearchBar placeholder="Cari peran..." className="mb-4" />

      <RolesTable
        data={paginatedData}
        pagination={pagination}
        onEdit={({ id, name }) => {
          setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, name } : r)))
        }}
        onDelete={(id) => {
          setRoles((prev) => prev.filter((r) => r.id !== id))
        }}
      />
    </>
  )
}
