import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Car, CalendarDays, LayoutDashboard, LogOut, Menu, PanelLeftClose, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { demoLoggedIn, demoLogout } from "@/services/carsService";
import { pageHead } from "@/lib/vehicle-fields";
export const Route = createFileRoute("/admin")({ head: () => pageHead("Demo Admin", "Shamran Motors demonstration inventory management."), component: AdminLayout });
const navigation = [{ to: "/admin", label: "Overview", icon: LayoutDashboard }, { to: "/admin/cars", label: "Cars", icon: Car }, { to: "/admin/car-hire", label: "Car Hire", icon: CalendarDays }] as const;
function AdminLayout() {
  const path = useLocation({ select: (l) => l.pathname }); const navigate = useNavigate(); const [allowed, setAllowed] = useState(false); const [checked, setChecked] = useState(false); const [collapsed, setCollapsed] = useState(false); const [drawer, setDrawer] = useState(false);
  const loginPage = path === "/admin/login";
  useEffect(() => {
    let loggedIn = false; try { loggedIn = demoLoggedIn(); } catch { /* Demo login requires available browser storage. */ }
    setAllowed(loggedIn); setChecked(true); setDrawer(false);
    if (!loginPage && !loggedIn) void navigate({ to: "/admin/login", replace: true });
  }, [path, loginPage, navigate]);
  if (loginPage) return <Outlet />;
  if (!checked || !allowed) return <div className="grid min-h-screen place-items-center">Checking demo login…</div>;
  function logout() { demoLogout(); setAllowed(false); void navigate({ to: "/admin/login" }); }
  const sidebar = <><div className="flex h-20 items-center justify-between border-b border-ink-foreground/15 px-4"><Link to="/admin" className="min-w-0"><img src="/logo-transparent.png" alt="Shamran Motors" className="h-14 w-28 object-contain" /></Link><Button variant="ghost" size="icon" className="lg:hidden" aria-label="Close sidebar" onClick={() => setDrawer(false)}><X /></Button></div><nav className="space-y-2 p-3">{navigation.map((n) => <Button key={n.to} asChild variant="ghost" className={`w-full justify-start ${path === n.to ? "bg-brand text-primary-foreground hover:bg-brand" : "hover:bg-ink-foreground/10 hover:text-ink-foreground"}`} title={n.label}><Link to={n.to}><n.icon />{!collapsed || drawer ? n.label : <span className="sr-only">{n.label}</span>}</Link></Button>)}</nav><div className="mt-auto p-3"><Button variant="ghost" className="w-full justify-start hover:bg-ink-foreground/10 hover:text-ink-foreground" onClick={logout}><LogOut />{!collapsed || drawer ? "Logout" : <span className="sr-only">Logout</span>}</Button></div></>;
  return <div className={`mx-auto grid min-h-screen max-w-[1920px] ${collapsed ? "lg:grid-cols-[88px_minmax(0,1fr)]" : "lg:grid-cols-[240px_minmax(0,1fr)]"}`}>
    <aside className="sticky top-0 hidden h-screen flex-col bg-ink text-ink-foreground lg:flex">{sidebar}</aside>
    {drawer && <div className="fixed inset-0 z-50 bg-ink/60 lg:hidden"><Button aria-label="Dismiss sidebar" variant="ghost" className="absolute inset-0 h-full w-full" onClick={() => setDrawer(false)} /><aside role="dialog" aria-modal="true" aria-label="Admin navigation" className="relative flex h-full w-64 flex-col bg-ink text-ink-foreground">{sidebar}</aside></div>}
    <div className="min-w-0"><header className="grid h-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b px-4 sm:px-8"><div className="flex min-w-0 items-center gap-3"><Button variant="outline" size="icon" aria-label="Toggle sidebar" onClick={() => { if (window.innerWidth < 1024) setDrawer(!drawer); else setCollapsed(!collapsed); }}><span className="lg:hidden"><Menu /></span><span className="hidden lg:block"><PanelLeftClose /></span></Button><p className="eyebrow truncate text-muted-foreground">Shamran · Demo admin</p></div><Button asChild variant="outline"><Link to="/cars">View site</Link></Button></header><main className="mx-auto max-w-[1440px] px-4 py-10 sm:px-8"><Outlet /></main></div>
  </div>;
}
