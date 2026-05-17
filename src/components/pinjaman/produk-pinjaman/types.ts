export type JenisPinjaman = 'Menurun' | 'Flat' | 'Anuitas'
export type PeriodePinjaman = 'Harian' | 'Mingguan' | 'Bulanan' | 'Tahunan'

export type ProdukPinjamanRecord = {
  id: number
  nama: string
  jenis: JenisPinjaman
  periode: PeriodePinjaman
  bunga: number
  keterangan: string
}

export const JENIS_PINJAMAN: Array<JenisPinjaman> = ['Menurun', 'Flat', 'Anuitas']
export const PERIODE_PINJAMAN: Array<PeriodePinjaman> = ['Harian', 'Mingguan', 'Bulanan', 'Tahunan']

export const MOCK_PRODUK_PINJAMAN: Array<ProdukPinjamanRecord> = [
  {
    id: 1,
    nama: 'Kredit Motor',
    jenis: 'Menurun',
    periode: 'Harian',
    bunga: 20,
    keterangan: 'Lorem Ipsum',
  },
  {
    id: 2,
    nama: 'KPR Mingguan',
    jenis: 'Flat',
    periode: 'Mingguan',
    bunga: 20,
    keterangan: 'Deskripsi Produk',
  },
  {
    id: 3,
    nama: 'KPR Bulanan',
    jenis: 'Anuitas',
    periode: 'Bulanan',
    bunga: 20,
    keterangan: 'Deskripsi Produk',
  },
  {
    id: 4,
    nama: 'Pinjaman Usaha',
    jenis: 'Flat',
    periode: 'Tahunan',
    bunga: 18.5,
    keterangan: 'Deskripsi Produk',
  },
  {
    id: 5,
    nama: 'Pinjaman Pendidikan',
    jenis: 'Flat',
    periode: 'Bulanan',
    bunga: 15,
    keterangan: 'Deskripsi Produk',
  },
  {
    id: 6,
    nama: 'Pinjaman Karyawan',
    jenis: 'Flat',
    periode: 'Bulanan',
    bunga: 12.5,
    keterangan: 'Deskripsi Produk',
  },
  {
    id: 7,
    nama: 'Pinjaman UMKM',
    jenis: 'Menurun',
    periode: 'Bulanan',
    bunga: 14,
    keterangan: 'Deskripsi Produk',
  },
  {
    id: 8,
    nama: 'Pinjaman Serbaguna',
    jenis: 'Flat',
    periode: 'Bulanan',
    bunga: 16,
    keterangan: 'Deskripsi Produk',
  },
  {
    id: 9,
    nama: 'Pinjaman Renovasi',
    jenis: 'Anuitas',
    periode: 'Bulanan',
    bunga: 17,
    keterangan: 'Deskripsi Produk',
  },
  {
    id: 10,
    nama: 'Pinjaman Multiguna',
    jenis: 'Flat',
    periode: 'Bulanan',
    bunga: 19,
    keterangan: 'Deskripsi Produk',
  },
  {
    id: 11,
    nama: 'Pinjaman Darurat',
    jenis: 'Menurun',
    periode: 'Bulanan',
    bunga: 21,
    keterangan: 'Deskripsi Produk',
  },
]
