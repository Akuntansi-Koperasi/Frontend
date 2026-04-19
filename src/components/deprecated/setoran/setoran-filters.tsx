import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Calendar, Filter } from 'lucide-react'
import type { DepositParams, DepositResponse } from '@/services/depositService'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface SetoranFiltersProps {
  currentFilters: DepositParams
  summary?: DepositResponse['summary']
}

export function SetoranFilters({
  currentFilters,
  summary,
}: SetoranFiltersProps) {
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

  const [filters, setFilters] = useState<DepositParams>(() => ({
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
        to: '/setoran',
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

  const formatRp = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val)
  }

  const applyFilter = (key: keyof DepositParams, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    navigate({
      to: '/setoran',
      search: {
        ...newFilters,
        page: 1,
        per_page: newFilters.per_page ?? 10,
      },
      replace: true,
    })
  }

  const isSimpananChecked = filters.type !== 'angsuran'
  const isAngsuranChecked = filters.type !== 'simpanan'

  const handleTypeToggle = (toggled: 'simpanan' | 'angsuran') => {
    if (toggled === 'simpanan') {
      if (!isSimpananChecked) applyFilter('type', undefined)
      else applyFilter('type', 'angsuran')
    } else {
      if (!isAngsuranChecked) applyFilter('type', undefined)
      else applyFilter('type', 'simpanan')
    }
  }

  const isVerifiedChecked = filters.status !== 'pending'
  const isPendingChecked = filters.status !== 'verified'

  const handleStatusToggle = (toggled: 'verified' | 'pending') => {
    if (toggled === 'verified') {
      if (!isVerifiedChecked) applyFilter('status', undefined)
      else applyFilter('status', 'pending')
    } else {
      if (!isPendingChecked) applyFilter('status', undefined)
      else applyFilter('status', 'verified')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 shadow-lg border-3 border-slate-200">
        <CardContent className="px-6 flex flex-col justify-between h-full gap-6">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Rentang Tanggal
            </Label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-full">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  className="pl-10"
                  value={filters.start_date || ''}
                  onChange={(e) => applyFilter('start_date', e.target.value)}
                />
              </div>
              <div className="relative w-full">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  className="pl-10"
                  value={filters.end_date || ''}
                  onChange={(e) => applyFilter('end_date', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-6 md:gap-12 pt-2 border-t border-dashed">
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span className="text-xs font-bold uppercase">Jenis :</span>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="simpanan"
                  checked={isSimpananChecked}
                  onCheckedChange={() => handleTypeToggle('simpanan')}
                />
                <Label htmlFor="simpanan" className="cursor-pointer font-bold">
                  Simpanan
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="angsuran"
                  checked={isAngsuranChecked}
                  onCheckedChange={() => handleTypeToggle('angsuran')}
                />
                <Label htmlFor="angsuran" className="cursor-pointer font-bold">
                  Angsuran
                </Label>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span className="text-xs font-bold uppercase">Status :</span>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="verified"
                  checked={isVerifiedChecked}
                  onCheckedChange={() => handleStatusToggle('verified')}
                />
                <Label htmlFor="verified" className="cursor-pointer font-bold">
                  Terverifikasi
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="pending"
                  checked={isPendingChecked}
                  onCheckedChange={() => handleStatusToggle('pending')}
                />
                <Label htmlFor="pending" className="cursor-pointer font-bold">
                  Belum
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 text-white border-slate-800 shadow-lg">
        <CardContent className="px-6 flex flex-col justify-center h-full gap-4">
          <h3 className="text-slate-300 font-medium border-b border-slate-700 pb-2">
            Total Berdasarkan Filter
          </h3>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Simpanan</span>
            <span className="text-emerald-400 font-bold text-lg">
              {formatRp(summary?.simpanan ?? 0)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Angsuran</span>
            <span className="text-blue-400 font-bold text-lg">
              {formatRp(summary?.angsuran ?? 0)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
