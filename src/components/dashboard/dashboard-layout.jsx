"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { User, Package, LogOut, ChevronRight, Menu, X, Mail, MapPin, Heart, EuroIcon } from "lucide-react"
import Breadcrumb from "@/components/Breadcrumb"
import { useAuth } from "@/context/AuthContext"
import { SupportAgentOutlined } from "@mui/icons-material"

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const { refreshUser, user } = useAuth()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("benzo-auth-token") || ""
    if (!token) {
      router.push("/login")
      localStorage.setItem("benzo-auth-token", "")
    }
  }, [])

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <User size={20} className="mr-3" />,
      active: pathname === "/dashboard",
    },
    {
      label: "Bestellingen",
      href: "/dashboard/orders",
      icon: <Package size={20} className="mr-3" />,
      active: pathname === "/dashboard/orders",
    },
    {
      label: "portemonnee",
      href: "/dashboard/wallet",
      icon: <EuroIcon size={20} className="mr-3" />,
      active: pathname === "/dashboard/wallet",
    },
    {
      label: 'Support',
      href: '/dashboard/tickets',
      icon: <SupportAgentOutlined size={20} className="mr-3" />,
      active: pathname === '/dashboard/tickets',
    },
    {
      label: "Adressen",
      href: "/dashboard/addresses",
      icon: <MapPin size={20} className="mr-3" />,
      active: pathname === "/dashboard/addresses",
    },
    {
      label: "E-mails",
      href: "/dashboard/emails",
      icon: <Mail size={20} className="mr-3" />,
      active: pathname === "/dashboard/emails",
    },
    {
      label: "Wishlist",
      href: "/dashboard/wishlist",
      icon: <Heart size={20} className="mr-3" />,
      active: pathname === "/dashboard/wishlist",
    },
    {
      label: "Account gegevens",
      href: "/dashboard/account",
      icon: <User size={20} className="mr-3" />,
      active: pathname === "/dashboard/account",
    },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const currentPage = navItems.find((item) => item.active)?.label || "Dashboard"

  const logoutHandler = () => {
    localStorage.setItem("benzo-auth-token", "")
    router.push("/")
    refreshUser()
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb
        items={[
          { label: "Mijn account", href: "/dashboard" },
          { label: currentPage, href: pathname },
        ]}
      />

      <div className="mt-6 flex flex-col md:flex-row gap-8">
        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex justify-between items-center bg-white rounded-lg shadow-sm p-4 mb-4">
          <h2 className="text-lg font-bold">Mijn account</h2>
          <button onClick={toggleMobileMenu} className="text-gray-600 hover:text-teal-600">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className={`md:w-1/4 ${isMobileMenuOpen ? "block" : "hidden md:block"}`}>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-bold">Mijn account</h2>
              <p className="text-gray-600 mt-1">Welkom terug, {user?.name}</p>
            </div>

            <nav className="p-4">
              <ul className="space-y-1">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className={`flex items-center py-2 px-3 rounded-md transition-colors ${item.active ? "bg-teal-50 text-teal-600 font-medium" : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      {item.active && <ChevronRight size={16} className="ml-auto" />}
                    </Link>
                  </li>
                ))}

                <li className="pt-4 mt-4 border-t">
                  <button
                    onClick={() => logoutHandler()}
                    className="flex cursor-pointer items-center py-2 px-3 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LogOut size={20} className="mr-3" />
                    <span>Uitloggen</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4">{children}</div>
      </div>
    </div>
  )
}
