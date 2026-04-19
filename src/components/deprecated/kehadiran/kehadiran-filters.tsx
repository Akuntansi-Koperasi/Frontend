import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Calendar, Search, User, X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import type { AttendanceParams } from '@/services/attendanceService'
import { getUserDropdownList } from '@/services/attendanceService'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

export function KehadiranFilters({
  currentFilters,
}: {
  currentFilters: AttendanceParams
}) {
  const navigate = useNavigate()

  const { data: users = [] } = useQuery({
    queryKey: ['userDropdown'],
    queryFn: getUserDropdownList,
    staleTime: 1000 * 60 * 5,
  })

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

  const [filters, setFilters] = useState<AttendanceParams>(() => ({
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
        to: '/kehadiran',
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

  const applyFilter = (key: keyof AttendanceParams, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    navigate({
      to: '/kehadiran',
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
    <Card className="border-3 border-slate-200 shadow-lg">
      <CardContent className="px-6 py-6 grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 gap-4">
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
          <Label className="text-sm text-muted-foreground">
            Filter Pegawai
          </Label>
          <Select
            value={filters.user_id || 'all'}
            onValueChange={(val) =>
              applyFilter('user_id', val === 'all' ? undefined : val)
            }
          >
            <SelectTrigger className="pl-9 relative w-full">
              <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Semua Pegawai" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Pegawai</SelectItem>
              {users.map((user: any) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Cari Data</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama..."
              className="pl-9"
              value={filters.search || ''}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              onBlur={() => applyFilter('search', filters.search)}
              onKeyDown={handleSearchKeyDown}
            />
            {filters.search && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-7 w-7"
                onClick={() => applyFilter('search', '')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}