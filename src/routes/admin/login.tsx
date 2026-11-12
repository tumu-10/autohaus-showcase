import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useDemoAdmin, ADMIN_AUTH_KEY, DEMO_ADMIN_CREDENTIALS } from "@/components/admin/admin-auth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Demo Admin Login | Shamran Motors" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const { setAuthenticated } = useDemoAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email !== DEMO_ADMIN_CREDENTIALS.email || password !== DEMO_ADMIN_CREDENTIALS.password) {
      setError("Those demo credentials don't match. Please try again.");
      return;
    }

    try {
      window.localStorage.setItem(ADMIN_AUTH_KEY, "true");
      setAuthenticated(true);
      void navigate({ to: "/admin" });
    } catch (storageError) {
      console.error("Unable to save demo admin authentication.", storageError);
      setError("This browser could not save the demo session. Check local storage access.");
      toast.error("Unable to save the demo session.");
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-secondary px-4 py-12">
      <section className="w-full max-w-md border bg-background p-6 shadow-sm sm:p-10">
        <Link to="/" aria-label="Shamran Motors home" className="flex min-h-11 items-center justify-center">
          <span className="flex w-52 max-w-full items-center justify-center">
            <img src="/file.png" alt="Shamran Motors — Motors, more than just cars" className="h-auto w-full object-contain" />
          </span>
        </Link>
        <p className="eyebrow mt-10 text-brand">Demo admin</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl">Welcome back.</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Sign in to manage demonstration vehicle and car hire listings.</p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <label className="block">
            <span className="eyebrow mb-2 block text-[0.62rem]">Email</span>
            <input autoComplete="username" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="min-h-12 w-full border bg-background px-3 text-base outline-none focus:border-brand" />
          </label>
          <label className="block">
            <span className="eyebrow mb-2 block text-[0.62rem]">Password</span>
            <input autoComplete="current-password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="min-h-12 w-full border bg-background px-3 text-base outline-none focus:border-brand" />
          </label>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <button type="submit" className="eyebrow min-h-12 w-full bg-brand px-5 py-3 text-primary-foreground transition-colors hover:bg-ink">Sign in</button>
        </form>
        <div className="mt-6 border-t pt-5">
          <p className="eyebrow text-[0.6rem] text-muted-foreground">Demo credentials</p>
          <p className="mt-2 text-sm">admin@demo.com <span className="text-muted-foreground">/</span> admin123</p>
        </div>
      </section>
    </section>
  );
}
