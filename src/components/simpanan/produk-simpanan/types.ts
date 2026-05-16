export type ProdukSimpananRecord = {
  id: number
  nama: string
  jenis: 'Sukarela' | 'Wajib'
  bunga: number
  nominal: number
  keterangan: string
}

export const JENIS_SIMPANAN = ['Sukarela', 'Wajib'] as const

export const MOCK_PRODUK_SIMPANAN: Array<ProdukSimpananRecord> = [
  {
    id: 1,
    nama: 'Tabungan',
    jenis: 'Sukarela',
    bunga: 20.0,
    nominal: 500000,
    keterangan: 'Lorem Ipsum',
  },
  {
    id: 2,
    nama: 'Something',
    jenis: 'Wajib',
    bunga: 20.0,
    nominal: 600000,
    keterangan: 'Deskripsi Produk',
  },
  {
    id: 3,
    nama: 'Simpanan Pokok',
    jenis: 'Sukarela',
    bunga: 20.0,
    nominal: 700000,
    keterangan: 'Deskripsi Produk',
  },
  {
    id: 4,
    nama: 'Something',
    jenis: 'Sukarela',
    bunga: 20.0,
    nominal: 800000,
    keterangan: 'Deskripsi Produk',
  },
  {
    id: 5,
    nama: 'Something',
    jenis: 'Sukarela',
    bunga: 20.0,
    nominal: 900000,
    keterangan: 'Deskripsi Produk',
  },
  {
    id: 6,
    nama: 'Something',
    jenis: 'Sukarela',
    bunga: 20.0,
    nominal: 1000000,
    keterangan: 'Deskripsi Produk',
  },
  {
    id: 7,
    nama: 'Something',
    jenis: 'Sukarela',
    bunga: 20.0,
    nominal: 1100000,
    keterangan: 'Deskripsi Produk',
  },
  {
    id: 8,
    nama: 'Something',
    jenis: 'Sukarela',
    bunga: 20.0,
    nominal: 1200000,
    keterangan: 'Deskripsi Produk',
  },
  {
    id: 9,
    nama: 'Something',
    jenis: 'Sukarela',
    bunga: 20.0,
    nominal: 1300000,
    keterangan: 'Deskripsi Produk',
  },
  {
    id: 10,
    nama: 'Something',
    jenis: 'Sukarela',
    bunga: 20.0,
    nominal: 1400000,
    keterangan: 'Deskripsi Produk',
  },
  {
    id: 11,
    nama: 'Something',
    jenis: 'Sukarela',
    bunga: 20.0,
    nominal: 1500000,
    keterangan: 'Deskripsi Produk',
  },
]
