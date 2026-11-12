import { createFileRoute } from "@tanstack/react-router";
import { AdminRouteLayout } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin")({
  component: AdminRouteLayout,
});
