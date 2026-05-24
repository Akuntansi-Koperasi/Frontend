export type CoaRecord = {
  id: number
  kode: string
  namaAkun: string
  kategori: 'Aset Lancar' | 'Aset Tetap' | 'Hutang Usaha' | 'Modal' | 'Pendapatan' | 'Beban'
  keterangan: string
}

export type CoaTransaction = {
  id: number
  coaId: number
  tanggal: string
  jenisTransaksi: string
  deskripsi: string
  debit: number
  kredit: number
  saldo: number
}

export const KATEGORI_OPTIONS: Array<{ value: CoaRecord['kategori']; label: string }> = [
  { value: 'Aset Lancar', label: 'Aset Lancar' },
  { value: 'Aset Tetap', label: 'Aset Tetap' },
  { value: 'Hutang Usaha', label: 'Hutang Usaha' },
  { value: 'Modal', label: 'Modal' },
  { value: 'Pendapatan', label: 'Pendapatan' },
  { value: 'Beban', label: 'Beban' },
]

export const MOCK_COA: Array<CoaRecord> = [
  {
    id: 1,
    kode: '121000211',
    namaAkun: 'Kas Ditangan (Retail)',
    kategori: 'Aset Lancar',
    keterangan: 'Kas untuk operasional retail',
  },
  {
    id: 2,
    kode: '121000212',
    namaAkun: 'Kas Ditangan (Wholesale)',
    kategori: 'Aset Lancar',
    keterangan: 'Kas untuk operasional wholesale',
  },
  {
    id: 3,
    kode: '121000213',
    namaAkun: 'Kas Ditangan (Online Store)',
    kategori: 'Aset Lancar',
    keterangan: 'Kas untuk penjualan online',
  },
  {
    id: 4,
    kode: '121000214',
    namaAkun: 'Kas Ditangan (Franchise)',
    kategori: 'Aset Tetap',
    keterangan: 'Kas untuk operasional franchise',
  },
  {
    id: 5,
    kode: '121000215',
    namaAkun: 'Kas Ditangan (Export)',
    kategori: 'Aset Tetap',
    keterangan: 'Kas untuk transaksi export',
  },
  {
    id: 6,
    kode: '121000216',
    namaAkun: 'Kas Ditangan (Import)',
    kategori: 'Aset Tetap',
    keterangan: 'Kas untuk transaksi import',
  },
  {
    id: 7,
    kode: '121000217',
    namaAkun: 'Kas Ditangan (E-commerce)',
    kategori: 'Hutang Usaha',
    keterangan: 'Kas untuk e-commerce',
  },
  {
    id: 8,
    kode: '121000218',
    namaAkun: 'Kas Ditangan (Marketplace)',
    kategori: 'Hutang Usaha',
    keterangan: 'Kas untuk marketplace',
  },
  {
    id: 9,
    kode: '121000219',
    namaAkun: 'Kas Ditangan (B2B)',
    kategori: 'Aset Lancar',
    keterangan: 'Kas untuk transaksi B2B',
  },
  {
    id: 10,
    kode: '121000220',
    namaAkun: 'Kas Ditangan (Event Sales)',
    kategori: 'Aset Lancar',
    keterangan: 'Kas untuk penjualan event',
  },
  {
    id: 11,
    kode: '121000221',
    namaAkun: 'Kas Ditangan (Subscriptions)',
    kategori: 'Hutang Usaha',
    keterangan: 'Kas untuk langganan',
  },
]

export const MOCK_COA_TRANSACTIONS: Array<CoaTransaction> = [
  {
    id: 1,
    coaId: 1,
    tanggal: '2026-03-03',
    jenisTransaksi: 'Transfer Dana Kasir (Retail)',
    deskripsi: 'Open shift - transfer float kasir dari bank',
    debit: 100000,
    kredit: 0,
    saldo: 100000,
  },
  {
    id: 2,
    coaId: 1,
    tanggal: '2026-03-03',
    jenisTransaksi: 'Penjualan Retail Tunai Barang Sendiri / Konsinyasi',
    deskripsi: 'Penjualan Retail Tunai Barang Sendiri',
    debit: 160000,
    kredit: 0,
    saldo: 260000,
  },
  {
    id: 3,
    coaId: 1,
    tanggal: '2026-03-12',
    jenisTransaksi: 'Penjualan Retail Tunai Barang Sendiri / Konsinyasi',
    deskripsi: 'Penjualan Retail Tunai Barang Sendiri',
    debit: 115000,
    kredit: 0,
    saldo: 375000,
  },
  {
    id: 4,
    coaId: 1,
    tanggal: '2026-03-12',
    jenisTransaksi: 'Setoran Tutup Shift (Retail)',
    deskripsi: 'Setoran tutup shift (Retail)',
    debit: 0,
    kredit: 115000,
    saldo: 260000,
  },
  {
    id: 5,
    coaId: 1,
    tanggal: '2026-03-12',
    jenisTransaksi: 'Penjualan Retail Tunai Barang Sendiri / Konsinyasi',
    deskripsi: 'Penjualan Retail Tunai Barang Sendiri',
    debit: 25000,
    kredit: 0,
    saldo: 285000,
  },
]
