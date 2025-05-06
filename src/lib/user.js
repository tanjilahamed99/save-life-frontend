// Mock user data - in a real app, this would come from an API or database

// Get user profile
export const getUserProfile = () => {
	const profile = {
		id: "user_1",
		firstName: "Jan",
		lastName: "Jansen",
		email: "jan.jansen@example.com",
		phone: "+31 6 12345678",
		dateRegistered: "2023-05-15T10:30:00Z",
	};

	return Promise.resolve(profile);
};

// Get user addresses
export const getUserAddresses = () => {
	const addresses = [
		{
			id: "address_1",
			type: "shipping",
			firstName: "Jan",
			lastName: "Jansen",
			company: "",
			address1: "Hoofdstraat 123",
			address2: "",
			city: "Amsterdam",
			postalCode: "1012 AB",
			country: "NL",
			isDefault: true,
		},
		{
			id: "address_2",
			type: "billing",
			firstName: "Jan",
			lastName: "Jansen",
			company: "Jansen BV",
			address1: "Zakenweg 45",
			address2: "Unit 3",
			city: "Amsterdam",
			postalCode: "1013 CD",
			country: "NL",
			isDefault: true,
		},
	];

	return Promise.resolve(addresses);
};

// Get user wishlist
export const getUserWishlist = () => {
	const wishlist = [
		{
			id: "1",
			name: "10 Gram - 2CMC crystalline powder",
			price: 55.0,
			originalPrice: 65.0,
			image: "/product-2cmc.jpg",
			stock: 10,
			dateAdded: "2023-11-15T14:30:00Z",
		},
		{
			id: "8",
			name: "1 Gram - NEP",
			price: 10.0,
			originalPrice: null,
			image: "/product-nep.jpg",
			stock: 15,
			dateAdded: "2023-12-02T09:15:00Z",
		},
		{
			id: "9",
			name: "1 Gram - 3-MMA",
			price: 15.0,
			originalPrice: 20.0,
			image: "/product-3mma.jpg",
			stock: 0,
			dateAdded: "2024-01-10T16:45:00Z",
		},
	];

	return Promise.resolve(wishlist);
};
