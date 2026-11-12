import { createContext, useContext } from "react";

export const ADMIN_AUTH_KEY = "shamran-demo-admin-auth";
export const DEMO_ADMIN_CREDENTIALS = { email: "admin@demo.com", password: "admin123" };

export type AdminAuthContextValue = {
  setAuthenticated: (value: boolean) => void;
};

export const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function useDemoAdmin() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("useDemoAdmin must be used within the admin route.");
  return context;
}
