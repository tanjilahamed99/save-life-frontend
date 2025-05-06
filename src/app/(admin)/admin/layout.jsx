"use client";
import { Suspense, useEffect, useState } from "react";
import AdminAuthCheck from "@/components/admin/auth-check";
import AdminLayout from "@/components/admin/admin-layout";
import { jwtDecode } from "jwt-decode";

export default function AdminRootLayout({ children }) {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("benzo-auth-token");

  if (!token) {
    typeof window !== "undefined" && window.location.replace("/");
    return;
  }

  useEffect(() => {
    const decoded = jwtDecode(token);
    const { role } = decoded.payload;
    setUserRole(role);
    setIsLoading(false);
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (userRole !== "admin" && userRole !== "Order_manager") {
    localStorage.removeItem("benzo-auth-token");
    typeof window !== "undefined" && window.location.replace("/");
  }      

  return (
    <AdminAuthCheck>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            Loading...
          </div>
        }>
        <AdminLayout role={userRole}>{children}</AdminLayout>
      </Suspense>
    </AdminAuthCheck>
  );
}
