"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ticketApi } from "@/utils/api";
import Breadcrumb from "@/components/Breadcrumb";
import DashboardLayout from "@/components/dashboard/dashboard-layout";

export default function CreateTicketPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    priority: "medium",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.subject.trim()) {
      newErrors.subject = "Onderwerp is verplicht";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Bericht is verplicht";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Bericht moet minimaal 10 tekens bevatten";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const ticketData = {
        ...formData,
        userId: user._id,
      };

      await ticketApi.createTicket(ticketData);

      router.push("/dashboard/tickets");
    } catch (error) {
      console.error("Error creating ticket:", error);
      setErrors({
        submit:
          "Er is een fout opgetreden bij het aanmaken van het ticket. Probeer het later opnieuw.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
     <div className="container mx-auto px-4 py-6">
  <Breadcrumb
    items={[
      { label: "Dashboard", href: "/dashboard" },
      { label: "Tickets", href: "/dashboard/tickets" },
      { label: "New Ticket", href: "/dashboard/tickets/create" },
    ]}
  />

  <div className="max-w-2xl mx-auto mt-6">
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Ticket</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
              errors.subject ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div className="mb-6">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            rows="6"
            value={formData.message}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
              errors.message ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Describe your problem or question as detailed as possible..."
          ></textarea>
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
        </div>

        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
            {errors.submit}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.push("/dashboard/tickets")}
            className="mr-4 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Create Ticket"}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

    </DashboardLayout>
  );
}
