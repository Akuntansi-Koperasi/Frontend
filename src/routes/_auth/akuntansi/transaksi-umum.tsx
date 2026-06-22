import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/akuntansi/transaksi-umum")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/akuntansi/transaksi-umum"!</div>;
}
