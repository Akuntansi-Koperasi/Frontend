export type AnggotaOption = {
  id: number
  nama: string
  email: string
  photo_profile?: string | null
}

export type JabatanOption = {
  id: number
  nama_posisi: string
  jenis_posisi: string
  multiple: boolean
}

export type PengurusStatus = 'aktif' | 'selesai'

export type PengurusRecord = {
  id: number
  anggotaId: number
  jabatanId: number
  nama: string
  email: string
  avatar?: string | null
  jabatan: string
  kategori: string
  mulaiMenjabat: number
  selesaiMenjabat: number | null
  status: PengurusStatus
}

export type PengurusUpsertPayload = {
  anggotaId: number
  jabatanId: number
  mulaiMenjabat: number
  selesaiMenjabat?: number | null
  status: PengurusStatus
}

export type PengurusFormErrors = Partial<Record<string, Array<string>>> | null