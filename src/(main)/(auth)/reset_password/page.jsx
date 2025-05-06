'use client';

import { useState, useLayoutEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axios';

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch('password', '');

  useLayoutEffect(() => {
    const storedEmail =
      typeof window !== 'undefined' &&
      localStorage.getItem('benzobestellen_reset_email');
    const storedOtp =
      typeof window !== 'undefined' &&
      localStorage.getItem('benzobestellen_reset_otp');
    if (storedEmail && storedOtp) {
      setEmail(JSON.parse(storedEmail));
      setOtp(storedOtp);
    } else {
      router.push('/auth/forgot_password');
    }
  }, [router]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/auth/password-reset', {
        email,
        password: newPassword,
        otp,
      });

      const { status, message } = await response.data;
      if (!status) {
        setLoading(false);
        setError(message);
        return;
      }

      // Clear the stored email and redirect to login
      typeof window !== 'undefined' &&
        localStorage.removeItem('benzobestellen_reset_email');
      typeof window !== 'undefined' &&
        localStorage.removeItem('benzobestellen_reset_otp');
      router.push('/login');
    } catch (error) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset je wachtwoord
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Voer je nieuwe wachtwoord in
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div
              className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleResetPassword}>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Nieuw wachtwoord
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Bevestig nieuw wachtwoord
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !newPassword}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Resetten...
                  </span>
                ) : (
                  'Reset wachtwoord'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
