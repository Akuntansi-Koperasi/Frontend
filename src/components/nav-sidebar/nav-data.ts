import {
  Banknote,
  Coins,
  FileMinus,
  FileText,
  HandCoins,
  House,
  School,
  Settings,
  Store,
  Wallet,
} from 'lucide-react'

export const navItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: House,
  },
  {
    title: 'Simpan Pinjam',
    icon: Coins,
    items: [
      {
        title: 'Transaksi Anggota',
        url: '/simpan-pinjam/transaksi-anggota',
      },
      {
        title: 'Laporan Transaksi',
        url: '/simpan-pinjam/laporan-transaksi',
      },
    ],
  },
  {
    title: 'Simpanan',
    icon: Wallet,
    items: [
      {
        title: 'Produk Simpanan',
        url: '/simpanan/produk-simpanan',
      },
      {
        title: 'Rekening Simpanan',
        url: '/simpanan/rekening-simpanan',
      },
      {
        title: 'Tagihan',
        url: '/simpanan/tagihan',
      },
    ],
  },
  {
    title: 'Pinjaman',
    icon: HandCoins,
    items: [
      {
        title: 'Produk Pinjaman',
        url: '/pinjaman/produk-pinjaman',
      },
      {
        title: 'Pengajuan Pinjaman',
        url: '/pinjaman/pengajuan-pinjaman',
      },
      {
        title: 'Tagihan',
        url: '/pinjaman/tagihan',
      },
    ],
  },
  {
    title: 'Gerai / Retail',
    url: '/gerai-retail',
    icon: School,
  },
  {
    title: 'Laporan Retail',
    url: '/laporan-retail',
    icon: FileText,
  },
  {
    title: 'Akuntansi',
    icon: Banknote,
    items: [
      {
        title: 'Buku Besar',
        url: '/akuntansi/buku-besar',
      },
      {
        title: 'Tutup Buku',
        url: '/akuntansi/tutup-buku',
      },
      {
        title: 'Transaksi Umum',
        url: '/akuntansi/transaksi-umum',
      },
      {
        title: 'COA',
        url: '/akuntansi/coa',
      },
    ],
  },
  {
    title: 'Laporan Akuntansi',
    url: '/laporan-akuntansi',
    icon: FileMinus,
  },
  {
    title: 'Koperasi',
    icon: Store,
    items: [
      {
        title: 'Anggota',
        url: '/koperasi/anggota',
      },
      {
        title: 'Pengurus Koperasi',
        url: '/koperasi/pengurus',
      },
      {
        title: 'Pengaturan Jabatan',
        url: '/koperasi/jabatan',
      },
    ]
  },
  {
    title: 'Pengaturan',
    icon: Settings,
    items: [
      {
        title: 'Pengguna',
        url: '/settings/users',
      },
      {
        title: 'Peran',
        url: '/settings/roles',
      },
      {
        title: 'Migrasi',
        url: '/settings/migration',
      },
    ],
  },
]
