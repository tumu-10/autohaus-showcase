import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/Chrome";
import { FIELD_GROUPS, LABELS, fieldValue, pageHead, parseCompareIds } from "@/lib/vehicle-fields";
import { useInventory } from "@/services/carsService";
export const Route = createFileRoute("/cars_/compare")({
  validateSearch: (s: Record<string, unknown>): { ids?: string } => ({ ids: typeof s.ids === "string" ? s.ids : "" }),
  head: () => pageHead("Compare Cars", "Compare two Shamran Motors vehicles side by side, including prices and full specifications."),
  component: CompareCars,
});
function CompareCars() {
  const { ids = "" } = Route.useSearch(); const { cars, ready } = useInventory();
  const selected = parseCompareIds(ids).map((id) => cars.find((v) => v.id === id)).filter((v) => v !== undefined);
  return <><PageHero eyebrow="The showroom" title="Compare cars" />
    <section className="mx-auto max-w-[1440px] px-5 pb-24 md:px-10">
      <Button asChild variant="outline"><Link to="/cars"><ArrowLeft />Back to cars</Link></Button>
      {!ready ? <p className="mt-8">Loading cars…</p> : selected.length !== 2 ? <p className="mt-8">Choose two available listings from the showroom to compare.</p> : <div className="mt-8 overflow-x-auto border" tabIndex={0} aria-label="Car comparison">
        <table className="w-full min-w-[720px] table-fixed text-sm"><thead><tr><th className="sticky left-0 z-10 w-36 bg-background p-4 text-left">Vehicle</th>{selected.map((v) => <th key={v.id} className="p-4 align-top text-left"><img src={v.images[0]} alt={v.name} className="aspect-[3/2] w-full object-cover" /><p className="display mt-4 text-3xl break-words">{v.name}</p><Button asChild variant="link" className="mt-2 px-0"><Link to="/cars/$id/details" params={{ id: v.id }}>View more details</Link></Button></th>)}</tr></thead>
        <tbody>{FIELD_GROUPS.flatMap((g) => g.fields).filter((key) => key !== "description").map((key) => {
          const different = selected[0]?.[key] !== selected[1]?.[key];
          return <tr key={key} className={different ? "border-t bg-secondary" : "border-t"}><th scope="row" className="sticky left-0 z-10 bg-background p-4 text-left font-medium">{LABELS[key]}</th>{selected.map((v) => <td key={v.id} className={`break-words p-4 ${different ? "border-l-2 border-brand/20" : ""}`}>{fieldValue(v, key)}</td>)}</tr>;
        })}</tbody></table>
      </div>}
    </section></>;
}
