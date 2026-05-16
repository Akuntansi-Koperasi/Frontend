import { useEffect, useState } from 'react'
import {
  Outlet,
  createFileRoute,
  useLocation,
  useRouter,
} from '@tanstack/react-router'
import { AppSidebar } from '@/components/nav-sidebar/app-sidebar'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { navItems } from '@/components/nav-sidebar/nav-data'
import { SearchBar } from '@/components/nav-sidebar/search-bar'
import { UserNav } from '@/components/nav-sidebar/user-nav'
import Notifications from '@/components/nav-sidebar/notifications'
import { isAuthenticated } from '@/services/authService'

export const Route = createFileRoute('/_auth')({
  // Tidak dipakai karena menyebabkan flicker
  // beforeLoad: ({ location }) => {
  //   if (!isAuthenticated()) {
  //     throw redirect({
  //       to: '/login',
  //       search: {
  //         redirect: location.href,
  //       },
  //     })
  //   }
  // },
  component: AuthLayout,
})

function AuthLayout() {
  const router = useRouter()
  const pathname = useLocation({
    select: (location) => location.pathname,
  })

  // Autentikasi dan authorisasi dengan client-side
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (isAuthenticated()) {
      setIsAuthorized(true)
    } else {
      router.navigate({ to: '/login', replace: true })
    }
  }, [router])

  if (!isAuthorized) {
    return null
  }

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '18rem',
          '--sidebar-width-icon': '5rem',
        } as React.CSSProperties
      }
    >
      <AppSidebar pathname={pathname} />
      <SidebarInset>
        <header className="relative flex h-16 shrink-0 items-center gap-2 px-4 bg-background">
          <SidebarTrigger />
          <h1 className="font-bold text-md">
            {navItems.find((item) => item.url === pathname)?.title}
          </h1>
          <SearchBar className="mx-auto max-w-xl hidden md:block" />
          <div className="flex items-center gap-2 ml-auto">
            <Notifications />
            <UserNav />
          </div>
          <div className="absolute bottom-0 left-0 right-0 mx-4 border-b-2 border-slate-200" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-x-hidden">
          {/* Tempat masuk utama aplikasi */}
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
