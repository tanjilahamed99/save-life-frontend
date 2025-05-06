"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Package,
  Edit,
  Save,
  X,
  EuroIcon,
} from "lucide-react";
import LoadingSpinner from "@/components/admin/loading-spinner";
import axiosInstance from "@/utils/axios";

export default function CustomerDetails() {
  const params = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const id = params.id;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const { data } = await axiosInstance.get(`/users/customer/${id}`);
        if (!data) {
          router.push("/admin/customers");
          return;
        }
        setCustomer(data);

        setFormData({
          name: data?.name || "",
          email: data?.email || "",
          phone: data?.phone || "",
          status: data?.status || "active",
        });

        // Fetch customer orders
        const customerOrders = await axiosInstance.get(
          `/orders/customer/${data?.email}`
        );
        setOrders(customerOrders?.data?.data || []);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [params.id, router]);

  useEffect(() => {
    setFormData({
      name: customer?.name,
      email: customer?.email,
      phone: customer?.phone || "",
      status: customer?.status || "active",
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await axiosInstance.put(`/users/${params.id}`, formData);
      if (response?.data?.status) {
        // Update the customer state with the updated data
        setCustomer({
          ...customer,
          ...response.data.data,
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating customer:", error);

      // Check for duplicate key error (MongoDB error code 11000)
      if (
        error.response?.data?.error?.includes("duplicate key") ||
        error.response?.status === 400
      ) {
        alert(
          "Update failed: Email address is already in use by another user."
        );
      } else {
        alert("Update failed. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Customer not found</h2>
        <p className="mt-2 text-gray-600">
          The customer you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/admin/customers"
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700">
          <ArrowLeft size={16} className="mr-2" />
          Back to Customers
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link
            href="/admin/customers"
            className="mr-4 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="md:text-2xl text-lg font-bold">Customer Details</h1>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-3 md:px-4 py-2 text-sm bg-teal-600 text-white rounded-md hover:bg-teal-700
             transition-colors">
            <Edit size={16} className="md:mr-2" />
            <span className="hidden md:inline-flex">Edit Customer</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center px-3 md:px-4 py-2  border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50
               transition-colors">
              <X size={16} className="md:mr-2" />
              <span className="hidden md:inline-flex">Cancel</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center px-3 md:px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors disabled:bg-teal-400">
              {saving ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="md:mr-2" />
                  <span className="hidden md:inline-flex">Save</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className=" p-4 md:px-6 py-4 border-b">
              <h2 className="font-bold text-lg">Customer Information</h2>
            </div>

            {isEditing ? (
              <form className="p-4 md:p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || customer?.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || customer?.email}
                      readOnly
                      disabled
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || customer?.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status || customer?.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </form>
            ) : (
              <div className="p-4 md:p-6">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-teal-600 flex items-center justify-center text-white font-medium text-lg">
                    {customer.name
                      ? customer.name.charAt(0).toUpperCase()
                      : "?"}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">{customer.name}</h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        customer.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                      {customer.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <div className="flex items-center">
                    <Mail size={16} className="text-gray-500 mr-3" />
                    <span className="text-gray-900">{customer.email}</span>
                  </div>

                  <div className="flex items-center">
                    <Phone size={16} className="text-gray-500 mr-3" />
                    <span className="text-gray-900">
                      {customer.phone || "Not provided"}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <Calendar size={16} className="text-gray-500 mr-3" />
                    <span className="text-gray-900">
                      Registered on{" "}
                      {new Date(
                        customer.dateRegistered || customer.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Customer Stats */}
          <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
            <div className="px-4 md:px-6 py-4 border-b">
              <h2 className="font-bold text-lg">Customer Stats</h2>
            </div>

            <div className="p-4 md:p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Package size={16} className="text-teal-600 mr-2" />
                    <span className="text-[11px] md:text-sm text-gray-600">
                      Total Orders
                    </span>
                  </div>
                  <p className="text-xl md:text-2xl font-bold">
                    {orders.length}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <EuroIcon size={16} className="text-teal-600 mr-2" />
                    <span className="text-[11px] md:text-sm text-gray-600">
                      Total Spent
                    </span>
                  </div>
                  <p className="text-xl md:text-2xl font-bold">
                    €
                    {orders
                      .reduce(
                        (sum, order) => sum + (order?.totalAmount || 0),
                        0
                      )
                      .toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 md:px-6 py-4 border-b flex justify-between items-center">
              <h2 className="font-bold text-lg">Order History</h2>
              <span className="text-sm text-gray-500">
                {orders.length} {orders.length === 1 ? "order" : "orders"}
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="p-4 md:p-6 text-center">
                <Package size={48} className="mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No orders yet
                </h3>
                <p className="text-gray-600">
                  This customer hasn't placed any orders yet.
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {orders.map((order) => (
                  <div
                    key={order._id || order.id}
                    className="p-4 md:p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link
                          href={`/admin/orders/${order._id || order.id}`}
                          className="font-medium text-gray-900 hover:text-teal-600">
                          Order #{order._id?.slice(-4)}
                        </Link>
                        <div className="text-sm text-gray-500 mt-1">
                          {new Date(
                            order.date || order.createdAt
                          ).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-medium">
                          €{(order?.totalAmount || 0).toFixed(2)}
                        </div>
                        <div className="mt-1">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order.status === "processing"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}>
                            {order.status
                              ? order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)
                              : "Unknown"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Items
                      </h4>
                      <ul className="text-sm text-gray-600">
                        {order.items &&
                          order.items.map((item, index) => (
                            <li
                              key={index}
                              className="flex justify-between mb-1">
                              <span>
                                {item.quantity}x {item.name}
                              </span>
                              <span>
                                €
                                {(
                                  (item.price || 0) * (item.quantity || 1)
                                ).toFixed(2)}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Link
                        href={`/admin/orders/${order._id || order.id}`}
                        className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                        View Order Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
