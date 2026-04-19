import {
  ArrowDownRight,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import type { DashboardStats } from '@/services/dashboardService'
import { Card, CardContent } from '@/components/ui/card'

const formatRp = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val)
}

const formatPercent = (val: number) => `${Math.abs(val).toFixed(1)}%`

export function DashboardCards({
  stats,
}: {
  stats?: DashboardStats['statistik']
}) {
  if (!stats) return null

  const items = [
    {
      label: 'Pemasukan',
      value: formatRp(stats.pemasukan.total),
      footerText: `${formatPercent(stats.pemasukan.change)} dari bulan lalu`,
      footerTextColor:
        stats.pemasukan.change >= 0 ? 'text-emerald-600' : 'text-rose-600',
      footerIcon: stats.pemasukan.change >= 0 ? ArrowUpRight : ArrowDownRight,
      icon: TrendingUp,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
    },
    {
      label: 'Pengeluaran',
      value: formatRp(stats.pengeluaran.total),
      footerText: `${formatPercent(stats.pengeluaran.change)} dari bulan lalu`,
      footerTextColor:
        stats.pengeluaran.change <= 0 ? 'text-emerald-600' : 'text-rose-600',
      footerIcon: stats.pengeluaran.change >= 0 ? ArrowUpRight : ArrowDownRight,
      icon: TrendingDown,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50',
    },
    {
      label: 'Total Setoran',
      value: formatRp(stats.deposit.total),
      isSpecial: true,
      subValue: `${stats.deposit.person} Anggota`,
      icon: Wallet,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50',
    },
    {
      label: 'Rata-Rata Jam kerja',
      value: stats.work_hours.average.text,
      footerText: `${formatPercent(stats.work_hours.change)} dari bulan lalu`,
      footerTextColor:
        stats.work_hours.change >= 0 ? 'text-emerald-600' : 'text-rose-600',
      footerIcon: stats.work_hours.change >= 0 ? ArrowUpRight : ArrowDownRight,
      icon: Users,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        Ringkasan Bulan ini
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <Card key={index} className="shadow-lg border-3 border-slate-200 p-0">
            <CardContent className="px-6 py-6 flex items-center justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-sm 2xl:text-md font-medium text-slate-500">
                      {item.label}
                    </p>
                    <h3 className="text-xl 2xl:text-4xl font-bold text-slate-900">
                      {item.value}
                    </h3>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1 text-xs font-medium">
                  {item.isSpecial ? (
                    <div className="flex items-center gap-1 text-blue-600 font-bold">
                      <Users className="w-3.5 h-3.5" />
                      <span>{item.subValue}</span>
                    </div>
                  ) : (
                    <span
                      className={`flex items-center gap-1 ${item.footerTextColor}`}
                    >
                      {item.footerIcon && (
                        <item.footerIcon className="w-3.5 h-3.5" />
                      )}
                      {item.footerText}
                    </span>
                  )}
                </div>
              </div>
              <div
                className={`p-3 2xl:p-4 rounded-full ${item.iconBg} ${item.iconColor}`}
              >
                <item.icon className="size-6 2xl:size-8" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
