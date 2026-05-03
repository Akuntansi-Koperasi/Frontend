import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/akuntansi/buku-besar')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/akuntansi/buku-besar"!</div>
}
