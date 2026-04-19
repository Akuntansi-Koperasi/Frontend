import { Clock } from "lucide-react"
import type { AttendanceResponse } from "@/services/attendanceService"
import { Card, CardContent } from "@/components/ui/card"

export function KehadiranStats({ summary }: { summary?: AttendanceResponse['summary'] }) {
  const averageTotal = summary?.work_hours_avg_perperson ?? 0
  const averageDaily = summary?.work_hours_avg_perperson_perday ?? 0

  return (
    <Card className="bg-slate-900 text-white border-slate-800 shadow-lg">
      <CardContent className="px-6 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-300">
            Rata-rata Jam Kerja Per-orang
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{averageTotal.toFixed(2)}</span>
            <span className="text-sm text-slate-400">Jam</span>
          </div>
          <p className="text-xs text-slate-500">
            ~ {averageDaily.toFixed(2)} jam / hari (Berdasarkan filter)
          </p>
        </div>
        <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
          <Clock className="h-5 w-5 text-slate-300" />
        </div>
      </CardContent>
    </Card>
  )
}