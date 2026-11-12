import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoBadge } from "@/components/site/VehicleGallery";
import { ShareVehicle } from "@/components/site/ShareVehicle";
import { VehicleDetails } from "@/components/site/VehicleDetails";
import { useInventory } from "@/services/carsService";
import { formatMoney, pageHead } from "@/lib/vehicle-fields";
import { whatsappLink } from "@/lib/site";
export const Route = createFileRoute("/cars_/$id/details")({
  head: ({ params }) => pageHead(`Vehicle Details — ${params.id}`, "Full vehicle specifications, appearance, availability and location from Shamran Motors."),
  component: Details,
});
function Details() {
  const { id } = Route.useParams(); const { cars, ready } = useInventory(); const v = cars.find((car) => car.id === id);
  return <section className="mx-auto max-w-[1440px] px-5 pb-24 pt-28 md:px-10">
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
      <Button asChild variant="outline" className="w-fit"><Link to="/cars" search={{ view: id }}><ArrowLeft />Back to car view</Link></Button>{v && <ShareVehicle vehicle={v} />}
    </div>
    {!ready ? <p className="mt-8">Loading vehicle…</p> : !v ? <><h1 className="display mt-10 text-5xl">Car not found</h1><p className="mt-4">This listing may have been removed.</p></> : <>
      <div className="mt-10 grid min-w-0 gap-8 lg:grid-cols-2"><img src={v.images[0]} alt={v.name} className="aspect-[3/2] w-full object-cover" /><div className="min-w-0 self-center"><DemoBadge /><h1 className="display mt-5 break-words text-5xl text-brand sm:text-6xl lg:text-7xl">{v.name}</h1><p className="mt-5 text-2xl font-semibold">{formatMoney(v.price, v.currency)}</p><p className="mt-3 text-muted-foreground">{v.manufacturingYear} · {v.manufacturer} · {v.model}</p><Button asChild className="mt-6"><a href={whatsappLink(`Hello Shamran Motors, I'm interested in ${v.name} (${v.id}).`)} target="_blank" rel="noreferrer">Enquire on WhatsApp</a></Button></div></div>
      <div className="mt-12"><VehicleDetails vehicle={v} /></div>
    </>}
  </section>;
}
