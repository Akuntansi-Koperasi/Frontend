import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/simpan-pinjam')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/simpan-pinjam"!</div>
}
