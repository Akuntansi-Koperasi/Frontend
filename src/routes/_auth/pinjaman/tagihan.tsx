import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/pinjaman/tagihan')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/pinjaman/tagihan"!</div>
}
