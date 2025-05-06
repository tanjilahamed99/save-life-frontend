"use client"

import { useState, useEffect } from "react"
import { Mail, Search, ChevronDown, ChevronUp, Calendar, User, Clock, RefreshCw } from "lucide-react"
import axiosInstance from "@/utils/axios"
import { toast } from "sonner"

export default function EmailHistoryTab({ orderId }) {
	const [emails, setEmails] = useState([])
	const [loading, setLoading] = useState(true)
	const [selectedEmail, setSelectedEmail] = useState(null)
	const [searchTerm, setSearchTerm] = useState("")
	const [sortBy, setSortBy] = useState("date")
	const [sortDirection, setSortDirection] = useState("desc")
	const [refreshing, setRefreshing] = useState(false)

	const fetchEmails = async () => {
		try {
			setLoading(true)
			const response = await axiosInstance.get(`/email/history/${orderId}`)
			setEmails(response.data.data || [])
		} catch (error) {
			console.error("Error fetching email history:", error)
			toast.error("Could not load email history")
		} finally {
			setLoading(false)
			setRefreshing(false)
		}
	}

	useEffect(() => {
		fetchEmails()
	}, [orderId])

	const handleRefresh = async () => {
		setRefreshing(true)
		await fetchEmails()
		toast.success("Email history refreshed")
	}

	const handleSort = (field) => {
		if (sortBy === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc")
		} else {
			setSortBy(field)
			setSortDirection("asc")
		}
	}

	const sortedEmails = [...emails].sort((a, b) => {
		if (sortBy === "date") {
			return sortDirection === "asc" ? new Date(a.sentAt) - new Date(b.sentAt) : new Date(b.sentAt) - new Date(a.sentAt)
		} else if (sortBy === "subject") {
			return sortDirection === "asc" ? a.subject.localeCompare(b.subject) : b.subject.localeCompare(a.subject)
		} else if (sortBy === "recipient") {
			return sortDirection === "asc" ? a.recipient.localeCompare(b.recipient) : b.recipient.localeCompare(a.recipient)
		}
		return 0
	})

	const filteredEmails = sortedEmails.filter(
		(email) =>
			email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
			email.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
			email.body.toLowerCase().includes(searchTerm.toLowerCase()),
	)

	const formatDate = (dateString) => {
		const date = new Date(dateString)
		return date.toLocaleDateString("nl-NL", {
			day: "numeric",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		})
	}

	const getEmailTypeLabel = (type) => {
		switch (type) {
			case "payment_request":
				return "Betaalverzoek"
			case "order_confirmation":
				return "Bestelbevestiging"
			case "shipping_update":
				return "Verzendupdate"
			case "order_delivered":
				return "Bestelling Geleverd"
			default:
				return "Notificatie"
		}
	}

	const getEmailTypeColor = (type) => {
		switch (type) {
			case "payment_request":
				return "bg-blue-100 text-blue-800"
			case "order_confirmation":
				return "bg-green-100 text-green-800"
			case "shipping_update":
				return "bg-yellow-100 text-yellow-800"
			case "order_delivered":
				return "bg-purple-100 text-purple-800"
			default:
				return "bg-gray-100 text-gray-800"
		}
	}

	if (loading && !refreshing) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
			</div>
		)
	}

	return (
		<div className="bg-white rounded-lg shadow overflow-hidden">
			<div className="p-4 border-b">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-bold">Email Geschiedenis</h2>
					<div className="flex items-center space-x-2">
						<button
							onClick={handleRefresh}
							className="p-2 rounded-md hover:bg-gray-100 transition-colors"
							disabled={refreshing}
						>
							<RefreshCw size={18} className={`text-gray-600 ${refreshing ? "animate-spin" : ""}`} />
						</button>
						<div className="relative">
							<input
								type="text"
								placeholder="Zoek emails..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
							/>
							<Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
						</div>
					</div>
				</div>
			</div>

			{emails.length === 0 ? (
				<div className="text-center py-12 bg-white">
					<Mail className="mx-auto h-12 w-12 text-gray-400" />
					<h3 className="mt-2 text-lg font-medium text-gray-900">Geen emails gevonden</h3>
					<p className="mt-1 text-sm text-gray-500">Er zijn nog geen emails verzonden voor deze bestelling.</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
					{/* Email List */}
					<div className="col-span-1 border-r overflow-y-auto h-full">
						<div className="sticky top-0 bg-gray-50 p-3 border-b">
							<div className="grid grid-cols-12 text-xs font-medium text-gray-500">
								<div className="col-span-5 flex items-center cursor-pointer" onClick={() => handleSort("subject")}>
									Onderwerp
									{sortBy === "subject" &&
										(sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
								</div>
								<div className="col-span-4 flex items-center cursor-pointer" onClick={() => handleSort("recipient")}>
									Ontvanger
									{sortBy === "recipient" &&
										(sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
								</div>
								<div className="col-span-3 flex items-center cursor-pointer" onClick={() => handleSort("date")}>
									Datum
									{sortBy === "date" && (sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
								</div>
							</div>
						</div>

						<div>
							{filteredEmails.map((email, index) => (
								<div
									key={index}
									className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${selectedEmail === email ? "bg-teal-50" : ""}`}
									onClick={() => setSelectedEmail(email)}
								>
									<div className="grid grid-cols-12 gap-1">
										<div className="col-span-5">
											<div className="font-medium text-sm truncate">{email.subject}</div>
											<div className="text-xs text-gray-500 mt-1">
												<span className={`px-1.5 py-0.5 rounded-full text-xs ${getEmailTypeColor(email.type)}`}>
													{getEmailTypeLabel(email.type)}
												</span>
											</div>
										</div>
										<div className="col-span-4">
											<div className="text-xs text-gray-600 truncate">{email.recipient}</div>
										</div>
										<div className="col-span-3">
											<div className="text-xs text-gray-500">{formatDate(email.sentAt).split(",")[0]}</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Email Content */}
					<div className="col-span-2 overflow-y-auto h-full">
						{selectedEmail ? (
							<div className="p-6">
								<h3 className="text-xl font-bold mb-4">{selectedEmail.subject}</h3>

								<div className="flex items-center mb-4 text-sm text-gray-500">
									<User size={16} className="mr-1" />
									<span className="mr-4">Van: {selectedEmail.sender}</span>
									<User size={16} className="mr-1" />
									<span>Naar: {selectedEmail.recipient}</span>
								</div>

								<div className="flex items-center mb-6 text-sm text-gray-500">
									<Calendar size={16} className="mr-1" />
									<span className="mr-4">{formatDate(selectedEmail.sentAt)}</span>
									<Clock size={16} className="mr-1" />
									<span>{new Date(selectedEmail.sentAt).toLocaleTimeString()}</span>
								</div>

								<div className="border-t pt-4">
									<div className="prose max-w-none">
										<iframe
											srcDoc={selectedEmail.body}
											title="Email Content"
											className="w-full min-h-[400px] border-0"
											sandbox="allow-same-origin"
										></iframe>
									</div>
								</div>
							</div>
						) : (
							<div className="flex items-center justify-center h-full text-gray-500">
								<div className="text-center">
									<Mail className="mx-auto h-12 w-12 text-gray-300" />
									<p className="mt-2">Selecteer een email om de inhoud te bekijken</p>
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	)
}
