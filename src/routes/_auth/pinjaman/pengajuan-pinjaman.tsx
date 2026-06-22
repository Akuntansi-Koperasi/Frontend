import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/pinjaman/pengajuan-pinjaman")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/pinjaman/pengajuan-pinjaman"!</div>;
}
