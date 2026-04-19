import { api } from '../api'

export type AttendanceParams = {
  page?: number
  per_page?: number
  start_date?: string
  end_date?: string
  user_id?: string
  search?: string
}

export type AttendanceRecord = {
  user: {
    id: number
    name: string
    username: string
    profile_image: string | null
  }
  date: string
  jam_masuk: string
  jam_pulang: string
  total_work_hours: number
  total_work_minutes: number
  work_duration_text: string
}

export type AttendanceResponse = {
  current_page: number
  last_page: number
  per_page: number
  total: number
  start_date: string
  end_date: string

  summary: {
    work_hours_avg_perperson: number
    work_hours_avg_perperson_perday: number
  }

  attendances: Array<AttendanceRecord>
}

export type UserDropdownItem = {
  id: number
  name: string
}

export const getAttendanceList = async (params: AttendanceParams) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v != null && v !== ''),
  )

  const response = await api.get<{
    status: string
    message: string
    data: AttendanceResponse
  }>('/admin/attendance', {
    params: cleanParams,
  })

  return response.data.data
}

export const getUserDropdownList = async () => {
  const response = await api.get<{ data: Array<UserDropdownItem> }>(
    '/admin/user/dropdown',
  )
  return response.data.data
}

export const exportAttendanceExcel = async (params: AttendanceParams) => {
  const { start_date, end_date, user_id } = params
  const cleanParams = Object.fromEntries(
    Object.entries({ start_date, end_date, user_id }).filter(
      ([_, v]) => v != null && v !== '',
    ),
  )
  const response = await api.get('/admin/attendance/export-excel', {
    params: cleanParams,
    responseType: 'blob',
  })

  return response
}