"use client"

import { useState, useEffect } from "react"
import { Home, Building, Plus, Edit, Trash2, Check } from "lucide-react"
import { getUserAddresses } from "@/lib/user"

export default function AddressBook() {
	const [addresses, setAddresses] = useState([])
	const [loading, setLoading] = useState(true)
	const [isAddingAddress, setIsAddingAddress] = useState(false)
	const [editingAddressId, setEditingAddressId] = useState(null)
	const [formData, setFormData] = useState({
		type: "shipping",
		firstName: "",
		lastName: "",
		company: "",
		address1: "",
		address2: "",
		city: "",
		postalCode: "",
		country: "NL",
		isDefault: false,
	})

	useEffect(() => {
		const fetchAddresses = async () => {
			try {
				const userAddresses = await getUserAddresses()
				setAddresses(userAddresses)
			} catch (error) {
				console.error("Error fetching addresses:", error)
			} finally {
				setLoading(false)
			}
		}

		fetchAddresses()
	}, [])

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target
		setFormData({
			...formData,
			[name]: type === "checkbox" ? checked : value,
		})
	}

	const handleAddAddress = () => {
		setIsAddingAddress(true)
		setEditingAddressId(null)
		setFormData({
			type: "shipping",
			firstName: "",
			lastName: "",
			company: "",
			address1: "",
			address2: "",
			city: "",
			postalCode: "",
			country: "NL",
			isDefault: false,
		})
	}

	const handleEditAddress = (address) => {
		setIsAddingAddress(true)
		setEditingAddressId(address.id)
		setFormData({
			type: address.type,
			firstName: address.firstName,
			lastName: address.lastName,
			company: address.company || "",
			address1: address.address1,
			address2: address.address2 || "",
			city: address.city,
			postalCode: address.postalCode,
			country: address.country,
			isDefault: address.isDefault,
		})
	}

	const handleDeleteAddress = (addressId) => {
		// In a real app, you would call an API to delete the address
		setAddresses(addresses.filter((address) => address.id !== addressId))
	}

	const handleSubmit = (e) => {
		e.preventDefault()

		if (editingAddressId) {
			// Update existing address
			setAddresses(
				addresses.map((address) =>
					address.id === editingAddressId ? { ...address, ...formData, id: editingAddressId } : address,
				),
			)
		} else {
			// Add new address
			const newAddress = {
				...formData,
				id: `address_${Date.now()}`,
			}
			setAddresses([...addresses, newAddress])
		}

		setIsAddingAddress(false)
		setEditingAddressId(null)
	}

	const handleCancel = () => {
		setIsAddingAddress(false)
		setEditingAddressId(null)
	}

	return (
		<div className="space-y-6">
			<div className="bg-white rounded-lg shadow-sm p-6">
				<h1 className="text-2xl font-bold">Adresboek</h1>
				<p className="text-gray-600 mt-2">Beheer je verzend- en factuuradres</p>
			</div>

			{/* Address Form */}
			{isAddingAddress && (
				<div className="bg-white rounded-lg shadow-sm p-6">
					<h2 className="text-lg font-bold mb-4">{editingAddressId ? "Adres bewerken" : "Nieuw adres toevoegen"}</h2>

					<form onSubmit={handleSubmit}>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Adrestype</label>
								<div className="flex space-x-4">
									<label className="flex items-center">
										<input
											type="radio"
											name="type"
											value="shipping"
											checked={formData.type === "shipping"}
											onChange={handleInputChange}
											className="mr-2"
										/>
										<span>Verzendadres</span>
									</label>
									<label className="flex items-center">
										<input
											type="radio"
											name="type"
											value="billing"
											checked={formData.type === "billing"}
											onChange={handleInputChange}
											className="mr-2"
										/>
										<span>Factuuradres</span>
									</label>
								</div>
							</div>

							<div className="md:text-right">
								<label className="inline-flex items-center">
									<input
										type="checkbox"
										name="isDefault"
										checked={formData.isDefault}
										onChange={handleInputChange}
										className="mr-2"
									/>
									<span>Instellen als standaard adres</span>
								</label>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Voornaam *</label>
								<input
									type="text"
									name="firstName"
									value={formData.firstName}
									onChange={handleInputChange}
									required
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Achternaam *</label>
								<input
									type="text"
									name="lastName"
									value={formData.lastName}
									onChange={handleInputChange}
									required
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
								/>
							</div>

							<div className="md:col-span-2">
								<label className="block text-sm font-medium text-gray-700 mb-1">Bedrijfsnaam (optioneel)</label>
								<input
									type="text"
									name="company"
									value={formData.company}
									onChange={handleInputChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
								/>
							</div>

							<div className="md:col-span-2">
								<label className="block text-sm font-medium text-gray-700 mb-1">Adres *</label>
								<input
									type="text"
									name="address1"
									value={formData.address1}
									onChange={handleInputChange}
									required
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
								/>
							</div>

							<div className="md:col-span-2">
								<label className="block text-sm font-medium text-gray-700 mb-1">Adres 2 (optioneel)</label>
								<input
									type="text"
									name="address2"
									value={formData.address2}
									onChange={handleInputChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Plaats *</label>
								<input
									type="text"
									name="city"
									value={formData.city}
									onChange={handleInputChange}
									required
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Postcode *</label>
								<input
									type="text"
									name="postalCode"
									value={formData.postalCode}
									onChange={handleInputChange}
									required
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
								/>
							</div>

							<div className="md:col-span-2">
								<label className="block text-sm font-medium text-gray-700 mb-1">Land *</label>
								<select
									name="country"
									value={formData.country}
									onChange={handleInputChange}
									required
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
								>
									<option value="NL">Nederland</option>
									<option value="BE">België</option>
									<option value="DE">Duitsland</option>
									<option value="FR">Frankrijk</option>
								</select>
							</div>
						</div>

						<div className="mt-6 flex justify-end space-x-3">
							<button
								type="button"
								onClick={handleCancel}
								className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
							>
								Annuleren
							</button>
							<button
								type="submit"
								className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
							>
								{editingAddressId ? "Opslaan" : "Toevoegen"}
							</button>
						</div>
					</form>
				</div>
			)}

			{/* Addresses List */}
			<div className="bg-white rounded-lg shadow-sm p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-lg font-bold">Mijn adressen</h2>
					<button
						onClick={handleAddAddress}
						className="flex items-center text-sm text-teal-600 hover:text-teal-700 font-medium"
					>
						<Plus size={16} className="mr-1" />
						Adres toevoegen
					</button>
				</div>

				{loading ? (
					<div className="py-8 flex justify-center">
						<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
					</div>
				) : addresses.length === 0 ? (
					<div className="py-8 text-center">
						<p className="text-gray-600">Je hebt nog geen adressen toegevoegd.</p>
						<button
							onClick={handleAddAddress}
							className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
						>
							Adres toevoegen
						</button>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{addresses.map((address) => (
							<div key={address.id} className="border rounded-lg p-4 relative">
								{address.isDefault && (
									<div className="absolute top-4 right-4 flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
										<Check size={12} className="mr-1" />
										Standaard
									</div>
								)}

								<div className="flex items-start mb-3">
									{address.type === "shipping" ? (
										<Home size={20} className="text-teal-600 mr-2 mt-1" />
									) : (
										<Building size={20} className="text-teal-600 mr-2 mt-1" />
									)}
									<div>
										<h3 className="font-medium">{address.type === "shipping" ? "Verzendadres" : "Factuuradres"}</h3>
										<p className="text-sm text-gray-600">
											{address.firstName} {address.lastName}
										</p>
									</div>
								</div>

								<div className="text-sm text-gray-700 ml-7">
									{address.company && <p>{address.company}</p>}
									<p>{address.address1}</p>
									{address.address2 && <p>{address.address2}</p>}
									<p>
										{address.postalCode} {address.city}
									</p>
									<p>
										{address.country === "NL" && "Nederland"}
										{address.country === "BE" && "België"}
										{address.country === "DE" && "Duitsland"}
										{address.country === "FR" && "Frankrijk"}
									</p>
								</div>

								<div className="mt-4 ml-7 flex space-x-3">
									<button
										onClick={() => handleEditAddress(address)}
										className="text-sm text-teal-600 hover:text-teal-700 flex items-center"
									>
										<Edit size={14} className="mr-1" />
										Bewerken
									</button>
									<button
										onClick={() => handleDeleteAddress(address.id)}
										className="text-sm text-red-600 hover:text-red-700 flex items-center"
									>
										<Trash2 size={14} className="mr-1" />
										Verwijderen
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

