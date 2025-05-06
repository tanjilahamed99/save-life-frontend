"use client"

import { useState } from "react"
import {
	ArrowUpRight,
	ArrowDownLeft,
	ShoppingBag,
	Calendar,
	Clock,
	XCircle,
	AlertTriangle,
	Search,
	Filter,
} from "lucide-react"
import Link from "next/link"

export default function TransactionHistory({ transactions }) {
	const [searchTerm, setSearchTerm] = useState("")
	const [filter, setFilter] = useState("all")

	// Format date
	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("nl-NL", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		})
	}

	// Filter transactions
	const filteredTransactions = transactions.filter((transaction) => {
		// Apply type filter
		if (filter !== "all" && transaction.type !== filter) {
			return false
		}

		// Apply search filter (search in description, reference, or amount)
		if (searchTerm) {
			const searchLower = searchTerm.toLowerCase()
			return (
				(transaction.description && transaction.description.toLowerCase().includes(searchLower)) ||
				(transaction.reference && transaction.reference.toLowerCase().includes(searchLower)) ||
				transaction.amount.toString().includes(searchLower)
			)
		}

		return true
	})

	// Get transaction icon
	const getTransactionIcon = (transaction) => {
		const { type, status } = transaction

		if (status === "failed" || status === "cancelled") {
			return <XCircle className="text-red-500" />
		}

		if (status === "pending") {
			return <Clock className="text-yellow-500" />
		}

		switch (type) {
			case "deposit":
				return <ArrowDownLeft className="text-green-500" />
			case "withdrawal":
				return <ArrowUpRight className="text-red-500" />
			case "order_payment":
				return <ShoppingBag className="text-blue-500" />
			default:
				return <AlertTriangle className="text-gray-500" />
		}
	}

	// Get transaction status badge
	const getStatusBadge = (status) => {
		const statusMap = {
			pending: "bg-yellow-100 text-yellow-800",
			completed: "bg-green-100 text-green-800",
			failed: "bg-red-100 text-red-800",
			cancelled: "bg-gray-100 text-gray-800",
		}

		return (
			<span
				className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusMap[status] || "bg-gray-100 text-gray-800"}`}
			>
				{status === "completed"
					? "Voltooid"
					: status === "pending"
						? "In behandeling"
						: status === "failed"
							? "Mislukt"
							: status === "cancelled"
								? "Geannuleerd"
								: status}
			</span>
		)
	}

	// Get transaction type label
	const getTypeLabel = (type) => {
		switch (type) {
			case "deposit":
				return "Storting"
			case "withdrawal":
				return "Opname"
			case "order_payment":
				return "Bestelling"
			default:
				return type
		}
	}

	return (
		<div className="space-y-6">
			<div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
				<div className="p-5 sm:p-6 border-b border-gray-100">
					<h2 className="text-lg font-bold text-gray-900">Transactiegeschiedenis</h2>
					<p className="text-sm text-gray-600 mt-1">Bekijk al je wallet transacties</p>
				</div>

				{/* Filters */}
				<div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-4">
					<div className="relative flex-grow">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Search size={18} className="text-gray-400" />
						</div>

						<input
							type="text"
							placeholder="Zoek transacties..."
							className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
					<div className="flex items-center gap-2">
						<div className="flex items-center">
							<Filter size={18} className="text-gray-400 mr-2" />
							<select
								className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
								value={filter}
								onChange={(e) => setFilter(e.target.value)}
							>
								<option value="all">Alle transacties</option>
								<option value="deposit">Stortingen</option>
								<option value="withdrawal">Opnames</option>
								<option value="order_payment">Bestellingen</option>
							</select>
						</div>
					</div>
				</div>

				{/* Transactions List */}
				{filteredTransactions.length === 0 ? (
					<div className="p-12 text-center">
						<div className="bg-gray-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
							<Clock size={40} className="text-gray-300" />
						</div>
						<h3 className="text-lg font-medium text-gray-900 mb-2">Geen transacties gevonden</h3>
						<p className="text-gray-600 max-w-md mx-auto mb-6">
							{searchTerm || filter !== "all"
								? "Er zijn geen transacties die overeenkomen met je zoekopdracht of filter."
								: "Je hebt nog geen transacties. Stort geld op je wallet om te beginnen."}
						</p>
					</div>
				) : (
					<ul className="divide-y divide-gray-100">
						{filteredTransactions.map((transaction) => (
							<li key={transaction._id} className="p-5 sm:p-6 hover:bg-gray-50 transition-colors">
								<div className="flex items-start gap-4">
									<div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
										{getTransactionIcon(transaction)}
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
											<h3 className="font-medium text-gray-900 truncate">
												{transaction.description || getTypeLabel(transaction.type)}
											</h3>
											{getStatusBadge(transaction.status)}
										</div>
										<div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
											<div className="flex items-center">
												<Calendar size={14} className="mr-1.5" />
												{formatDate(transaction.createdAt)}
											</div>
											{transaction.reference && (
												<div className="flex items-center">
													<span className="text-gray-500">Ref:</span>
													<span className="ml-1">{transaction.reference}</span>
												</div>
											)}
											{transaction.orderId && (
												<Link
													href={`/dashboard/orders/${transaction.orderId._id}`}
													className="flex items-center text-teal-600 hover:text-teal-700"
												>
													<ShoppingBag size={14} className="mr-1.5" />
													Bestelling bekijken
												</Link>
											)}
										</div>
									</div>
									<div className="text-right">
										<span
											className={`text-lg font-medium ${transaction.type === "order_payment" ? "text-red-600" : "text-green-600"}`}
										>
											{transaction.type === "order_payment" ? "-" : "+"} €{transaction.amount.toFixed(2)}
										</span>
										{transaction.paymentMethod && (
											<div className="text-xs text-gray-500 mt-1">via {transaction.paymentMethod}</div>
										)}
									</div>
								</div>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	)
}
