import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Chrome";
import { useCars } from "@/hooks/useCars";
import { formatKm, formatPrice } from "@/lib/site";
import type { Car } from "@/services/carsService";

export const Route = createFileRoute("/cars/compare")({
  validateSearch: (search: Record<string, unknown>): { ids: string } => ({
    ids: typeof search["ids"] === "string" ? search["ids"] : "",
  }),
  head: () => ({ meta: [{ title: "Compare Cars | Shamran Motors" }] }),
  component: CompareCars,
});

const rows: { label: string; value: (car: Car) => string }[] = [
  { label: "Image", value: (car) => car.images[0] ?? "" },
  { label: "Name and model", value: (car) => `${car.name} · ${car.model}` },
  { label: "Manufacturer", value: (car) => car.manufacturer },
  { label: "Year", value: (car) => String(car.manufacturingYear) },
  { label: "Price and currency", value: (car) => formatPrice(car.price, car.currency) },
  { label: "Mileage", value: (car) => formatKm(car.mileage) },
  { label: "Fuel type", value: (car) => car.fuelType },
  { label: "Transmission", value: (car) => car.transmission },
  { label: "Engine capacity", value: (car) => `${car.engineCapacity.toLocaleString("en-US")} cc` },
  { label: "Body type", value: (car) => car.bodyType },
  { label: "Exterior color", value: (car) => car.exteriorColor },
  { label: "Interior color", value: (car) => car.interiorColor },
  { label: "Seats", value: (car) => String(car.seats) },
  { label: "Drive type", value: (car) => car.driveType },
  { label: "Condition", value: (car) => car.condition },
  { label: "Availability", value: (car) => car.availability },
  { label: "Location", value: (car) => car.location },
];

function CompareCars() {
  const { ids: searchIds } = Route.useSearch();
  const cars = useCars();
  const ids = [...new Set(searchIds.split(",").filter(Boolean))].slice(0, 2);
  const selected = ids.map((id) => cars.find((car) => car.id === id)).filter((car) => car !== undefined);

  return (
    <>
      <PageHero eyebrow="The showroom" title="Compare cars" />
      <section className="mx-auto max-w-[1440px] px-5 pb-24 md:px-10">
        <Link to="/cars" className="eyebrow link-line inline-flex min-h-11 items-center text-brand">← Back to cars</Link>
        {selected.length !== 2 ? (
          <div className="mt-8 border-y py-10">
            <p className="text-muted-foreground">Select two cars from the showroom to compare their specifications.</p>
            <Link to="/cars" className="eyebrow mt-5 inline-flex min-h-11 items-center bg-brand px-5 py-3 text-primary-foreground">Choose cars</Link>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto border-y">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr>
                  <th scope="col" className="sticky left-0 z-10 w-44 bg-background p-4" />
                  {selected.map((car) => (
                    <th key={car.id} scope="col" className="min-w-64 border-l p-4 align-bottom">
                      <p className="display text-3xl">{car.name}</p>
                      <p className="mt-2 text-muted-foreground">{car.model}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const values = selected.map(row.value);
                  const differs = values[0] !== values[1];
                  return (
                    <tr key={row.label} className="border-t">
                      <th scope="row" className="eyebrow sticky left-0 z-10 bg-background p-4 text-left text-[0.62rem]">{row.label}</th>
                      {selected.map((car) => {
                        const value = row.value(car);
                        return (
                          <td key={car.id} className={`border-l p-4 align-middle ${differs ? "bg-brand/[0.06]" : ""}`}>
                            {row.label === "Image"
                              ? <img src={value} alt={`${car.name} vehicle`} className="aspect-[3/2] w-full max-w-sm object-cover" />
                              : value}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
