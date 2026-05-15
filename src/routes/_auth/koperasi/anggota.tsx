import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { z } from 'zod'
import type { AnggotaRecord } from '@/components/koperasi/anggota/types'
import { AnggotaAddDialog } from '@/components/koperasi/anggota/anggota-add-dialog'
import { AnggotaTable } from '@/components/koperasi/anggota/anggota-table'
import HeaderComp from '@/components/shared/header-comp'
import { SearchBar } from '@/components/shared/search-bar'

export const Route = createFileRoute('/_auth/koperasi/anggota')({
  validateSearch: z.object({
    page: z.number().int().positive().catch(1),
    per_page: z.number().int().positive().catch(10),
    search: z.string().optional(),
  }),
  component: RouteComponent,
})

const MOCK_ANGGOTA: Array<AnggotaRecord> = [
  {
    id: 1,
    nama: 'Alice Smith',
    email: 'aff@example.com',
    photo_profile: null,
    nomor_ktp: '3471234567890001',
    nomor_telepon: '081234567890',
    gender: 'Perempuan',
    tanggal_masuk: '2026-01-03',
    status: 'aktif',
    akses_sistem: true,
    role: 'employee',
    tanggal_keluar: null,
  },
  {
    id: 2,
    nama: 'Bob Johnson',
    email: 'bobj@example.com',
    photo_profile: null,
    nomor_ktp: '3471234567890002',
    nomor_telepon: '081234567891',
    gender: 'Perempuan',
    tanggal_masuk: '2026-02-10',
    status: 'tidak_aktif',
    akses_sistem: false,
    role: null,
    tanggal_keluar: null,
  },
  {
    id: 3,
    nama: 'Clara Garcia',
    email: 'clara@example.com',
    photo_profile: null,
    nomor_ktp: '3471234567890003',
    nomor_telepon: '081234567892',
    gender: 'Perempuan',
    tanggal_masuk: '2026-03-20',
    status: 'keluar',
    akses_sistem: false,
    role: null,
    tanggal_keluar: '2026-05-01',
  },
  {
    id: 4,
    nama: 'David Brown',
    email: 'david@example.com',
    photo_profile: null,
    nomor_ktp: '3471234567890004',
    nomor_telepon: '081234567893',
    gender: 'Perempuan',
    tanggal_masuk: '2026-04-07',
    status: 'tidak_aktif',
    akses_sistem: false,
    role: null,
    tanggal_keluar: null,
  },
  {
    id: 5,
    nama: 'Emma Lee',
    email: 'emma@example.com',
    photo_profile: null,
    nomor_ktp: '3471234567890005',
    nomor_telepon: '081234567894',
    gender: 'Perempuan',
    tanggal_masuk: '2026-04-20',
    status: 'aktif',
    akses_sistem: true,
    role: 'admin',
    tanggal_keluar: null,
  },
  {
    id: 6,
    nama: 'Frank Wong',
    email: 'frank@example.com',
    photo_profile: null,
    nomor_ktp: '3471234567890006',
    nomor_telepon: '081234567895',
    gender: 'Perempuan',
    tanggal_masuk: '2026-04-25',
    status: 'tidak_aktif',
    akses_sistem: false,
    role: null,
    tanggal_keluar: null,
  },
]

function RouteComponent() {
  const navigate = useNavigate()
  const search = Route.useSearch()
  const { page, per_page, search: searchQuery } = search

  const [openAdd, setOpenAdd] = useState(false)
  const [anggotaList, setAnggotaList] = useState<Array<AnggotaRecord>>(() => MOCK_ANGGOTA)

  const filtered = useMemo(() => {
    let result = anggotaList
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (a) =>
          a.nama.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          (a.nomor_ktp || '').toLowerCase().includes(q) ||
          (a.nomor_telepon || '').toLowerCase().includes(q),
      )
    }
    return result
  }, [anggotaList, searchQuery])

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
        title="Manajemen Anggota"
        description="Kelola anggota koperasi"
        icon={<Plus />}
        actionLabel="Tambah Anggota"
        onAction={() => setOpenAdd(true)}
      />

      <AnggotaAddDialog
        open={openAdd}
        onOpenChange={setOpenAdd}
        onCreate={(payload) => {
          setAnggotaList((prev) => {
            const nextId = prev.length ? Math.max(...prev.map((p) => p.id)) + 1 : 1
            return [{ id: nextId, ...payload }, ...prev]
          })
        }}
      />

      <SearchBar placeholder="Cari anggota..." className="mb-4" />

      <AnggotaTable
        data={paginatedData}
        pagination={pagination}
        onPageChange={(newPageIndex) => {
          navigate({
            to: '/koperasi/anggota',
            search: (prev: any) => ({ ...prev, page: newPageIndex + 1 }),
            replace: true,
          })
        }}
        onPageSizeChange={(newPageSize) => {
          navigate({
            to: '/koperasi/anggota',
            search: (prev: any) => ({ ...prev, per_page: newPageSize, page: 1 }),
            replace: true,
          })
        }}
        onUpdate={(payload) => {
          setAnggotaList((prev) => prev.map((p) => (p.id === payload.id ? payload : p)))
        }}
        onDelete={(id) => {
          setAnggotaList((prev) => prev.filter((p) => p.id !== id))
        }}
        onActivateAccess={({ id, role }) => {
          setAnggotaList((prev) =>
            prev.map((p) =>
              p.id === id
                ? { ...p, akses_sistem: true, role, status: p.status === 'keluar' ? 'keluar' : p.status }
                : p,
            ),
          )
        }}
        onKeluarkan={({ id, tanggal_keluar }) => {
          setAnggotaList((prev) =>
            prev.map((p) =>
              p.id === id
                ? {
                    ...p,
                    status: 'keluar',
                    tanggal_keluar,
                    akses_sistem: false,
                    role: null,
                  }
                : p,
            ),
          )
        }}
      />
    </>
  )
}
