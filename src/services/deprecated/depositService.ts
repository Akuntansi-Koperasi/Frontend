import { api } from '../api'

export type DepositParams = {
  page?: number
  per_page?: number
  start_date?: string
  end_date?: string
  search?: string
  type?: 'simpanan' | 'angsuran' 
  status?: 'pending' | 'verified'
}

export type DepositRecord = {
  id: number
  user: {
    id: number
    name: string
    username: string
    profile_image: string | null
  }
  for_name: string
  type: 'simpanan' | 'angsuran'
  date: string
  value: number
  verified_key: string | null 
}

export type DepositResponse = {
  current_page: number
  last_page: number
  per_page: number
  total: number
  start_date: string
  end_date: string
  summary: {
    simpanan: number
    angsuran: number
  }
  
  deposits: Array<DepositRecord>
}

export const getDepositList = async (params: DepositParams) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v != null && v !== '')
  )

  const response = await api.get<{ status: string; message: string; data: DepositResponse }>(
    '/admin/deposit', 
    {
      params: cleanParams
    }
  )
  
  return response.data.data
}

export const verifyDeposit = async (id: number, code: string) => {
  const response = await api.patch<{ status: string; message: string; data: DepositRecord }>(
    `/admin/deposit/verify/${id}`,
    {
      verified_key: code
    }
  )

  return response.data.data
}

export const exportDepositExcel = async (params: DepositParams) => {
  const { start_date, end_date, type, status, search } = params

  const cleanParams = Object.fromEntries(
    Object.entries({ start_date, end_date, type, status, search }).filter(
      ([_, v]) => v != null && v !== '',
    ),
  )

  const response = await api.get('/admin/deposit/export-excel', {
    params: cleanParams,
    responseType: 'blob',
  })

  return response
}