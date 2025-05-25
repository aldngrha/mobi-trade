import { Navigate, useLocation } from "react-router";
import type { JSX } from "react";
import { useAuth } from "~/context/auth-context";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  if (typeof window === "undefined") return null;

  const { token, isInitialized } = useAuth();
  const location = useLocation();

  const isOpenPath =
    location.pathname === "/" || location.pathname.startsWith("/products");

  if (!isInitialized) {
    // opsional: bisa kasih loading spinner atau null
    return null;
  }

  if (!token && !isOpenPath) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
}
