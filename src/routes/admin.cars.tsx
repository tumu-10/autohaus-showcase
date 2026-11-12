import { createFileRoute } from "@tanstack/react-router";
import { AdminInventory } from "@/components/admin/AdminInventory";
import { pageHead } from "@/lib/vehicle-fields";
export const Route = createFileRoute("/admin/cars")({ head: () => pageHead("Admin Cars", "Create, edit and manage demo car listings at Shamran Motors."), component: () => <AdminInventory /> });
