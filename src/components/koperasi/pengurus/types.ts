export type AnggotaOption = {
  id: string
  nama: string
  email: string
  avatar?: string
}

export type PengurusRecord = {
  id: number
  anggotaId: string
  nama: string
  email: string
  avatar?: string
  jabatan: string
  mulaiMenjabat: number
  selesaiMenjabat: number
  status: 'Aktif' | 'Tidak Aktif'
}

export const MOCK_ANGGOTA_KOPERASI: Array<AnggotaOption> = [
  { id: '1', nama: 'Alice Smith', email: 'alice@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
  { id: '2', nama: 'Bob Johnson', email: 'bob@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
  { id: '3', nama: 'Clara Garcia', email: 'clara@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Clara' },
  { id: '4', nama: 'David Brown', email: 'david@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
  { id: '5', nama: 'Emma Lee', email: 'emma@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
  { id: '6', nama: 'Frank Wilson', email: 'frank@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Frank' },
  { id: '7', nama: 'Grace Taylor', email: 'grace@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grace' },
  { id: '8', nama: 'Henry Martinez', email: 'henry@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Henry' },
]
