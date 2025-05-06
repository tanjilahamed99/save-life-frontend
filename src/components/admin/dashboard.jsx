"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Users,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Euro,
} from "lucide-react";
import axiosInstance from "@/utils/axios";
import { jwtDecode } from "jwt-decode";

// Loading spinner component
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lowStockProducts, setPowStockProducts] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const token = localStorage.getItem("benzo-auth-token");

  useEffect(() => {
    const decoded = jwtDecode(token);
    const { role } = decoded.payload;
    setUserRole(role);
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance("/orders/all");
        const { data: customer } = await axiosInstance("/users/customers");
        const { data: products } = await axiosInstance("/product/all");

        const allOrders = data?.data || [];
        const allCustomers = customer || [];
        const allProducts = products?.products || [];

        // Calculate Revenue
        const totalRevenue = allOrders.reduce(
          (sum, order) => sum + (order.totalAmount || 0),
          0
        );

        const now = new Date();
        const thisMonthOrders = allOrders.filter((order) => {
          const orderDate = new Date(order.createdAt);
          return (
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear()
          );
        });

        const lastMonthOrders = allOrders.filter((order) => {
          const orderDate = new Date(order.createdAt);
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          return (
            orderDate.getMonth() === lastMonth.getMonth() &&
            orderDate.getFullYear() === lastMonth.getFullYear()
          );
        });

        const thisMonthCustomers = allCustomers.filter((customer) => {
          const registerDate = new Date(customer.createdAt);
          return (
            registerDate.getMonth() === now.getMonth() &&
            registerDate.getFullYear() === now.getFullYear()
          );
        });

        const lastMonthCustomers = allCustomers.filter((customer) => {
          const registerDate = new Date(customer.createdAt);
          const lastMonthRegister = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            1
          );
          return (
            registerDate.getMonth() === lastMonthRegister.getMonth() &&
            registerDate.getFullYear() === lastMonthRegister.getFullYear()
          );
        });

        const thisMonthRevenue = thisMonthOrders.reduce(
          (sum, order) => sum + (order.totalAmount || 0),
          0
        );
        const lastMonthRevenue = lastMonthOrders.reduce(
          (sum, order) => sum + (order.totalAmount || 0),
          0
        );

        // Growth helper
        const calculateGrowth = (current, previous) => {
          if (previous === 0) return current === 0 ? 0 : 100;
          return ((current - previous) / previous) * 100;
        };

        setStats({
          revenue: {
            total: totalRevenue,
            thisMonth: thisMonthRevenue,
            lastMonth: lastMonthRevenue,
            growth: Number(
              calculateGrowth(thisMonthRevenue, lastMonthRevenue).toFixed(2)
            ),
          },
          orders: {
            total: allOrders.length,
            thisMonth: thisMonthOrders.length,
            lastMonth: lastMonthOrders.length,
            growth: Number(
              calculateGrowth(
                thisMonthOrders.length,
                lastMonthOrders.length
              ).toFixed(2)
            ),
          },
          customers: {
            total: allCustomers.length,
            thisMonth: thisMonthCustomers.length, // if you have createdAt for customers, you can calculate like orders
            lastMonth: lastMonthCustomers.length, // same here
            growth: Number(
              calculateGrowth(
                thisMonthCustomers.length,
                lastMonthCustomers.length
              ).toFixed(2)
            ),
          },
          products: {
            total: allProducts.length,
            inStock: allProducts.filter((product) => product.stock > 0).length,
            outOfStock: allProducts.filter((product) => product.stock <= 0)
              .length,
          },
        });

        setRecentOrders(allOrders.slice(0, 5));
        setTopProducts(allProducts);
        const lowStockProducts = [...allProducts].sort(
          (a, b) => a.stock - b.stock
        );
        setPowStockProducts([...lowStockProducts]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Find products with low stock (less than 10)
  // const lowStockProducts = stats
  //   ? Array.from({ length: 3 }).map((_, i) => ({
  //       id: `${i + 1}`,
  //       name:
  //         i === 0
  //           ? "1 Gram - 3-MMA"
  //           : i === 1
  //           ? "10 Gram - 2-CMC Crystals"
  //           : "Product Sample",
  //       stock: i === 0 ? 0 : i === 1 ? 5 : 8,
  //     }))
  //   : [];

  const statCards = [
    {
      title: "Total Revenue",
      value: `€${stats?.revenue?.total.toFixed(2)}` || 0,
      change: stats?.revenue?.growth,
      icon: <Euro size={20} className="text-white" />,
      color: "bg-gradient-to-r from-green-400 to-green-600",
      roles: ["admin", "Order_manager"],
    },
    {
      title: "Orders",
      value: stats?.orders?.total || 0,
      change: stats?.orders?.growth,
      icon: <ShoppingCart size={20} className="text-white" />,
      color: "bg-gradient-to-r from-blue-400 to-blue-600",
      href: "/admin/orders",
      roles: ["admin", "Order_manager"],
    },
    {
      title: "Products",
      value: stats?.products?.total || 0,
      change: 0, // No change data for products
      icon: <Package size={20} className="text-white" />,
      color: "bg-gradient-to-r from-purple-400 to-purple-600",
      href: userRole === "admin" ? "/admin/products" : "/admin",
      roles: ["admin"],
    },
    {
      title: "Customers",
      value: stats?.customers?.total || 0,
      change: stats?.customers?.growth,
      icon: <Users size={20} className="text-white" />,
      color: "bg-gradient-to-r from-amber-400 to-amber-600",
      href: userRole === "admin" ? "/admin/customers" : "/admin",
      roles: ["admin"],
    },
  ];

  const filterStats = statCards.filter((i) => i?.roles?.includes(userRole));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <span className="text-sm text-gray-500">
          <span className="hidden md:inline">
            Last updated: {new Date().toLocaleString()}
          </span>
          <span className="md:hidden text-[12px]">
            Last updated: {new Date().toLocaleDateString()}
          </span>
        </span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {filterStats.map((stat, index) => (
          <Link
            href={stat.href || "/admin"}
            key={index}
            className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`rounded-full p-3 ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>

              <div className="flex items-center mt-4">
                {stat.change > 0 ? (
                  <>
                    <ArrowUpRight size={16} className="text-green-500 mr-1" />
                    <span className="text-green-500 text-sm font-medium">
                      {stat.change}%
                    </span>
                  </>
                ) : stat.change < 0 ? (
                  <>
                    <ArrowDownRight size={16} className="text-red-500 mr-1" />
                    <span className="text-red-500 text-sm font-medium">
                      {Math.abs(stat.change)}%
                    </span>
                  </>
                ) : (
                  <span className="text-gray-500 text-sm">No change</span>
                )}
                <span className="text-gray-500 text-sm ml-1">
                  vs last month
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="font-bold text-lg">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-teal-600 hover:text-teal-700 flex items-center">
              View all
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="divide-y">
            {recentOrders.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No recent orders
              </div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="font-medium text-gray-900 hover:text-teal-600">
                        Order #{order._id.slice(-4)}
                      </Link>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <Clock size={14} className="mr-1" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {order?.firstName} {order?.lastName}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-medium">
                        €{order.totalAmount.toFixed(2)}
                      </div>
                      <div className="mt-1">
                        {order.orderStatus === "processing" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            Processing
                          </span>
                        )}
                        {order.orderStatus === "shipped" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Shipped
                          </span>
                        )}
                        {order.orderStatus === "delivered" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Delivered
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="font-bold text-lg">Quick Stats</h2>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              {/* Popular Products */}
              <div>
                <h3 className="font-medium text-gray-600 mb-3">
                  Popular Products
                </h3>
                <ul className="space-y-2">
                  {topProducts.slice(0, 5).map((product, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between">
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="text-sm text-gray-900 hover:text-teal-600 truncate flex-1">
                        {product.name}
                      </Link>
                      <span className="text-sm font-medium ml-2">
                        {product.totalSold || 50} sold
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Low Stock Alert */}
              <div>
                <h3 className="font-medium text-gray-600 mb-3">
                  Low Stock Alert
                </h3>
                <ul className="space-y-2">
                  {lowStockProducts.slice(0, 5).map((product, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between">
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="text-sm text-gray-900 hover:text-teal-600 truncate flex-1">
                        {product.name}
                      </Link>
                      <span
                        className={`text-sm font-medium ${
                          product.stock === 0
                            ? "text-red-600"
                            : "text-yellow-600"
                        } ml-2`}>
                        {product.stock} left
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="font-medium text-gray-600 mb-3">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {userRole === "admin" && (
                    <Link
                      href="/admin/products/add"
                      className="flex justify-center items-center py-2 bg-teal-50 text-teal-600 rounded-md hover:bg-teal-100 transition-colors text-sm font-medium">
                      Add Product
                    </Link>
                  )}

                  <Link
                    href="/admin/orders"
                    className="flex justify-center items-center py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium">
                    View Orders
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
