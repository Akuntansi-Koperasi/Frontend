import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/gerai-retail")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/gerai-retail"!</div>;
}
