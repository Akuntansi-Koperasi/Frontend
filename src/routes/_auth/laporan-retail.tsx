import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/laporan-retail')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/laporan-retail"!</div>
}
