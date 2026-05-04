"use client"

import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { LogOut, User } from 'lucide-react'
import { navItems } from './nav-data'
import { SearchBar } from './search-bar'
import { logout } from '@/services/authService'
import { useUserProfile } from '@/hooks/use-user-profile'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function AppSidebar({
  pathname,
  ...props
}: React.ComponentProps<typeof Sidebar> & { pathname: string }) {
  const { data: user } = useUserProfile()
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>(
    {}
  )

  const getInitials = (name: string) => {
    return (name || 'User')
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  React.useEffect(() => {
    navItems.forEach((item) => {
      if (!item.items?.length) {
        return
      }

      const hasActiveChild = item.items.some(
        (subItem) =>
          pathname === subItem.url || pathname.startsWith(`${subItem.url}/`)
      )

      if (hasActiveChild) {
        setOpenSections((current) =>
          current[item.title] ? current : { ...current, [item.title]: true }
        )
      }
    })
  }, [pathname])

  const toggleSection = (key: string) => {
    setOpenSections((current) => ({
      ...current,
      [key]: !current[key],
    }))
  }

  return (
    <Sidebar collapsible="icon" {...props} className="pt-4">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground data-[slot=sidebar-menu-button]:p-1!"
            >
              <div className="flex aspect-square size-10 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="size-10 object-contain"
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold text-base">
                  Dashboard Presensi
                </span>
                <span className="truncate font-bold text-base">
                  KPRI Bina Sejahtera
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SearchBar className="sm:hidden block" />
              </SidebarMenuItem>
              {navItems.map((item) => {
                const isActive =
                  pathname === item.url || pathname.startsWith(`${item.url}/`)
                const isSectionOpen = openSections[item.title] ?? false

                if (item.items?.length) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <div className="flex items-center gap-1">
                        <SidebarMenuButton
                          tooltip={item.title}
                          className="h-12 flex-1 font-medium cursor-pointer hover:bg-slate-100 data-[active=true]:bg-slate-900 data-[active=true]:text-white data-[active=true]:hover:bg-slate-800 data-[active=true]:hover:text-white"
                          onClick={() => toggleSection(item.title)}
                        >
                          {item.icon ? <item.icon /> : null}
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </div>

                      {isSectionOpen ? (
                        <SidebarMenuSub>
                          {item.items.map((subItem) => {
                            const isSubActive =
                              pathname === subItem.url ||
                              pathname.startsWith(`${subItem.url}/`)

                            return (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isSubActive}
                                  className="h-10 rounded-md px-2 text-sm hover:bg-slate-100 data-[active=true]:bg-slate-900 data-[active=true]:text-white data-[active=true]:hover:bg-slate-800 data-[active=true]:hover:text-white"
                                >
                                  <Link to={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )
                          })}
                        </SidebarMenuSub>
                      ) : null}
                    </SidebarMenuItem>
                  )
                }
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                      className="h-12 font-medium hover:bg-slate-100 data-[active=true]:bg-slate-900 data-[active=true]:text-white data-[active=true]:hover:bg-slate-800 data-[active=true]:hover:text-white"
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="group-data-[collapsible=icon]:p-1! hover:bg-slate-100"
            >
              <Link to='/profile'>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border">
                  <Avatar className="h-full w-full">
                    <AvatarImage
                      src={user?.photo_profile || undefined}
                      alt={user?.nama || 'User'}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-slate-200 text-slate-700 font-bold">
                      {user?.nama ? getInitials(user.nama) : <User className="w-5 h-5" />}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">
                    {user?.nama || 'Pengguna'}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email || 'Memuat...'}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="bg-[#E11D48] hover:bg-[#BE123C] text-white hover:text-white group-data-[collapsible=icon]:p-2.5! cursor-pointer"
              onClick={logout}
            >
              <LogOut />
              <span className="group-data-[collapsible=icon]:hidden">
                Log out
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}