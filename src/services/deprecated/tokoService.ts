import { api } from '../api'

export type TokoRecord = {
  id: number
  name: string
  address: string
  latitude: string
  longitude: string
  max_distance: number
  maps: string
}

export type TokoResponse = {
  current_page: number
  last_page: number
  per_page: number
  total: number
  presence_locations: Array<TokoRecord>
}

export type TokoPayload = {
  name: string
  address: string
  latitude: number | string
  longitude: number | string
  max_distance: number
}

export type TokoParams = {
  page?: number
  per_page?: number
  search?: string
}

export const getTokoList = async (params: TokoParams) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v != null && v !== '')
  )

  const response = await api.get<{ status: string; data: TokoResponse }>(
    '/admin/presence-location', 
    { params: cleanParams }
  )
  return response.data.data
}

export const createToko = async (data: TokoPayload) => {
  const formData = new FormData()
  formData.append('name', data.name)
  formData.append('address', data.address)
  formData.append('latitude', String(data.latitude))
  formData.append('longitude', String(data.longitude))
  formData.append('max_distance', String(data.max_distance))

  const response = await api.post('/admin/presence-location', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const updateToko = async (id: number, data: TokoPayload) => {
  const payload = {
    ...data,
    latitude: String(data.latitude),
    longitude: String(data.longitude),
    max_distance: String(data.max_distance),
  }

  const response = await api.put(`/admin/presence-location/${id}`, payload)
  return response.data
}

export const deleteToko = async (id: number) => {
  const response = await api.delete(`/admin/presence-location/${id}`)
  return response.data
}

export const getAddressFromCoordinates = async (lat: number, lng: number) => {
  const response = await api.get<{ status: string; data: { address: string } }>(
    '/address', 
    {
      params: { latitude: lat, longitude: lng }
    }
  )
  return response.data.data.address
}

export const getTokoDropdown = async () => {
  const response = await api.get<{ status: string; data: Array<{ id: number; name: string }> }>(
    '/admin/presence-location/dropdown'
  )
  return response.data.data
}