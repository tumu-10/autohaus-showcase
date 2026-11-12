import type { Vehicle } from "@/lib/site";
import { FIELD_GROUPS, LABELS, fieldValue } from "@/lib/vehicle-fields";
export function VehicleDetails({ vehicle }: { vehicle: Vehicle }) {
  return <div className="space-y-10">{FIELD_GROUPS.map((group) => <section key={group.title} className="border-t pt-6">
    <h2 className="display text-3xl text-brand">{group.title}</h2>
    <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">{group.fields.map((key) => <div key={key} className={key === "description" ? "sm:col-span-2 lg:col-span-3" : "min-w-0"}>
      <dt className="eyebrow text-muted-foreground">{LABELS[key]}</dt><dd className="mt-2 whitespace-pre-line break-words">{fieldValue(vehicle, key)}</dd>
    </div>)}</dl>
  </section>)}</div>;
}
