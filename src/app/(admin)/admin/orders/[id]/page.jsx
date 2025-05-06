"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Package, Truck, CheckCircle, Calendar, CreditCard, MapPin, Save, Mail } from "lucide-react"
import LoadingSpinner from "@/components/admin/loading-spinner"
import axiosInstance from "@/utils/axios"
import { toast } from "sonner"
import OrderProductsCard from "@/components/admin/orders/OrderProductsCard"
import OrderEmailSend from "@/components/admin/orders/OrderEmailSend"
import EmailHistoryTab from "@/components/admin/orders/EmailHistoryTab"
import SendEmailModal from "@/components/admin/orders/SendEmailModal"

export default function OrderDetails() {
    const params = useParams()
    const router = useRouter()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [updatingStatus, setUpdatingStatus] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState(null)
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(null)
    const [refetch, setRefetch] = useState(false)
    const [activeTab, setActiveTab] = useState("details")
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)

    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true)
            try {
                const orderData = await axiosInstance.get(`/orders/${params.id}`)
                setOrder(orderData?.data?.data)
                setSelectedStatus(orderData?.data?.data?.orderStatus)
                setSelectedPaymentStatus(orderData?.data?.data?.paymentStatus)
                setLoading(false)
            } catch (error) {
                console.error("Error fetching order:", error)
                setLoading(false)
            } finally {
                setLoading(false)
            }
        }
        fetchOrder()
    }, [params.id, router, refetch])

    const handleStatusChange = async () => {
        if (selectedStatus === order.status) return
        const toastId = toast.loading("Loading...")
        setUpdatingStatus(true)
        try {
            const { data } = await axiosInstance.put(`/orders/${order._id}`, {
                orderStatus: selectedStatus,
                paymentStatus: selectedPaymentStatus,
                site: "https://benzobestellen.com",
            })
            setOrder({
                ...order,
                status: selectedStatus,
            })
            if (data?.status) {
                toast.success("Order status update successfully!", {
                    id: toastId,
                    duration: 2000,
                })
                setRefetch(!refetch)
            }
        } catch (error) {
            console.error("Error updating order status:", error)
        } finally {
            setRefetch(!refetch)
        }
    }

    const handlePaymentStatusChange = async () => {
        if (selectedPaymentStatus === order.paymentStatus) return
        const toastId = toast.loading("Loading...")
        setUpdatingStatus(true)
        try {
            await axiosInstance.put(`/orders/${order._id}`, {
                paymentStatus: selectedPaymentStatus,
                orderStatus: selectedStatus,
                site: "https://benzobestellen.com",
            })
            setOrder({
                ...order,
                paymentStatus: selectedPaymentStatus,
            })
            setRefetch(!refetch)
            toast.success("Update successfully!", { id: toastId, duration: 2000 })
        } catch (error) {
            console.error("Error updating payment status:", error)
        } finally {
            setUpdatingStatus(false)
        }
    }

    const handleEmailSent = () => {
        // Refresh email history when a new email is sent
        setRefetch(!refetch)
    }

    if (loading) {
        return <LoadingSpinner />
    }

    if (!order) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>
                <p className="mt-2 text-gray-600">The order you're looking for doesn't exist or has been removed.</p>
                <Link
                    href="/admin/orders"
                    className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Orders
                </Link>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <Link href="/admin/orders" className="mr-4 text-gray-600 hover:text-gray-900">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="md:text-2xl font-bold">Order #{order?._id?.slice(-4)}</h1>
                </div>

                <div className="md:flex items-center text-sm text-gray-500 hidden ">
                    <Calendar size={16} className="mr-1" />
                    {new Date(order?.createdAt).toLocaleString()}
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6 border-b">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab("details")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "details"
                            ? "border-teal-500 text-teal-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        <Package size={16} className="inline mr-2" />
                        Order Details
                    </button>
                    <button
                        onClick={() => setActiveTab("emails")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "emails"
                            ? "border-teal-500 text-teal-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        <Mail size={16} className="inline mr-2" />
                        Email History
                    </button>
                </nav>
            </div>

            {activeTab === "details" ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Summary */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className=" px-3 md:px-6 py-4 border-b flex justify-between items-center">
                                <h2 className="font-bold text-base md:text-lg">Order Summary</h2>
                                <div className="flex space-x-2">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-medium ${order.orderStatus === "processing"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : order.orderStatus === "shipped"
                                                ? "bg-blue-100 text-blue-800"
                                                : "bg-green-100 text-green-800"
                                            }`}
                                    >
                                        {order?.orderStatus?.charAt(0)?.toUpperCase() + order?.orderStatus?.slice(1)}
                                    </span>

                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-medium ${order.paymentStatus === "paid"
                                            ? "bg-green-100 text-green-800"
                                            : order.paymentStatus === "pending"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                    </span>
                                </div>
                            </div>

                            <div className="p-3 md:p-6">
                                <div className="mb-6">
                                    <h3 className="text-sm font-medium text-gray-900 mb-3">Items</h3>
                                    <div className="bg-gray-50 rounded-lg overflow-hidden hidden md:inline">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Product
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Quantity
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Price
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Total
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {order.items.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {item.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                            {item.quantity}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                                            €{item.price.toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                                            €{(item?.price * item.quantity)?.toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot className="bg-gray-50">
                                                <tr>
                                                    <th
                                                        scope="row"
                                                        colSpan="3"
                                                        className="px-6 py-3 text-right text-sm font-medium text-gray-900"
                                                    >
                                                        Subtotal
                                                    </th>
                                                    <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                                                        €{(order?.subtotal).toFixed(2)}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th
                                                        scope="row"
                                                        colSpan="3"
                                                        className="px-6 py-3 text-right text-sm font-medium text-gray-900"
                                                    >
                                                        Shipping
                                                    </th>
                                                    <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">€5</td>
                                                </tr>
                                                <tr>
                                                    <th
                                                        scope="row"
                                                        colSpan="3"
                                                        className="px-6 py-3 text-right text-sm font-medium text-gray-900"
                                                    >
                                                        Total
                                                    </th>
                                                    <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                                                        €{order.totalAmount.toFixed(2)}
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-2 md:hidden space-y-2">
                                        {order?.items.map((item, index) => (
                                            <OrderProductsCard key={index} data={item} />
                                        ))}
                                    </div>

                                    <div className="bg-gray-50">
                                        <div className="flex justify-between items-center p-2">
                                            <h2 className=" text-right text-sm font-medium text-gray-900">Subtotal</h2>
                                            <p className=" text-right text-sm font-medium text-gray-900">€{(order?.subtotal).toFixed(2)}</p>
                                        </div>
                                        <div className="flex justify-between items-center p-2">
                                            <h2 className=" text-right text-sm font-medium text-gray-900">Shipping</h2>
                                            <p className=" text-right text-sm font-medium text-gray-900">€5</p>
                                        </div>
                                        <div className="flex justify-between items-center p-2">
                                            <h2 className=" text-right text-sm font-medium text-gray-900">Total</h2>
                                            <p className=" text-right text-sm font-medium text-gray-900">€{order.totalAmount.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>


                                <div className="grid grid-cols-1">
                                    {/* user info like, email, phone, name */}
                                    <div className="bg-gray-100 rounded-lg p-4 mb-4 flex flex-col gap-2">
                                        <h1 className="text-sm font-medium text-gray-900">Name: {order?.firstName} {order?.lastName}</h1>
                                        <h1 className="text-sm font-medium text-gray-900">Email: {order?.email}</h1>
                                        <h1 className="text-sm font-medium text-gray-900">Phone: {order?.phone}</h1>
                                        <h1 className="text-sm font-medium text-gray-900">Country: {order?.country}</h1>
                                    </div>
                                </div>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900 mb-3">Shipping Address</h3>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-900 capitalize">
                                                {order?.firstName} {order?.lastName}
                                            </p>
                                            {order?.shippingAddress?.company && (
                                                <p className="text-sm text-gray-900 capitalize">{order?.shippingAddress?.company}</p>
                                            )}
                                            <p className="text-sm text-gray-900 capitalize">{order?.address}</p>
                                            {order?.shippingAddress?.address2 && (
                                                <p className="text-sm text-gray-900 capitalize">{order?.shippingAddress?.address2}</p>
                                            )}
                                            <p className="text-sm text-gray-900 capitalize">
                                                {order?.postalCode} {order?.city}
                                            </p>
                                            <p className="text-sm text-gray-900">{order?.country}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900 mb-3">Billing Address</h3>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-900 capitalize">
                                                {order?.firstName} {order?.lastName}
                                            </p>
                                            {order.billingAddress?.company && (
                                                <p className="text-sm text-gray-900 capitalize">{order.billingAddress?.company}</p>
                                            )}
                                            <p className="text-sm text-gray-900 capitalize">{order?.address}</p>
                                            {order.billingAddress?.address2 && (
                                                <p className="text-sm text-gray-900 capitalize">{order.billingAddress?.address2}</p>
                                            )}
                                            <p className="text-sm text-gray-900 capitalize">
                                                {order?.postalCode} {order?.city}
                                            </p>
                                            <p className="text-sm text-gray-900">{order?.country}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Actions */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className=" px-3 md:px-6 py-4 border-b">
                                <h2 className="font-bold text-lg">Order Actions</h2>
                            </div>

                            <div className="p-6">
                                <div className="space-y-6">
                                    {/* payment url send */}
                                    <div>
                                        <h3 className="text-md font-medium text-gray-900 mb-3">Send Payment URL</h3>
                                        <OrderEmailSend orderId={params.id} onEmailSent={handleEmailSent} />
                                    </div>

                                    {/* send custom email */}
                                    <div>
                                        <h3 className="text-md font-medium text-gray-900 mb-3">Send Custom Email</h3>
                                        <button
                                            onClick={() => setIsEmailModalOpen(true)}
                                            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
                                        >
                                            <Mail size={16} className="mr-2" />
                                            Compose Email
                                        </button>
                                    </div>

                                    <div className="h-px bg-gray-200"></div>

                                    {/* update order status */}
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900 mb-3">Update Order Status</h3>
                                        <div className="flex space-x-2">
                                            <select
                                                value={selectedStatus}
                                                onChange={(e) => setSelectedStatus(e.target.value)}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            >
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                            </select>
                                            <button
                                                onClick={handleStatusChange}
                                                disabled={selectedStatus === order.orderStatus}
                                                className={`px-4 py-2 rounded-md ${selectedStatus === order.orderStatus
                                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed "
                                                    : "bg-teal-600 text-white hover:bg-teal-700 cursor-pointer"
                                                    }`}
                                            >
                                                <span className="flex items-center">
                                                    <Save size={16} className="mr-2" />
                                                    Update
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                    {/* update payment status */}
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900 mb-3">Update Payment Status</h3>
                                        <div className="flex space-x-2">
                                            <select
                                                value={selectedPaymentStatus}
                                                onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            >
                                                <option value="paid">Paid</option>
                                                <option value="pending">Pending</option>
                                                <option value="failed">Failed</option>
                                            </select>
                                            <button
                                                onClick={handlePaymentStatusChange}
                                                disabled={selectedPaymentStatus === order.paymentStatus}
                                                className={`px-4 py-2 rounded-md ${selectedPaymentStatus === order.paymentStatus
                                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                    : "bg-teal-600 text-white hover:bg-teal-700"
                                                    }`}
                                            >
                                                <span className="flex items-center">
                                                    <Save size={16} className="mr-2" />
                                                    Update
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 space-y-4">
                                    <div className="flex items-center">
                                        <div
                                            className={`rounded-full p-2 mr-3 ${order.orderStatus === "processing" ||
                                                order.orderStatus === "shipped" ||
                                                order.orderStatus === "delivered"
                                                ? "bg-green-100 text-green-600"
                                                : "bg-gray-100 text-gray-400"
                                                }`}
                                        >
                                            <Package size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Order Received</p>
                                            <p className="text-xs text-gray-500">Order has been received and is being processed</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div
                                            className={`rounded-full p-2 mr-3 ${order.orderStatus === "shipped" || order.orderStatus === "delivered"
                                                ? "bg-green-100 text-green-600"
                                                : "bg-gray-100 text-gray-400"
                                                }`}
                                        >
                                            <Truck size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Order Shipped</p>
                                            <p className="text-xs text-gray-500">Order has been shipped to the customer</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div
                                            className={`rounded-full p-2 mr-3 ${order.orderStatus === "delivered" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                                                }`}
                                        >
                                            <CheckCircle size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Order Delivered</p>
                                            <p className="text-xs text-gray-500">Order has been delivered to the customer</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 space-y-4">
                                    <div className="flex items-center">
                                        <CreditCard size={16} className="text-gray-500 mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Payment Method</p>
                                            <p className="text-sm text-gray-500">
                                                {order.paymentMethod === "ideal"
                                                    ? "iDEAL"
                                                    : order.paymentMethod === "creditcard"
                                                        ? "Credit Card"
                                                        : order.paymentMethod}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <MapPin size={16} className="text-gray-500 mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Customer</p>
                                            <Link
                                                href={`/admin/customers/${order?.user?._id}`}
                                                className="text-sm text-teal-600 hover:text-teal-700"
                                            >
                                                View Customer Profile
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <EmailHistoryTab orderId={params.id} />
            )}

            {/* Email Modal */}
            <SendEmailModal
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                orderId={params.id}
                orderData={order}
                onEmailSent={handleEmailSent}
            />
        </div>
    )
}
