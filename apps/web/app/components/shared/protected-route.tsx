import { Navigate, useLocation } from "react-router";
import type { JSX } from "react";
import { useAuth } from "~/context/auth-context";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  if (typeof window === "undefined") return null;

  const { token, user, isInitialized } = useAuth();
  const location = useLocation();

  const path = location.pathname;

  const isOpenPath = path === "/" || path.startsWith("/products");

  const isAdminPath = path.startsWith("/admin");

  if (!isInitialized) return null;

  if (!token && !isOpenPath) {
    return <Navigate to="/sign-in" replace />;
  }

  if (user?.role === "USER" && isAdminPath) {
    return <Navigate to="/" replace />;
  }

  return children;
}
