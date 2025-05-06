"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  EuroIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { SupportAgent } from "@mui/icons-material";

export default function AdminLayout({ children, role }) {
  const pathname = usePathname();
  const { refreshUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logoutHandler = () => {
    localStorage.setItem("benzo-auth-token", "");
    typeof window !== "undefined" && window.location.replace("/");
    refreshUser();
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard size={20} />,
      active: pathname === "/admin",
      roles: ["admin", "Order_manager"],
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: <Package size={20} />,
      active: pathname.startsWith("/admin/products"),
      roles: ["admin"],
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: <ShoppingCart size={20} />,
      active: pathname.startsWith("/admin/orders"),
      roles: ["admin", "Order_manager"],
    },
    {
      name: "Customers",
      href: "/admin/customers",
      icon: <Users size={20} />,
      active: pathname.startsWith("/admin/customers"),
      roles: ["admin"],
    },
    {
      name: "Tickets",
      href: "/admin/tickets",
      icon: <SupportAgent size={20} />,
      active: pathname.startsWith("/admin/tickets"),
      roles: ["admin"],
    },
    {
      name: "Wallet",
      href: "/admin/wallet",
      icon: <EuroIcon size={20} />,
      active: pathname.startsWith("/admin/wallet"),
      roles: ["admin"],
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: <Settings size={20} />,
      active: pathname.startsWith("/admin/settings"),
      roles: ["admin"],
    },
  ];

  const filteredNavItems = navItems?.filter((item) =>
    item?.roles?.includes(role)
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 transform bg-white transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-5 border-b">
          <Link href="/admin" className="flex items-center">
            <span className="text-xl font-bold text-teal-600">Benzo Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md lg:hidden">
            <X size={20} />
          </button>
        </div>

        {/* Sidebar content */}
        <nav className="p-4 space-y-1">
          {filteredNavItems?.map((item) => (
            <Link
              onClick={() => setSidebarOpen(false)}
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                item.active
                  ? "bg-teal-50 text-teal-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}>
              {item.icon}
              <span className="ml-3 font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white shadow">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md lg:hidden">
              <Menu size={20} />
            </button>

            {/* Right side header items */}
            <div className="flex items-center space-x-4 ml-auto">
              {/* Notifications
              <button className="p-1 rounded-full text-gray-600 hover:bg-gray-100 relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </button> */}

              {/* User dropdown */}
              <div className="relative">
                <div className="flex items-center cursor-pointer">
                  <div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-medium">
                    A
                  </div>
                  <span className="ml-2 mr-1 text-sm font-medium hidden sm:block">
                    Admin
                  </span>
                  {/* <ChevronDown size={16} className="text-gray-500" /> */}
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={() => logoutHandler()}
                className="p-1 cursor-pointer rounded-full text-gray-600 hover:bg-gray-100">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
