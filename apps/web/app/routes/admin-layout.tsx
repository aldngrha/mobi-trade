import { Outlet, useNavigate } from "react-router";
import { useAuth } from "~/context/auth-context";
import { useEffect, useState } from "react";
import Sidebar from "~/components/shared/sidebar";

export default function AdminLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    if (user.role !== "ADMIN") {
      navigate("/sign-in");
    }
  }, [user, navigate]);

  return (
    <Sidebar>
      <Outlet />
    </Sidebar>
  );
}
