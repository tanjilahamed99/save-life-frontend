"use client";

import { useState, useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axiosInstance from "@/utils/axios";

export default function VerifyOTPPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const [skeleton, setSkeleton] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  console.log(skeleton);

  useLayoutEffect(() => {
    const customerEmail =
      typeof window !== "undefined" &&
      localStorage.getItem("benzobestellen_reset_email");
    if (!customerEmail) {
      router.push("/forgot_password");
      return;
    }
    setEmail(JSON.parse(customerEmail));
    setSkeleton(false);
  }, [router]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (otp.length === 6) {
      try {
        const res = await axiosInstance.post("/auth/verify-otp", {
          email,
          otp,
        });
        const { status, message } = await res.data;

        if (status) {
          typeof window !== "undefined" &&
            localStorage.setItem("benzobestellen_reset_otp", otp);
          router.push("/reset_password");
        } else {
          setError(message);
        }
      } catch (err) {
        setError("Failed to verify OTP. Please try again.");
      }
    } else {
      setError("Invalid OTP");
    }

    setLoading(false);
  };

  const handleOtpChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and limit to 6 digits
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
    }
  };

  return (
    <div className="m bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verifieer OTP-code
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Voer de 6-cijferige code in die we naar {email} hebben gestuurd
        </p>
      </div>

      {skeleton ? (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="animate-pulse bg-white py-8 px-4  shadow sm:rounded-lg sm:px-10 h-[232px] w-[448px] flex 
          flex-col space-y-4 justify-center">
            <div className="h-10 bg-gray-300 rounded full"></div>
            <div className="h-10 bg-gray-300 rounded w-full"></div>
          </div>
        </div>
      ) : (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && (
              <div
                className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleVerifyOTP}>
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700">
                  OTP-code
                </label>
                <div className="mt-1">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="Voer 6-cijferige code in"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
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
                      Verifiëren...
                    </span>
                  ) : (
                    "Verifieer OTP"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Geen code ontvangen?{" "}
                  <Link
                    href="/auth/forgot_password"
                    className="font-medium text-teal-600 hover:text-teal-500">
                    Opnieuw versturen
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
