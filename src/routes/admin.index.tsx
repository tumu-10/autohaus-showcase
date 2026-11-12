import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Car, CheckCircle2, CalendarDays, CircleDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInventory } from "@/services/carsService";
import { pageHead } from "@/lib/vehicle-fields";
export const Route = createFileRoute("/admin/")({ head: () => pageHead("Admin Overview", "Shamran Motors demo dashboard with total, available, hired and sold cars."), component: Dashboard });
function Dashboard() {
  const { cars, hires } = useInventory();
  const stats = [{ name: "Total cars", value: cars.length, icon: Car }, { name: "Available", value: cars.filter((v) => v.availability === "Available").length, icon: CheckCircle2 }, { name: "Hired", value: cars.filter((v) => v.availability === "Hired").length, icon: CalendarDays }, { name: "Sold", value: cars.filter((v) => v.availability === "Sold").length, icon: CircleDollarSign }];
  return <><p className="eyebrow text-muted-foreground">Inventory at a glance</p><h1 className="display mt-4 text-5xl text-brand sm:text-7xl">Overview</h1><div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((s) => <article key={s.name} className="border p-5"><div className="flex items-center justify-between"><p className="eyebrow text-muted-foreground">{s.name}</p><s.icon className="h-5 w-5 text-brand" /></div><p className="display mt-8 text-6xl">{s.value}</p></article>)}</div><section className="mt-12 border-t pt-8"><h2 className="display text-3xl">Manage listings</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><Button asChild variant="outline" className="h-auto justify-between p-5"><Link to="/admin/cars"><span>Cars · {cars.length} listings</span><ArrowRight /></Link></Button><Button asChild variant="outline" className="h-auto justify-between p-5"><Link to="/admin/car-hire"><span>Car Hire · {hires.length} listings</span><ArrowRight /></Link></Button></div></section></>;
}
