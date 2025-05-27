import { Outlet, useNavigate } from "react-router";
import { AuthProvider, useAuth } from "~/context/auth-context";
import { useEffect, useState } from "react";
import Sidebar from "~/components/shared/sidebar";
import { ProtectedRoute } from "~/components/shared/protected-route";

export default function AdminLayout() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <Sidebar>
          <Outlet />
        </Sidebar>
      </ProtectedRoute>
    </AuthProvider>
  );
}
