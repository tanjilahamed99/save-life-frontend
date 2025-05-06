"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axiosInstance from "@/utils/axios";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { email } = data;
    setLoading(true);
    setError("");

    try {
      const res = await axiosInstance.post("/auth/forget-password", {
        email,
        site: "benzobestellen.com",
      });
      const { status, message } = res.data;

      console.log(data);

      localStorage.setItem("benzobestellen_reset_email", JSON.stringify(email));

      if (status) {
        setSuccess(true);
        router.push("/verify_otp");
      } else {
        setError(message);
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Wachtwoord vergeten
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 ">
          Voer je e-mailadres in en we sturen je een OTP-code <br /> om je
          wachtwoord te resetten
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div
              className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {success && (
            <div
              className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
              role="alert">
              <span className="block sm:inline">
                OTP-code is verzonden naar je e-mailadres. Je wordt
                doorgestuurd...
              </span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700">
                E-mailadres
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  {...register("email", {
                    required: "E-mail is verplicht",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Ongeldig e-mailadres",
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50">
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Versturen...
                  </span>
                ) : (
                  "Verstuur OTP-code"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Terug naar{" "}
                <Link
                  href="/login"
                  className="font-medium text-teal-600 hover:text-teal-500">
                  Inloggen
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
