export type RekeningSimpananRecord = {
  id: number
  anggotaId: number
  produkId: number
  nomorRekening: string
  nominal: number
  bungaTahunan: number | null
  statusTagih: 'Tagih' | 'Tidak'
}

export type AnggotaOption = {
  id: number
  nama: string
  email: string
  avatarUrl: string
}

export type ProdukSimpananOption = {
  id: number
  nama: string
}

export type RekeningTransaction = {
  id: number
  rekeningId: number
  tanggal: string
  jenis: 'Setoran' | 'Penarikan' | 'Koreksi'
  keterangan: string
  debit: number
  kredit: number
  saldo: number
}

export const MOCK_ANGGOTA_OPTIONS: Array<AnggotaOption> = [
  {
    id: 1,
    nama: 'Alice Smith',
    email: 'alice@example.com',
    avatarUrl: 'https://i.pravatar.cc/100?img=5',
  },
  {
    id: 2,
    nama: 'Bob Johnson',
    email: 'bob@example.com',
    avatarUrl: 'https://i.pravatar.cc/100?img=12',
  },
  {
    id: 3,
    nama: 'Clara Garcia',
    email: 'clara@example.com',
    avatarUrl: 'https://i.pravatar.cc/100?img=16',
  },
  {
    id: 4,
    nama: 'David Brown',
    email: 'david@example.com',
    avatarUrl: 'https://i.pravatar.cc/100?img=22',
  },
  {
    id: 5,
    nama: 'Emma Lee',
    email: 'emma@example.com',
    avatarUrl: 'https://i.pravatar.cc/100?img=24',
  },
  {
    id: 6,
    nama: 'Frank Wong',
    email: 'frank@example.com',
    avatarUrl: 'https://i.pravatar.cc/100?img=30',
  },
  {
    id: 7,
    nama: 'Grace Taylor',
    email: 'grace@example.com',
    avatarUrl: 'https://i.pravatar.cc/100?img=31',
  },
  {
    id: 8,
    nama: 'Isabella Clark',
    email: 'isabella@example.com',
    avatarUrl: 'https://i.pravatar.cc/100?img=34',
  },
]

export const MOCK_PRODUK_SIMPANAN_OPTIONS: Array<ProdukSimpananOption> = [
  { id: 1, nama: 'Tabungan' },
  { id: 2, nama: 'Simpanan Pokok' },
  { id: 3, nama: 'Simpanan Wajib' },
]

export const MOCK_REKENING_SIMPANAN: Array<RekeningSimpananRecord> = [
  {
    id: 1,
    anggotaId: 1,
    produkId: 1,
    nomorRekening: '006 - 1056 - 769',
    nominal: 500000,
    bungaTahunan: 20,
    statusTagih: 'Tagih',
  },
  {
    id: 2,
    anggotaId: 2,
    produkId: 1,
    nomorRekening: '006 - 1056 - 770',
    nominal: 600000,
    bungaTahunan: 20,
    statusTagih: 'Tagih',
  },
  {
    id: 3,
    anggotaId: 3,
    produkId: 2,
    nomorRekening: '006 - 1056 - 771',
    nominal: 700000,
    bungaTahunan: 20,
    statusTagih: 'Tagih',
  },
  {
    id: 4,
    anggotaId: 4,
    produkId: 3,
    nomorRekening: '006 - 1056 - 772',
    nominal: 800000,
    bungaTahunan: null,
    statusTagih: 'Tagih',
  },
  {
    id: 5,
    anggotaId: 5,
    produkId: 1,
    nomorRekening: '006 - 1056 - 773',
    nominal: 900000,
    bungaTahunan: 20,
    statusTagih: 'Tagih',
  },
  {
    id: 6,
    anggotaId: 6,
    produkId: 3,
    nomorRekening: '006 - 1056 - 774',
    nominal: 1000000,
    bungaTahunan: 20,
    statusTagih: 'Tagih',
  },
  {
    id: 7,
    anggotaId: 7,
    produkId: 3,
    nomorRekening: '006 - 1056 - 775',
    nominal: 1100000,
    bungaTahunan: null,
    statusTagih: 'Tagih',
  },
  {
    id: 8,
    anggotaId: 8,
    produkId: 3,
    nomorRekening: '006 - 1056 - 776',
    nominal: 1200000,
    bungaTahunan: 20,
    statusTagih: 'Tagih',
  },
  {
    id: 9,
    anggotaId: 7,
    produkId: 3,
    nomorRekening: '006 - 1056 - 777',
    nominal: 1300000,
    bungaTahunan: null,
    statusTagih: 'Tagih',
  },
  {
    id: 10,
    anggotaId: 5,
    produkId: 3,
    nomorRekening: '006 - 1056 - 778',
    nominal: 1400000,
    bungaTahunan: 20,
    statusTagih: 'Tagih',
  },
  {
    id: 11,
    anggotaId: 7,
    produkId: 3,
    nomorRekening: '006 - 1056 - 779',
    nominal: 1500000,
    bungaTahunan: 20,
    statusTagih: 'Tagih',
  },
]

export const MOCK_REKENING_TRANSACTIONS: Array<RekeningTransaction> = [
  {
    id: 1,
    rekeningId: 1,
    tanggal: '2026-03-03',
    jenis: 'Setoran',
    keterangan: 'Open shift - transfer float kasir dari bank',
    debit: 100000,
    kredit: 0,
    saldo: 100000,
  },
  {
    id: 2,
    rekeningId: 1,
    tanggal: '2026-03-03',
    jenis: 'Setoran',
    keterangan: 'Penjualan retail tunai barang sendiri',
    debit: 160000,
    kredit: 0,
    saldo: 260000,
  },
  {
    id: 3,
    rekeningId: 1,
    tanggal: '2026-03-12',
    jenis: 'Setoran',
    keterangan: 'Penjualan retail tunai barang sendiri',
    debit: 115000,
    kredit: 0,
    saldo: 375000,
  },
  {
    id: 4,
    rekeningId: 1,
    tanggal: '2026-03-12',
    jenis: 'Penarikan',
    keterangan: 'Setoran tutup shift (Retail)',
    debit: 0,
    kredit: 115000,
    saldo: 260000,
  },
  {
    id: 5,
    rekeningId: 1,
    tanggal: '2026-03-12',
    jenis: 'Koreksi',
    keterangan: 'Something terlipa',
    debit: 25000,
    kredit: 0,
    saldo: 285000,
  },
]
