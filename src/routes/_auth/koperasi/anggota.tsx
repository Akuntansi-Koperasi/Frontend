import * as React from 'react'
import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { z } from 'zod'
import { toast } from 'sonner'
import type { AnggotaParams } from '@/services/anggotaService'
import type { AnggotaFormErrors } from '@/components/koperasi/anggota/types'
import { AnggotaAddDialog } from '@/components/koperasi/anggota/anggota-add-dialog'
import { AnggotaTable } from '@/components/koperasi/anggota/anggota-table'
import HeaderComp from '@/components/shared/header-comp'
import { SearchBar } from '@/components/shared/search-bar'
import {
  aktifkanAnggota,
  createAnggota,
  deleteAnggota,
  getAnggotaList,
  getRoleDropdown,
  updateAnggota,
} from '@/services/anggotaService'
import { getPermissionAccess } from '@/services/permissionService'

export const Route = createFileRoute('/_auth/koperasi/anggota')({
  validateSearch: z.object({
    page: z.number().int().positive().catch(1),
    per_page: z.number().int().positive().catch(10),
    search: z.string().optional(),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const search = Route.useSearch()
  const queryClient = useQueryClient()
  const { canView, canManage, canDelete } = React.useMemo(() => getPermissionAccess('anggota'), [])
  const canActivateAccess = React.useMemo(() => getPermissionAccess('pengguna').canManage, [])

  if (!canView && !canManage && !canDelete) {
    throw notFound()
  }

  const { page, per_page, search: searchQuery } = search

  const [openAdd, setOpenAdd] = React.useState(false)
  const [addErrors, setAddErrors] = React.useState<AnggotaFormErrors>(null)
  const [editErrors, setEditErrors] = React.useState<AnggotaFormErrors>(null)

  const params: AnggotaParams = {
    page,
    per_page,
    search: searchQuery?.trim() || undefined,
  }

  const anggotaQuery = useQuery({
    queryKey: ['anggota', params],
    queryFn: () => getAnggotaList(params),
    staleTime: 1000 * 60 * 2,
    enabled: canView,
  })

  const roleQuery = useQuery({
    queryKey: ['anggota', 'role-dropdown'],
    queryFn: getRoleDropdown,
    staleTime: 1000 * 60 * 10,
    enabled: canActivateAccess,
  })

  const createMutation = useMutation({
    mutationFn: createAnggota,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['anggota'] }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Parameters<typeof updateAnggota>[1] }) =>
      updateAnggota(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['anggota'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAnggota,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['anggota'] }),
  })

  const activateMutation = useMutation({
    mutationFn: ({ id, roleId }: { id: number; roleId: number }) => aktifkanAnggota(id, roleId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['anggota'] }),
  })

  const normalizeApiErrors = (err: any, fallbackMessage: string): AnggotaFormErrors => {
    const apiErrors = err?.apiErrors ?? err?.errors ?? {}
    const message = err?.message ?? fallbackMessage

    return {
      ...apiErrors,
      general: apiErrors.general?.length ? apiErrors.general : [message],
    }
  }

  const total = anggotaQuery.data ? anggotaQuery.data.total : 0
  const pageCount = anggotaQuery.data ? Math.max(1, Math.ceil(anggotaQuery.data.total / anggotaQuery.data.per_page)) : 1
  const safePage = Math.min(Math.max(page, 1), pageCount)
  const pageIndex = safePage - 1

  React.useEffect(() => {
    if (safePage !== page) {
      navigate({
        to: '/koperasi/anggota',
        search: (prev: any) => ({ ...prev, page: safePage }),
        replace: true,
      })
    }
  }, [navigate, page, safePage])

  const handleAdd = async (payload: Parameters<typeof createAnggota>[0]) => {
    try {
      await createMutation.mutateAsync(payload)
      setAddErrors(null)
      toast.success('Anggota berhasil ditambahkan')
      return true
    } catch (err: any) {
      setAddErrors(normalizeApiErrors(err, 'Gagal menambahkan anggota'))
      toast.error(err?.message ?? 'Gagal menambahkan anggota')
      return false
    }
  }

  const handleEdit = async (payload: Parameters<typeof updateAnggota>[1] & { id: number }) => {
    try {
      await updateMutation.mutateAsync({ id: payload.id, payload })
      setEditErrors(null)
      toast.success('Data anggota berhasil diperbarui')
      return true
    } catch (err: any) {
      setEditErrors(normalizeApiErrors(err, 'Gagal memperbarui anggota'))
      toast.error(err?.message ?? 'Gagal memperbarui anggota')
      return false
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Anggota berhasil dihapus')
      return true
    } catch (err: any) {
      toast.error(err?.message ?? 'Gagal menghapus anggota')
      return false
    }
  }

  const handleActivate = async ({ id, roleId }: { id: number; roleId: number }) => {
    try {
      await activateMutation.mutateAsync({ id, roleId })
      toast.success('Akun akses anggota berhasil diaktifkan')
      return true
    } catch (err: any) {
      toast.error(err?.message ?? 'Gagal mengaktifkan akun akses anggota')
      return false
    }
  }

  const handleKeluarkan = async ({ id, tanggal_keluar }: { id: number; tanggal_keluar: string }) => {
    const current = anggotaQuery.data?.data.find((item) => item.id === id)

    if (!current) {
      toast.error('Data anggota tidak ditemukan')
      return false
    }

    try {
      await updateMutation.mutateAsync({
        id,
        payload: {
          nama: current.nama,
          ktp: current.ktp,
          email: current.email,
          telp: current.telp,
          gender: current.gender,
          photo_profile: current.photo_profile,
          tanggal_masuk: current.tanggal_masuk,
          tanggal_keluar,
          status: 'keluar',
        },
      })
      toast.success('Anggota berhasil dikeluarkan')
      return true
    } catch (err: any) {
      toast.error(err?.message ?? 'Gagal mengeluarkan anggota')
      return false
    }
  }

  const pagination = {
    pageIndex,
    pageSize: per_page,
    pageCount,
    total,
  }

  const handleSearchChange = (value: string) => {
    navigate({
      to: '/koperasi/anggota',
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
        title="Manajemen Anggota"
        description="Kelola anggota koperasi"
        icon={<Plus />}
        actionLabel={canManage ? 'Tambah Anggota' : undefined}
        onAction={canManage ? () => setOpenAdd(true) : undefined}
      />

      <AnggotaAddDialog
        open={openAdd}
        onOpenChange={(isOpen) => {
          setOpenAdd(isOpen)
          if (!isOpen) setAddErrors(null)
        }}
        onCreate={handleAdd}
        errors={addErrors}
      />

      <SearchBar
        placeholder="Cari anggota..."
        className="mb-4"
        value={search.search ?? ''}
        onChange={(event) => handleSearchChange(event.target.value)}
      />

      <AnggotaTable
        data={anggotaQuery.data?.data ?? []}
        isLoading={anggotaQuery.isLoading}
        pagination={pagination}
        canManage={canManage}
        canDelete={canDelete}
        canActivateAccess={canActivateAccess}
        roleOptions={roleQuery.data ?? []}
        editErrors={editErrors}
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
        onUpdate={handleEdit}
        onDelete={handleDelete}
        onActivateAccess={handleActivate}
        onKeluarkan={handleKeluarkan}
      />
    </>
  )
}
