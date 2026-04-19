import { api } from '../api'

export type CashflowParams = {
  page?: number
  per_page?: number
  start_date?: string
  end_date?: string
  type?: 'pemasukan' | 'pengeluaran' | 'all'
  search?: string
}

export type CashflowRecord = {
  user: {
    id: number
    name: string
    username: string
    profile_image: string | null
  }
  type: 'pemasukan' | 'pengeluaran'
  date: string
  value: number
}

export type CashflowResponse = {
  current_page: number
  last_page: number
  per_page: number
  total: number
  
  start_date: string
  end_date: string
  
  summary: {
    pemasukan: number
    pengeluaran: number
  }
  
  cashflows: Array<CashflowRecord>
}

export const getCashflowList = async (params: CashflowParams) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v != null && v !== '' && v !== 'all')
  )

  const response = await api.get<{ status: string; message: string; data: CashflowResponse }>(
    '/admin/cashflow', 
    {
      params: cleanParams
    }
  )
  
  return response.data.data
}

export const exportCashflowExcel = async (params: CashflowParams) => {
  const { start_date, end_date, type } = params

  const cleanParams = Object.fromEntries(
    Object.entries({ start_date, end_date, type }).filter(
      ([_, v]) => v != null && v !== '' && v !== 'all',
    ),
  )

  const response = await api.get('/admin/cashflow/export-excel', {
    params: cleanParams,
    responseType: 'blob',
  })

  return response
}