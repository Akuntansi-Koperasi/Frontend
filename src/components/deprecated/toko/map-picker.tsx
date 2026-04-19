import { useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { Loader2, MapPin, Search } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

interface MapPickerProps {
  lat: number
  lng: number
  onLocationSelect: (lat: number, lng: number) => void
  className?: string
}

type NominatimSearchResult = {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

function LocationMarker({ lat, lng, onLocationSelect }: MapPickerProps) {
  const map = useMap()
  
  useEffect(() => {
    map.flyTo([lat, lng], map.getZoom())
  }, [lat, lng, map])

  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    },
  })

  return <Marker position={[lat, lng]} />
}

export function MapPicker({ lat, lng, onLocationSelect, className }: MapPickerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<Array<NominatimSearchResult>>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const suggestTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(query)}`,
        { headers: { 'Accept-Language': 'id' } }
      )
      const data = await response.json()
      setSuggestions(data || [])
      setShowSuggestions(true)
    } catch (error) {
      console.error("Error fetching suggestions:", error)
      setSuggestions([])
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    if (suggestTimerRef.current) clearTimeout(suggestTimerRef.current)

    if (searchQuery.trim().length >= 3) {
      suggestTimerRef.current = setTimeout(() => {
        fetchSuggestions(searchQuery)
      }, 350)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }

    return () => {
      if (suggestTimerRef.current) clearTimeout(suggestTimerRef.current)
    }
  }, [searchQuery])

  const selectSuggestion = (result: NominatimSearchResult) => {
    const newLat = parseFloat(result.lat)
    const newLng = parseFloat(result.lon)
    
    setSearchQuery(result.display_name)
    setSuggestions([])
    setShowSuggestions(false)
    onLocationSelect(newLat, newLng)
  }

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (suggestions.length > 0) {
      selectSuggestion(suggestions[0])
    } else {
      fetchSuggestions(searchQuery)
    }
  }

  return (
    <div className={cn("flex flex-col gap-3 w-full", className)}>
      <div ref={containerRef} className="relative w-full z-10">
        <form onSubmit={handleManualSearch} className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
          
          <Input
            className="h-10 w-full rounded-full bg-slate-50 pl-10 pr-10 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring border-2 border-slate-200 hover:border-slate-300 transition-all"
            placeholder="Cari lokasi (contoh: Malioboro)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true)
            }}
          />
          
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </form>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-12 left-0 w-full rounded-xl border border-slate-200 bg-white shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {suggestions.map((result, index) => (
              <button
                key={result.place_id || index}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-start gap-3 transition-colors"
                onClick={() => selectSuggestion(result)}
              >
                <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <span className="line-clamp-1">{result.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-[300px] w-full rounded-xl overflow-hidden border-2 border-slate-200 shadow-sm relative z-0">
        <MapContainer
          center={[lat, lng]}
          zoom={13}
          className="w-full h-full"
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker 
            lat={lat} 
            lng={lng} 
            onLocationSelect={onLocationSelect} 
          />
        </MapContainer>
      </div>
    </div>
  )
}