"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/CartContext"
import Breadcrumb from "@/components/Breadcrumb"
import { Lock, Wallet } from "lucide-react"
import axiosInstance from "@/utils/axios"
import { useAuth } from "@/context/AuthContext"

export default function CheckoutPage() {
    const router = useRouter()
    const { user } = useAuth()
    const { cart, clearCart } = useCart()
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: user?.email,
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        country: "NL",
        paymentMethod: "ideal",
        saveInfo: false,
        notes: "",
    })

    const discountPrice = localStorage.getItem("discountPrice")

    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [step, setStep] = useState(1)
    const [walletBalance, setWalletBalance] = useState(0)
    const [loadingWallet, setLoadingWallet] = useState(true)
    const [useWallet, setUseWallet] = useState(false)

    useEffect(() => {
        // Redirect to cart if cart is empty
        if (!user?.email) {
            router.push("/login")
        }
        if (cart.length === 0) {
            router.push("/cart")
        }

        // Fetch wallet balance if user is logged in
        if (user?.email) {
            fetchWalletBalance()
        }
    }, [router, user])

    const fetchWalletBalance = async () => {
        try {
            setLoadingWallet(true)
            const response = await axiosInstance.get(`/wallet/user/${user.email}`)
            if (response.data.status) {
                setWalletBalance(response.data.data.balance || 0)
            }
        } catch (error) {
            console.error("Error fetching wallet balance:", error)
        } finally {
            setLoadingWallet(false)
        }
    }

    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
    const shipping = 5
    const total = subtotal + shipping
    const finalTotal = discountPrice > 0 ? Number.parseFloat(discountPrice) : total

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.firstName.trim()) newErrors.firstName = "Voornaam is verplicht"
        if (!formData.lastName.trim()) newErrors.lastName = "Achternaam is verplicht"
        if (!formData.email.trim()) {
            newErrors.email = "E-mail is verplicht"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "E-mail is ongeldig"
        }
        if (!formData.phone.trim()) newErrors.phone = "Telefoonnummer is verplicht"
        if (!formData.address.trim()) newErrors.address = "Adres is verplicht"
        if (!formData.city.trim()) newErrors.city = "Plaats is verplicht"
        if (!formData.postalCode.trim()) newErrors.postalCode = "Postcode is verplicht"
        if (!formData.paymentMethod && !useWallet) newErrors.paymentMethod = "Selecteer een betaalmethode"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (step === 1) {
            if (validateForm()) {
                setStep(2)
                window.scrollTo(0, 0)
            }
        } else {
            setIsSubmitting(true)

            try {
                // First, create the order to get an order ID
                const orderResponse = await axiosInstance.post("/orders/create", {
                    ...formData,
                    user: user,
                    items: cart,
                    discountPrice,
                    site: "https://benzobestellen.com",
                    paymentStatus: useWallet ? "pending" : "unpaid", // Mark as pending if using wallet
                    paymentMethod: useWallet ? "wallet" : formData.paymentMethod,
                })

                if (!orderResponse.data.status) {
                    setErrors({
                        submit: orderResponse.data.message || "Er is een fout opgetreden bij het aanmaken van de bestelling",
                    })
                    setIsSubmitting(false)
                    return
                }

                const orderId = orderResponse.data.data._id

                if (useWallet) {
                    // Now that we have the order ID, process the wallet payment
                    const walletResponse = await axiosInstance.post("/wallet/pay-order", {
                        email: user.email,
                        orderId: orderId,
                    })

                    if (walletResponse.data.status) {
                        clearCart()
                        localStorage.removeItem("discountPrice")
                        router.push(`/checkout/success?orderId=${orderId}`)
                    } else {
                        // If payment fails, show error
                        setErrors({ wallet: walletResponse.data.message || "Betaling mislukt. Probeer een andere betaalmethode." })
                        setUseWallet(false)
                        setIsSubmitting(false)
                    }
                } else {
                    // Regular payment flow
                    clearCart()
                    localStorage.removeItem("discountPrice")
                    if (formData.paymentMethod === "stripe") {
                        window.location.href = `http://localhost:3001?paymentType=${formData.paymentMethod}&orderId=${orderId}`
                    } else {
                        router.push(`/checkout/success?orderId=${orderId}`)
                    }
                }
            } catch (error) {
                console.error("Error during checkout:", error)
                setErrors({ submit: "Er is een fout opgetreden bij het verwerken van je bestelling" })
                setIsSubmitting(false)
            }
        }
    }

    const goBack = () => {
        if (step === 2) {
            setStep(1)
            window.scrollTo(0, 0)
        } else {
            router.push("/cart")
        }
    }

    const handleWalletToggle = () => {
        setUseWallet(!useWallet)
        if (!useWallet) {
            // When enabling wallet payment, clear other payment methods
            setFormData((prev) => ({
                ...prev,
                paymentMethod: "",
            }))
        }
    }

    const hasEnoughBalance = walletBalance >= finalTotal

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <Breadcrumb
                items={[
                    { label: "Winkelwagen", href: "/cart" },
                    { label: "Afrekenen", href: "/checkout" },
                ]}
            />

            <div className="max-w-6xl mx-auto mt-8">
                <h1 className="text-3xl font-bold mb-6">Afrekenen</h1>

                <div className="flex justify-center mb-8">
                    <div className="flex items-center">
                        <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center ${step >= 1 ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-600"
                                }`}
                        >
                            1
                        </div>
                        <div className={`h-1 w-16 ${step >= 2 ? "bg-teal-600" : "bg-gray-200"}`}></div>
                        <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center ${step >= 2 ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-600"
                                }`}
                        >
                            2
                        </div>
                        <div className={`h-1 w-16 ${step >= 3 ? "bg-teal-600" : "bg-gray-200"}`}></div>
                        <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center ${step >= 3 ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-600"
                                }`}
                        >
                            3
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            {step === 1 ? (
                                <>
                                    <h2 className="text-xl font-bold mb-6">Verzendgegevens</h2>

                                    <form onSubmit={handleSubmit}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Voornaam *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="firstName"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.firstName ? "border-red-500" : "border-gray-300"
                                                        }`}
                                                />
                                                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                                            </div>

                                            <div>
                                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Achternaam *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="lastName"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.lastName ? "border-red-500" : "border-gray-300"
                                                        }`}
                                                />
                                                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                    E-mail *
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.email ? "border-red-500" : "border-gray-300"
                                                        }`}
                                                />
                                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                            </div>

                                            <div>
                                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Telefoonnummer *
                                                </label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.phone ? "border-red-500" : "border-gray-300"
                                                        }`}
                                                />
                                                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                                Adres *
                                            </label>
                                            <input
                                                type="text"
                                                id="address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.address ? "border-red-500" : "border-gray-300"
                                                    }`}
                                            />
                                            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                            <div>
                                                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Plaats *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="city"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.city ? "border-red-500" : "border-gray-300"
                                                        }`}
                                                />
                                                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                                            </div>

                                            <div>
                                                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Postcode *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="postalCode"
                                                    name="postalCode"
                                                    value={formData.postalCode}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.postalCode ? "border-red-500" : "border-gray-300"
                                                        }`}
                                                />
                                                {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>}
                                            </div>

                                            <div>
                                                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Land *
                                                </label>
                                                <select
                                                    id="country"
                                                    name="country"
                                                    value={formData.country}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                >
                                                    <option value="NL">Nederland</option>
                                                    <option value="BE">België</option>
                                                    <option value="DE">Duitsland</option>
                                                    <option value="FR">Frankrijk</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                                Opmerkingen (optioneel)
                                            </label>
                                            <textarea
                                                id="notes"
                                                name="notes"
                                                rows="3"
                                                value={formData.notes}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            ></textarea>
                                        </div>

                                        <div className="mb-6">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="saveInfo"
                                                    name="saveInfo"
                                                    checked={formData.saveInfo}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor="saveInfo" className="ml-2 block text-sm text-gray-700">
                                                    Bewaar deze informatie voor de volgende keer
                                                </label>
                                            </div>
                                        </div>

                                        <div className="flex flex-col lg:flex-row justify-between gap-5">
                                            <button
                                                type="button"
                                                onClick={goBack}
                                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                                            >
                                                Terug naar winkelwagen
                                            </button>

                                            <button
                                                type="submit"
                                                className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                                            >
                                                Ga naar betaling
                                            </button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-xl font-bold mb-6">Betaling</h2>

                                    <form onSubmit={handleSubmit} className="text-gray-700">
                                        {errors.submit && (
                                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                                <p className="text-red-700 text-sm">{errors.submit}</p>
                                            </div>
                                        )}

                                        {/* Wallet Payment Option */}
                                        {!loadingWallet && (
                                            <div className="mb-6">
                                                <div
                                                    className={`border rounded-md p-4 ${useWallet ? "border-teal-500 bg-teal-50" : "border-gray-300"
                                                        } ${!hasEnoughBalance && "opacity-75"}`}
                                                >
                                                    <label className="flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={useWallet}
                                                            onChange={handleWalletToggle}
                                                            disabled={!hasEnoughBalance}
                                                            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                                        />
                                                        <span className="ml-3 flex items-center justify-between w-full">
                                                            <div className="flex items-center">
                                                                <Wallet size={20} className="text-teal-600 mr-3" />
                                                                <div>
                                                                    <span className="font-medium">Betalen met wallet saldo</span>
                                                                    <p className="text-sm text-gray-600">Beschikbaar: €{walletBalance.toFixed(2)}</p>
                                                                </div>
                                                            </div>
                                                            <span className={`font-medium ${hasEnoughBalance ? "text-green-600" : "text-red-600"}`}>
                                                                {hasEnoughBalance ? "Voldoende saldo" : "Onvoldoende saldo"}
                                                            </span>
                                                        </span>
                                                    </label>

                                                    {errors.wallet && <p className="mt-2 ml-7 text-sm text-red-600">{errors.wallet}</p>}

                                                    {!hasEnoughBalance && (
                                                        <div className="mt-3 ml-7 text-sm">
                                                            <p className="text-gray-600">
                                                                Je hebt niet genoeg saldo om deze bestelling te betalen.
                                                                <Link
                                                                    href="/dashboard/wallet"
                                                                    className="text-teal-600 hover:text-teal-700 ml-1 font-medium"
                                                                >
                                                                    Stort geld op je wallet
                                                                </Link>{" "}
                                                                of kies een andere betaalmethode.
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Other Payment Methods */}
                                        {!useWallet && (
                                            <div className="mb-6">
                                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                                    Selecteer een betaalmethode *
                                                </label>

                                                <div className="space-y-4">
                                                    <div
                                                        className={`border rounded-md p-4 ${formData.paymentMethod === "ideal" ? "border-teal-500 bg-teal-50" : "border-gray-300"
                                                            }`}
                                                    >
                                                        <label className="flex items-center cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="paymentMethod"
                                                                value="ideal"
                                                                checked={formData.paymentMethod === "ideal"}
                                                                onChange={handleChange}
                                                                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                                                            />
                                                            <span className="ml-3 flex items-center">
                                                                <img src="/payment-ideal.png" alt="iDEAL" className="h-8 mr-3" />
                                                                <span className="font-medium">iDEAL</span>
                                                            </span>
                                                        </label>
                                                    </div>

                                                    <div
                                                        className={`border rounded-md p-4 ${formData.paymentMethod === "bancontact" ? "border-teal-500 bg-teal-50" : "border-gray-300"
                                                            }`}
                                                    >
                                                        <label className="flex items-center cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="paymentMethod"
                                                                value="bancontact"
                                                                checked={formData.paymentMethod === "bancontact"}
                                                                onChange={handleChange}
                                                                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                                                            />
                                                            <span className="ml-3 flex items-center">
                                                                <img src="/payment-bancontact.png" alt="Bancontact" className="h-8 mr-3" />
                                                                <span className="font-medium">Bancontact</span>
                                                            </span>
                                                        </label>
                                                    </div>

                                                    <div
                                                        className={`border rounded-md p-4 ${formData.paymentMethod === "stripe" ? "border-teal-500 bg-teal-50" : "border-gray-300"
                                                            }`}
                                                    >
                                                        <label className="flex items-center cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="paymentMethod"
                                                                value="stripe"
                                                                checked={formData.paymentMethod === "stripe"}
                                                                onChange={handleChange}
                                                                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                                                            />
                                                            <span className="ml-3 flex items-center">
                                                                <img src="/stripe.png" alt="Stripe" className="h-4 mr-3" />
                                                                <span className="font-medium">Stripe</span>
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>

                                                {errors.paymentMethod && <p className="mt-2 text-sm text-red-600">{errors.paymentMethod}</p>}
                                            </div>
                                        )}

                                        <div className="flex items-center mb-6 p-4 bg-teal-50 border border-teal-200 rounded-md">
                                            <Lock className="h-5 w-5 text-teal-600 mr-2" />
                                            <p className="text-sm text-teal-700">
                                                Alle betalingen zijn beveiligd en versleuteld. Uw gegevens zijn veilig.
                                            </p>
                                        </div>

                                        <div className="flex flex-col lg:flex-row justify-between gap-5">
                                            <button
                                                type="button"
                                                onClick={goBack}
                                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                                            >
                                                Terug naar verzendgegevens
                                            </button>

                                            <button
                                                type="submit"
                                                disabled={isSubmitting || (!useWallet && !formData.paymentMethod)}
                                                className={`px-6 py-3 cursor-pointer bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors ${isSubmitting || (!useWallet && !formData.paymentMethod) ? "opacity-70 cursor-not-allowed" : ""
                                                    }`}
                                            >
                                                {isSubmitting ? "Bezig met verwerken..." : "Plaats bestelling"}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                            <h2 className="text-xl font-bold mb-6">Bestelsamenvatting</h2>

                            <div className="max-h-80 overflow-y-auto mb-6">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex py-4 border-b">
                                        <div className="h-16 w-16 bg-teal-50 rounded-md relative flex-shrink-0">
                                            <Image
                                                src={item.image || "/placeholder.svg"}
                                                alt={item.name}
                                                fill
                                                className="object-contain p-2"
                                            />
                                        </div>
                                        <div className="ml-4 flex-grow">
                                            <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                                            <p className="text-sm text-gray-500 mt-1">Aantal: {item.quantity}</p>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-900">€{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotaal</span>
                                    <span className="font-medium">€{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Verzendkosten</span>
                                    <span className="font-medium">{shipping > 0 ? `€${shipping.toFixed(2)}` : "Gratis"}</span>
                                </div>
                                {!loadingWallet && walletBalance > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Wallet saldo</span>
                                        <span className="font-medium text-teal-600">€{walletBalance.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="border-t pt-3 flex justify-between">
                                    <span className="font-bold">Totaal</span>
                                    <span className="font-bold">
                                        {discountPrice > 0 ? (
                                            <div className="flex items-end gap-2">
                                                <span className="text-base text-gray-500 line-through ">€{total.toFixed(2)}</span>
                                                <span className="text-base font-bold text-gray-900">
                                                    €{Number.parseFloat(discountPrice).toFixed(2)}
                                                </span>
                                            </div>
                                        ) : (
                                            `€${total.toFixed(2)}`
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-center space-x-2 mt-4">
                                <img src="/stripe.png" alt="Visa" className="h-5" />
                                <img src="/payment-ideal.png" alt="iDEAL" className="h-6" />
                                <img src="/payment-bancontact.png" alt="Bancontact" className="h-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
