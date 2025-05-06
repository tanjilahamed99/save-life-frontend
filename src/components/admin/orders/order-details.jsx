"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Download, Edit, CheckCircle } from 'lucide-react'
import { useRouter } from "next/navigation"

export default function OrderDetails({ order }) {
	const router = useRouter()
	const [currentStatus, setCurrentStatus] = useState(order.status)
	const [isUpdating, setIsUpdating] = useState(false)
	const [showStatusForm, setShowStatusForm] = useState(false)

	const handleStatusChange = async (e) => {
		e.preventDefault()
		const newStatus = e.target.status.value

		if (newStatus !== currentStatus) {
			setIsUpdating(true)

			try {
				// In a real app, you would make an API call to update the status
				await new Promise(resolve => setTimeout(resolve, 800)) // Simulate API delay
				setCurrentStatus(newStatus)
			} catch (error) {
				console.error("Error updating order status:", error)
			} finally {
				setIsUpdating(false)
				setShowStatusForm(false)
			}
		} else {
			setShowStatusForm(false)
		}
	}

	if (!order) {
		return (
			<div className="text-center py-12">
				<h2 className="text-xl font-bold mb-2">Order not found</h2>
				<p className="text-gray-600 mb-4">The order you are looking for does not exist.</p>
				<Link
					href="/admin/orders"
					className="text-teal-600 hover:text-teal-700 font-medium flex items-center justify-center"
				>
					<ArrowLeft size={16} className="mr-2" />
					Back to orders
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
							href="/admin/orders"
							className="mr-4 text-gray-600 hover:text-gray-900"
						>
							<ArrowLeft size={18} />
						</Link>
						<h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
					</div>
					<p className="text-gray-500 mt-1">
						Placed on {new Date(order.date).toLocaleString()}
					</p>
				</div>
				<div className="flex flex-col sm:flex-row gap-2">
					<button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
						<Download size={16} className="mr-2" />
						Invoice
					</button>
				</div>
			</div>

			{/* Order Summary Card */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="bg-white rounded-lg shadow p-6">
					<h2 className="font-bold text-gray-700 mb-2">Order Status</h2>
					<div className="flex items-center justify-between">
						<div>
							{currentStatus === 'processing' && (
								<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
									Processing
								</span>
							)}
							{currentStatus === 'shipped' && (
								<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
									Shipped
								</span>
							)}
							{currentStatus === 'delivered' && (
								<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
									Delivered
								</span>
							)}
						</div>
						{!showStatusForm && (
							<button
								onClick={() => setShowStatusForm(true)}
								className="text-teal-600 hover:text-teal-700"
							>
								<Edit size={16} />
							</button>
						)}
					</div>

					{showStatusForm && (
						<form onSubmit={handleStatusChange} className="mt-2">
							<select
								name="status"
								defaultValue={currentStatus}
								className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm mb-2"
							>
								<option value="processing">Processing</option>
								<option value="shipped">Shipped</option>
								<option value="delivered">Delivered</option>
							</select>
							<div className="flex justify-end space-x-2">
								<button
									type="button"
									onClick={() => setShowStatusForm(false)}
									className="px-2 py-1 text-xs text-gray-600 hover:text-gray-900"
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={isUpdating}
									className="px-2 py-1 text-xs bg-teal-600 text-white rounded hover:bg-teal-700 flex items-center"
								>
									{isUpdating ? (
										<>
											<span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full mr-1"></span>
											Updating...
										</>
									) : (
										<>
											<CheckCircle size={14} className="mr-1" />
											Save
										</>
									)}
								</button>
							</div>
						</form>
					)}
				</div>
				<div className="bg-white rounded-lg shadow p-6">
					<h2 className="font-bold text-gray-700 mb-2">Customer</h2>
					<p className="text-gray-600">Jan Jansen</p>
					<p className="text-gray-600 text-sm mt-1">jan.jansen@example.com</p>
					<p className="text-gray-600 text-sm">+31 6 12345678</p>
				</div>
				<div className="bg-white rounded-lg shadow p-6">
					<h2 className="font-bold text-gray-700 mb-2">Shipping Address</h2>
					<p className="text-gray-600">Jan Jansen</p>
					<p className="text-gray-600 text-sm">Hoofdstraat 123</p>
					<p className="text-gray-600 text-sm">1012 AB Amsterdam</p>
					<p className="text-gray-600 text-sm">Netherlands</p>
				</div>
				<div className="bg-white rounded-lg shadow p-6">
					<h2 className="font-bold text-gray-700 mb-2">Payment</h2>
					<p className="text-gray-600">Bank Transfer</p>
					<p className="text-gray-600 text-sm mt-1">Paid</p>
					<p className="font-medium text-lg mt-2">€{order.total.toFixed(2)}</p>
				</div>
			</div>

			{/* Order Items */}
			<div className="bg-white rounded-lg shadow overflow-hidden">
				<div className="px-6 py-4 border-b">
					<h2 className="text-lg font-bold">Order Items</h2>
				</div>
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Product
								</th>
								<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Price
								</th>
								<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Quantity
								</th>
								<th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									Total
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{order.items.map((item, index) => (
								<tr key={index}>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="h-10 w-10 relative flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
												<Image
													src={item.image || "/placeholder.svg?height=80&width=80"}
													alt={item.name}
													fill
													loading="lazy"
													className="object-contain"
												/>
											</div>
											<div className="ml-4">
												<div className="text-sm font-medium text-gray-900">{item.name}</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										€{item.price.toFixed(2)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{item.quantity}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										€{(item.price * item.quantity).toFixed(2)}
									</td>
								</tr>
							))}
						</tbody>
						<tfoot className="bg-gray-50">
							<tr>
								<td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-500">
									Subtotal
								</td>
								<td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
									€{(order.total - 4.95).toFixed(2)}
								</td>
							</tr>
							<tr>
								<td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-500">
									Shipping
								</td>
								<td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
									€4.95
								</td>
							</tr>
							<tr>
								<td colSpan="3" className="px-6 py-4 text-right text-sm font-bold text-gray-900">
									Total
								</td>
								<td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
									€{order.total.toFixed(2)}
								</td>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>
		</div>
	)
}
