"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Breadcrumb from "@/components/Breadcrumb"
import axiosInstance from "@/utils/axios"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext"
import { ticketApi } from "@/utils/api"

export default function ContactPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    createTicket: false,
    priority: "medium",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Pre-fill form with user data if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: `${user.name || ""}`,
        email: user.email || "",
      }))
    }
  }, [user])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      // Store the current path to redirect back after login
      localStorage.setItem("redirectAfterLogin", "/contact")
      router.push("/login")
    }
  }, [user, loading, router])

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

    if (!formData.name.trim()) {
      newErrors.name = "Naam is verplicht"
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-mail is verplicht"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "E-mail is ongeldig"
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Onderwerp is verplicht"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Bericht is verplicht"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)

      if (formData.createTicket) {
        // Create a ticket
        const ticketData = {
          subject: formData.subject,
          message: formData.message,
          priority: formData.priority,
          status: "open",
        }

        const response = await ticketApi.createTicket(ticketData)

        if (response.status === 201 || response.status === 200) {
          // Reset form on successful submission
          setFormData({
            name: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "",
            email: user ? user.email : "",
            subject: "",
            message: "",
            createTicket: false,
            priority: "medium",
          })

          // Show success toast
          toast.success("Uw ticket is succesvol aangemaakt! U kunt de status bekijken in uw dashboard.")

          // Redirect to ticket detail page
          setTimeout(() => {
            router.push(`/dashboard/tickets/${response.data._id}`)
          }, 2000)
        }
      } else {
        // Send regular contact email
        const emailData = {
          email: formData.email,
          name: formData.name,
          subject: formData.subject,
          message: formData.message,
        }

        const response = await axiosInstance.post("/email/contact", emailData)

        if (response?.data?.status) {
          // Reset form on successful submission
          setFormData({
            name: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "",
            email: user ? user.email : "",
            subject: "",
            message: "",
            createTicket: false,
            priority: "medium",
          })

          // Show success toast
          toast.success("Uw bericht is succesvol verzonden!")
        } else {
          // Handle error response
          toast.error(response?.data?.message || "Er is een fout opgetreden bij het verzenden van uw bericht")
        }
      }
    } catch (error) {
      console.error("Verzendingsfout:", error)
      toast.error("Er is een onverwachte fout opgetreden. Probeer het later opnieuw.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "Contact", href: "/contact" }]} />

      <div className="max-w-5xl mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-6">Contact</h1>

        <div className="">
          {/* Contact Form */}
          <div className="">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">
                {formData.createTicket ? "Nieuw ticket aanmaken" : "Stuur ons een bericht"}
              </h2>

              {submitSuccess ? (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
                  <p>Bedankt voor uw bericht! We nemen zo snel mogelijk contact met u op.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Naam *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.name ? "border-red-500" : "border-gray-300"
                          }`}
                        readOnly={!!user}
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

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
                        readOnly={!!user}
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Onderwerp *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.subject ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Bericht *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.message ? "border-red-500" : "border-gray-300"
                        }`}
                    ></textarea>
                    {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="createTicket"
                        name="createTicket"
                        checked={formData.createTicket}
                        onChange={handleChange}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      />
                      <label htmlFor="createTicket" className="ml-2 block text-sm text-gray-700">
                        Maak een ticket aan in plaats van een e-mail te sturen
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-6">
                      Een ticket stelt u in staat om de voortgang van uw vraag te volgen en updates te ontvangen in uw
                      dashboard.
                    </p>
                  </div>

                  {formData.createTicket && (
                    <div className="mb-6">
                      <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                        Prioriteit
                      </label>
                      <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="low">Laag</option>
                        <option value="medium">Gemiddeld</option>
                        <option value="high">Hoog</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  )}

                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                    >
                      {isSubmitting ? "Verzenden..." : formData.createTicket ? "Ticket aanmaken" : "Verstuur bericht"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
