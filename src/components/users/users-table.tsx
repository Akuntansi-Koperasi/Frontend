import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useNavigate } from "@tanstack/react-router"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { UserDeleteDialog } from "./user-delete-dialog"
import { UserEditDialog } from "./user-edit-dialog"
import type { ColumnDef, SortingState } from "@tanstack/react-table"
import type { UserRecord } from "@/services/userService"
import { DataTablePagination } from "@/components/data-table-pagination"

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

import { deleteUser } from "@/services/userService"

interface UsersTableProps {
  data: Array<UserRecord>
  pagination: {
    pageIndex: number
    pageSize: number
    pageCount: number
    total: number
  }
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export function UsersTable({ data, pagination }: UsersTableProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [sorting, setSorting] = React.useState<SortingState>([])

  const [userToDelete, setUserToDelete] = React.useState<UserRecord | null>(null)
  const [userToEdit, setUserToEdit] = React.useState<UserRecord | null>(null)

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      toast.success("User berhasil dihapus")
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setUserToDelete(null)
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Gagal menghapus user"
      toast.error(errorMessage)
    },
  })

  const handlePageChange = (newPageIndex: number) => {
    navigate({
      to: '/settings/users',
      search: (prev: any) => ({ ...prev, page: newPageIndex + 1 }),
      replace: true,
    })
  }

  const handlePageSizeChange = (newPageSize: number) => {
    navigate({
      to: '/settings/users',
      search: (prev: any) => ({ ...prev, per_page: newPageSize, page: 1 }),
      replace: true,
    })
  }

  const columns: Array<ColumnDef<UserRecord>> = [
    {
      id: "index",
      header: "No.",
      cell: ({ row, table }) => {
        const index = row.index + 1 + (table.getState().pagination.pageIndex * table.getState().pagination.pageSize)
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
          Karyawan
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
      cell: () => <Badge variant="outline" className="cursor-default bg-amber-50 text-amber-600 border-amber-200 rounded-full h-8 gap-1.5 px-3 has-[>svg]:px-2.5 font-bold">Peran</Badge>,
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 justify-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
            onClick={() => setUserToEdit(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
            onClick={() => setUserToDelete(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
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
              {table.getRowModel().rows.length ? (
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
      />

      <UserDeleteDialog 
        open={!!userToDelete} 
        onOpenChange={(isOpen) => !isOpen && setUserToDelete(null)}
        user={userToDelete}
        onConfirm={(id) => deleteMutation.mutate(id)}
        isDeleting={deleteMutation.isPending}
      />
    </>
  )
}