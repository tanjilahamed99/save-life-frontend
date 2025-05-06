import axios from "axios";

const API_URL =
	process.env.NEXT_PUBLIC_APP_MODE == "production"
		? "https://api.zolpidem-kopen.net/api/v1"
		: "http://localhost:4000/api/v1";
// Create axios instance
const api = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Add token to requests if available
api.interceptors.request.use(
	(config) => {
		if (typeof window !== "undefined") {
			const token = localStorage.getItem("benzo-auth-token");
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Ticket API functions
export const ticketApi = {
	// Create a new ticket
	createTicket: async (ticketData) => {
		try {
			const response = await api.post("/tickets/create", ticketData);
			return response.data;
		} catch (error) {
			throw error.response?.data || error.message;
		}
	},

	// Get all tickets (admin)
	getAllTickets: async () => {
		try {
			const response = await api.get("/tickets/all");
			return response.data;
		} catch (error) {
			throw error.response?.data || error.message;
		}
	},

	// Get tickets by user
	getTicketsByUser: async (userId) => {
		try {
			const response = await api.get(`/tickets/user/${userId}`);
			return response.data;
		} catch (error) {
			throw error.response?.data || error.message;
		}
	},

	// Get ticket by ID
	getTicketById: async (id) => {
		try {
			const response = await api.get(`/tickets/${id}`);
			return response.data;
		} catch (error) {
			throw error.response?.data || error.message;
		}
	},

	// Update ticket status (admin)
	updateTicketStatus: async (id, status) => {
		try {
			const response = await api.put(`/tickets/status/${id}`, { status });
			return response.data;
		} catch (error) {
			throw error.response?.data || error.message;
		}
	},

	// Add response to ticket
	addTicketResponse: async (id, responseData) => {
		try {
			const response = await api.post(`/tickets/response/${id}`, responseData);
			return response.data;
		} catch (error) {
			throw error.response?.data || error.message;
		}
	},

	// Close ticket
	closeTicket: async (id) => {
		try {
			const response = await api.put(`/tickets/close/${id}`);
			return response.data;
		} catch (error) {
			throw error.response?.data || error.message;
		}
	},

	// Delete ticket (admin)
	deleteTicket: async (id) => {
		try {
			const response = await api.delete(`/tickets/${id}`);
			return response.data;
		} catch (error) {
			throw error.response?.data || error.message;
		}
	},

	// Get ticket statistics (admin)
	getTicketStats: async () => {
		try {
			const response = await api.get("/tickets/stats/summary");
			return response.data;
		} catch (error) {
			throw error.response?.data || error.message;
		}
	},
};

export default api;
