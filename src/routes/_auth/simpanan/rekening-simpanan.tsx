import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/simpanan/rekening-simpanan')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/simpanan/rekening-simpanan"!</div>
}
