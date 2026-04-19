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
    url: '/simpan-pinjam',
    icon: Coins,
  },
  {
    title: 'Simpanan',
    url: '/simpanan',
    icon: Wallet,
  },
  {
    title: 'Pinjaman',
    url: '/pinjaman',
    icon: HandCoins,
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
    url: '/akuntansi',
    icon: Banknote,
  },
  {
    title: 'Laporan Akuntansi',
    url: '/laporan-akuntansi',
    icon: FileMinus,
  },
  {
    title: 'Koperasi',
    url: '/koperasi',
    icon: Store,
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
