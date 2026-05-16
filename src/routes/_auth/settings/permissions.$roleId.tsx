import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Save } from 'lucide-react'
import { useMemo, useState } from 'react'
import { z } from 'zod'

import type { PermissionLevel, PermissionMenuItem } from '@/components/settings/roles/types'

import { PermissionsTable } from '@/components/settings/roles/permissions-table'
import HeaderComp from '@/components/shared/header-comp'
import { SearchBar } from '@/components/shared/search-bar'

const permissionsSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  per_page: z.number().int().positive().catch(10),
  search: z.string().optional(),
})

export const Route = createFileRoute('/_auth/settings/permissions/$roleId')({
  validateSearch: permissionsSearchSchema,
  component: RouteComponent,
})

const MOCK_ROLE_NAMES: Record<string, string> = {
  '1': 'Admin',
  '2': 'Anggota',
  '3': 'Super Admin',
  '4': 'Karyawan',
}

const ALL_MENUS: Array<PermissionMenuItem> = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'simpanan', label: 'Simpanan' },
  { key: 'pinjaman', label: 'Pinjaman' },
  { key: 'gerai_retail', label: 'Gerai / Retail' },
  { key: 'laporan_retail', label: 'Laporan Retail' },
  { key: 'akuntansi', label: 'Akuntansi' },
  { key: 'laporan_akuntansi', label: 'Laporan Akuntansi' },
  { key: 'koperasi', label: 'Koperasi' },
  { key: 'pengaturan_pengguna', label: 'Pengaturan - Pengguna' },
  { key: 'pengaturan_peran', label: 'Pengaturan - Peran' },
  { key: 'pengaturan_migrasi', label: 'Pengaturan - Migrasi' },
  { key: 'anggota', label: 'Anggota' },
  { key: 'laporan_simpanan', label: 'Laporan Simpanan' },
  { key: 'laporan_pinjaman', label: 'Laporan Pinjaman' },
  { key: 'jurnal', label: 'Jurnal' },
  { key: 'buku_besar', label: 'Buku Besar' },
  { key: 'neraca', label: 'Neraca' },
  { key: 'laba_rugi', label: 'Laba Rugi' },
  { key: 'arus_kas', label: 'Arus Kas' },
  { key: 'notifikasi', label: 'Notifikasi' },
  { key: 'profil', label: 'Profil' },
]

function RouteComponent() {
  const { roleId } = Route.useParams()
  const navigate = useNavigate()
  const roleName = MOCK_ROLE_NAMES[roleId] ?? `Peran #${roleId}`

  const { page, per_page, search: searchQuery } = Route.useSearch()

  const [levels, setLevels] = useState<Record<string, PermissionLevel>>(() =>
    Object.fromEntries(ALL_MENUS.map((m) => [m.key, 'lihat'])),
  )

  const filtered = useMemo(() => {
    if (!searchQuery) return ALL_MENUS
    const q = searchQuery.toLowerCase()
    return ALL_MENUS.filter((m) => m.label.toLowerCase().includes(q))
  }, [searchQuery])

  const total = filtered.length
  const pageCount = Math.max(1, Math.ceil(total / per_page))
  const pageIndex = page - 1
  const paginated = filtered.slice(pageIndex * per_page, pageIndex * per_page + per_page)

  const pagination = {
    pageIndex,
    pageSize: per_page,
    pageCount,
  }

  const handlePageChange = (newPageIndex: number) => {
    navigate({
      to: '/settings/permissions/$roleId',
      params: { roleId },
      search: (prev: any) => ({ ...prev, page: newPageIndex + 1 }),
      replace: true,
    })
  }

  const handlePageSizeChange = (newPageSize: number) => {
    navigate({
      to: '/settings/permissions/$roleId',
      params: { roleId },
      search: (prev: any) => ({ ...prev, per_page: newPageSize, page: 1 }),
      replace: true,
    })
  }

  const handleChangeLevel = (menuKey: string, level: PermissionLevel) => {
    setLevels((prev) => ({ ...prev, [menuKey]: level }))
  }

  const handleSave = () => {
    console.log('Saved permissions for role', roleId, levels)
    navigate({ to: '/settings/roles' } as any)
  }

  return (
    <>
      <HeaderComp
        title={`Hak Akses Peran ${roleName}`}
        description="Kelola hak akses peran"
        icon={<Save />}
        actionLabel="Simpan Hak Akses Peran"
        onAction={handleSave}
      />

      <SearchBar placeholder="Cari menu..." className="mb-4" />

      <PermissionsTable
        roleName={roleName}
        menus={paginated}
        totalMenus={ALL_MENUS.length}
        levels={levels}
        onChangeLevel={handleChangeLevel}
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  )
}
