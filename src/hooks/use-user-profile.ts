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
  const incomingList = data.koperasi ?? []
  const incomingActive = incomingList[0] ?? null

  // merge koperasiList: update existing entries with same koperasi.id, keep others
  const existingRaw = localStorage.getItem('koperasiList')
  let existingList: Array<any> = []
  try {
    existingList = existingRaw ? JSON.parse(existingRaw) : []
  } catch {
    existingList = []
  }

  const merged = [...existingList]
  for (const item of incomingList) {
    const id = item?.koperasi?.id
    const idx = merged.findIndex((m) => m?.koperasi?.id === id)
    if (idx >= 0) merged[idx] = item
    else merged.push(item)
  }

  localStorage.setItem('user', JSON.stringify(data.user))
  localStorage.setItem('koperasiList', JSON.stringify(merged))

  const existingActiveRaw = localStorage.getItem('koperasiActive')
  let existingActive = null
  try {
    existingActive = existingActiveRaw ? JSON.parse(existingActiveRaw) : null
  } catch {
    existingActive = null
  }

  if (incomingActive) {
    // set/update active koperasi from incoming
    const activeIdx = merged.findIndex((m) => m?.koperasi?.id === incomingActive.koperasi.id)
    const activeItem = activeIdx >= 0 ? merged[activeIdx] : incomingActive
    localStorage.setItem('koperasiActive', JSON.stringify(activeItem))
    localStorage.setItem('anggota', JSON.stringify(activeItem.anggota))
    localStorage.setItem('permissions', JSON.stringify(activeItem.permissions))
  } else if (existingActive) {
    // keep existing active as-is
    // ensure anggota & permissions kept in sync with existingActive
    localStorage.setItem('koperasiActive', JSON.stringify(existingActive))
    if (existingActive.anggota) localStorage.setItem('anggota', JSON.stringify(existingActive.anggota))
    if (existingActive.permissions) localStorage.setItem('permissions', JSON.stringify(existingActive.permissions))
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