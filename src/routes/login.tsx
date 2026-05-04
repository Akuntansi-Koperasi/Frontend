import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { LoginForm } from '@/components/login/login-form'
import { isAuthenticated } from '@/services/authService'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated()) {
      router.navigate({ to: '/dashboard', replace: true })
    }
  }, [router])

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
