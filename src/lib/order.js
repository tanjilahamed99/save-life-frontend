// Mock order data - in a real app, this would come from an API or database

// Get recent orders
export const getRecentOrders = (limit = 3) => {
	const orders = [
		{
			id: "order_1",
			orderNumber: "XS24031001",
			date: "2024-03-10T14:30:00Z",
			status: "delivered",
			total: 75.0,
			items: [
				{
					id: "1",
					name: "10 Gram - 2CMC crystalline powder",
					price: 55.0,
					quantity: 1,
					image: "/product-2cmc.jpg",
				},
				{
					id: "8",
					name: "1 Gram - NEP",
					price: 10.0,
					quantity: 2,
					image: "/product-nep.jpg",
				},
			],
		},
		{
			id: "order_2",
			orderNumber: "XS24022501",
			date: "2024-02-25T09:15:00Z",
			status: "shipped",
			total: 45.0,
			items: [
				{
					id: "9",
					name: "1 Gram - 3-MMA",
					price: 15.0,
					quantity: 3,
					image: "/product-3mma.jpg",
				},
			],
		},
		{
			id: "order_3",
			orderNumber: "XS24021201",
			date: "2024-02-12T16:45:00Z",
			status: "processing",
			total: 30.0,
			items: [
				{
					id: "2",
					name: "1 Gram - 2-CMC Crystals",
					price: 10.0,
					quantity: 3,
					image: "/product-2cmc.jpg",
				},
			],
		},
	];

	return Promise.resolve(orders.slice(0, limit));
};

// Get all orders
export const getAllOrders = () => {
	const orders = [
		{
			id: "order_1",
			orderNumber: "XS24031001",
			date: "2024-03-10T14:30:00Z",
			status: "delivered",
			total: 75.0,
			items: [
				{
					id: "1",
					name: "10 Gram - 2CMC crystalline powder",
					price: 55.0,
					quantity: 1,
					image: "/product-2cmc.jpg",
				},
				{
					id: "8",
					name: "1 Gram - NEP",
					price: 10.0,
					quantity: 2,
					image: "/product-nep.jpg",
				},
			],
		},
		{
			id: "order_2",
			orderNumber: "XS24022501",
			date: "2024-02-25T09:15:00Z",
			status: "shipped",
			total: 45.0,
			items: [
				{
					id: "9",
					name: "1 Gram - 3-MMA",
					price: 15.0,
					quantity: 3,
					image: "/product-3mma.jpg",
				},
			],
		},
		{
			id: "order_3",
			orderNumber: "XS24021201",
			date: "2024-02-12T16:45:00Z",
			status: "processing",
			total: 30.0,
			items: [
				{
					id: "2",
					name: "1 Gram - 2-CMC Crystals",
					price: 10.0,
					quantity: 3,
					image: "/product-2cmc.jpg",
				},
			],
		},
		{
			id: "order_4",
			orderNumber: "XS24020501",
			date: "2024-02-05T11:20:00Z",
			status: "delivered",
			total: 65.0,
			items: [
				{
					id: "5",
					name: "5 Gram - 2-CMC Crystals",
					price: 30.0,
					quantity: 1,
					image: "/product-2cmc.jpg",
				},
				{
					id: "10",
					name: "2 Gram - 2-MMC Crystals",
					price: 11.0,
					quantity: 2,
					image: "/product-2mmc.jpg",
				},
				{
					id: "11",
					name: "Product Sample",
					price: 7.5,
					quantity: 1,
					image: "/product-sample.jpg",
				},
			],
		},
		{
			id: "order_5",
			orderNumber: "XS24011501",
			date: "2024-01-15T08:45:00Z",
			status: "delivered",
			total: 120.0,
			items: [
				{
					id: "7",
					name: "10 Gram - 2-CMC Crystals",
					price: 55.0,
					quantity: 2,
					image: "/product-2cmc.jpg",
				},
				{
					id: "11",
					name: "Product Sample",
					price: 7.5,
					quantity: 1,
					image: "/product-sample.jpg",
				},
			],
		},
	];

	return Promise.resolve(orders);
};

// Get order by ID
export const getOrderById = async (orderId) => {
	const orders = await getAllOrders();
	const order = await orders.find((order) => order.id == orderId);
	return Promise.resolve(order || null);
};
