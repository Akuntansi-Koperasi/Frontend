import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/koperasi')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/koperasi"!</div>
}
