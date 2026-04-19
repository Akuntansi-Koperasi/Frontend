import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function SetoranSearch({ currentSearch }: { currentSearch?: string }) {
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState(currentSearch || '')

  useEffect(() => {
    setSearchTerm(currentSearch || '')
  }, [currentSearch])

  const handleSearch = (term: string) => {
    navigate({
      to: '/setoran',
      search: (prev: any) => ({
        ...prev,
        search: term || undefined,
        page: 1,
      }),
      replace: true,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm)
    }
  }

  const clearSearch = () => {
    setSearchTerm('')
    handleSearch('')
  }

  return (
    <div className="relative shadow-lg">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Cari nama anggota..."
        className="pl-10 pr-10 h-10 bg-white border-3 border-slate-200"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onBlur={() => handleSearch(searchTerm)}
        onKeyDown={handleKeyDown}
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={clearSearch}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
