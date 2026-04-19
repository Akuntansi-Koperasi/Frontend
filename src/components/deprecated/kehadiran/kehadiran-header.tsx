import { useState } from "react"
import { FileSpreadsheet, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { AttendanceParams} from "@/services/attendanceService";
import { Button } from "@/components/ui/button"
import { exportAttendanceExcel } from "@/services/attendanceService"

interface KehadiranHeaderProps {
  currentFilters: AttendanceParams
}

export function KehadiranHeader({ currentFilters }: KehadiranHeaderProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const response = await exportAttendanceExcel(currentFilters)
      
      let filename = `Laporan_Kehadiran_${new Date().toISOString().split('T')[0]}.xlsx`
      
      const disposition = response.headers['content-disposition']
      if (disposition && disposition.indexOf('attachment') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        const matches = filenameRegex.exec(disposition)
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '')
        }
      }
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      
      link.setAttribute('download', filename)
      
      document.body.appendChild(link)
      link.click()
      
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success("Export Excel berhasil diunduh")
    } catch (error) {
      console.error("Export failed", error)
      toast.error("Gagal mengunduh file Excel")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex md:items-center items-start justify-between pt-4 flex-col sm:flex-row gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Manajemen Kehadiran</h1>
        <p className="text-lg text-muted-foreground">
          Pantau kehadiran dan total jam kerja karyawan
        </p>
      </div>
      <Button 
        className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 h-12 cursor-pointer"
        onClick={handleExport}
        disabled={isExporting}
      >
        {isExporting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileSpreadsheet className="h-4 w-4" />
        )}
        {isExporting ? "Mengunduh..." : "Export Excel"}
      </Button>
    </div>
  )
}