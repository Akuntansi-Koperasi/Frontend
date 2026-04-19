import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function TokoSearch({ currentSearch }: { currentSearch?: string }) {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState(currentSearch || '')

  useEffect(() => {
    setSearchTerm(currentSearch || '')
  }, [currentSearch])

  const handleSearch = (term: string) => {
    navigate({
      to: '/toko',
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
    <Card className="shadow-lg border-3 border-slate-200 p-0">
      <CardContent className="p-0">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama toko..."
            className="pl-10 pr-10 h-11 border-none shadow-none focus-visible:ring-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onBlur={() => handleSearch(searchTerm)}
            onKeyDown={handleKeyDown}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1.5 h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
