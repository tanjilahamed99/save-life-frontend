"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  SlidersHorizontal,
  Package,
  EyeIcon,
} from "lucide-react";
import LoadingSpinner from "@/components/admin/loading-spinner";
import axiosInstance from "@/utils/axios";
import CustomerTotalOrders from "./Customer-totalOrders";

export default function CustomersManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("name_asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const customersPerPage = 10;
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data } = await axiosInstance.get("/users/customers");
      setCustomers(data);
      setLoading(false);
      const { data: orders } = await axiosInstance("/orders/all");
      setOrders([...orders?.data]);
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        let filteredCustomers = [...customers];
        if (!searchTerm || !filterStatus || !sortBy) {
          setFilteredCustomers(customers);
          setTotalCount(customers.length);
        }
        const filters = {
          search: searchTerm,
          status: filterStatus,
          sort: sortBy,
        };

        // Apply filters
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredCustomers = filteredCustomers.filter(
            (customer) =>
              customer.name.toLowerCase().includes(searchTerm) ||
              customer.email.toLowerCase().includes(searchTerm)
          );
        }

        if (filters.status) {
          filteredCustomers = filteredCustomers.filter(
            (customer) => customer.status === filters.status
          );
        }

        // Sort
        if (filters.sort) {
          switch (filters.sort) {
            case "name_asc":
              filteredCustomers.sort((a, b) => a.name.localeCompare(b.name));
              break;
            case "name_desc":
              filteredCustomers.sort((a, b) =>
                b.firstName.localeCompare(a.firstName)
              );
              break;
            case "email_asc":
              filteredCustomers.sort((a, b) => a.email.localeCompare(b.email));
              break;
            case "email_desc":
              filteredCustomers.sort((a, b) => b.email.localeCompare(a.email));
              break;
            case "orders_asc":
              filteredCustomers.sort((a, b) => a.totalOrders - b.totalOrders);
              break;
            case "orders_desc":
              filteredCustomers.sort((a, b) => b.totalOrders - a.totalOrders);
              break;
            case "spent_asc":
              filteredCustomers.sort((a, b) => a.totalSpent - b.totalSpent);
              break;
            case "spent_desc":
              filteredCustomers.sort((a, b) => b.totalSpent - a.totalSpent);
              break;
            case "date_asc":
              filteredCustomers.sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
              );
              break;
            case "date_desc":
              filteredCustomers.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              );
              break;
            default:
              break;
          }
        }

        setTotalCount(filteredCustomers.length);
        return setFilteredCustomers([...filteredCustomers]);
      } catch (error) {}
    };

    fetchCustomers();
  }, [searchTerm, filterStatus, sortBy, customers]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  // Pagination
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers?.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );
  const totalPages = Math.ceil(totalCount / customersPerPage);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
      </div>

      {/* Search and filters */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search customers..."
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
            Advanced Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
                <option value="email_asc">Email (A-Z)</option>
                <option value="email_desc">Email (Z-A)</option>
                <option value="orders_desc">Most Orders</option>
                <option value="orders_asc">Least Orders</option>
                <option value="spent_desc">Highest Spent</option>
                <option value="spent_asc">Lowest Spent</option>
                <option value="date_desc">Newest First</option>
                <option value="date_asc">Oldest First</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("");
                  setSortBy("name_asc");
                }}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Customers table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="hidden md:block">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registered
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentCustomers.length > 0 ? (
                  currentCustomers.map((customer, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {customer.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {
                          orders?.filter(
                            (order) => order.user?._id === customer._id
                          ).length
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        €
                        {orders
                          ?.filter((order) => order.user?._id === customer._id)
                          .reduce((acc, order) => acc + order.totalAmount, 0)
                          .toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/customers/${customer._id}`}
                          className="text-teal-600 hover:text-teal-900 flex justify-center">
                          <Eye size={16} />
                          <span className="sr-only">View</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-sm text-gray-500">
                      No customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="md:hidden">
          <div className="divide-y">
            {currentCustomers?.map((customer) => (
              <div
                key={customer._id || customer.id}
                className="p-4 md:p-6 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition-all">
                <div className="flex justify-between items-start">
                  {/* Left side (Customer Info) */}
                  <div className="space-y-1">
                    <Link
                      href={`/admin/customers/${customer._id || customer.id}`}
                      className="text-sm font-semibold text-gray-900 hover:text-teal-600 transition-colors">
                      {customer?.name}
                    </Link>
                    <div className="text-sm text-gray-600 truncate max-w-[250px]">
                      {customer?.email}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(
                        customer.date || customer.createdAt
                      ).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>

                  {/* Right side (Order Count and Total Spend) */}
                  <div className="text-right space-y-2">
                    <div className="flex items-center justify-end gap-1 text-sm font-semibold text-gray-700">
                      <Package size={16} className="text-teal-600" />
                      {
                        orders?.filter(
                          (order) => order.user?._id === customer._id
                        ).length
                      }
                    </div>
                    <div className="flex items-center justify-end gap-1 text-sm text-gray-800">
                      €
                      {orders
                        ?.filter((order) => order.user?._id === customer._id)
                        .reduce((acc, order) => acc + order.totalAmount, 0)
                        .toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* View Button */}
                <div className="mt-4 flex justify-end">
                  <Link
                    href={`/admin/customers/${customer._id || customer.id}`}
                    className="text-teal-600 hover:text-teal-800 transition-colors flex items-center gap-1 text-sm font-medium">
                    <EyeIcon size={18} />
                    <span>View</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <nav className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{indexOfFirstCustomer + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastCustomer, totalCount)}
              </span>{" "}
              of <span className="font-medium">{totalCount}</span> customers
            </p>
          </div>
          <div className="flex-1 flex justify-between sm:justify-end">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } mr-2`}>
              <ChevronLeft size={16} className="mr-1" />
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === totalPages || totalPages === 0
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
