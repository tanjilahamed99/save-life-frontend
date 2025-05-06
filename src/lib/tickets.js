// Mock ticket data - in a real app, this would come from an API or database

// Generate a unique ID
export const generateId = () => {
	return Math.random().toString(36).substring(2, 10);
};

// Mock tickets data
export const mockTickets = [
	{
		id: "tkt1234",
		customerId: "user_1",
		customerName: "Jan Jansen",
		customerEmail: "jan.jansen@example.com",
		subject: "Order delivery issue",
		status: "open",
		priority: "high",
		createdAt: "2024-04-15T10:30:00Z",
		updatedAt: "2024-04-15T10:30:00Z",
		messages: [
			{
				message:
					"I placed an order 5 days ago (order #XS24031001) but haven't received it yet. The tracking information hasn't been updated in 3 days. Can you help?",
				isAdmin: false,
				createdAt: "2024-04-15T10:30:00Z",
			},
			{
				message:
					"Thank you for reaching out. I'm sorry to hear about the delay with your order. I'll check the status with our shipping department and get back to you as soon as possible.",
				isAdmin: true,
				createdAt: "2024-04-15T11:45:00Z",
			},
			{
				message: "Thank you, I appreciate your help.",
				isAdmin: false,
				createdAt: "2024-04-15T12:15:00Z",
			},
		],
	},
	{
		id: "tkt5678",
		customerId: "user_1",
		customerName: "Jan Jansen",
		customerEmail: "jan.jansen@example.com",
		subject: "Question about product dosage",
		status: "pending",
		priority: "medium",
		createdAt: "2024-04-10T14:20:00Z",
		updatedAt: "2024-04-12T09:15:00Z",
		messages: [
			{
				message:
					"I recently purchased Diazepam 10mg and I'm not sure about the recommended dosage. Can you provide some guidance?",
				isAdmin: false,
				createdAt: "2024-04-10T14:20:00Z",
			},
			{
				message:
					"Thank you for your question. For specific dosage information, we recommend consulting with a healthcare professional as they can provide guidance tailored to your specific needs. The product information on our website is for general reference only.",
				isAdmin: true,
				createdAt: "2024-04-11T09:30:00Z",
			},
			{
				message:
					"I understand. Is there any general information you can provide about typical usage?",
				isAdmin: false,
				createdAt: "2024-04-12T09:15:00Z",
			},
		],
	},
	{
		id: "tkt9012",
		customerId: "user_2",
		customerName: "Piet Pietersen",
		customerEmail: "piet.pietersen@example.com",
		subject: "Website payment issue",
		status: "resolved",
		priority: "high",
		createdAt: "2024-04-08T16:45:00Z",
		updatedAt: "2024-04-09T11:20:00Z",
		messages: [
			{
				message:
					"I tried to place an order but the payment system gave me an error. My card was charged but I didn't receive an order confirmation.",
				isAdmin: false,
				createdAt: "2024-04-08T16:45:00Z",
			},
			{
				message:
					"I apologize for the inconvenience. Can you provide the approximate time of your attempted purchase and the last 4 digits of your card? I'll check our payment logs.",
				isAdmin: true,
				createdAt: "2024-04-08T17:30:00Z",
			},
			{
				message: "It was around 4:30 PM today, and the card ends in 4567.",
				isAdmin: false,
				createdAt: "2024-04-08T17:45:00Z",
			},
			{
				message:
					"Thank you for that information. I've found your transaction in our system. There was a temporary issue with our payment processor, but your order has been successfully processed now. You should receive a confirmation email shortly. I've also added a 10% discount to your order for the inconvenience.",
				isAdmin: true,
				createdAt: "2024-04-09T11:20:00Z",
			},
		],
	},
	{
		id: "tkt3456",
		customerId: "user_3",
		customerName: "Klaas Klaassen",
		customerEmail: "klaas.klaassen@example.com",
		subject: "Request for product information",
		status: "closed",
		priority: "low",
		createdAt: "2024-04-05T09:10:00Z",
		updatedAt: "2024-04-07T14:25:00Z",
		messages: [
			{
				message:
					"Do you have any information about potential interactions between Zolpidem and other medications?",
				isAdmin: false,
				createdAt: "2024-04-05T09:10:00Z",
			},
			{
				message:
					"Thank you for your inquiry. Zolpidem may interact with several other medications. For your safety, we recommend consulting with a healthcare professional who can provide personalized advice based on your specific medication regimen. Would you like me to provide some general information about common interactions?",
				isAdmin: true,
				createdAt: "2024-04-05T10:45:00Z",
			},
			{
				message: "Yes, some general information would be helpful. Thank you.",
				isAdmin: false,
				createdAt: "2024-04-06T08:30:00Z",
			},
			{
				message:
					"Zolpidem may interact with CNS depressants (including alcohol), certain antidepressants, antifungals, and some antibiotics. These interactions can increase sedative effects or alter how zolpidem works in your body. Always inform your healthcare provider about all medications you're taking. Is there anything specific you're concerned about?",
				isAdmin: true,
				createdAt: "2024-04-06T11:15:00Z",
			},
			{
				message: "That's very helpful, thank you for the information!",
				isAdmin: false,
				createdAt: "2024-04-07T14:25:00Z",
			},
		],
	},
];

// Get all tickets
export const getAllTickets = () => {
	return Promise.resolve([...mockTickets]);
};

// Get tickets for a specific customer
export const getCustomerTickets = (customerId) => {
	const tickets = mockTickets.filter(
		(ticket) => ticket.customerId === customerId
	);
	return Promise.resolve(tickets);
};

// Get a specific ticket by ID
export const getTicketById = (id) => {
	const ticket = mockTickets.find((ticket) => ticket.id === id);
	return Promise.resolve(ticket || null);
};

// Create a new ticket
export const addTicket = (ticketData) => {
	const { subject, message, priority } = ticketData;

	// In a real app, you would get the customer info from the authenticated user
	const newTicket = {
		id: generateId(),
		customerId: "user_1", // Mock user ID
		customerName: "Jan Jansen", // Mock user name
		customerEmail: "jan.jansen@example.com", // Mock user email
		subject,
		status: "open",
		priority: priority || "medium",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		messages: [
			{
				message,
				isAdmin: false,
				createdAt: new Date().toISOString(),
			},
		],
	};

	mockTickets.unshift(newTicket);
	return Promise.resolve(newTicket);
};

// Add a reply to a ticket
export const addTicketReply = (ticketId, replyData) => {
	const { message, isAdmin } = replyData;
	const ticketIndex = mockTickets.findIndex((ticket) => ticket.id === ticketId);

	if (ticketIndex === -1) {
		return Promise.reject(new Error("Ticket not found"));
	}

	const ticket = mockTickets[ticketIndex];

	// Add the new message
	ticket.messages.push({
		message,
		isAdmin,
		createdAt: new Date().toISOString(),
	});

	// Update the ticket status if needed
	if (isAdmin && ticket.status === "open") {
		ticket.status = "pending";
	} else if (!isAdmin && ticket.status === "resolved") {
		ticket.status = "open";
	}

	// Update the updatedAt timestamp
	ticket.updatedAt = new Date().toISOString();

	// Update the ticket in the array
	mockTickets[ticketIndex] = ticket;

	return Promise.resolve(ticket);
};

// Update ticket status
export const updateTicketStatus = (ticketId, newStatus) => {
	const ticketIndex = mockTickets.findIndex((ticket) => ticket.id === ticketId);

	if (ticketIndex === -1) {
		return Promise.reject(new Error("Ticket not found"));
	}

	const ticket = mockTickets[ticketIndex];

	// Update the status
	ticket.status = newStatus;

	// Update the updatedAt timestamp
	ticket.updatedAt = new Date().toISOString();

	// Update the ticket in the array
	mockTickets[ticketIndex] = ticket;

	return Promise.resolve(ticket);
};

// Update ticket priority
export const updateTicketPriority = (ticketId, newPriority) => {
	const ticketIndex = mockTickets.findIndex((ticket) => ticket.id === ticketId);

	if (ticketIndex === -1) {
		return Promise.reject(new Error("Ticket not found"));
	}

	const ticket = mockTickets[ticketIndex];

	// Update the priority
	ticket.priority = newPriority;

	// Update the updatedAt timestamp
	ticket.updatedAt = new Date().toISOString();

	// Update the ticket in the array
	mockTickets[ticketIndex] = ticket;

	return Promise.resolve(ticket);
};

// Close a ticket
export const closeTicket = (ticketId) => {
	return updateTicketStatus(ticketId, "closed");
};

// Reopen a ticket
export const reopenTicket = (ticketId) => {
	return updateTicketStatus(ticketId, "open");
};
