import * as React from 'react'
import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { AlertCircle, Loader2 } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import { toast } from 'sonner'
import { login, loginWithGoogle, mockLogin } from '@/services/authService'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAuthSuccess = (response: any) => {
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    router.navigate({ to: '/koperasi' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // const response = await login(email, password)
      const response = await mockLogin()
      handleAuthSuccess(response)
    } catch (err: any) {
      const msg =
        err.response?.data?.message || 'Login gagal. Cek email/password.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential

    if (!idToken) {
      setError('Gagal menerima token dari Google')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await loginWithGoogle(idToken)
      handleAuthSuccess(response)
    } catch (err: any) {
      if (err.response) {
        const msg = err.response.data?.message || 'Login Google gagal.'
        setError(msg)
      } else {
        setError('Gagal menghubungi server.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <div className="relative h-40 w-full mb-4">
            <img
              src="/office.webp"
              alt="Office Background"
              className="w-full h-full object-cover blur-[1px] rounded-md"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="/Logo.webp"
                alt="Logo Koperasi"
                className="size-24 object-contain drop-shadow-lg"
              />
            </div>
          </div>
          <CardTitle className="text-2xl">
            Presensi KPRI Bina Sejahtera
          </CardTitle>
          <CardDescription className="text-sm">
            Silakan masukkan kredensial Anda untuk mengakses dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              {error && (
                <div className="flex items-center gap-2 p-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              <Field className="gap-0">
                <FieldLabel
                  htmlFor="email"
                  className="text-muted-foreground font-bold"
                >
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Masukkan Email"
                  required
                  className="p-5"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </Field>
              <Field className="gap-0">
                <div className="flex items-center">
                  <FieldLabel
                    htmlFor="password"
                    className="text-muted-foreground font-bold"
                  >
                    Password
                  </FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan Password"
                  required
                  className="p-5"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </Field>
              <FieldSeparator>Atau lanjutkan dengan</FieldSeparator>
              <Field>
                <div className="relative w-full h-12">
                  <Button
                    variant="outline"
                    type="button"
                    className="absolute inset-0 w-full h-full font-bold p-5 z-0"
                    disabled={isLoading}
                  >
                    <img
                      src="/google.svg"
                      alt="Google Logo"
                      className="h-4 w-4 mr-2"
                    />
                    Masuk Dengan Google
                  </Button>
                  {/* Overlay untuk Google Login, karena pakai button biasa tidak bisa */}
                  <div className="absolute inset-0 z-10 opacity-0 overflow-hidden">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => {
                        setError('Gagal inisialisasi Google Login')
                        toast.error('Google Login Failed')
                      }}
                      useOneTap={false}
                      width="500"
                      text="signin_with"
                    />
                  </div>
                </div>
                {/* Ini untuk yang login biasa */}
                <Button
                  type="submit"
                  className="font-bold bg-primary p-6 cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memuat...
                    </>
                  ) : (
                    'Masuk'
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
