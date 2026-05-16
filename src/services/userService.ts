import { api } from './api'

export type UserParams = {
  page?: number
  per_page?: number
  search?: string
  role?: 'admin' | 'employee'
}

export type UserRecord = {
  id: number
  name: string
  username: string
  email: string
  peran: string
  profile_image: string | null
}

export type UserResponse = {
  current_page: number
  last_page: number
  per_page: number
  total: number
  users: Array<UserRecord>
}

export const getUserList = async (params: UserParams) => {
  const cleanParams: Record<string, any> = {}
  Object.entries(params as Record<string, any>).forEach(([k, v]) => {
    if (v == null) return
    if (typeof v === 'string' && v === '') return
    cleanParams[k] = v
  })

  const response = await api.get<{ status: string; message: string; data: UserResponse }>(
    '/admin/user', 
    {
      params: cleanParams
    }
  )
  
  return response.data.data
}

export const deleteUser = async (id: number) => {
  const response = await api.delete<{ status: string; message: string }>(
    `/admin/user/${id}`
  )
  return response.data
}

export const getUserDropdown = async () => {
  const response = await api.get<{ data: Array<{ id: number; name: string }> }>(
    '/admin/user/dropdown'
  )
  return response.data.data
}

export const updateUser = async (id: number, data: any) => {
  const response = await api.put(`/admin/user/${id}`, data)
  return response.data
}

export const getTokoDropdown = async () => {
  const response = await api.get('/admin/presence-location/dropdown')
  return response.data.data
}