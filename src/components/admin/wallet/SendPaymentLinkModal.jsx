"use client"

import { useState } from "react"
import { X } from "lucide-react"
import axiosInstance from "@/utils/axios"
import { toast } from "react-toastify"

const SendPaymentLinkModal = ({ isOpen, transaction, onClose, onSuccess }) => {
	const [paymentUrl, setPaymentUrl] = useState("")
	const [expiryDate, setExpiryDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0])
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState("")

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError("")

		if (!paymentUrl) {
			setError("Betaal URL is verplicht")
			return
		}

		try {
			setIsSubmitting(true)
			const response = await axiosInstance.post("/wallet/send-payment-link", {
				transactionId: transaction._id,
				payment_url: paymentUrl,
				expiry_date: expiryDate,
			})

			if (response.data.status) {
				toast.success("Betaallink succesvol verzonden")
				onSuccess()
				onClose()
			} else {
				setError(response.data.message || "Er is een fout opgetreden")
			}
		} catch (error) {
			console.error("Error sending payment link:", error)
			setError(error.response?.data?.message || "Er is een fout opgetreden bij het verzenden van de betaallink")
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<>
			{
				isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 w-full max-w-md">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-bold">Betaallink verzenden</h2>
							<button onClick={onClose} className="text-gray-500 hover:text-gray-700">
								<X size={20} />
							</button>
						</div>

						{error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">{error}</div>}

						<form onSubmit={handleSubmit}>
							<div className="mb-4">
								<p className="text-sm text-gray-600 mb-2">Transactie: {transaction?.reference || transaction?._id}</p>
								<p className="text-sm text-gray-600 mb-2">Klant: {transaction?.email}</p>
								<p className="text-sm text-gray-600 mb-2">Bedrag: €{transaction?.amount.toFixed(2)}</p>
								<p className="text-sm text-gray-600 mb-4">Betaalmethode: {transaction?.paymentMethod}</p>
							</div>

							<div className="mb-4">
								<label htmlFor="paymentUrl" className="block text-sm font-medium text-gray-700 mb-1">
									Betaal URL *
								</label>
								<input
									type="url"
									id="paymentUrl"
									value={paymentUrl}
									onChange={(e) => setPaymentUrl(e.target.value)}
									placeholder="https://payment.provider.com/link"
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
									required
								/>
							</div>

							<div className="mb-6">
								<label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
									Vervaldatum
								</label>
								<input
									type="date"
									id="expiryDate"
									value={expiryDate}
									onChange={(e) => setExpiryDate(e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
								/>
								<p className="text-xs text-gray-500 mt-1">De betaallink verloopt op deze datum. Standaard 24 uur geldig.</p>
							</div>

							<div className="flex justify-end space-x-3">
								<button
									type="button"
									onClick={onClose}
									className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
								>
									Annuleren
								</button>
								<button
									type="submit"
									disabled={isSubmitting}
									className={`px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
										}`}
								>
									{isSubmitting ? "Verzenden..." : "Verzenden"}
								</button>
							</div>
						</form>
					</div>
				</div>
			}
		</>
	)
}

export default SendPaymentLinkModal
