"use client";

import React, { useEffect, useState } from "react";

const AdminOnly = ({ children }) => {
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

  if (userRole !== "admin") {
    localStorage.removeItem("benzo-auth-token");
    typeof window !== "undefined" && window.location.replace("/");
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminOnly;
