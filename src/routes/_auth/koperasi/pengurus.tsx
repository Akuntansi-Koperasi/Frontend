import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { z } from 'zod'
import { toast } from 'sonner'

import type { PengurusFormErrors, PengurusUpsertPayload } from '@/components/koperasi/pengurus/types'
import type { PengurusParams } from '@/services/pengurusService'
import HeaderComp from '@/components/shared/header-comp'
import { SearchBar } from '@/components/shared/search-bar'
import { PengurusTable } from '@/components/koperasi/pengurus/pengurus-table'
import { getPermissionAccess } from '@/services/permissionService'

import {
  akhiriPengurus,
  createPengurus,
  deletePengurus,
  getAnggotaDropdown,
  getJabatanDropdown,
  getPengurusList,
  updatePengurus,
} from '@/services/pengurusService'

const pengurusSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  per_page: z.number().int().positive().catch(10),
  search: z.string().optional(),
})

export const Route = createFileRoute('/_auth/koperasi/pengurus')({
  validateSearch: pengurusSearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const search = Route.useSearch()
  const page = search.page
  const perPage = search.per_page
  const searchQuery = (search.search ?? '').trim()

  const [addOpen, setAddOpen] = React.useState(false)
  const [addErrors, setAddErrors] = React.useState<PengurusFormErrors>(null)
  const [editErrors, setEditErrors] = React.useState<PengurusFormErrors>(null)

  const { canView, canManage, canDelete } = React.useMemo(
    () => getPermissionAccess('pengurus'),
    []
  )

  const params: PengurusParams = {
    page,
    per_page: perPage,
    search: searchQuery || undefined,
  }

  const pengurusQuery = useQuery({
    queryKey: ['pengurus', params],
    queryFn: () => getPengurusList(params),
    staleTime: 1000 * 60 * 2,
    enabled: canView,
  })

  const anggotaDropdownQuery = useQuery({
    queryKey: ['pengurus-anggota-dropdown'],
    queryFn: () => getAnggotaDropdown(),
    staleTime: 1000 * 60 * 5,
    enabled: canManage,
  })

  const jabatanDropdownQuery = useQuery({
    queryKey: ['pengurus-jabatan-dropdown'],
    queryFn: () => getJabatanDropdown(),
    staleTime: 1000 * 60 * 5,
    enabled: canManage,
  })

  const invalidatePengurusQueries = React.useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['pengurus'] }),
      queryClient.invalidateQueries({ queryKey: ['pengurus-anggota-dropdown'] }),
      queryClient.invalidateQueries({ queryKey: ['pengurus-jabatan-dropdown'] }),
    ])
  }, [queryClient])

  const createMutation = useMutation({
    mutationFn: createPengurus,
    onSuccess: async () => {
      await invalidatePengurusQueries()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PengurusUpsertPayload }) => updatePengurus(id, payload),
    onSuccess: async () => {
      await invalidatePengurusQueries()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deletePengurus,
    onSuccess: async () => {
      await invalidatePengurusQueries()
    },
  })

  const finishMutation = useMutation({
    mutationFn: akhiriPengurus,
    onSuccess: async () => {
      await invalidatePengurusQueries()
    },
  })

  const normalizeApiErrors = (err: any, fallbackMessage: string): PengurusFormErrors => {
    const apiErrors = err?.apiErrors ?? err?.errors ?? {}
    const message = err?.message ?? fallbackMessage

    return {
      ...apiErrors,
      general: apiErrors.general?.length ? apiErrors.general : [message],
    }
  }

  const total = pengurusQuery.data?.total ?? 0
  const pageCount = Math.max(1, Math.ceil(total / perPage))
  const safePage = Math.min(Math.max(page, 1), pageCount)

  const pagination = {
    pageIndex: safePage - 1,
    pageSize: perPage,
    pageCount: pengurusQuery.data ? Math.max(1, Math.ceil(pengurusQuery.data.total / pengurusQuery.data.per_page)) : 1,
    total,
  }

  React.useEffect(() => {
    if (safePage !== page) {
      navigate({
        to: '/koperasi/pengurus',
        search: (prev: any) => ({ ...prev, page: safePage }),
        replace: true,
      })
    }
  }, [navigate, page, safePage])

  const handleAdd = async (payload: PengurusUpsertPayload) => {
    try {
      await createMutation.mutateAsync(payload)
      setAddErrors(null)
      toast.success('Pengurus berhasil ditambahkan')
      return true
    } catch (err: any) {
      setAddErrors(normalizeApiErrors(err, 'Gagal menambahkan pengurus'))
      toast.error(err?.message ?? 'Gagal menambahkan pengurus')
      return false
    }
  }

  const handleEdit = async (payload: PengurusUpsertPayload & { id: number }) => {
    try {
      await updateMutation.mutateAsync({ id: payload.id, payload })
      setEditErrors(null)
      toast.success('Pengurus berhasil diperbarui')
      return true
    } catch (err: any) {
      setEditErrors(normalizeApiErrors(err, 'Gagal memperbarui pengurus'))
      toast.error(err?.message ?? 'Gagal memperbarui pengurus')
      return false
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Pengurus berhasil dihapus')
      return true
    } catch (err: any) {
      toast.error(err?.message ?? 'Gagal menghapus pengurus')
      return false
    }
  }

  const handleAkhiri = async (id: number) => {
    try {
      await finishMutation.mutateAsync(id)
      toast.success('Jabatan pengurus berhasil diakhiri')
      return true
    } catch (err: any) {
      toast.error(err?.message ?? 'Gagal mengakhiri jabatan pengurus')
      return false
    }
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

  const handleSearchChange = (value: string) => {
    navigate({
      to: '/koperasi/pengurus',
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
        title="Manajemen Pengurus Koperasi"
        description="Kelola anggota pengurus koperasi"
        icon={<Plus />}
        actionLabel={canManage ? 'Tambah Struktur' : undefined}
        onAction={canManage ? () => setAddOpen(true) : undefined}
      />

      <SearchBar
        placeholder="Cari nama pengurus..."
        className="mb-4"
        value={search.search ?? ''}
        onChange={(event) => handleSearchChange(event.target.value)}
      />

      <PengurusTable
        data={pengurusQuery.data?.data ?? []}
        isLoading={pengurusQuery.isLoading}
        pagination={pagination}
        canManage={canManage}
        canDelete={canDelete}
        anggotaOptions={anggotaDropdownQuery.data ?? []}
        jabatanOptions={jabatanDropdownQuery.data ?? []}
        addOpen={addOpen}
        onAddOpenChange={(isOpen: boolean) => {
          setAddOpen(isOpen)
          if (!isOpen) setAddErrors(null)
        }}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAkhiri={handleAkhiri}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        addErrors={addErrors}
        editErrors={editErrors}
        onEditClose={() => setEditErrors(null)}
      />
    </>
  )
}