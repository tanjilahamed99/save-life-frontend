"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { ticketApi } from "@/utils/api"
import { Clock, Filter, Plus, Search } from "lucide-react"
import useMobile from "@/hooks/use-mobile"
import DashboardLayout from "@/components/dashboard/dashboard-layout"

export default function TicketsPageClient() {
	const { user } = useAuth()
	const router = useRouter()
	const isMobile = useMobile()
	const [tickets, setTickets] = useState([])
	const [loading, setLoading] = useState(true)
	const [searchTerm, setSearchTerm] = useState("")
	const [statusFilter, setStatusFilter] = useState("all")

	useEffect(() => {
		const fetchTickets = async () => {
			if (!user?._id) return

			try {
				setLoading(true)
				const response = await ticketApi.getTicketsByUser(user._id)
				setTickets(response.data)
			} catch (error) {
				console.error("Error fetching tickets:", error)
			} finally {
				setLoading(false)
			}
		}

		fetchTickets()
	}, [user])

	// Filter tickets based on search term and status
	const filteredTickets = tickets && tickets.filter((ticket) => {
		const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase())
		const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
		return matchesSearch && matchesStatus
	})

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

	// Format date
	const formatDate = (dateString) => {
		const date = new Date(dateString)
		return date.toLocaleDateString("nl-NL", {
			day: "numeric",
			month: "short",
			year: "numeric",
		})
	}

	if (loading) {
		return (
			<DashboardLayout>
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
				</div>
			</DashboardLayout>
		)
	}

	return (
		<DashboardLayout>
			<div className="bg-white rounded-lg shadow-sm p-6">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
					<h1 className="text-2xl font-bold">Mijn Kaartjes</h1>
					<Link
						href="/dashboard/tickets/create"
						className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
					>
						<Plus size={16} className="mr-2" />
						Nieuw Ticket
					</Link>
				</div>

				<div className="mb-6 flex flex-col md:flex-row gap-4">
					<div className="relative flex-grow">
						<input
							type="text"
							placeholder="Zoek op onderwerp..."
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
					</div>
					<div className="relative">
						<select
							className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
						>
							<option value="all">Alle statussen</option>
							<option value="open">Open</option>
							<option value="in-progress">In behandeling</option>
							<option value="resolved">Opgelost</option>
							<option value="closed">Gesloten</option>
						</select>
						<Filter className="absolute left-3 top-2.5 text-gray-400" size={18} />
					</div>
				</div>

				{tickets && filteredTickets.length === 0 ? (
					<div className="text-center py-12">
						<p className="text-gray-500 mb-4">Je hebt nog geen Kaartjes aangemaakt.</p>
						<Link
							href="/dashboard/tickets/create"
							className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
						>
							<Plus size={16} className="mr-2" />
							Nieuw Ticket
						</Link>
					</div>
				) : (
					<>
						{/* Mobile Card View */}
						{isMobile ? (
							<div className="space-y-4">
								{tickets && filteredTickets.map((ticket) => (
									<div
										key={ticket._id}
										className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
										onClick={() => router.push(`/dashboard/tickets/${ticket._id}`)}
									>
										<div className="p-4">
											<div className="flex justify-between items-start mb-2">
												<h3 className="font-medium text-gray-900">{ticket.subject}</h3>
												<span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
													{ticket.status === "open" && "Open"}
													{ticket.status === "in-progress" && "In behandeling"}
													{ticket.status === "resolved" && "Opgelost"}
													{ticket.status === "closed" && "Gesloten"}
												</span>
											</div>
											<div className="flex items-center text-sm text-gray-500 mt-2">
												<Clock size={14} className="mr-1" />
												<span>Laatste update: {formatDate(ticket.updatedAt)}</span>
											</div>
										</div>
									</div>
								))}

								{
									!tickets && (
										<tr>
											<td colSpan="4" className="text-center py-4">
												Geen Kaartjes gevonden
											</td>
										</tr>
									)
								}
							</div>
						) : (
							/* Desktop Table View */
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Ticket ID
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Onderwerp
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Status
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Laatste Update
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{tickets && filteredTickets.map((ticket) => (
											<tr
												key={ticket._id}
												className="hover:bg-gray-50 cursor-pointer"
												onClick={() => router.push(`/dashboard/tickets/${ticket._id}`)}
											>
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
													#{ticket._id.substring(ticket._id.length - 6)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.subject}</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
														{ticket.status === "open" && "Open"}
														{ticket.status === "in-progress" && "In behandeling"}
														{ticket.status === "resolved" && "Opgelost"}
														{ticket.status === "closed" && "Gesloten"}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{formatDate(ticket.updatedAt)}
												</td>
											</tr>
										))}
										{
											!tickets && (
												<tr>
													<td colSpan="4" className="text-center py-4">
														Geen Kaartjes gevonden
													</td>
												</tr>
											)
										}
									</tbody>
								</table>
							</div>
						)}
					</>
				)}
			</div>
		</DashboardLayout>
	)
}
