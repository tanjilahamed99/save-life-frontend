"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Package,
  Clock,
  CheckCircle,
  ChevronRight,
  ShoppingBag,
  Filter,
  Calendar,
  XCircle,
  Truck,
  AlertCircle,
  Euro,
} from "lucide-react";
import axiosInstance from "@/utils/axios";
import { useAuth } from "@/context/AuthContext";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [timeFrame, setTimeFrame] = useState("all");
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/orders/customer/${user?.email}`
        );
        setOrders(response?.data?.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) fetchOrders();
  }, [user]);

  // Function to filter orders by time frame
  const filterByTimeFrame = (order) => {
    const orderDate = new Date(order.createdAt);
    const today = new Date();

    switch (timeFrame) {
      case "last30":
        // Last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        return orderDate >= thirtyDaysAgo;
      case "last90":
        // Last 90 days
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(today.getDate() - 90);
        return orderDate >= ninetyDaysAgo;
      case "last365":
        // Last year
        const yearAgo = new Date();
        yearAgo.setFullYear(today.getFullYear() - 1);
        return orderDate >= yearAgo;
      default:
        return true; // 'all' - no filtering
    }
  };

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        const matchesSearch = order._id
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesStatus =
          filterStatus === "all" || order?.orderStatus === filterStatus;
        const matchesTimeFrame = filterByTimeFrame(order);
        return matchesSearch && matchesStatus && matchesTimeFrame;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, searchTerm, filterStatus, timeFrame]);

  // Status mapping helper
  const getStatusInfo = (status) => {
    const statusMap = {
      pending: {
        icon: Clock,
        label: "Pending",
        color: "gray",
        description: "Order received",
      },
      processing: {
        icon: Package,
        label: "Processing",
        color: "yellow",
        description: "Order is being processed",
      },
      shipped: {
        icon: Truck,
        label: "Shipped",
        color: "blue",
        description: "On the way to your address",
      },
      delivered: {
        icon: CheckCircle,
        label: "Delivered",
        color: "green",
        description: "Order has been delivered",
      },
      cancelled: {
        icon: XCircle,
        label: "Cancelled",
        color: "red",
        description: "Order has been cancelled",
      },
    };

    return (
      statusMap[status] || {
        icon: AlertCircle,
        label: status || "Onbekend",
        color: "gray",
        description: "Status onbekend",
      }
    );
  };

  // Payment status helper
  const getPaymentStatusInfo = (status) => {
    if (status === "paid") {
      return { icon: CheckCircle, label: "Paid", color: "green" };
    }
    return { icon: AlertCircle, label: status || "Not Paid", color: "red" };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("nl-NL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-xl shadow-md p-6 sm:p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              My Orders
            </h1>
            <p className="mt-2 text-teal-100">
              View and track all your orders in one place
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              href="/shop"
              className="inline-flex text-sm items-center bg-white text-teal-700 px-4 py-2 rounded-lg shadow-sm font-medium hover:bg-teal-50 transition-colors">
              <ShoppingBag size={18} className="mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by order number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none">
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Filter
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>

          {/* Time Frame Filter */}
          <div className="relative">
            <select
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none">
              <option value="all">All orders</option>
              <option value="last30">Last 30 days</option>
              <option value="last90">Last 90 days</option>
              <option value="last365">Last year</option>
            </select>
            <Calendar
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Order Count Summary */}
      {!loading && (
        <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6">
          <p className="text-gray-700">
            <span className="font-semibold">{filteredOrders.length}</span>{" "}
            orders found
            {filterStatus !== "all" && (
              <span>
                {" "}
                with status <span className="font-medium">{filterStatus}</span>
              </span>
            )}
            {timeFrame !== "all" && (
              <span>
                {" "}
                in the{" "}
                {timeFrame === "last30"
                  ? "last 30 days"
                  : timeFrame === "last90"
                  ? "last 90 days"
                  : "last year"}
              </span>
            )}
            {searchTerm && (
              <span>
                {" "}
                matching "<span className="font-medium">{searchTerm}</span>"
              </span>
            )}
          </p>
        </div>
      )}

      {/* Order List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <div className="h-16 w-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-gray-50 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={48} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {searchTerm || filterStatus !== "all" || timeFrame !== "all"
                ? "Try different search or filter criteria or view all your orders"
                : "You have not placed any orders yet"}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {(searchTerm ||
                filterStatus !== "all" ||
                timeFrame !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("all");
                    setTimeFrame("all");
                  }}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Clear Filters
                </button>
              )}
              <Link
                href="/shop"
                className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                <ShoppingBag size={18} className="mr-2" />
                Start shopping
              </Link>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order?.orderStatus);
              const paymentInfo = getPaymentStatusInfo(order?.paymentStatus);

              return (
                <li
                  key={order._id}
                  className="p-5 sm:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Order Info - Left Side */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                        <h3 className="font-medium text-lg text-gray-900 truncate">
                          Order #{order._id?.slice(0, 8)}
                        </h3>
                        <StatusBadge
                          icon={statusInfo.icon}
                          text={statusInfo.label}
                          color={statusInfo.color}
                        />
                      </div>

                      {/* Date, items count and payment info */}
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Calendar size={16} className="mr-1" />
                          <span>{formatDate(order?.createdAt)}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <ShoppingBag size={16} className="mr-1" />
                          <span>
                            {order?.items?.length || 0}{" "}
                            {(order?.items?.length || 0) === 1
                              ? "item"
                              : "items"}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600 gap-2 border border-gray-200 rounded-full px-2 pr-4 py-0.5">
                          <Euro
                            size={16}
                            icon={paymentInfo.icon}
                            text={paymentInfo.label}
                            color={paymentInfo.color}
                            small
                          />
                          <span>{paymentInfo.label}</span>
                        </div>
                      </div>

                      {/* Status description only on mobile */}
                      <p className="mt-2 text-sm text-gray-600 sm:hidden">
                        {statusInfo.description}
                      </p>
                    </div>

                    {/* Order Price and Action - Right Side */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {/* Status description on larger screens */}
                      <p className="hidden sm:block text-sm text-gray-600">
                        {statusInfo.description}
                      </p>

                      {/* Price */}
                      <div className="text-lg font-medium text-gray-900">
                        €{order?.totalAmount?.toFixed(2)}
                      </div>

                      {/* Details button */}
                      <Link
                        href={`/dashboard/orders/${order._id}`}
                        className="inline-flex items-center justify-center px-4 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors font-medium">
                        Details
                        <ChevronRight size={18} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Pagination placeholder - could be implemented later */}
      {!loading && filteredOrders.length > 10 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
              Previous
            </button>
            <button className="px-3 py-2 rounded-md bg-teal-600 text-white">
              1
            </button>
            <button className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
              2
            </button>
            <button className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
              3
            </button>
            <span className="px-3 py-2">...</span>
            <button className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ icon: Icon, text, color, small = false }) {
  const colorClasses = {
    yellow: "text-yellow-700 bg-yellow-50 border-yellow-200",
    blue: "text-blue-700 bg-blue-50 border-blue-200",
    green: "text-green-700 bg-green-50 border-green-200",
    gray: "text-gray-700 bg-gray-50 border-gray-200",
    red: "text-red-700 bg-red-50 border-red-200",
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center rounded-full 
        ${small ? "text-xs px-2 py-0.5" : "text-xs sm:text-sm px-2.5 py-1"} 
        uppercase font-medium border ${colorClasses[color]}
      `}>
      <Icon size={small ? 12 : 14} className="mr-1" />
      {text}
    </span>
  );
}
