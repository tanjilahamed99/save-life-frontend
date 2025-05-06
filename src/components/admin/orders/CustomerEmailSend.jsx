"use client";
import axiosInstance from "@/utils/axios";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

// Simple Date Picker Component
function SimpleDatePicker({
  value,
  onChange,
  placeholder = "Select Date",
  className = "",
  required = false,
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  // Navigate months
  const changeMonth = (increment) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + increment);
    setCurrentMonth(newMonth);
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    if (date) {
      // Ensure the date is at the start of the day in local time
      const localDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );

      // Format to YYYY-MM-DD
      const year = localDate.getFullYear();
      const month = String(localDate.getMonth() + 1).padStart(2, "0");
      const day = String(localDate.getDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`;

      onChange(formattedDate);
      setShowDatePicker(false);
    }
  };

  // Format date for display
  const formatDisplayDate = () => {
    if (value) {
      const date = new Date(value);
      return date.toLocaleDateString("nl-NL", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
    return "";
  };

  const weekdays = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];

  return (
    <div className="relative">
      <div
        className={`relative flex items-center border w-full px-8 py-2   font-medium  text-[12px] focus:outline-none  mt-3 
           text-center bg-white text-black border-teal-700/30 rounded-md  pl-8 pr-3  cursor-pointer ${className}`}
        onClick={() => setShowDatePicker(true)}>
        <input
          type="text"
          value={formatDisplayDate()}
          readOnly
          placeholder={placeholder}
          className="w-full border-none outline-none capitalize text-black bg-transparent placeholder-black"
          required={required}
        />
      </div>

      {showDatePicker && (
        <div className="absolute z-10 mt-1 bg-purple-900 p-4 rounded-lg shadow-lg w-64 text-white">
          {/* Month Navigation */}
          <div className="flex justify-between items-center mb-4">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="p-1 hover:bg-purple-800 rounded text-white">
              <ChevronLeft />
            </button>
            <div className="font-semibold capitalize">
              {currentMonth.toLocaleString("nl-NL", {
                month: "long",
                year: "numeric",
              })}
            </div>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="p-1 hover:bg-purple-800 rounded text-white">
              <ChevronRight />
            </button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 capitalize text-center mb-2 text-xs text-purple-200">
            {weekdays.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays().map((date, index) => {
              if (!date) return <div key={`empty-${index}`} />;

              const isToday = date.toDateString() === new Date().toDateString();
              const isSelected = value
                ? date.toISOString().split("T")[0] === value
                : false;

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => handleDateSelect(date)}
                  className={`
                    w-8 h-8 rounded-full text-sm
                    ${isToday ? "bg-purple-600 text-white" : ""}
                    ${isSelected ? "bg-purple-500" : ""}
                    ${date.getMonth() !== currentMonth.getMonth()
                      ? "text-purple-400"
                      : "text-white"
                    }
                    hover:bg-purple-700
                  `}>
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Success Modal Component
const SuccessModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="text-black bg-white rounded-2xl shadow-xl border border-purple-700/20 w-full max-w-md p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-500/20 p-4 rounded-full">
            <Check className="w-12 h-12 text-green-400" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-black mb-4">
          Email Sent Successfully
        </h2>
        <p className="text-black-300 mb-6">
          {message || "Payment request email has been sent."}
        </p>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-teal-600 text-white cursor-pointer rounded-lg hover:bg-teal-700 transition-colors">
          Close
        </button>
      </div>
    </div>
  );
};

export default function CustomerEmailSend({ orderId, setResponseMessage }) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      setIsUpdating(true);
      const { status, message } = await axiosInstance.post(
        "/email/payment/request",
        {
          ...data,
          orderId,
        }
      );

      // Set success modal message
      setSuccessMessage(
        message || "Payment request email has been sent successfully."
      );
      setShowSuccessModal(true);

      // Reset form
      reset({
        pay_amount: "",
        expiry_date: "",
        payment_url: "",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send email. Please try again.";
      setResponseMessage((p) => ({ type: "error", message: errorMessage }));
    } finally {
      setIsUpdating(false);
    }
  };

  // Close success modal and clear any response messages
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessMessage("");
    setResponseMessage(null);
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("pay_amount", {
              required: true,
              validate: (value) => value > 0 || "Amount must be greater than 0",
            })}
            className="w-full px-8 py-2   font-medium  text-[12px] focus:outline-none    bg-white
             text-black border border-teal-700/30 rounded-md"
            type="number"
            step="0.01"
            placeholder="Payment Amount"
          />
          {errors.pay_amount && (
            <p className="text-red-500 text-sm py-2 pl-2">
              {errors.pay_amount.message || "This field is required"}
            </p>
          )}

          <div className="mt-3">
            <Controller
              name="expiry_date"
              control={control}
              rules={{
                required: "Expiry date is required",
                validate: (value) => {
                  const selectedDate = new Date(value);
                  const today = new Date();
                  return (
                    selectedDate > today || "Expiry date must be in the future"
                  );
                },
              }}
              render={({ field: { value, onChange } }) => (
                <SimpleDatePicker
                  value={value}
                  onChange={onChange}
                  placeholder="Expiry Date"
                  required
                />
              )}
            />
            {errors.expiry_date && (
              <p className="text-red-500 text-sm py-2 pl-2">
                {errors.expiry_date.message}
              </p>
            )}
          </div>

          <input
            {...register("payment_url", {
              required: true,
              pattern: {
                value:
                  /^(https?:\/\/)?(localhost|([a-z0-9-]+\.)+[a-z]{2,})(:\d+)?(\/.*)?$/i,
                message: "Please enter a valid URL",
              },
            })}
            className="w-full px-8 py-2   font-medium  text-[12px] focus:outline-none  mt-3  bg-white
             text-black border border-teal-700/30 rounded-md
             
             "
            type="text"
            placeholder="Payment Url"
          />
          {errors.payment_url && (
            <p className="text-red-500 text-sm py-2 pl-2">
              {errors.payment_url.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isUpdating}
            className="mt-3 w-full px-8 py-2 font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex
             items-center justify-center hover:bg-t-800/50 disabled:opacity-50 disabled:cursor-not-allowed">
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-mail">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>

              {isUpdating ? (
                <Loader2 className="w-3 h-3 ml-3 animate-spin text-purple-300" />
              ) : (
                <span className="ml-2">Send</span>
              )}
            </>
          </button>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          message={successMessage}
          onClose={handleCloseSuccessModal}
        />
      )}
    </>
  );
}
