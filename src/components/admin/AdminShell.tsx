import { useEffect, useState, type ReactNode } from "react";
import { Link, Navigate, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { CarFront, ChevronLeft, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { AdminAuthContext, ADMIN_AUTH_KEY, useDemoAdmin } from "@/components/admin/admin-auth";

export function AdminRouteLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    try {
      setAuthenticated(window.localStorage.getItem(ADMIN_AUTH_KEY) === "true");
    } catch (error) {
      console.error("Unable to read demo admin authentication.", error);
      toast.error("Unable to read the demo login session.");
    } finally {
      setChecking(false);
    }
  }, []);

  const isLogin = pathname === "/admin/login";
  return (
    <AdminAuthContext.Provider value={{ setAuthenticated }}>
      {isLogin ? (
        <Outlet />
      ) : checking ? (
        <div role="status" aria-label="Checking admin session" className="flex min-h-screen items-center justify-center bg-ink px-6">
          <div className="w-52 max-w-full animate-pulse">
            <img src="/logo-transparent.png" alt="Shamran Motors — Motors, more than just cars" className="h-auto w-full object-contain" />
          </div>
        </div>
      ) : authenticated ? (
        <AdminShell />
      ) : (
        <Navigate to="/admin/login" replace />
      )}
    </AdminAuthContext.Provider>
  );
}

function AdminShell() {
  const { setAuthenticated } = useDemoAdmin();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function logout() {
    try {
      window.localStorage.removeItem(ADMIN_AUTH_KEY);
      setAuthenticated(false);
      void navigate({ to: "/admin/login" });
    } catch (error) {
      console.error("Unable to clear demo admin authentication.", error);
      toast.error("Unable to clear the saved demo session.");
      setAuthenticated(false);
      void navigate({ to: "/admin/login" });
    }
  }

  const nav = (
    <>
      <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex min-h-12 items-center gap-3 px-4 py-3 transition-colors hover:bg-ink-foreground/10" activeProps={{ className: "bg-ink-foreground/10 text-brand" }}>
        <LayoutDashboard className="h-5 w-5 shrink-0" />
        <span className={collapsed ? "md:hidden" : ""}>Dashboard</span>
      </Link>
      <Link to="/admin/cars" onClick={() => setMobileOpen(false)} className="flex min-h-12 items-center gap-3 px-4 py-3 transition-colors hover:bg-ink-foreground/10" activeProps={{ className: "bg-ink-foreground/10 text-brand" }}>
        <CarFront className="h-5 w-5 shrink-0" />
        <span className={collapsed ? "md:hidden" : ""}>Cars</span>
      </Link>
      <Link to="/admin/hire" onClick={() => setMobileOpen(false)} className="flex min-h-12 items-center gap-3 px-4 py-3 transition-colors hover:bg-ink-foreground/10" activeProps={{ className: "bg-ink-foreground/10 text-brand" }}>
        <span className="flex h-5 w-5 shrink-0 items-center justify-center text-sm font-bold">H</span>
        <span className={collapsed ? "md:hidden" : ""}>Car Hire</span>
      </Link>
    </>
  );

  return (
    <div className="admin-shell min-h-screen bg-background text-foreground">
      {mobileOpen && <button aria-label="Close admin menu" className="fixed inset-0 z-40 bg-ink/50 md:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-ink text-ink-foreground transition-transform md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} ${collapsed ? "md:w-20" : "md:w-64"}`}>
        <div className="flex h-16 items-center justify-between border-b border-ink-foreground/15 px-4">
          <Link to="/" aria-label="Shamran Motors home" className={`flex min-h-11 items-center ${collapsed ? "md:justify-center" : ""}`}>
            <span className={`flex h-12 items-center ${collapsed ? "w-12 md:w-12" : "w-44 md:w-44"}`}>
              <img src="/logo-transparent.png" alt="Shamran Motors — Motors, more than just cars" className="h-auto w-full object-contain" />
            </span>
          </Link>
          <button type="button" aria-label="Close admin menu" onClick={() => setMobileOpen(false)} className="min-h-11 min-w-11 md:hidden"><X /></button>
          <button type="button" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={() => setCollapsed(!collapsed)} className="hidden min-h-11 min-w-11 items-center justify-center md:flex">
            <ChevronLeft className={`h-5 w-5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-3">{nav}</nav>
        <div className="mt-auto border-t border-ink-foreground/15 p-3">
          <button type="button" onClick={logout} className="flex min-h-12 w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-ink-foreground/10">
            <LogOut className="h-5 w-5 shrink-0" />
            <span className={collapsed ? "md:hidden" : ""}>Logout</span>
          </button>
        </div>
      </aside>
      <div className={`min-w-0 transition-[padding] ${collapsed ? "md:pl-20" : "md:pl-64"}`}>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-8">
          <button type="button" aria-label="Open admin menu" onClick={() => setMobileOpen(true)} className="flex min-h-11 min-w-11 items-center justify-center md:hidden"><Menu /></button>
          <p className="eyebrow hidden text-muted-foreground sm:block">Shamran Motors · Demo Admin</p>
          <button type="button" onClick={logout} className="eyebrow inline-flex min-h-11 items-center gap-2 px-3 text-brand">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </header>
        <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AdminPageTitle({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <p className="eyebrow text-brand">{eyebrow}</p>
        <h1 className="display mt-2 break-words text-5xl sm:text-6xl">{title}</h1>
      </div>
      {action}
    </div>
  );
}
