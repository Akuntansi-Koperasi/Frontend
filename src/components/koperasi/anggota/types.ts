export type AnggotaGender = 'Laki-Laki' | 'Perempuan'

export type AnggotaStatus = 'aktif' | 'tidak_aktif' | 'keluar'

export type AnggotaAccessRole = 'admin' | 'employee'

export type AnggotaRecord = {
  id: number
  nama: string
  email: string
  photo_profile: string | null
  nomor_ktp: string | null
  nomor_telepon: string | null
  gender: AnggotaGender | null
  tanggal_masuk: string | null
  status: AnggotaStatus
  akses_sistem: boolean
  role: AnggotaAccessRole | null
  tanggal_keluar: string | null
}
