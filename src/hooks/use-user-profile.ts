import { useQuery } from '@tanstack/react-query'
// import { getProfile } from '@/services/profileService'

export type Anggota = {
  id: number
  nama: string
  email: string
  photo_profile: string | null
}

export function useUserProfile() {
  return useQuery<Anggota>({
    queryKey: ['profile'],
    // queryFn: async () => {
    //   const data = localStorage.getItem("anggota")
    //   // const data = await getProfile()
    //   if (typeof window !== 'undefined') {
    //     localStorage.setItem("anggota", JSON.stringify(data))
    //   }
    //   return data as unknown as Anggota
    // },
    initialData: () => {
      try {
        if (typeof window === 'undefined') return undefined
        const stored = localStorage.getItem("anggota")
        return stored ? JSON.parse(stored) : undefined
      } catch {
        return undefined
      }
    },
    staleTime: 1000 * 60 * 5,
  })
}