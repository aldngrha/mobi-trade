import { Navigate, useLocation } from "react-router";
import type { JSX } from "react";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  if (typeof window === "undefined") return null; // SSR safety

  const isLoggedIn = !!localStorage.getItem("authToken");
  const location = useLocation();

  const isOpenPath =
    location.pathname === "/" || location.pathname.startsWith("/products");

  if (!isLoggedIn && !isOpenPath) {
    // redirect to sign-in if not logged in and trying to access protected page
    return <Navigate to="/sign-in" replace />;
  }

  return children;
}
