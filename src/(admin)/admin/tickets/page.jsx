"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ticketApi } from "@/utils/api";
import { Clock, Filter, Search, User } from "lucide-react";
import useMobile from "@/hooks/use-mobile";
import AdminOnly from "@/components/admin/AdminOnly";

export default function AdminTicketsPage() {
  const router = useRouter();
  const isMobile = useMobile();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await ticketApi.getAllTickets();
        setTickets(response.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Filter tickets based on search term, status, and priority
  const filteredTickets =
    tickets &&
    tickets.filter((ticket) => {
      const matchesSearch =
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.user?.email &&
          ticket.user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ticket.user?.firstName &&
          ticket.user.firstName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (ticket.user?.lastName &&
          ticket.user.lastName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" || ticket.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || ticket.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <AdminOnly>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold">Alle Tickets</h1>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Zoek op onderwerp of klant..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
          <div className="relative">
            <select
              className="appearance-none w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Alle statussen</option>
              <option value="open">Open</option>
              <option value="in-progress">In behandeling</option>
              <option value="resolved">Opgelost</option>
              <option value="closed">Gesloten</option>
            </select>
            <Filter
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
          <div className="relative">
            <select
              className="appearance-none w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}>
              <option value="all">Alle prioriteiten</option>
              <option value="low">Laag</option>
              <option value="medium">Gemiddeld</option>
              <option value="high">Hoog</option>
              <option value="urgent">Urgent</option>
            </select>
            <Filter
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        {tickets && filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Geen tickets gevonden die aan de criteria voldoen.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            {isMobile ? (
              <div className="space-y-4">
                {tickets &&
                  filteredTickets.map((ticket) => (
                    <div
                      key={ticket._id}
                      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() =>
                        router.push(`/admin/tickets/${ticket._id}`)
                      }>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900">
                            {ticket.subject}
                          </h3>
                          <div className="flex flex-col items-end space-y-1">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                                ticket.status
                              )}`}>
                              {ticket.status === "open" && "Open"}
                              {ticket.status === "in-progress" &&
                                "In behandeling"}
                              {ticket.status === "resolved" && "Opgelost"}
                              {ticket.status === "closed" && "Gesloten"}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
                                ticket.priority
                              )}`}>
                              {ticket.priority === "low" && "Laag"}
                              {ticket.priority === "medium" && "Gemiddeld"}
                              {ticket.priority === "high" && "Hoog"}
                              {ticket.priority === "urgent" && "Urgent"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-2">
                          <User size={14} className="mr-1" />
                          <span>
                            {ticket.user?.firstName} {ticket.user?.lastName} (
                            {ticket.user?.email})
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock size={14} className="mr-1" />
                          <span>
                            Laatste update: {formatDate(ticket.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                {!tickets && (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      Geen tickets gevonden
                    </td>
                  </tr>
                )}
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
                        Klant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prioriteit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Laatste Update
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tickets &&
                      filteredTickets.map((ticket) => (
                        <tr
                          key={ticket._id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() =>
                            router.push(`/admin/tickets/${ticket._id}`)
                          }>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{ticket._id.substring(ticket._id.length - 6)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {ticket.subject}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {ticket.user?.firstName} {ticket.user?.lastName}
                            <div className="text-xs text-gray-400">
                              {ticket.user?.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                                ticket.status
                              )}`}>
                              {ticket.status === "open" && "Open"}
                              {ticket.status === "in-progress" &&
                                "In behandeling"}
                              {ticket.status === "resolved" && "Opgelost"}
                              {ticket.status === "closed" && "Gesloten"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
                                ticket.priority
                              )}`}>
                              {ticket.priority === "low" && "Laag"}
                              {ticket.priority === "medium" && "Gemiddeld"}
                              {ticket.priority === "high" && "Hoog"}
                              {ticket.priority === "urgent" && "Urgent"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(ticket.updatedAt)}
                          </td>
                        </tr>
                      ))}
                    {!tickets && (
                      <tr>
                        <td colSpan="4" className="text-center py-4">
                          Geen tickets gevonden
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </AdminOnly>
  );
}
