import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Calendar, Filter, Search } from 'lucide-react'
import type { CashflowParams } from '@/services/cashflowService'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

export function KeuanganFilters({
  currentFilters,
}: {
  currentFilters: CashflowParams
}) {
  const navigate = useNavigate()

  const getToday = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const getFirstDayOfMonth = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    return `${year}-${month}-01`
  }

  const [filters, setFilters] = useState<CashflowParams>(() => ({
    ...currentFilters,
    start_date: currentFilters.start_date || getFirstDayOfMonth(),
    end_date: currentFilters.end_date || getToday(),
  }))

  useEffect(() => {
    const defaultStart = getFirstDayOfMonth()
    const defaultEnd = getToday()

    const hasStart = !!currentFilters.start_date
    const hasEnd = !!currentFilters.end_date

    if (!hasStart || !hasEnd) {
      navigate({
        to: '/keuangan',
        search: (prev: any) => ({
          ...prev,
          start_date: hasStart ? currentFilters.start_date : defaultStart,
          end_date: hasEnd ? currentFilters.end_date : defaultEnd,
        }),
        replace: true,
      })
    } else {
      setFilters(currentFilters)
    }
  }, [currentFilters, navigate])

  const applyFilter = (key: keyof CashflowParams, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    navigate({
      to: '/keuangan',
      search: {
        ...newFilters,
        page: 1,
        per_page: newFilters.per_page ?? 10,
      },
      replace: true,
    })
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      applyFilter('search', filters.search)
    }
  }

  return (
    <Card className="shadow-lg border-3 border-slate-200">
      <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Tanggal Mulai</Label>
          <div className="relative">
            <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              className="pl-9"
              value={filters.start_date || ''}
              onChange={(e) => applyFilter('start_date', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            Tanggal Selesai
          </Label>
          <div className="relative">
            <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              className="pl-9"
              value={filters.end_date || ''}
              onChange={(e) => applyFilter('end_date', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
            Filter Tipe
          </Label>
          <Select
            value={filters.type || 'all'}
            onValueChange={(val) =>
              applyFilter('type', val as CashflowParams['type'])
            }
          >
            <SelectTrigger className="pl-9 relative w-full">
              <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Semua Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="pemasukan">Pemasukan</SelectItem>
              <SelectItem value="pengeluaran">Pengeluaran</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
            Cari Keterangan
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari transaksi..."
              className="pl-9"
              value={filters.search || ''}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              onBlur={() => applyFilter('search', filters.search)}
              onKeyDown={handleSearchKeyDown}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}