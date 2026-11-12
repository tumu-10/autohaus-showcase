import { useEffect, useState } from "react";
import { Copy, MessageCircle, Share2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Vehicle } from "@/lib/site";
export function shareMessage(name: string, url: string) { return `${name} — Shamran Motors\n${url}`; }
export function ShareVehicle({ vehicle }: { vehicle: Vehicle }) {
  const [native, setNative] = useState(false);
  useEffect(() => setNative(typeof navigator.share === "function"), []);
  const url = () => new URL(`/cars/${encodeURIComponent(vehicle.id)}/details`, window.location.origin).href;
  async function copy() { try { await navigator.clipboard.writeText(url()); toast.success("Link copied"); } catch { toast.error("Could not copy the link. Please try WhatsApp."); } }
  async function share() { try { await navigator.share({ title: vehicle.name, text: vehicle.name, url: url() }); } catch (error) { if (!(error instanceof Error && error.name === "AbortError")) toast.error("Sharing unavailable. Use the share options."); } }
  return <div className="flex items-center gap-1">
    {native && <Button variant="outline" onClick={share}><Share2 />Share</Button>}
    <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" aria-label={native ? "Share options" : "Share"}>{native ? <ChevronDown /> : <><Share2 />Share</>}</Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[70]">
        <DropdownMenuItem className="min-h-11" onSelect={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage(vehicle.name, url()))}`, "_blank", "noopener,noreferrer")}><MessageCircle />WhatsApp</DropdownMenuItem>
        <DropdownMenuItem className="min-h-11" onSelect={copy}><Copy />Copy link</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>;
}
