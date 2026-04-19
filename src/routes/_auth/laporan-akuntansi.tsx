import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/laporan-akuntansi')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/laporan-akuntansi"!</div>
}
