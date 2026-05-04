import { Link } from "@tanstack/react-router"
import {
  ChevronDown,
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

export function UserNav() {
  const { data: user } = useUserProfile()

  const getInitials = (name: string) => {
    return (name || 'User')
      .split(' ')
      .map((n) => n[0])
      .join('')
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
              {user?.email || "Memuat..."}
            </p>
            {/* {user?.role && (
               <p className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 w-fit px-1.5 py-0.5 rounded mt-1">
                {user.role}
              </p>
            )} */}
          </div>
        </DropdownMenuLabel>
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