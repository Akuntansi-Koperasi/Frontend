import * as React from "react"
import { Link } from "@tanstack/react-router"
import {
  Check,
  ChevronDown,
  Building2,
  LogOut,
  User as UserIcon,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { logout } from "@/services/authService"
import { useUserProfile } from "@/hooks/use-user-profile"
import type { Koperasi } from "@/services/authService"
import { useQueryClient } from "@tanstack/react-query"

function getKoperasiList(): Koperasi[] {
  try {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem("koperasiList")
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function getActiveKoperasiId(): number | null {
  try {
    if (typeof window === "undefined") return null
    const stored = localStorage.getItem("koperasiActive")
    return stored ? Number(stored) : null
  } catch {
    return null
  }
}

export function UserNav() {
  const { data: user } = useUserProfile()
  const qc = useQueryClient()

  const [koperasiList] = React.useState<Koperasi[]>(() => getKoperasiList())
  const [activeId, setActiveId] = React.useState<number | null>(() => getActiveKoperasiId())

  const activeKoperasi = localStorage.getItem("koperasiActive") ? JSON.parse(localStorage.getItem("koperasiActive")!) : null

  const switchKoperasi = (item: Koperasi) => {
    if (item.koperasi.id === activeId) return

    localStorage.setItem("koperasiActive", JSON.stringify(item))
    localStorage.setItem("anggota", JSON.stringify(item.anggota))
    localStorage.setItem("permissions", JSON.stringify(item.permissions))

    setActiveId(item.koperasi.id)

    qc.invalidateQueries({ queryKey: ["profile"] })

    // Reload page to apply new permissions everywhere
    window.location.reload()
  }

  const getInitials = (name: string) => {
    return (name || "User")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="hover:bg-slate-100 h-12 gap-2 px-2">
          <Avatar className="h-9 w-9 border border-slate-200">
            <AvatarImage
              src={user?.photo_profile || undefined}
              alt={user?.nama || "User"}
              className="object-cover"
            />
            <AvatarFallback className="bg-slate-200 text-slate-700 font-bold text-xs">
              {user?.nama ? getInitials(user.nama) : "..."}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.nama || "Pengguna"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {activeKoperasi?.koperasi.nama || "—"}
            </p>
          </div>
        </DropdownMenuLabel>

        {/* Koperasi switcher — only show if more than 1 */}
        {koperasiList.length > 1 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              Pindah Koperasi
            </DropdownMenuLabel>
            {koperasiList.map((item) => (
              <DropdownMenuItem
                key={item.koperasi.id}
                onClick={() => switchKoperasi(item)}
                className="gap-2 cursor-pointer"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border bg-background shrink-0">
                  <Building2 className="size-3.5" />
                </div>
                <span className="flex-1 truncate">{item.koperasi.nama}</span>
                {item.koperasi.id === activeId && (
                  <Check className="size-4 text-primary shrink-0" />
                )}
              </DropdownMenuItem>
            ))}
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link to="/profile" className="w-full cursor-pointer">
            <DropdownMenuItem className="cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}