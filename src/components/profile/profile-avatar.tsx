import { useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertCircle, Camera, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { ProfileData } from '@/services/profileService'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { updatePhoto } from '@/services/profileService'

interface ProfileAvatarProps {
  user: {
    profile_image?: string | null
    name: string
    username: string
  }
}

export function ProfileAvatar({ user }: ProfileAvatarProps) {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')

  const mutation = useMutation({
    mutationFn: updatePhoto,
    onSuccess: () => {
      toast.success('Foto profil berhasil diperbarui')
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      setError('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    onError: (err: any) => {
      const errorMessage =
        err?.response?.data?.message ||
        'Terjadi kesalahan saat mengunggah foto.'
      setError(errorMessage)

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setError('')
      mutation.mutate(file)
    }
  }

  const handleButtonClick = () => {
    setError('')
    fileInputRef.current?.click()
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-6 gap-4">
        <div className="relative">
          <Avatar className="h-24 w-24 border-2 border-slate-100">
            <AvatarImage
              src={user.profile_image || undefined}
              className="object-cover"
            />
            <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-xl">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="text-center space-y-1">
          <h3 className="font-semibold text-lg">{user.name}</h3>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleFileChange}
        />

        <Button
          variant="outline"
          className="gap-2"
          onClick={handleButtonClick}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
          {mutation.isPending ? 'Mengupload...' : 'Ubah Foto'}
        </Button>
      </CardContent>
    </Card>
  )
}
