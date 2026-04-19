import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/settings/users')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/settings/users"!</div>
}
