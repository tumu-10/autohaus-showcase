import { createFileRoute } from "@tanstack/react-router";
import { AdminInventory } from "@/components/admin/AdminInventory";
import { pageHead } from "@/lib/vehicle-fields";
export const Route = createFileRoute("/admin/car-hire")({ head: () => pageHead("Admin Car Hire", "Manage demonstration hire rates, availability, locations and terms at Shamran Motors."), component: () => <AdminInventory hire /> });
