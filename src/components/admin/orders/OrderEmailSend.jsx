"use client"
import axiosInstance from "@/utils/axios"
import { Email } from "@mui/icons-material"
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

// Simple Date Picker Component
function SimpleDatePicker({ value, onChange, placeholder = "Select Date", className = "", required = false }) {
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [currentMonth, setCurrentMonth] = useState(new Date())

    // Generate calendar days
    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()

        const firstDayOfMonth = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()

        const days = []

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null)
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day))
        }

        return days
    }

    // Navigate months
    const changeMonth = (increment) => {
        const newMonth = new Date(currentMonth)
        newMonth.setMonth(currentMonth.getMonth() + increment)
        setCurrentMonth(newMonth)
    }

    // Handle date selection
    const handleDateSelect = (date) => {
        if (date) {
            // Ensure the date is at the start of the day in local time
            const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

            // Format to YYYY-MM-DD
            const year = localDate.getFullYear()
            const month = String(localDate.getMonth() + 1).padStart(2, "0")
            const day = String(localDate.getDate()).padStart(2, "0")

            const formattedDate = `${year}-${month}-${day}`

            onChange(formattedDate)
            setShowDatePicker(false)
        }
    }

    // Format date for display
    const formatDisplayDate = () => {
        if (value) {
            const date = new Date(value)
            return date.toLocaleDateString("nl-NL", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })
        }
        return ""
    }

    const weekdays = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"]

    return (
        <div className="relative mt-1">
            <div
                className={`relative flex items-center rounded-lg font-medium text-black cursor-pointer ${className}`}
                onClick={() => setShowDatePicker(true)}
            >
                <input
                    type="text"
                    value={formatDisplayDate()}
                    readOnly
                    placeholder={placeholder}
                    required={required}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
            </div>

            {showDatePicker && (
                <div className="absolute z-10 mt-1 bg-white p-4 rounded-lg shadow-lg w-64 text-black">
                    {/* Month Navigation */}
                    <div className="flex justify-between items-center mb-4">
                        <button type="button" onClick={() => changeMonth(-1)} className="p-1 hover:bg-white rounded text-black">
                            <ChevronLeft />
                        </button>
                        <div className="font-semibold capitalize">
                            {currentMonth.toLocaleString("nl-NL", {
                                month: "long",
                                year: "numeric",
                            })}
                        </div>
                        <button type="button" onClick={() => changeMonth(1)} className="p-1 hover:bg-white rounded text-black">
                            <ChevronRight />
                        </button>
                    </div>

                    {/* Weekdays */}
                    <div className="grid grid-cols-7 capitalize text-center mb-2 text-xs text-black">
                        {weekdays.map((day) => (
                            <div key={day}>{day}</div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {generateCalendarDays().map((date, index) => {
                            if (!date) return <div key={`empty-${index}`} />

                            const isToday = date.toDateString() === new Date().toDateString()
                            const isSelected = value ? date.toISOString().split("T")[0] === value : false

                            return (
                                <button
                                    key={date.toISOString()}
                                    type="button"
                                    onClick={() => handleDateSelect(date)}
                                    className={`
                            w-8 h-8 rounded-full text-sm
                            ${isToday ? "bg-purple-600 text-white" : ""}
                            ${isSelected ? "bg-purple-600 text-white" : ""}
                            ${date.getMonth() !== currentMonth.getMonth() ? "" : "text-black"}
                            hover:bg-purple-700
                          `}
                                >
                                    {date.getDate()}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

// Success Modal Component
const SuccessModal = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white text-black rounded-2xl shadow-xl border border-purple-700/20 w-full max-w-md p-6 text-center">
                <div className="flex justify-center mb-4">
                    <div className="bg-green-500/20 p-4 rounded-full">
                        <Check className="w-12 h-12 text-green-400" />
                    </div>
                </div>
                <h2 className="text-xl font-semibold text-black mb-4">Email Sent Successfully</h2>
                <p className="mb-2">{message || "Payment request email has been sent."}</p>
                <button
                    onClick={onClose}
                    className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    )
}

export default function OrderEmailSend({ orderId, setResponseMessage }) {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm()

    const [isUpdating, setIsUpdating] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")

    const onSubmit = async (data) => {
        try {
            setIsUpdating(true)
            // Send payment request email
            const res = await axiosInstance.post("/email/payment/request", {
                ...data,
                orderId,
                date: new Date(),
            })

            // Create notification for the customer
            try {
                // Get order details to find the customer email
                const orderRes = await axiosInstance.get(`/orders/${orderId}`)
                const customerEmail = orderRes.data.data.email

                // Create notification
                await axiosInstance.post("/notifications", {
                    userId: customerEmail, // Using email as userId
                    message: "Er is een betalingsverzoek voor uw bestelling. Klik hier om nu te betalen.",
                    type: "payment",
                    actionUrl: data.payment_url,
                    expiryDate: data.expiry_date,
                    orderId: orderId,
                })
            } catch (notifError) {
                console.error("Error creating notification:", notifError)
                // Continue even if notification creation fails
            }

            toast.success("Email sent successfully!", { duration: 2000 })

            // Reset form
            reset({
                expiry_date: "",
                payment_url: "",
            })
        } catch (error) {
            console.error("Error sending email:", error)
            const errorMessage = error.response?.data?.message || "Failed to send email. Please try again."
            // setResponseMessage((p) => ({ type: "error", message: errorMessage }));
        } finally {
            setIsUpdating(false)
        }
    }

    // Close success modal and clear any response messages
    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false)
        setSuccessMessage("")
        // setResponseMessage(null);
    }

    return (
        <>
            <div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div className="">
                        <label className="text-sm font-medium text-gray-700">Expire Date</label>
                        <Controller
                            name="expiry_date"
                            control={control}
                            rules={{
                                required: "Expiry date is required",
                                validate: (value) => {
                                    const selectedDate = new Date(value)
                                    const today = new Date()
                                    return selectedDate > today || "Expiry date must be in the future"
                                },
                            }}
                            render={({ field: { value, onChange } }) => (
                                <SimpleDatePicker value={value} onChange={onChange} placeholder="Expiry Date" required />
                            )}
                        />
                        {errors.expiry_date && <p className="text-red-500 pb-2 mt-1 text-sm pl-2">{errors.expiry_date.message}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Payment URL</label>
                        <input
                            {...register("payment_url", {
                                required: "Payment URL is required", // Custom error message
                                pattern: {
                                    value: /^(https?:\/\/)?(localhost|([a-z0-9-]+\.)+[a-z]{2,})(:\d+)?(\/.*)?$/i,
                                    message: "Please enter a valid URL", // Error message for pattern validation
                                },
                            })}
                            className="flex-1 px-4 py-2 mt-1 border w-full border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            type="text"
                            placeholder="Payment Url"
                        />
                        {errors.payment_url && <p className="text-red-500 pb-2 mt-1 pl-2 text-sm ">{errors.payment_url.message}</p>}
                    </div>

                    <button
                        disabled={isUpdating}
                        className={`px-4 py-2 cursor-pointer rounded-md bg-teal-600 hover:bg-teal-700 text-white  cursor-not-allowed`}
                    >
                        <span className="flex items-center">
                            {isUpdating ? (
                                <Loader2 className="w-5 h-5 ml-3 animate-spin text-purple-300" />
                            ) : (
                                <span className="ml-3">
                                    <Email size={16} className="mr-2" />
                                    Send Payment URL
                                </span>
                            )}
                        </span>
                    </button>
                </form>
            </div>

            {/* Success Modal */}
            {showSuccessModal && <SuccessModal message={successMessage} onClose={handleCloseSuccessModal} />}
        </>
    )
}
