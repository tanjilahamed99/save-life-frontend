"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Package,
  User,
  ChevronRight,
  ShoppingBag,
  Clock,
  CheckCircle,
  ArrowRight,
  Settings,
  AlertCircle,
  Truck,
  XCircle,
  Calendar,
  Wallet,
} from "lucide-react"
import axiosInstance from "@/utils/axios"
import { useAuth } from "@/context/AuthContext"

export default function DashboardOverview() {
  const [recentOrders, setRecentOrders] = useState([])
  const [walletData, setWalletData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.email) return

        // Fetch orders
        const ordersResponse = await axiosInstance.get(`/orders/customer/${user.email}`)
        setRecentOrders(ordersResponse?.data?.data || [])

        // Fetch wallet data
        const walletResponse = await axiosInstance.get(`/wallet/user/${user.email}`)
        if (walletResponse.data.status) {
          setWalletData(walletResponse.data.data)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const dashboardLinks = [
    {
      title: "Bestellingen",
      description: "Bekijk en volg je bestellingen",
      icon: Package,
      href: "/dashboard/orders",
      color: "bg-blue-50 text-blue-600",
      count: recentOrders?.length || 0,
    },
    {
      title: "Account gegevens",
      description: "Wijzig je persoonlijke gegevens",
      icon: User,
      href: "/dashboard/account",
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Wallet",
      description: "Beheer je saldo en stortingen",
      icon: Wallet,
      href: "/dashboard/wallet",
      color: "bg-green-50 text-green-600",
    },
    // {
    //   title: 'Adressen',
    //   description: 'Beheer je verzend- en factuuradres',
    //   icon: MapPin,
    //   href: '/dashboard/addresses',
    //   color: 'bg-amber-50 text-amber-600',
    // },
    // {
    //   title: 'Wishlist',
    //   description: 'Bekijk je opgeslagen producten',
    //   icon: Heart,
    //   href: '/dashboard/wishlist',
    //   color: 'bg-rose-50 text-rose-600',
    //   count: 2,
    // },
  ]

  // Get user's first name
  const firstName = user?.name?.split(" ")?.[0] || "daar"

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("nl-NL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Order status helper
  const getStatusInfo = (status) => {
    const statusMap = {
      pending: {
        icon: Clock,
        label: "In afwachting",
        color: "text-gray-600 bg-gray-50",
      },
      processing: {
        icon: Clock,
        label: "In behandeling",
        color: "text-yellow-600 bg-yellow-50",
      },
      shipped: {
        icon: Truck,
        label: "Verzonden",
        color: "text-blue-600 bg-blue-50",
      },
      delivered: {
        icon: CheckCircle,
        label: "Afgeleverd",
        color: "text-green-600 bg-green-50",
      },
      cancelled: {
        icon: XCircle,
        label: "Geannuleerd",
        color: "text-red-600 bg-red-50",
      },
    }

    return (
      statusMap[status] || {
        icon: AlertCircle,
        label: status || "Onbekend",
        color: "text-gray-600 bg-gray-50",
      }
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-xl shadow-md p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welkom terug, {user?.name}!</h1>
            <p className="mt-2 text-teal-100">Beheer je bestellingen, account en meer vanaf één centrale plek</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/dashboard/account"
              className="inline-flex text-sm lg:text-base items-center bg-white text-teal-700 px-4 py-2 rounded-lg shadow-sm font-medium hover:bg-teal-50 transition-colors"
            >
              <Settings size={18} className="mr-2" />
              Account
            </Link>
            <Link
              href="/shop"
              className="inline-flex text-sm lg:text-base items-center bg-white text-teal-700 px-4 py-2 rounded-lg shadow-sm font-medium hover:bg-teal-50 transition-colors"
            >
              <ShoppingBag size={18} className="mr-2" />
              Shop
            </Link>
          </div>
        </div>
      </div>

      {/* Wallet Card */}
      {!loading && walletData && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Wallet Saldo</h2>
              <p className="text-3xl font-bold text-teal-600 mt-2">€{walletData.balance.toFixed(2)}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/dashboard/wallet"
                className="inline-flex justify-center items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
              >
                <Wallet size={18} className="mr-2" />
                Beheer wallet
              </Link>
              <Link
                href="/dashboard/wallet?tab=deposit"
                className="inline-flex justify-center items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Geld storten
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardLinks.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.title}
              href={link.href}
              className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all flex flex-col justify-between h-full border border-gray-100 hover:border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${link.color}`}>
                  <Icon size={22} />
                </div>
                {link.count !== undefined && (
                  <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    {link.count}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-gray-900">{link.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{link.description}</p>
              </div>
              <div className="flex items-center justify-end mt-4 text-teal-600 text-sm font-medium">
                Bekijken
                <ChevronRight size={16} className="ml-1" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recente bestellingen</h2>
            <p className="text-sm text-gray-600">Bekijk en beheer je meest recente aankopen</p>
          </div>
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium bg-teal-50 hover:bg-teal-100 transition-colors px-4 py-2 rounded-lg text-sm"
          >
            Alle bestellingen
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-gray-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={40} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Geen bestellingen gevonden</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Je hebt nog geen bestellingen geplaatst. Begin met winkelen om je eerste bestelling te maken.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              <ShoppingBag size={18} className="mr-2" />
              Begin met winkelen
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recentOrders.slice(0, 5).map((order) => {
              const statusInfo = getStatusInfo(order?.orderStatus)
              const StatusIcon = statusInfo.icon

              return (
                <li key={order._id} className="p-5 sm:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <h3 className="font-medium text-gray-900">Bestelling #{order._id}</h3>
                        <span
                          className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full ${statusInfo.color} sm:ml-auto`}
                        >
                          <StatusIcon size={14} className="mr-1" />
                          {statusInfo.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1.5" />
                          {formatDate(order?.createdAt)}
                        </div>
                        <div className="flex items-center">
                          <ShoppingBag size={14} className="mr-1.5" />
                          {order?.items?.length || 0} {(order?.items?.length || 0) === 1 ? "product" : "producten"}
                        </div>
                        <div className="font-medium text-gray-900">€{order?.totalAmount?.toFixed(2)}</div>
                      </div>
                    </div>

                    <Link
                      href={`/dashboard/orders/${order._id}`}
                      className="inline-flex items-center justify-center px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                    >
                      Details
                      <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {/* View more button for mobile */}
        {!loading && recentOrders.length > 0 && (
          <div className="p-4 sm:hidden border-t border-gray-100">
            <Link
              href="/dashboard/orders"
              className="block w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-center font-medium rounded-lg text-gray-700 transition-colors"
            >
              Bekijk alle bestellingen
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
