import axios from 'axios'
import { env } from '@/env' 

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const koperasi_id = typeof window !== 'undefined' ? localStorage.getItem('koperasiActive') : null

  if (koperasi_id) {
    config.headers['X-Koperasi-ID'] = koperasi_id
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('koperasiList')
        localStorage.removeItem('koperasiActive')
        localStorage.removeItem('anggota')
        localStorage.removeItem('permissions')

        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }
    }

    if (error.code === 'ECONNABORTED') {
      console.warn('Request timed out (10s limit exceeded)')
    }

    return Promise.reject(error)
  }
)