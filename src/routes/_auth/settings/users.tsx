import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import type { UserRecord } from '@/services/userService'
import { UserAddDialog } from '@/components/settings/users/user-add-dialog'
import { UsersTable } from '@/components/settings/users/users-table'
import HeaderComp from '@/components/shared/header-comp'
import { SearchBar } from '@/components/shared/search-bar'

// ─── Search Params Schema ─────────────────────────────────────────────────────
const usersSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  per_page: z.number().int().positive().catch(10),
  search: z.string().optional(),
  role: z.enum(['admin', 'employee']).optional(),
})

export const Route = createFileRoute('/_auth/settings/users')({
  validateSearch: usersSearchSchema,
  component: RouteComponent,
})

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_USERS: Array<UserRecord> = [
  {
    id: 1,
    name: 'Budi Santoso',
    username: 'budi.santoso',
    email: 'budi.santoso@koperasi.id',
    peran: 'admin',
    profile_image: null,
  },
  {
    id: 2,
    name: 'Siti Rahayu',
    username: 'siti.rahayu',
    email: 'siti.rahayu@koperasi.id',
    peran: 'employee',
    profile_image: null,
  },
  {
    id: 3,
    name: 'Ahmad Fauzi',
    username: 'ahmad.fauzi',
    email: 'ahmad.fauzi@koperasi.id',
    peran: 'employee',
    profile_image: null,
  },
  {
    id: 4,
    name: 'Dewi Lestari',
    username: 'dewi.lestari',
    email: 'dewi.lestari@koperasi.id',
    peran: 'admin',
    profile_image: null,
  },
  {
    id: 5,
    name: 'Rudi Hartono',
    username: 'rudi.hartono',
    email: 'rudi.hartono@koperasi.id',
    peran: 'employee',
    profile_image: null,
  },
  {
    id: 6,
    name: 'Eka Wulandari',
    username: 'eka.wulandari',
    email: 'eka.wulandari@koperasi.id',
    peran: 'employee',
    profile_image: null,
  },
  {
    id: 7,
    name: 'Hendra Gunawan',
    username: 'hendra.gunawan',
    email: 'hendra.gunawan@koperasi.id',
    peran: 'employee',
    profile_image: null,
  },
  {
    id: 8,
    name: 'Nita Permata',
    username: 'nita.permata',
    email: 'nita.permata@koperasi.id',
    peran: 'employee',
    profile_image: null,
  },
  {
    id: 9,
    name: 'Yusuf Ibrahim',
    username: 'yusuf.ibrahim',
    email: 'yusuf.ibrahim@koperasi.id',
    peran: 'admin',
    profile_image: null,
  },
  {
    id: 10,
    name: 'Rina Marlina',
    username: 'rina.marlina',
    email: 'rina.marlina@koperasi.id',
    peran: 'employee',
    profile_image: null,
  },
  {
    id: 11,
    name: 'Fajar Nugraha',
    username: 'fajar.nugraha',
    email: 'fajar.nugraha@koperasi.id',
    peran: 'employee',
    profile_image: null,
  },
  {
    id: 12,
    name: 'Laila Sari',
    username: 'laila.sari',
    email: 'laila.sari@koperasi.id',
    peran: 'employee',
    profile_image: null,
  },
]

// ─── Route Component ──────────────────────────────────────────────────────────
function RouteComponent() {
  const search = Route.useSearch()
  const { page, per_page, search: searchQuery, role } = search

  // Filter mock data berdasarkan search params
  const filtered = useMemo(() => {
    let result = MOCK_USERS

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q),
      )
    }

    if (role) {
      result = result.filter((u) => u.peran === role)
    }

    return result
  }, [searchQuery, role])

  // Paginasi manual
  const total = filtered.length
  const pageCount = Math.max(1, Math.ceil(total / per_page))
  const safePageIndex = Math.min(page - 1, pageCount - 1) // 0-based
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

  const [open, setOpen] = useState(false)

  return (
    <>
      <HeaderComp
        title="Manajemen Pengguna"
        description="Kelola akun akses anggota"
        icon={<Plus />}
        actionLabel='Aktifkan Pengguna'
        onAction={() => setOpen(true)}
      />
      <UserAddDialog open={open} onOpenChange={setOpen} />
      <SearchBar placeholder="Cari pengguna..." className="mb-4" />

      <UsersTable data={paginatedData} pagination={pagination} />
    </>
  )
}
