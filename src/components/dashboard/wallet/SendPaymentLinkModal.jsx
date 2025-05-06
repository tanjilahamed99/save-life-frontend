"use client"

import { useState, useEffect } from "react"
import { X, Send, Calendar, Link } from "lucide-react"
import axiosInstance from "@/utils/axios"

export default function SendPaymentLinkModal({ isOpen, onClose, transaction, onSuccess }) {
	const [formData, setFormData] = useState({
		payment_url: "",
		expiry_date: "",
	})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")

	useEffect(() => {
		if (isOpen && transaction) {
			// Set default expiry date to 3 days from now
			const expiryDate = new Date()
			expiryDate.setDate(expiryDate.getDate() + 3)

			setFormData({
				payment_url: "",
				expiry_date: expiryDate.toISOString().split("T")[0],
			})
		}
	}, [isOpen, transaction])

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError("")

		if (!formData.payment_url) {
			setError("Betalingslink is verplicht")
			return
		}

		if (!formData.expiry_date) {
			setError("Vervaldatum is verplicht")
			return
		}

		try {
			setLoading(true)

			// Send payment link email
			const response = await axiosInstance.post("/emails/payment-link", {
				transactionId: transaction._id,
				email: transaction.email,
				payment_url: formData.payment_url,
				expiry_date: formData.expiry_date,
				amount: transaction.amount,
				date: new Date().toISOString(),
			})

			if (response.data.status) {
				onSuccess("Betalingslink succesvol verzonden")
				onClose()
			} else {
				setError(response.data.message || "Er is een fout opgetreden bij het verzenden van de betalingslink")
			}
		} catch (error) {
			console.error("Error sending payment link:", error)
			setError("Er is een fout opgetreden bij het verzenden van de betalingslink")
		} finally {
			setLoading(false)
		}
	}

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-lg shadow-xl w-full max-w-md">
				<div className="flex items-center justify-between p-6 border-b">
					<h3 className="text-lg font-medium">Betalingslink verzenden</h3>
					<button onClick={onClose} className="text-gray-400 hover:text-gray-500">
						<X size={20} />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-6">
					{error && (
						<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
							<p className="text-red-700 text-sm">{error}</p>
						</div>
					)}

					<div className="mb-6">
						<div className="flex items-center justify-between mb-2">
							<label htmlFor="payment_url" className="block text-sm font-medium text-gray-700">
								Betalingslink *
							</label>
						</div>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Link size={16} className="text-gray-400" />
							</div>
							<input
								type="url"
								id="payment_url"
								name="payment_url"
								placeholder="https://payment.example.com/..."
								className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
								value={formData.payment_url}
								onChange={handleChange}
								required
							/>
						</div>
						<p className="mt-1 text-sm text-gray-500">Voer de betalingslink in die naar de klant wordt verzonden</p>
					</div>

					<div className="mb-6">
						<div className="flex items-center justify-between mb-2">
							<label htmlFor="expiry_date" className="block text-sm font-medium text-gray-700">
								Vervaldatum *
							</label>
						</div>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Calendar size={16} className="text-gray-400" />
							</div>
							<input
								type="date"
								id="expiry_date"
								name="expiry_date"
								className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
								value={formData.expiry_date}
								onChange={handleChange}
								required
							/>
						</div>
						<p className="mt-1 text-sm text-gray-500">De betalingslink is geldig tot deze datum</p>
					</div>

					<div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
						<h4 className="font-medium text-blue-800 mb-2">Transactie details</h4>
						<div className="grid grid-cols-2 gap-2 text-sm">
							<div className="text-gray-600">Klant:</div>
							<div className="font-medium">{transaction?.email}</div>
							<div className="text-gray-600">Bedrag:</div>
							<div className="font-medium">€{transaction?.amount?.toFixed(2)}</div>
							<div className="text-gray-600">Betaalmethode:</div>
							<div className="font-medium">{transaction?.paymentMethod}</div>
							<div className="text-gray-600">Referentie:</div>
							<div className="font-medium">{transaction?.reference}</div>
						</div>
					</div>

					<div className="flex justify-end space-x-3">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
						>
							Annuleren
						</button>
						<button
							type="submit"
							disabled={loading}
							className={`px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center ${loading ? "opacity-70 cursor-not-allowed" : ""
								}`}
						>
							{loading ? (
								<>
									<svg
										className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									Verzenden...
								</>
							) : (
								<>
									<Send size={16} className="mr-2" />
									Verzenden
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
