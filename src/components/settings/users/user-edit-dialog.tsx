import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { UserRecord } from "@/services/userService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getTokoDropdown, updateUser } from "@/services/userService"
import { useUserProfile } from "@/hooks/use-user-profile"

const MOCK_PERAN = [
  { id: "1", name: "Admin" },
  { id: "2", name: "Bendahara" },
  { id: "3", name: "Kasir" },
  { id: "4", name: "Manager" },
  { id: "5", name: "Pengawas" },
  { id: "6", name: "Anggota" },
]

interface UserEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserRecord | null
}

export function UserEditDialog({ open, onOpenChange, user }: UserEditDialogProps) {
  const queryClient = useQueryClient()
  const { data: currentUser } = useUserProfile()
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [tokoId, setTokoId] = useState("")
  const [role, setRole] = useState<string>("employee")
  const [fieldErrors, setFieldErrors] = useState<Record<string, Array<string>>>({})

  const { data: tokoList } = useQuery({
    queryKey: ['toko-dropdown'],
    queryFn: getTokoDropdown
  })

  useEffect(() => {
    if (user) {
      setName(user.name)
      setUsername(user.username)
      setEmail(user.email)
      const safeRole = (user.peran || "employee").toLowerCase() as "admin" | "employee"
      setRole(safeRole)
      setFieldErrors({})
    }
  }, [user])

  const mutation = useMutation({
    mutationFn: (data: any) => updateUser(user!.id, data),
    onSuccess: (_, variables) => {
      toast.success("User berhasil diperbarui")
      queryClient.invalidateQueries({ queryKey: ["users"] })
      if (currentUser && currentUser.id === user?.id) {
        queryClient.invalidateQueries({ queryKey: ["profile"] })
        const updatedUser = { ...currentUser, ...variables }
        localStorage.setItem("user", JSON.stringify(updatedUser))
      }

      onOpenChange(false)
      setFieldErrors({})
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        setFieldErrors(error.response.data.errors)
      }
      toast.error(error.response?.data?.message || "Gagal memperbarui user")
    }
  })

  const handleInputChange = (
    setter: (value: string) => void, 
    field: string, 
    value: string
  ) => {
    setter(value)
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    mutation.mutate({
      name,
      username,
      email,
      role,
    })
  }

  const isSelf = currentUser?.id === user?.id
  
  const isFormValid = 
    name.trim() !== "" && 
    username.trim() !== "" && 
    email.trim() !== "" && 
    (role === "admin" || (role === "employee" && tokoId !== ""))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit User</DialogTitle>
            <DialogDescription>
              Silakan ubah data user
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-slate-500">
                Peran* {isSelf && <span className="text-xs text-amber-600 font-normal ml-2">(Tidak dapat mengubah role sendiri)</span>}
              </Label>
              <div>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className={`h-auto min-h-12 cursor-pointer w-full px-4 py-3 ${isSelf ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isSelf}>
                    <SelectValue placeholder="Pilih Peran" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_PERAN.map((peran) => (
                      <SelectItem key={peran.id} value={peran.id}>
                        {peran.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="destructive" 
              className="md:w-[50%] w-full h-12 cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              className="md:w-[50%] w-full bg-slate-900 text-white hover:bg-slate-800 h-12 cursor-pointer"
              disabled={mutation.isPending || !isFormValid}
            >
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}