"use client"

import { useState } from "react"
import { Wallet, PlusCircle, ArrowDownLeft, ArrowUpRight, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function WalletOverview({ wallet, transactions, onDeposit }) {
	const [showBalance, setShowBalance] = useState(true)
	console.log({ transactions })
	// If wallet data is not available yet
	if (!transactions) {
		return (
			<div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
				<div className="p-5 sm:p-6 border-b border-gray-100">
					<h2 className="text-lg font-bold text-gray-900">Wallet Overzicht</h2>
					<p className="text-sm text-gray-600 mt-1">Beheer je wallet saldo</p>
				</div>
				<div className="p-12 text-center">
					<div className="bg-gray-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
						<Wallet size={40} className="text-gray-300" />
					</div>
					<h3 className="text-lg font-medium text-gray-900 mb-2">Wallet wordt aangemaakt</h3>
					<p className="text-gray-600 max-w-md mx-auto mb-6">
						Je wallet wordt momenteel aangemaakt. Dit kan enkele ogenblikken duren.
					</p>
				</div>
			</div>
		)
	}

	// Format date
	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("nl-NL", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		})
	}

	// Get transaction icon
	const getTransactionIcon = (type) => {
		switch (type) {
			case "deposit":
				return <ArrowDownLeft className="text-green-500" />
			case "withdrawal":
				return <ArrowUpRight className="text-red-500" />
			case "order_payment":
				return <ShoppingBag className="text-blue-500" />
			default:
				return <ArrowDownLeft className="text-green-500" />
		}
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
			{/* Balance Card */}
			<div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
				<div className="p-5 sm:p-6 border-b border-gray-100">
					<h2 className="text-lg font-bold text-gray-900">Wallet Overzicht</h2>
					<p className="text-sm text-gray-600 mt-1">Beheer je wallet saldo</p>
				</div>

				<div className="p-5 sm:p-6">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
						<div>
							<div className="flex items-center gap-2 mb-2">
								<h3 className="text-sm font-medium text-gray-500">Beschikbaar saldo</h3>
								<button
									onClick={() => setShowBalance(!showBalance)}
									className="text-gray-400 hover:text-gray-600"
									aria-label={showBalance ? "Verberg saldo" : "Toon saldo"}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="w-4 h-4"
									>
										{showBalance ? (
											<>
												<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
												<path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
												<path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
												<line x1="2" x2="22" y1="2" y2="22" />
											</>
										) : (
											<>
												<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
												<circle cx="12" cy="12" r="3" />
											</>
										)}
									</svg>
								</button>
							</div>
							<div className="flex items-baseline">
								<span className="text-3xl font-bold text-gray-900">
									{showBalance ? `€${wallet.balance.toFixed(2)}` : "••••••"}
								</span>
								<span className="ml-2 text-sm text-gray-500">EUR</span>
							</div>
							<p className="text-sm text-gray-500 mt-2">Wallet aangemaakt op {formatDate(wallet.createdAt)}</p>
						</div>

						<div className="flex flex-col sm:flex-row gap-3">
							<button
								onClick={onDeposit}
								className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
							>
								<PlusCircle size={16} className="mr-2" />
								Geld storten
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Recent Transactions */}
			<div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
				<div className="p-5 sm:p-6 border-b border-gray-100">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-bold text-gray-900">Recente Transacties</h2>
						<Link
							href="#"
							onClick={(e) => {
								e.preventDefault()
								onDeposit && onDeposit("transactions")
							}}
							className="text-sm font-medium text-teal-600 hover:text-teal-700"
						>
							Alles bekijken
						</Link>
					</div>
				</div>

				{transactions && transactions.length > 0 ? (
					<ul className="divide-y divide-gray-100">
						{transactions.slice(0, 5).map((transaction) => (
							<li key={transaction._id} className="p-4 hover:bg-gray-50 transition-colors">
								<div className="flex items-center gap-4">
									<div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
										{getTransactionIcon(transaction.type)}
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900 truncate">
											{transaction.description || getTypeLabel(transaction.type)}
										</p>
										<p className="text-sm text-gray-500 truncate">
											{formatDate(transaction.createdAt)}
											{transaction.reference && ` • Ref: ${transaction.reference}`}
										</p>
									</div>
									<div className="text-right">
										<span
											className={`text-sm font-medium ${transaction.type === "order_payment" ? "text-red-600" : "text-green-600"
												}`}
										>
											{transaction.type === "order_payment" ? "-" : "+"} €{transaction.amount.toFixed(2)}
										</span>
									</div>
								</div>
							</li>
						))}
					</ul>
				) : (
					<div className="p-8 text-center">
						<div className="bg-gray-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
							<ShoppingBag size={32} className="text-gray-300" />
						</div>
						<h3 className="text-base font-medium text-gray-900 mb-1">Geen recente transacties</h3>
						<p className="text-sm text-gray-500 mb-4">Je hebt nog geen transacties uitgevoerd met je wallet.</p>
						<button
							onClick={onDeposit}
							className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
						>
							<PlusCircle size={16} className="mr-2" />
							Geld storten
						</button>
					</div>
				)}
			</div>

			{/* How to use wallet */}
			<div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
				<div className="p-5 sm:p-6 border-b border-gray-100">
					<h2 className="text-lg font-bold text-gray-900">Hoe werkt mijn wallet?</h2>
				</div>
				<div className="p-5 sm:p-6">
					<div className="grid gap-6 md:grid-cols-2">
						<div className="flex flex-col items-center text-center">
							<div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
								<PlusCircle size={24} className="text-teal-600" />
							</div>
							<h3 className="text-base font-medium text-gray-900 mb-2">Geld storten</h3>
							<p className="text-sm text-gray-500">
								Stort geld op je wallet via iDEAL of creditcard om snel en eenvoudig te kunnen betalen.
							</p>
						</div>

						<div className="flex flex-col items-center text-center">
							<div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
								<ShoppingBag size={24} className="text-teal-600" />
							</div>
							<h3 className="text-base font-medium text-gray-900 mb-2">Betaal voor bestellingen</h3>
							<p className="text-sm text-gray-500">
								Gebruik je wallet saldo om snel en veilig te betalen voor je bestellingen.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
