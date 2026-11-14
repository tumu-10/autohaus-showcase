import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, CarFront, CircleDollarSign, KeyRound, Tag } from "lucide-react";
import { AdminPageTitle } from "@/components/admin/AdminShell";
import { useCars, useHireListings } from "@/hooks/useCars";
import { formatPrice } from "@/lib/site";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [
    { title: "Admin Dashboard | Shamran Motors" },
    { name: "description", content: "View the Shamran Motors demonstration vehicle inventory dashboard." },
    { property: "og:title", content: "Admin Dashboard | Shamran Motors" },
    { property: "og:description", content: "View the Shamran Motors demonstration vehicle inventory dashboard." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const cars = useCars();
  const hireListings = useHireListings();
  const stats = [
    { label: "Total cars", value: cars.length, icon: CarFront },
    { label: "Available", value: cars.filter((car) => car.availability === "Available").length, icon: CircleDollarSign },
    { label: "Hired", value: cars.filter((car) => car.availability === "Hired").length, icon: KeyRound },
    { label: "Sold", value: cars.filter((car) => car.availability === "Sold").length, icon: Tag },
  ];

  return (
    <>
      <AdminPageTitle eyebrow="Overview" title="Dashboard" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <article key={label} className="border bg-background p-5 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-sm">
            <div className="flex items-center justify-between">
              <p className="eyebrow text-[0.62rem] text-muted-foreground">{label}</p>
              <Icon className="h-5 w-5 text-brand" />
            </div>
            <p className="display mt-5 text-5xl">{value}</p>
          </article>
        ))}
      </div>
      <div className="mt-10 grid gap-8 xl:grid-cols-[1.4fr_0.6fr]">
        <section className="border bg-background p-5 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow text-brand">Inventory</p>
              <h2 className="display mt-2 text-3xl sm:text-4xl">Recent cars</h2>
            </div>
            <Link to="/admin/cars" className="eyebrow inline-flex min-h-11 items-center gap-2 text-brand">All cars <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-6 divide-y">
            {cars.slice(-4).reverse().map((car) => (
              <div key={car.id} className="flex min-w-0 items-center gap-3 py-4">
                <img src={car.images[0]} alt="" className="h-14 w-20 shrink-0 object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{car.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{car.manufacturer} · {car.manufacturingYear}</p>
                </div>
                <p className="hidden shrink-0 text-sm sm:block">{formatPrice(car.price, car.currency)}</p>
              </div>
            ))}
            {cars.length === 0 && <p className="py-6 text-sm text-muted-foreground">No cars have been added.</p>}
          </div>
        </section>
        <section className="border bg-ink p-5 text-ink-foreground sm:p-7">
          <p className="eyebrow text-brand">Car hire</p>
          <h2 className="display mt-2 text-3xl sm:text-4xl">Hire listings</h2>
          <p className="mt-5 text-5xl font-semibold">{hireListings.length}</p>
          <p className="mt-2 text-sm opacity-70">Demo listings managed locally in this browser.</p>
          <Link to="/admin/hire" className="eyebrow mt-6 inline-flex min-h-11 items-center gap-2 bg-brand px-4 py-3 text-primary-foreground">Manage hire <ArrowUpRight className="h-4 w-4" /></Link>
        </section>
      </div>
    </>
  );
}
