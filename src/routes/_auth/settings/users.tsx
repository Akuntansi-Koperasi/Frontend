import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { getUserList } from '@/services/userService'
import { UsersHeader } from '@/components/users/users-header'
import { UsersFilters } from '@/components/users/users-filters'
import { UsersTable } from '@/components/users/users-table'
import LoadingPage from '@/components/loading-page'
import ErrorPage from '@/components/error-page'

const usersSearchSchema = z.object({
  page: z.number().catch(1),
  per_page: z.number().catch(10),
  search: z.string().optional(),
  role: z.enum(['admin', 'employee']).optional(),
})

export const Route = createFileRoute('/_auth/settings/users')({
  validateSearch: (search) => usersSearchSchema.parse(search),
  component: UsersPage,
})

function UsersPage() {
  const search = Route.useSearch()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users', search],
    queryFn: () => getUserList(search),
    placeholderData: (previousData) => previousData,
  })

  if (isLoading) {
    return <LoadingPage />
  }

  if (error) {
    return (
      <ErrorPage 
        title="Gagal Memuat Data Users" 
        error={error} 
        reset={refetch} 
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <UsersHeader />
      <UsersFilters currentFilters={search} />
      <UsersTable 
        data={data?.users || []} 
        pagination={{
          pageIndex: (data?.current_page || 1) - 1,
          pageSize: data?.per_page || 10,
          pageCount: data?.last_page || 1,
          total: data?.total || 0
        }}
      />
    </div>
  )
}