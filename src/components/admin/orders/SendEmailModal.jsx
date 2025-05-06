"use client"

import { useState } from "react"
import { X } from "lucide-react"
import axiosInstance from "@/utils/axios"
import { toast } from "sonner"

export default function SendEmailModal({ isOpen, onClose, orderId, orderData, onEmailSent }) {
	const [subject, setSubject] = useState("")
	const [message, setMessage] = useState("")
	const [emailType, setEmailType] = useState("other")
	const [sending, setSending] = useState(false)

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (!subject || !message) {
			toast.error("Vul alle velden in")
			return
		}

		setSending(true)

		try {
			await axiosInstance.post("/email/customer-email", {
				name: `${orderData.firstName} ${orderData.lastName}`,
				email: orderData.email,
				subject,
				message,
				site: orderData.site || "https://benzobestellen.com",
				orderId,
			})

			toast.success("Email succesvol verzonden")
			onEmailSent()
			onClose()

			// Reset form
			setSubject("")
			setMessage("")
			setEmailType("other")
		} catch (error) {
			console.error("Error sending email:", error)
			toast.error("Fout bij het verzenden van de email")
		} finally {
			setSending(false)
		}
	}

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
				<div className="flex justify-between items-center border-b px-6 py-4">
					<h2 className="text-xl font-bold">Email verzenden naar klant</h2>
					<button onClick={onClose} className="text-gray-500 hover:text-gray-700">
						<X size={24} />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-6">
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">Email Type</label>
						<select
							value={emailType}
							onChange={(e) => setEmailType(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
						>
							<option value="other">Algemene Communicatie</option>
							<option value="payment_request">Betaalverzoek</option>
							<option value="shipping_update">Verzendupdate</option>
							<option value="order_delivered">Bestelling Geleverd</option>
						</select>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">Aan</label>
						<input
							type="text"
							value={`${orderData.firstName} ${orderData.lastName} <${orderData.email}>`}
							disabled
							className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
						/>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">Onderwerp</label>
						<input
							type="text"
							value={subject}
							onChange={(e) => setSubject(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
							placeholder="Voer onderwerp in"
							required
						/>
					</div>

					<div className="mb-6">
						<label className="block text-sm font-medium text-gray-700 mb-1">Bericht</label>
						<textarea
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 h-32"
							placeholder="Voer uw bericht in"
							required
						/>
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
							disabled={sending}
							className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
						>
							{sending ? "Verzenden..." : "Verzenden"}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
