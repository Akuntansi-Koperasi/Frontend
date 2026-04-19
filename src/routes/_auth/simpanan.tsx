import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/simpanan')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/simpanan"!</div>
}
