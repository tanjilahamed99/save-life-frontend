"use client"

import { useState } from "react"
import { CreditCard, AlertCircle } from "lucide-react"
import axiosInstance from "@/utils/axios"

export default function DepositForm({ user, onSuccess }) {
	const [amount, setAmount] = useState("")
	const [paymentMethod, setPaymentMethod] = useState("ideal")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError("")

		if (!amount || isNaN(Number.parseFloat(amount)) || Number.parseFloat(amount) <= 0) {
			setError("Voer een geldig bedrag in")
			return
		}

		try {
			setLoading(true)

			// Create a deposit request - this will be pending until admin confirms
			const response = await axiosInstance.post("/wallet/deposit", {
				email: user.email,
				amount: Number.parseFloat(amount),
				paymentMethod,
				reference: `DEP-${Date.now()}`,
			})

			if (response.data.status) {
				// Success - the deposit is created but pending admin approval
				onSuccess(
					"Je stortingsverzoek is succesvol ingediend. De beheerder zal je een betalingslink sturen via e-mail. Na betaling wordt het bedrag aan je wallet toegevoegd.",
				)
				setAmount("")
			} else {
				setError(response.data.message || "Er is een fout opgetreden bij het aanmaken van je stortingsverzoek")
			}
		} catch (error) {
			console.error("Error creating deposit:", error)
			setError("Er is een fout opgetreden bij het aanmaken van je stortingsverzoek")
		} finally {
			setLoading(false)
		}
	}

	const presetAmounts = [10, 25, 50, 100, 200]

	return (
		<div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
			<div className="p-5 sm:p-6 border-b border-gray-100">
				<h2 className="text-lg font-bold text-gray-900">Geld storten op je wallet</h2>
				<p className="text-sm text-gray-600 mt-1">Vul je wallet aan om snel en gemakkelijk bestellingen te plaatsen</p>
			</div>

			<form onSubmit={handleSubmit} className="p-5 sm:p-6">
				{error && (
					<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
						<AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
						<p className="text-red-700 text-sm">{error}</p>
					</div>
				)}

				<div className="mb-6">
					<label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
						Bedrag (€) *
					</label>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<span className="text-gray-500">€</span>
						</div>
						<input
							type="number"
							id="amount"
							step="0.01"
							min="1"
							placeholder="0.00"
							className="pl-8 pr-4 py-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							required
						/>
					</div>
				</div>

				<div className="mb-6">
					<label className="block text-sm font-medium text-gray-700 mb-2">Kies een bedrag</label>
					<div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
						{presetAmounts.map((presetAmount) => (
							<button
								key={presetAmount}
								type="button"
								onClick={() => setAmount(presetAmount.toString())}
								className={`py-2 px-4 border rounded-md text-sm font-medium ${amount === presetAmount.toString()
									? "bg-teal-50 border-teal-500 text-teal-700"
									: "border-gray-300 text-gray-700 hover:bg-gray-50"
									}`}
							>
								€{presetAmount}
							</button>
						))}
					</div>
				</div>

				<div className="mb-6">
					<label className="block text-sm font-medium text-gray-700 mb-2">Betaalmethode *</label>
					<div className="space-y-3">
						<div
							className={`border rounded-md p-4 ${paymentMethod === "ideal" ? "border-teal-500 bg-teal-50" : "border-gray-300"
								}`}
						>
							<label className="flex items-center cursor-pointer">
								<input
									type="radio"
									name="paymentMethod"
									value="ideal"
									checked={paymentMethod === "ideal"}
									onChange={() => setPaymentMethod("ideal")}
									className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
								/>
								<span className="ml-3 flex items-center">
									<img src="/payment-ideal.png" alt="iDEAL" className="h-8 mr-3" />
									<span className="font-medium">iDEAL</span>
								</span>
							</label>
						</div>

						<div
							className={`border rounded-md p-4 ${paymentMethod === "bancontact" ? "border-teal-500 bg-teal-50" : "border-gray-300"
								}`}
						>
							<label className="flex items-center cursor-pointer">
								<input
									type="radio"
									name="paymentMethod"
									value="bancontact"
									checked={paymentMethod === "bancontact"}
									onChange={() => setPaymentMethod("bancontact")}
									className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
								/>
								<span className="ml-3 flex items-center">
									<img src="/payment-bancontact.png" alt="Bancontact" className="h-8 mr-3" />
									<span className="font-medium">Bancontact</span>
								</span>
							</label>
						</div>
					</div>
				</div>

				<div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
					<p className="text-sm text-gray-600">
						<strong>Let op:</strong> Na het indienen van je stortingsverzoek zal de beheerder je een betalingslink
						sturen via e-mail. Zodra je betaling is bevestigd, wordt het bedrag aan je wallet toegevoegd.
					</p>
				</div>

				<div className="flex sm:justify-end justify-center">
					<button
						type="submit"
						disabled={loading}
						className={`px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center ${loading ? "opacity-70 cursor-not-allowed" : ""
							}`}
					>
						{loading ? (
							<>
								<svg
									className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Verwerken...
							</>
						) : (
							<>
								<CreditCard className="mr-2 h-4 w-4" />
								Stortingsverzoek indienen
							</>
						)}
					</button>
				</div>
			</form>
		</div>
	)
}
