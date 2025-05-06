"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ShoppingBag, MapPin, Mail, Phone, Edit, Save, Trash2, ChevronRight } from 'lucide-react'
import { useRouter } from "next/navigation"

export default function CustomerDetails({ customer }) {
	const router = useRouter()
	const [isEditing, setIsEditing] = useState(false)
	const [formData, setFormData] = useState({
		firstName: customer?.firstName || "",
		lastName: customer?.lastName || "",
		email: customer?.email || "",
		phone: customer?.phone || ""
	})
	const [isSaving, setIsSaving] = useState(false)

	const handleInputChange = (e) => {
		const { name, value } = e.target
		setFormData((prev) => ({
			...prev,
			[name]: value
		}))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setIsSaving(true)

		try {
			// In a real app, you would make an API call to update the customer
			await new Promise(resolve => setTimeout(resolve, 800)) // Simulate API delay
			setIsEditing(false)
		} catch (error) {
			console.error("Error updating customer:", error)
		} finally {
			setIsSaving(false)
		}
	}


	if (!customer) {
		return (
			<div className="text-center py-12">
				<h2 className="text-xl font-bold mb-2">Customer not found</h2>
				<p className="text-gray-600 mb-4">The customer you are looking for does not exist.</p>
				<Link
					href="/admin/customers"
					className="text-teal-600 hover:text-teal-700 font-medium flex items-center justify-center"
				>
					<ArrowLeft size={16} className="mr-2" />
					Back to customers
				</Link>
			</div>
		)
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
				<div className="mb-4 sm:mb-0">
					<div className="flex items-center">
						<Link
							href="/admin/customers"
							className="mr-4 text-gray-600 hover:text-gray-900"
						>
							<ArrowLeft size={18} />
						</Link>
						<h1 className="text-2xl font-bold">{customer.firstName} {customer.lastName}</h1>
					</div>
					<p className="text-gray-500 mt-1">
						Customer since {new Date(customer.dateRegistered).toLocaleDateString()}
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Customer Info Card */}
				<div className="md:col-span-2 bg-white rounded-lg shadow overflow-hidden">
					<div className="px-6 py-4 border-b flex items-center justify-between">
						<h2 className="font-bold text-lg">Customer Information</h2>
						{!isEditing ? (
							<button
								onClick={() => setIsEditing(true)}
								className="text-teal-600 hover:text-teal-700"
							>
								<Edit size={16} />
							</button>
						) : null}
					</div>

					{isEditing ? (
						<form onSubmit={handleSubmit} className="p-6">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										First Name
									</label>
									<input
										type="text"
										name="firstName"
										value={formData.firstName}
										onChange={handleInputChange}
										required
										className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Last Name
									</label>
									<input
										type="text"
										name="lastName"
										value={formData.lastName}
										onChange={handleInputChange}
										required
										className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Email Address
									</label>
									<input
										type="email"
										name="email"
										value={formData.email}
										onChange={handleInputChange}
										required
										className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Phone Number
									</label>
									<input
										type="tel"
										name="phone"
										value={formData.phone}
										onChange={handleInputChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
									/>
								</div>
							</div>
							<div className="flex justify-end space-x-2">
								<button
									type="button"
									onClick={() => setIsEditing(false)}
									className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={isSaving}
									className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 flex items-center"
								>
									{isSaving ? (
										<>
											<span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
											Saving...
										</>
									) : (
										<>
											<Save size={16} className="mr-1" />
											Save Changes
										</>
									)}
								</button>
							</div>
						</form>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
							<div>
								<div className="flex items-center text-gray-500 mb-2">
									<Mail size={16} className="mr-2" />
									<span className="text-sm">Email</span>
								</div>
								<a href={`mailto:${customer.email}`} className="text-gray-900 hover:text-teal-600">
									{customer.email}
								</a>
							</div>
							<div>
								<div className="flex items-center text-gray-500 mb-2">
									<Phone size={16} className="mr-2" />
									<span className="text-sm">Phone</span>
								</div>
								<a href={`tel:${customer.phone}`} className="text-gray-900 hover:text-teal-600">
									{customer.phone || "Not provided"}
								</a>
							</div>
							<div>
								<div className="flex items-center text-gray-500 mb-2">
									<MapPin size={16} className="mr-2" />
									<span className="text-sm">Default Shipping Address</span>
								</div>
								<div>
									<p className="text-gray-900">Hoofdstraat 123</p>
									<p className="text-gray-900">1012 AB Amsterdam</p>
									<p className="text-gray-900">Netherlands</p>
								</div>
							</div>
							<div>
								<div className="flex items-center text-gray-500 mb-2">
									<ShoppingBag size={16} className="mr-2" />
									<span className="text-sm">Orders</span>
								</div>
								<p className="text-gray-900">{customer.ordersCount} orders</p>
								<p className="text-gray-900 font-medium">€{customer.totalSpent.toFixed(2)} total spent</p>
							</div>
						</div>
					)}
				</div>

				{/* Stats Card */}
				<div className="bg-white rounded-lg shadow overflow-hidden">
					<div className="px-6 py-4 border-b">
						<h2 className="font-bold text-lg">Activity</h2>
					</div>
					<div className="p-6 space-y-6">
						<div>
							<h3 className="text-sm font-medium text-gray-500 mb-2">Last Order</h3>
							<p className="text-gray-900">{customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : "No orders yet"}</p>
						</div>
						<div>
							<h3 className="text-sm font-medium text-gray-500 mb-2">Average Order Value</h3>
							<p className="text-gray-900">€{customer.ordersCount > 0 ? (customer.totalSpent / customer.ordersCount).toFixed(2) : "0.00"}</p>
						</div>
						<div>
							<h3 className="text-sm font-medium text-gray-500 mb-2">Account Age</h3>
							<p className="text-gray-900">{Math.floor((new Date() - new Date(customer.dateRegistered)) / (1000 * 60 * 60 * 24 * 30))} months</p>
						</div>
					</div>
				</div>
			</div>

			{/* Recent Orders */}
			<div className="bg-white rounded-lg shadow overflow-hidden">
				<div className="px-6 py-4 border-b flex items-center justify-between">
					<h2 className="font-bold text-lg">Recent Orders</h2>
					<Link
						href={`/admin/orders?customer=${customer.id}`}
						className="text-sm text-teal-600 hover:text-teal-700 flex items-center"
					>
						View all
						<ChevronRight size={16} className="ml-1" />
					</Link>
				</div>

				{customer.recentOrders && customer.recentOrders.length > 0 ? (
					<div className="divide-y">
						{customer.recentOrders.map((order) => (
							<div key={order.id} className="px-6 py-4 hover:bg-gray-50">
								<div className="flex justify-between items-center">
									<div>
										<Link
											href={`/admin/orders/${order.id}`}
											className="font-medium text-gray-900 hover:text-teal-600"
										>
											Order #{order.orderNumber}
										</Link>
										<div className="text-sm text-gray-500 mt-1">
											{new Date(order.date).toLocaleDateString()}
										</div>
									</div>

									<div className="text-right">
										<div className="font-medium">€{order.total.toFixed(2)}</div>
										<div>
											{order.status === 'processing' && (
												<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
													Processing
												</span>
											)}
											{order.status === 'shipped' && (
												<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
													Shipped
												</span>
											)}
											{order.status === 'delivered' && (
												<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
													Delivered
												</span>
											)}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="p-6 text-center">
						<ShoppingBag size={32} className="mx-auto text-gray-300 mb-2" />
						<p className="text-gray-600">This customer has no orders yet.</p>
					</div>
				)}

				{customer.recentOrders && customer.recentOrders.length > 0 && (
					<div className="px-6 py-4 bg-gray-50 flex justify-center">
						<Link
							href={`/admin/orders?customer=${customer.id}`}
							className="text-sm text-teal-600 hover:text-teal-700 flex items-center"
						>
							View all
							<ChevronRight size={16} className="ml-1" />
						</Link>
					</div>
				)}
			</div>
		</div>
	)
}