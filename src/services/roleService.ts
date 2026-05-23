import { api } from './api'

type ApiListResponse<T> = {
  status: string
  message: string
  data: Array<T>
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export type RoleOption = {
  id: number
  name: string
}

export const getRoleDropdown = async (): Promise<Array<RoleOption>> => {
  const response = await api.get<ApiListResponse<{ id: number; name: string }>>('/role/dropdown')

  return response.data.data.map((role) => ({
    id: role.id,
    name: role.name,
  }))
}
