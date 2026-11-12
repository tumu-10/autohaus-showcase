import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { CarShare } from "@/components/site/CarShare";
import { useCars } from "@/hooks/useCars";
import { formatKm, formatPrice } from "@/lib/site";
import type { Car } from "@/services/carsService";

export const Route = createFileRoute("/cars/$id/details")({
  head: () => ({ meta: [{ title: "Vehicle Details | Shamran Motors" }] }),
  component: CarDetails,
});

function DetailGroup({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <section className="border-t py-7">
      <h2 className="display text-3xl text-brand sm:text-4xl">{title}</h2>
      <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(([label, value]) => (
          <div key={label} className="min-w-0">
            <dt className="eyebrow text-[0.62rem] text-muted-foreground">{label}</dt>
            <dd className="mt-1 break-words">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function getGroups(car: Car): [string, [string, string][]][] {
  return [
    ["Overview", [
      ["Name", car.name],
      ["Model", car.model],
      ["Manufacturer", car.manufacturer],
      ["Manufacturing year", String(car.manufacturingYear)],
      ["Price", formatPrice(car.price, car.currency)],
      ["Mileage", formatKm(car.mileage)],
    ]],
    ["Specifications", [
      ["Fuel type", car.fuelType],
      ["Transmission", car.transmission],
      ["Engine capacity", `${car.engineCapacity.toLocaleString("en-US")} cc`],
      ["Body type", car.bodyType],
      ["Seats", String(car.seats)],
      ["Drive type", car.driveType],
      ["Condition", car.condition],
    ]],
    ["Appearance", [
      ["Exterior color", car.exteriorColor],
      ["Interior color", car.interiorColor],
    ]],
    ["Availability and Location", [
      ["Availability", car.availability],
      ["Location", car.location],
    ]],
  ];
}

function CarDetails() {
  const { id } = Route.useParams();
  const car = useCars().find((item) => item.id === id);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => setSelectedImage(0), [id]);

  if (!car) {
    return (
      <section className="mx-auto max-w-[1440px] px-5 pb-24 pt-32 md:px-10">
        <Link to="/cars" className="eyebrow inline-flex min-h-11 items-center gap-2 text-brand"><ArrowLeft className="h-4 w-4" /> Back to cars</Link>
        <p className="display mt-8 text-5xl">Vehicle not found</p>
      </section>
    );
  }

  const images = car.images.filter(Boolean).slice(0, 4);
  const mainImage = images[selectedImage] ?? images[0];

  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-24 pt-28 md:px-10 md:pt-36">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/cars" className="eyebrow inline-flex min-h-11 items-center gap-2 text-brand"><ArrowLeft className="h-4 w-4" /> Back to cars</Link>
        <CarShare car={car} />
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <div className="min-w-0">
          {mainImage && <img src={mainImage} alt={`${car.manufacturer} ${car.model}`} className="aspect-[3/2] w-full bg-secondary object-cover" />}
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-3 gap-3">
              {images.slice(1).map((image, index) => {
                const imageIndex = index + 1;
                return (
                  <button
                    key={`${imageIndex}-${image.slice(0, 40)}`}
                    type="button"
                    aria-label={`Show vehicle photo ${imageIndex + 1}`}
                    aria-pressed={selectedImage === imageIndex}
                    onClick={() => setSelectedImage(imageIndex)}
                    className={`min-h-11 overflow-hidden border-2 ${selectedImage === imageIndex ? "border-brand" : "border-transparent opacity-75"}`}
                  >
                    <img src={image} alt="" className="aspect-[3/2] w-full bg-secondary object-cover" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center">
          <p className="eyebrow text-brand">{car.manufacturer} · {car.manufacturingYear}</p>
          <h1 className="display mt-3 text-5xl sm:text-6xl md:text-7xl">{car.name}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{car.model}</p>
          <p className="mt-6 text-2xl font-semibold">{formatPrice(car.price, car.currency)}</p>
        </div>
      </div>
      <div className="mt-12">
        {getGroups(car).map(([title, items]) => <DetailGroup key={title} title={title} items={items} />)}
        <section className="border-t py-7">
          <h2 className="display text-3xl text-brand sm:text-4xl">Description</h2>
          <p className="mt-5 max-w-3xl leading-relaxed text-muted-foreground">{car.description}</p>
        </section>
      </div>
    </section>
  );
}
