"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function AccountDetails() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const { user, loading, refetch } = useAuth();

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const fetchProfile = async () => {
    try {
      const userProfile = await axiosInstance.post(`/users/current`, {
        id: user?._id,
      });

      setProfile(userProfile?.data?.data?.[0]);
      setFormData({
        name: userProfile.data?.data?.name,
        email: userProfile?.data?.data?.email,
        phone: userProfile?.data?.data?.phone || "",
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      fetchProfile();
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // In a real app, you would call an API to update the profile
    // setProfile({
    //   ...profile,
    //   ...formData,
    // });

    const tokenId = toast.loading("Loading...");

    try {
      const response = await axiosInstance.put(`/users/${user?._id}`, {
        name: user?.name,
        email: user?.email,
        phone: formData.phone,
      });

      if (response?.data?.status) {
        toast.success("Profile updated successfully!");

        refetch();
        fetchProfile();
      }
    } catch (error) {
      toast.error("Something went wrong!", { id: tokenId, duration: 2000 });
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Wachtwoorden komen niet overeen");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("Wachtwoord moet minimaal 8 tekens bevatten");
      return;
    }

    // In a real app, you would call an API to update the password

    // Reset form and close
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
    setIsChangingPassword(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold">Account Information</h1>
        <p className="text-gray-600 mt-2">
          Manage your personal information and password
        </p>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Personal Information</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-teal-600 hover:text-teal-700 font-medium">
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile?.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile?.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profile?.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                Save
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{profile?.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Email Address</p>
              <p className="font-medium">{profile?.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Phone Number</p>
              <p className="font-medium">{profile?.phone || "-"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
