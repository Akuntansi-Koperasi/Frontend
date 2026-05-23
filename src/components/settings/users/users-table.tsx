import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
// parent handles queryClient and mutations
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react"
import { UserDeleteDialog } from "./user-delete-dialog"
import { UserEditDialog } from "./user-edit-dialog"
import type { ColumnDef, SortingState } from "@tanstack/react-table"
import type { UserFormErrors, UserRecord } from "@/services/userService"
import type { RoleOption } from "@/services/roleService"
import { DataTablePagination } from "@/components/data-table-pagination"
import { Toaster } from "@/components/ui/sonner"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface UsersTableProps {
  data: Array<UserRecord>
  isLoading?: boolean
  pagination: {
    pageIndex: number
    pageSize: number
    pageCount: number
    total: number
  }
  canManage?: boolean
  canDelete?: boolean
  editErrors?: UserFormErrors
  onPageChange: (newPageIndex: number) => void
  onPageSizeChange: (newPageSize: number) => void
  onUpdate?: (payload: { id: number; role_id: number }) => Promise<boolean>
  onDelete?: (id: number) => Promise<boolean>
  roleOptions?: Array<RoleOption>
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export function UsersTable({ data, isLoading, pagination, canManage, canDelete, onPageChange, onPageSizeChange, onUpdate, onDelete, roleOptions, editErrors }: UsersTableProps) {
  const [sorting] = React.useState<SortingState>([])

  const [userToDelete, setUserToDelete] = React.useState<UserRecord | null>(null)
  const [userToEdit, setUserToEdit] = React.useState<UserRecord | null>(null)

  const handlePageChange = (newPageIndex: number) => {
    if (typeof onPageChange === 'function') onPageChange(newPageIndex)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    if (typeof onPageSizeChange === 'function') onPageSizeChange(newPageSize)
  }

  const columns: Array<ColumnDef<UserRecord>> = [
    {
      id: "index",
      header: "No.",
      cell: ({ row }) => {
        const index = row.index + 1 + (pagination.pageIndex * pagination.pageSize)
        return <span className="text-muted-foreground font-medium">{index}.</span>
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent font-bold text-slate-900 justify-start cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Anggota
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-slate-200">
            <AvatarImage src={row.original.profile_image || ""} />
            <AvatarFallback className="bg-orange-100 text-orange-600 font-medium">
              {row.original.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-left">
            <span className="font-semibold text-slate-900 text-sm">{row.original.name}</span>
            <span className="text-xs text-muted-foreground">@{row.original.email}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "peran",
      header: "Peran",
      cell: ({ row }) => {
        const peran = row.original.peran || "-"

        return (
          <Badge variant="outline" className="cursor-default bg-amber-50 text-amber-600 border-amber-200 rounded-full h-8 gap-1.5 px-3 has-[>svg]:px-2.5 font-bold">
            {capitalize(peran)}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 justify-center">
          {canManage ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
              onClick={() => setUserToEdit(row.original)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          ) : null}

          {canDelete ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
              onClick={() => setUserToDelete(row.original)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { sorting },
    manualPagination: true,
    pageCount: pagination.pageCount,
  })

  const hasRows = table.getRowModel().rows.length > 0
  const isInitialLoading = Boolean(isLoading) && !hasRows

  return (
    <>
      <Card className="shadow-lg border-3 border-slate-200 p-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header, index) => {
                    let alignClass = "text-center"
                    if (index === 1) alignClass = "text-left"
                    return (
                      <TableHead key={header.id} className={`font-semibold text-slate-900 ${alignClass}`}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isInitialLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    Memuat data pengguna...
                  </TableCell>
                </TableRow>
              ) : hasRows ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-slate-50">
                    {row.getVisibleCells().map((cell, index) => {
                      let alignClass = "text-center"
                      if (index === 1) alignClass = "text-left"
                      return (
                        <TableCell key={cell.id} className={`py-3 ${alignClass}`}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Tidak ada user ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <DataTablePagination
            pageIndex={pagination.pageIndex}
            pageCount={pagination.pageCount}
            pageSize={pagination.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </CardContent>
      </Card>

      <UserEditDialog 
        open={!!userToEdit}
        onOpenChange={(isOpen) => !isOpen && setUserToEdit(null)}
        user={userToEdit}
        onSave={async (payload) => {
          if (typeof onUpdate === 'function') return onUpdate(payload)
          return false
        }}
        roleOptions={roleOptions ?? []}
        errors={editErrors}
      />

      <UserDeleteDialog 
        open={!!userToDelete} 
        onOpenChange={(isOpen) => !isOpen && setUserToDelete(null)}
        user={userToDelete}
        onConfirm={(id) => {
          if (typeof onDelete === 'function') return onDelete(id)
          return Promise.resolve(false)
        }}
      />
      <Toaster position="top-right" richColors closeButton theme="light" />
    </>
  )
}