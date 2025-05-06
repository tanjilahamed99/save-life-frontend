"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ticketApi } from "@/utils/api"
import { Clock, Send, User } from 'lucide-react'
import { useAuth } from "@/context/AuthContext"

export default function AdminTicketDetailPage() {
	const { id } = useParams()
	const router = useRouter()
	const { user } = useAuth()
	const [ticket, setTicket] = useState(null)
	const [loading, setLoading] = useState(true)
	const [newResponse, setNewResponse] = useState("")
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState("")
	const [updatingStatus, setUpdatingStatus] = useState(false)

	useEffect(() => {
		const fetchTicket = async () => {
			try {
				setLoading(true)
				const response = await ticketApi.getTicketById(id)
				setTicket(response.data)
			} catch (error) {
				console.error("Error fetching ticket:", error)
				setError("Kon ticket niet laden. Probeer het later opnieuw.")
			} finally {
				setLoading(false)
			}
		}

		if (id) {
			fetchTicket()
		}
	}, [id])

	const handleSubmitResponse = async (e) => {
		e.preventDefault()

		if (!newResponse.trim()) {
			return
		}

		try {
			setSubmitting(true)

			const responseData = {
				message: newResponse,
				isAdmin: true, // Admin response
			}

			const response = await ticketApi.addTicketResponse(id, responseData)
			setTicket(response.data)
			setNewResponse("")
		} catch (error) {
			console.error("Error adding response:", error)
			setError("Kon reactie niet toevoegen. Probeer het later opnieuw.")
		} finally {
			setSubmitting(false)
		}
	}

	const handleUpdateStatus = async (newStatus) => {
		try {
			setUpdatingStatus(true)
			const response = await ticketApi.updateTicketStatus(id, newStatus)
			setTicket(response.data)
		} catch (error) {
			console.error("Error updating ticket status:", error)
			setError("Kon ticket status niet bijwerken. Probeer het later opnieuw.")
		} finally {
			setUpdatingStatus(false)
		}
	}

	const handleDeleteTicket = async () => {
		if (
			!window.confirm("Weet je zeker dat je dit ticket wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.")
		) {
			return
		}

		try {
			await ticketApi.deleteTicket(id)
			router.push("/admin/tickets")
		} catch (error) {
			console.error("Error deleting ticket:", error)
			setError("Kon ticket niet verwijderen. Probeer het later opnieuw.")
		}
	}
	// Format date
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

	// Get status badge color
	const getStatusColor = (status) => {
		switch (status) {
			case "open":
				return "bg-blue-100 text-blue-800"
			case "in-progress":
				return "bg-yellow-100 text-yellow-800"
			case "resolved":
				return "bg-green-100 text-green-800"
			case "closed":
				return "bg-gray-100 text-gray-800"
			default:
				return "bg-gray-100 text-gray-800"
		}
	}

	// Get priority badge color - FIXED FUNCTION
	const getPriorityColor = (priority) => {
		switch (priority) {
			case "low":
				return "bg-green-100 text-green-800"
			case "medium":
				return "bg-blue-100 text-blue-800"
			case "high":
				return "bg-orange-100 text-orange-800"
			case "urgent":
				return "bg-red-100 text-red-800"
			default:
				return "bg-blue-100 text-blue-800"
		}
	}

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="bg-white rounded-lg shadow-sm p-6">
				<div className="text-center py-8">
					<p className="text-red-500 mb-4">{error}</p>
					<button
						onClick={() => router.push("/admin/tickets")}
						className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
					>
						Terug naar Tickets
					</button>
				</div>
			</div>
		)
	}

	if (!ticket) {
		return (
			<div className="bg-white rounded-lg shadow-sm p-6">
				<div className="text-center py-8">
					<p className="text-gray-500 mb-4">Ticket niet gevonden</p>
					<button
						onClick={() => router.push("/admin/tickets")}
						className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
					>
						Terug naar Tickets
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className="bg-white rounded-lg shadow-sm p-6">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
				<h1 className="text-2xl font-bold">{ticket.subject}</h1>
				<div className="mt-2 md:mt-0 flex items-center space-x-2">
					<span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
						{ticket.status === "open" && "Open"}
						{ticket.status === "in-progress" && "In behandeling"}
						{ticket.status === "resolved" && "Opgelost"}
						{ticket.status === "closed" && "Gesloten"}
					</span>
					<span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(ticket.priority)}`}>
						{ticket.priority === "low" && "Laag"}
						{ticket.priority === "medium" && "Gemiddeld"}
						{ticket.priority === "high" && "Hoog"}
						{ticket.priority === "urgent" && "Urgent"}
					</span>
				</div>
			</div>

			<div className="flex flex-col md:flex-row items-start md:items-center text-sm text-gray-500 mb-6 space-y-2 md:space-y-0 md:space-x-4">
				<div className="flex items-center">
					<User size={16} className="mr-1" />
					<span>
						{user?.name} ({user?.email})
					</span>
				</div>
				<div className="flex items-center">
					<Clock size={16} className="mr-1" />
					<span>Aangemaakt op {formatDate(ticket.createdAt)}</span>
				</div>
			</div>

			<div className="mb-6">
				<label className="block text-sm font-medium text-gray-700 mb-1">Status wijzigen</label>
				<div className="flex flex-wrap gap-2">
					<button
						onClick={() => handleUpdateStatus("open")}
						disabled={ticket.status === "open" || updatingStatus}
						className={`px-3 py-1 text-sm rounded-md ${ticket.status === "open"
							? "bg-blue-100 text-blue-800"
							: "bg-gray-100 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
							} ${updatingStatus ? "opacity-50 cursor-not-allowed" : ""}`}
					>
						Open
					</button>
					<button
						onClick={() => handleUpdateStatus("in-progress")}
						disabled={ticket.status === "in-progress" || updatingStatus}
						className={`px-3 py-1 text-sm rounded-md ${ticket.status === "in-progress"
							? "bg-yellow-100 text-yellow-800"
							: "bg-gray-100 text-gray-800 hover:bg-yellow-50 hover:text-yellow-600"
							} ${updatingStatus ? "opacity-50 cursor-not-allowed" : ""}`}
					>
						In behandeling
					</button>
					<button
						onClick={() => handleUpdateStatus("resolved")}
						disabled={ticket.status === "resolved" || updatingStatus}
						className={`px-3 py-1 text-sm rounded-md ${ticket.status === "resolved"
							? "bg-green-100 text-green-800"
							: "bg-gray-100 text-gray-800 hover:bg-green-50 hover:text-green-600"
							} ${updatingStatus ? "opacity-50 cursor-not-allowed" : ""}`}
					>
						Opgelost
					</button>
					<button
						onClick={() => handleUpdateStatus("closed")}
						disabled={ticket.status === "closed" || updatingStatus}
						className={`px-3 py-1 text-sm rounded-md ${ticket.status === "closed" ? "bg-gray-100 text-gray-800" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
							} ${updatingStatus ? "opacity-50 cursor-not-allowed" : ""}`}
					>
						Gesloten
					</button>
				</div>
			</div>

			<div className="border-t pt-4">
				<div className="bg-gray-50 p-4 rounded-lg mb-6">
					<div className="flex justify-between items-start mb-2">
						<div className="font-medium">
							{user?.name}
						</div>
						<div className="text-xs text-gray-500">{formatDate(ticket.createdAt)}</div>
					</div>
					<p className="text-gray-700 whitespace-pre-wrap">{ticket.message}</p>
				</div>

				{ticket.responses && ticket.responses.length > 0 && (
					<div className="space-y-6">
						{ticket.responses.map((response, index) => (
							<div key={index} className={`p-4 rounded-lg ${response.isAdmin ? "bg-teal-50 ml-4" : "bg-gray-50 mr-4"}`}>
								<div className="flex justify-between items-start mb-2">
									<div className="font-medium">
										{response.isAdmin ? "Het supportteam" : `${user?.name}`}
									</div>
									<div className="text-xs text-gray-500">{formatDate(response.createdAt)}</div>
								</div>
								<p className="text-gray-700 whitespace-pre-wrap">{response.message}</p>
							</div>
						))}
					</div>
				)}
			</div>

			{ticket.status !== "closed" && (
				<div className="mt-8">
					<form onSubmit={handleSubmitResponse}>
						<div className="mb-4">
							<label htmlFor="response" className="block text-sm font-medium text-gray-700 mb-1">
								Jouw reactie
							</label>
							<textarea
								id="response"
								rows="4"
								value={newResponse}
								onChange={(e) => setNewResponse(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
								placeholder="Typ je reactie hier..."
								disabled={ticket.status === "closed"}
							></textarea>
						</div>

						<div className="flex justify-between">
							<button
								type="button"
								onClick={handleDeleteTicket}
								className="px-4 py-2 text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
							>
								Ticket Verwijderen
							</button>
							<button
								type="submit"
								className={`px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center ${submitting ? "opacity-70 cursor-not-allowed" : ""
									}`}
								disabled={submitting || !newResponse.trim() || ticket.status === "closed"}
							>
								<Send size={16} className="mr-2" />
								{submitting ? "Verzenden..." : "Verstuur"}
							</button>
						</div>
					</form>
				</div>
			)}

			{ticket.status === "closed" && (
				<div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
					<p className="text-gray-700">Dit ticket is gesloten.</p>
					<div className="mt-4 flex justify-center space-x-4">
						<button
							onClick={() => handleUpdateStatus("open")}
							className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
						>
							Ticket Heropenen
						</button>
						<button
							onClick={handleDeleteTicket}
							className="px-4 py-2 text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
						>
							Ticket Verwijderen
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
