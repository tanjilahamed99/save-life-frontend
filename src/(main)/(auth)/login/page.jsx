'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import axiosInstance from '@/utils/axios';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { refreshUser } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail is verplicht';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail is ongeldig';
    }

    if (!formData.password) {
      newErrors.password = 'Wachtwoord is verplicht';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading('Loading...');
    if (validateForm()) {
      try {
        const response = await axiosInstance.post('/auth/login', formData);

        if (response?.data?.status) {
          localStorage.setItem(
            'benzo-auth-token',
            JSON.stringify(response?.data?.user?.token)
          );
          toast.success('Succesvol ingelogd!', { id: toastId, duration: 2000 });
          if (response?.data?.data?.role == 'admin') {
            router.push('/admin');
          } else {
            router.push('/dashboard');
          }
          refreshUser();
        } else {
          toast.error(response?.data?.message || 'Er is een fout opgetreden', {
            id: toastId,
            duration: 2000,
          });
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || 'Er is een fout opgetreden',
          {
            id: toastId,
            duration: 2000,
          }
        );
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Inloggen</h1>
          <p className="text-gray-600 mt-2">
            Log in op uw account om uw bestellingen te bekijken en meer
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                E-mail *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Wachtwoord *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Onthoud mij
                </label>
              </div>

              <Link
                href="/forgot_password"
                className="text-sm text-teal-600 hover:text-teal-700"
              >
                Wachtwoord vergeten?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Inloggen...' : 'Inloggen'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Nog geen account?{' '}
              <Link
                href="/register"
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                Registreer nu
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
