import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertCircle, Loader2, MapPin, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { MapPicker } from './map-picker'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createToko, getAddressFromCoordinates } from '@/services/tokoService'

export function TokoAddDialog() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const [coords, setCoords] = useState({ lat: -7.7956, lng: 110.3695 })
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [maxDistance, setMaxDistance] = useState(50)
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)
  const [error, setError] = useState('')
  const [noAddressFound, setNoAddressFound] = useState('')

  const mutation = useMutation({
    mutationFn: createToko,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toko'] })
      setOpen(false)
      setName('')
      setAddress('')
      setError('')
      setNoAddressFound('')
      setMaxDistance(50)
      toast.success('Toko berhasil ditambahkan')
    },
    onError: (err: any) => {
      const errorMessage =
        err?.response?.data?.message || 'Terjadi kesalahan saat menambahkan toko'
      
      setError(errorMessage)
      toast.error(errorMessage)
    },
  })

  const handleLocationSelect = async (lat: number, lng: number) => {
    setNoAddressFound('')
    setError('')
    
    setCoords({ lat, lng })
    setIsLoadingAddress(true)
    
    try {
      const fetchedAddress = await getAddressFromCoordinates(lat, lng)
      if (fetchedAddress) {
        setAddress(fetchedAddress)
      } else {
        setNoAddressFound('Alamat tidak ditemukan untuk koordinat ini.')
      }
    } catch (err) {
      setNoAddressFound('Gagal mengambil detail alamat otomatis.')
      toast.error('Gagal mengambil alamat dari peta')
    } finally {
      setIsLoadingAddress(false)
    }
  }

  const handleSubmit = () => {
    if (!name || !address) {
      toast.error('Nama toko dan alamat harus diisi')
      return
    }

    mutation.mutate({
      name,
      address,
      latitude: coords.lat,
      longitude: coords.lng,
      max_distance: maxDistance,
    })
  }

  const isFormValid = name.trim() !== '' && address.trim() !== '' && maxDistance > 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 shadow-lg h-12 cursor-pointer">
          <Plus className="h-4 w-4" />
          Tambah Toko
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Tambah Toko Baru
          </DialogTitle>
          <DialogDescription className="text-md">
            Silakan masukkan data toko baru. Pin lokasi di peta untuk mengisi
            alamat otomatis.
          </DialogDescription>
          
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-bold text-slate-700">
              Nama Toko*
            </Label>
            <Input
              id="name"
              placeholder="Contoh: Toko Cabang Utara"
              className="bg-slate-50"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
            />
          </div>

          <div className="space-y-4 rounded-lg border p-4 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-500 font-medium">
                <MapPin className="size-5" />
                <span className="text-slate-900">Lokasi Toko*</span>
              </div>
              {noAddressFound && (
                <span className="text-xs text-red-500 font-medium">
                  {noAddressFound}
                </span>
              )}
            </div>

            <MapPicker
              lat={coords.lat}
              lng={coords.lng}
              onLocationSelect={handleLocationSelect}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-600">Latitude*</Label>
                <Input
                  value={coords.lat}
                  readOnly
                  className="bg-white font-mono text-xs text-slate-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600">Longitude*</Label>
                <Input
                  value={coords.lng}
                  readOnly
                  className="bg-white font-mono text-xs text-slate-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-slate-600">Alamat*</Label>
                {isLoadingAddress && (
                  <div className="flex items-center gap-1 text-xs text-blue-500">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Mengambil alamat...</span>
                  </div>
                )}
              </div>
              <Input
                placeholder="Jl. Jendral Sudirman..."
                className={`bg-white ${noAddressFound ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value)
                  setNoAddressFound('')
                }}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-600">
                Jarak maksimal (m) untuk presensi*
              </Label>
              <Input
                type="number"
                min="1"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="bg-white"
              />
              <p className="text-xs text-muted-foreground">
                Radius pegawai bisa melakukan absen dari titik lokasi.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="destructive"
            className="md:w-[50%] w-full h-12 cursor-pointer"
            onClick={() => setOpen(false)}
            disabled={mutation.isPending}
          >
            Batal
          </Button>
          <Button
            className="md:w-[50%] w-full bg-slate-900 text-white hover:bg-slate-800 h-12 cursor-pointer"
            onClick={handleSubmit}
            disabled={mutation.isPending || isLoadingAddress || !isFormValid}
          >
            {mutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {mutation.isPending ? 'Menyimpan...' : 'Tambah Toko'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}