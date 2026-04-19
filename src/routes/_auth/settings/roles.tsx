import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/settings/roles')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/settings/roles"!</div>
}
