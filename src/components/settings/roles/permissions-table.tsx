import type { PermissionLevel, PermissionMenuItem } from '@/components/settings/roles/types'

import { Card, CardContent } from '@/components/ui/card'
import { DataTablePagination } from '@/components/data-table-pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const DEFAULT_LEVEL_OPTIONS: Array<{ id: PermissionLevel; label: string }> = [
  { id: 'lihat', label: 'Lihat' },
  { id: 'modifikasi', label: 'Modifikasi' },
  { id: 'admin', label: 'Admin' },
]

interface PermissionsTableProps {
  roleName: string
  menus: Array<PermissionMenuItem>
  totalMenus: number
  levels: Record<string, PermissionLevel>
  onChangeLevel: (menuKey: string, level: PermissionLevel) => void
  levelOptions?: Array<{ id: PermissionLevel; label: string }>
  pagination: {
    pageIndex: number
    pageCount: number
    pageSize: number
  }
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function PermissionsTable({
  menus,
  levels,
  onChangeLevel,
  levelOptions = DEFAULT_LEVEL_OPTIONS,
  pagination,
  onPageChange,
  onPageSizeChange,
}: PermissionsTableProps) {
  return (
    <Card className="shadow-lg border border-slate-200 p-0">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-b border-slate-200">
              <TableHead className="font-semibold text-slate-700 text-left px-4 py-3 text-sm">
                Menu
              </TableHead>
              <TableHead className="font-semibold text-slate-700 text-center px-4 py-3 w-[200px] text-sm">
                Izin
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menus.length ? (
              menus.map((m) => (
                <TableRow key={m.key} className="hover:bg-slate-50 border-b border-slate-100">
                  <TableCell className="px-4 py-3 text-left">
                    <span className="text-slate-900 font-medium text-sm">{m.label}</span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center w-[200px]">
                    <div className="flex justify-center">
                      <Select
                        value={levels[m.key] ?? 'lihat'}
                        onValueChange={(v) => onChangeLevel(m.key, v as PermissionLevel)}
                      >
                        <SelectTrigger className="h-9 w-[150px] bg-white cursor-pointer text-sm">
                          <SelectValue placeholder="Pilih level" />
                        </SelectTrigger>
                        <SelectContent>
                          {levelOptions.map((opt) => (
                            <SelectItem key={opt.id} value={opt.id} className="text-sm">
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center text-sm text-muted-foreground">
                  Tidak ada menu ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <DataTablePagination
          pageIndex={pagination.pageIndex}
          pageCount={pagination.pageCount}
          pageSize={pagination.pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </CardContent>
    </Card>
  )
}
