import { api } from './api'

export type User = {
  id: number
  email: string
}

export type koperasiDetail = {
  id: number
  name: string
}

export type anggota = {
  id: number
  name: string
  email: string
  photo_profile: string | null
}

export type Koperasi = {
  koperasi: koperasiDetail
  anggota: anggota
  permissions: Array<string>
}

export type LoginResponse = {
  status: string
  message: string
  data: {
    token_type: string
    token: string
    user: User
    koperasi: Array<Koperasi>
  }
}

export const fetchUserProfile = async () => {
  const response = await api.get<{ status: string; data: User }>('/profile/me')
  return response.data.data
}

export const login = async (email: string, password: string) => {
  const response = await api.post<LoginResponse>('/auth/login', {
    email,
    password,
  })

  if (typeof window !== 'undefined') {
    localStorage.setItem('token', response.data.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.data.user))
    localStorage.setItem('koperasiList', JSON.stringify(response.data.data.koperasi))
    localStorage.setItem('koperasiActive', response.data.data.koperasi[0].koperasi.id.toString())
    localStorage.setItem('anggota', JSON.stringify(response.data.data.koperasi[0].anggota))
    localStorage.setItem('permissions', JSON.stringify(response.data.data.koperasi[0].permissions))
  }

  return response.data
}

export const loginWithGoogle = async (idToken: string) => {
  const formData = new FormData()
  formData.append('id_token', idToken)
  formData.append('device_name', 'web')

  const response = await api.post('/auth/login-google', formData)

  const token = response.data.data?.token
  let user = response.data.data?.user

  if (typeof window !== 'undefined' && token) {
    localStorage.setItem('token', token)

    if (!user) {
      try {
        console.log("User missing from login response, fetching manually...")
        user = await fetchUserProfile()
      } catch (error) {
        console.error('Failed to fetch user profile after Google login', error)
      }
    }

    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    }
  }

  return {
    ...response.data,
    data: {
      ...response.data.data,
      user: user,
    },
  }
}

export const isAuthenticated = () => {
  if (typeof window === 'undefined') {
    return false
  }
  return !!localStorage.getItem('token')
}

export const logout = async () => {
  try {
    await api.post('/auth/logout')
  } catch (err) {
    console.warn('Logout endpoint failed, forcing local logout anyway.', err)
  } finally {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('koperasiList')
      localStorage.removeItem('koperasiActive')
      localStorage.removeItem('anggota')
      localStorage.removeItem('permissions')
      window.location.href = '/login'
    }
  }
}