import { useQuery } from '@tanstack/react-query'
import type { ProfileData } from '@/services/profileService'
import { getProfile } from '@/services/profileService'

export type Anggota = {
  id: number
  nama: string
  email: string
  photo_profile: string | null
}

function syncProfileStorage(data: ProfileData) {
  if (typeof window === 'undefined') return

  const activeKoperasi = data.koperasi[0] ?? null

  localStorage.setItem('user', JSON.stringify(data.user))
  localStorage.setItem('koperasiList', JSON.stringify(data.koperasi))

  if (activeKoperasi) {
    localStorage.setItem('koperasiActive', JSON.stringify(activeKoperasi))
    localStorage.setItem('anggota', JSON.stringify(activeKoperasi.anggota))
    localStorage.setItem('permissions', JSON.stringify(activeKoperasi.permissions))
  } else {
    localStorage.removeItem('koperasiActive')
    localStorage.removeItem('anggota')
    localStorage.removeItem('permissions')
  }
}

function readStoredAnggota(): Anggota | undefined {
  try {
    if (typeof window === 'undefined') return undefined

    const stored = localStorage.getItem('anggota')
    if (!stored) return undefined

    const parsed = JSON.parse(stored)
    return parsed?.user ?? parsed ?? undefined
  } catch {
    return undefined
  }
}

export function useUserProfile() {
  return useQuery<Anggota>({
    queryKey: ['profile'],
    queryFn: async () => {
      const data = await getProfile()
      syncProfileStorage(data)
      const activeAnggota = data.koperasi[0]?.anggota

      if (!activeAnggota) {
        throw new Error('Data anggota aktif tidak ditemukan')
      }

      return activeAnggota
    },
    initialData: () => {
      return readStoredAnggota()
    },
    staleTime: 1000 * 60 * 5,
  })
}