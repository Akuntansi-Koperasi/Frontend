import { api } from './api'

export type User = {
  id: number
  name: string
  username: string
  email: string
  role: string
  profile_image: string | null
  has_password?: boolean
  google_id?: string | null
}

export type LoginResponse = {
  status: string
  message: string
  data: {
    token_type: string
    token: string
    user: User
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
  }

  return response.data
}

export const mockLogin = async () => {
      const mockUser = {"id":69,"name":"Afif","username":"afif","email":"juwhater@mail.com","role":"admin","profile_image":"https://lh3.googleusercontent.com/a/ACg8ocLlT6wjyml6pl-yYNjdQA7zg_Yqo_wYrdAGGgh5zh15AA2OrMk=s96-c","has_password":true}
      localStorage.setItem('token', 'mock-token')
      localStorage.setItem('user', JSON.stringify(mockUser))
      return {
        status: 'success',
        message: 'Mock login successful',
        data: {
          token_type: 'Bearer',
          token: 'mock-token',
          user: mockUser,
        },
      }
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
      window.location.href = '/login'
    }
  }
}