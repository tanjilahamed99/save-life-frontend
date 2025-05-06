"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  Plus,
  Clock,
  Trash2,
} from "lucide-react";
import LoadingSpinner from "@/components/admin/loading-spinner";
import axiosInstance from "@/utils/axios";
import { toast } from "sonner";
import { CardContent } from "@mui/material";
import { CardGiftcardOutlined } from "@mui/icons-material";

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sortBy, setSortBy] = useState("date_desc");
  const [totalCount, setTotalCount] = useState(0);
  const ordersPerPage = 10;
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const { data } = await axiosInstance("/orders/all");
        setOrders([...data?.data]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchAllOrders();
  }, []);

  useEffect(() => {
    const fetchOrdersFilter = async () => {
      try {
        const filters = {};
        if (searchTerm) filters.search = searchTerm;
        if (filterStatus) filters.orderStatus = filterStatus;
        if (filterPaymentStatus) filters.paymentStatus = filterPaymentStatus;
        if (dateRange.start) filters.dateFrom = dateRange.start;
        if (dateRange.end) filters.dateTo = dateRange.end;
        if (sortBy) filters.sort = sortBy;

        let filteredOrders = [...orders];

        const noFilters = Object.keys(filters).length === 0;

        if (noFilters) {
          setFilteredOrders([...orders]);
          setTotalCount(filteredOrders.length);
        }

        if (!noFilters) {
          if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredOrders = filteredOrders.filter(
              (order) =>
                order._id.toLowerCase().includes(searchTerm) ||
                order.firstName.toLowerCase().includes(searchTerm) ||
                order.lastName.toLowerCase().includes(searchTerm) ||
                order.email.toLowerCase().includes(searchTerm)
            );
          }

          if (filters.orderStatus) {
            filteredOrders = filteredOrders.filter(
              (order) => order.orderStatus === filters.orderStatus
            );
          }

          if (filters.paymentStatus) {
            filteredOrders = filteredOrders.filter(
              (order) => order.paymentStatus === filters.paymentStatus
            );
          }

          if (filters.dateFrom) {
            filteredOrders = filteredOrders.filter(
              (order) => new Date(order.createdAt) >= new Date(filters.dateFrom)
            );
          }

          if (filters.dateTo) {
            filteredOrders = filteredOrders.filter(
              (order) => new Date(order.createdAt) <= new Date(filters.dateTo)
            );
          }

          if (filters.sort === "latest") {
            filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
          } else if (filters.sort === "oldest") {
            filteredOrders.sort((a, b) => new Date(a.date) - new Date(b.date));
          }

          if (filters.sort) {
            switch (filters.sort) {
              case "date_asc":
                filteredOrders.sort(
                  (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                );
                break;
              case "date_desc":
                filteredOrders.sort(
                  (a, b) => new Date(b.date) - new Date(a.date)
                );
                break;
              case "number_asc":
                filteredOrders.sort((a, b) => a._id.localeCompare(b._id));
                break;
              case "number_desc":
                filteredOrders.sort((a, b) => b._id.localeCompare(a._id));
                break;
              case "customer_asc":
                filteredOrders.sort((a, b) =>
                  a.user.name.localeCompare(b.user.name)
                );
                break;
              case "customer_desc":
                filteredOrders.sort((a, b) =>
                  b.user.name.localeCompare(a.user.name)
                );
                break;
              case "total_asc":
                filteredOrders.sort((a, b) => a.totalAmount - b.totalAmount);
                break;
              case "total_desc":
                filteredOrders.sort((a, b) => b.totalAmount - a.totalAmount);
                break;
              default:
                break;
            }
          }
        }

        setTotalCount(filteredOrders.length);
        return setFilteredOrders([...filteredOrders]);
      } catch (error) {
        console.error("Error filtering orders:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchOrdersFilter();
  }, [
    searchTerm,
    filterStatus,
    filterPaymentStatus,
    dateRange,
    sortBy,
    orders,
  ]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const handlePaymentStatusChange = (e) => {
    setFilterPaymentStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange({ ...dateRange, [name]: value });
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterStatus("");
    setFilterPaymentStatus("");
    setDateRange({ start: "", end: "" });
    setSortBy("date_desc");
    setCurrentPage(1);
  };

  const handleDelete = async (orderId) => {
    const toastId = toast.loading("Loading...");
    if (window.confirm("Are you sure you want to delete this Order?")) {
      try {
        const { data } = await axiosInstance.delete(
          `/orders/delete/${orderId}`
        );
        console.log(data);
        if (data?.result?.deletedCount > 0) {
          setTotalCount(totalCount - 1);
          setOrders(orders.filter((order) => order._id !== orderId));
          toast.success("Order Delete successfully!", {
            id: toastId,
            duration: 200,
          });
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(totalCount / ordersPerPage);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Link href={"/admin/orders/add"}>
          <button className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">
            <Plus size={16} className="mr-2" />
            Create Order
          </button>
        </Link>
      </div>

      {/* Search and filters */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by order # or customer..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 sm:w-auto">
            <SlidersHorizontal size={18} className="mr-2" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Status
                </label>
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none">
                    <option value="">All Statuses</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                  <Filter
                    size={16}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  value={filterPaymentStatus}
                  onChange={handlePaymentStatusChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                  <option value="">All Payment Statuses</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date From
                </label>
                <input
                  type="date"
                  name="start"
                  value={dateRange.start}
                  onChange={handleDateRangeChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date To
                </label>
                <input
                  type="date"
                  name="end"
                  value={dateRange.end}
                  onChange={handleDateRangeChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                  <option value="date_desc">Date (Newest First)</option>
                  <option value="date_asc">Date (Oldest First)</option>
                  <option value="number_asc">Order Number (A-Z)</option>
                  <option value="number_desc">Order Number (Z-A)</option>
                  <option value="customer_asc">Customer Name (A-Z)</option>
                  <option value="customer_desc">Customer Name (Z-A)</option>
                  <option value="total_asc">Total (Low to High)</option>
                  <option value="total_desc">Total (High to Low)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="hidden md:block">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order #
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order._id.slice(0, 4)}..
                        {order._id.slice(20)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 flex gap-1 whitespace-nowrap text-sm text-gray-500">
                        <span>{order.firstName}</span>
                        <span>{order.lastName}</span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.paymentStatus === "pending" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                        {order.paymentStatus === "paid" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Paid
                          </span>
                        )}
                        {order.paymentStatus === "failed" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.orderStatus === "processing" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Processing
                          </span>
                        )}
                        {order.orderStatus === "shipped" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Shipped
                          </span>
                        )}
                        {order.orderStatus === "delivered" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Delivered
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        €{order?.totalAmount?.toFixed(2)}
                      </td>
                      <td className="ppx-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex mx-auto items-center justify-center space-x-2">
                          <Link
                            href={`/admin/orders/${order._id}`}
                            className="text-teal-600 hover:text-teal-900">
                            <Eye size={16} />
                            <span className="sr-only">View</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(order._id)}
                            className="text-red-600 hover:text-red-900">
                            <Trash2 size={16} />
                            <span className="sr-only">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-sm text-gray-500">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="md:hidden">
          <div className="divide-y">
            {currentOrders.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No orders found
              </div>
            ) : (
              currentOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 md:p-6 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition-all">
                  <Link href={`/admin/orders/${order?._id}`} className="text-sm font-semibold text-gray-900 hover:text-teal-600 transition-colors">
                    <div className="flex justify-between items-start">
                      {/* Left side (Order Info) */}
                      <div className="space-y-1">

                        Order #{order?._id?.slice(-4)}
                        <div className="text-sm text-gray-700 font-medium truncate max-w-[250px]">
                          {order.firstName} {order.lastName}
                        </div>
                        {/* Date (optional) */}
                        {/* <div className="flex items-center text-xs text-gray-400">
                        <Clock size={14} className="mr-1" />
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                        </div> */}
                      </div>


                      {/* Right side (Amount and Status) */}
                      <div className="text-right space-y-2">
                        <div className="text-sm font-semibold text-gray-900">
                          €{order.totalAmount.toFixed(2)}
                        </div>
                        <div className="text-sm font-semibold">
                          <p className="bg-green-400/20 rounded-full px-2 py-1">€{order.paymentStatus}</p>
                        </div>
                        <div>
                          {order.orderStatus === "processing" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <CardGiftcardOutlined size={16} fontSize="small" className="mr-2" />
                              Processing
                            </span>
                          )}
                          {order.orderStatus === "shipped" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <CardGiftcardOutlined size={16} fontSize="small" className="mr-2" />  Shipped
                            </span>
                          )}
                          {order.orderStatus === "delivered" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CardGiftcardOutlined size={16} fontSize="small" className="mr-2" />  Delivered
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                  {/* Actions */}
                  <div className="mt-4 flex justify-end items-center space-x-3">
                    <Link
                      href={`/admin/orders/${order._id}`}
                      className="text-teal-600 hover:text-teal-800 transition-colors">
                      <Eye size={18} />
                      <span className="sr-only">View</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="text-red-600 hover:text-red-800 transition-colors">
                      <Trash2 size={18} />
                      <span className="sr-only">Delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination */}
        <nav className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{indexOfFirstOrder + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastOrder, totalCount)}
              </span>{" "}
              of <span className="font-medium">{totalCount}</span> orders
            </p>
          </div>
          <div className="flex-1 flex justify-between sm:justify-end">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
                } mr-2`}>
              <ChevronLeft size={16} className="mr-1" />
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages || totalPages === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
                }`}>
              Next
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
