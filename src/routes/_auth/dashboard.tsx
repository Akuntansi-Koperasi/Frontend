import { createFileRoute } from '@tanstack/react-router'
import { SearchBar } from '@/components/nav-sidebar/search-bar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'

export const Route = createFileRoute('/_auth/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="m-10 gap-4 flex flex-col">
      <div className="flex gap-4">
        <Button>Tes Button</Button>
        <Button variant={'destructive'}>Tes Button</Button>
        <Button variant={'outline'}>Tes Button</Button>
        <Button variant={'secondary'}>Tes Button</Button>
        <Button variant={'ghost'}>Tes Button</Button>
        <Button variant={'link'}>Tes Button</Button>
        <Button variant={'green'}>Tes Button</Button>
        <Button variant={'purple'}>Tes Button</Button>
        <Button variant={'orange'}>Tes Button</Button>
      </div>
      <div className="flex gap-4">
        <Checkbox></Checkbox>
        <Checkbox checked={true}></Checkbox>
        <RadioGroup defaultValue='1' className='flex'>
          <RadioGroupItem value="1" id="r1" />
          <RadioGroupItem value="2" id="r2" />
        </RadioGroup>
      </div>
      <Switch />
      <div className="flex gap-4">
        <Badge>Hello</Badge>
        <Badge variant={'secondary'}>Hello</Badge>
        <Badge variant={'destructive'}>Hello</Badge>
        <Badge variant={'outline'}>Hello</Badge>
        <Badge variant={'ghost'}>Hello</Badge>
        <Badge variant={'link'}>Hello</Badge>
        <Badge variant={'green'}>Hello</Badge>
        <Badge variant={'blue'}>Hello</Badge>
        <Badge variant={'orange'}>Hello</Badge>
        <Badge variant={'purple'}>Hello</Badge>
      </div>
      <div className='max-w-sm'>
      <SearchBar />
      </div>
    </div>
  )
}
