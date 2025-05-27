"use client";
import axiosInstance from "@/utils/axios";
import { ArrowRight, Mail } from "lucide-react";
import React, { useState } from "react";

export default function NewsLetter() {
  const [error, setError] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    try {
      const { data } = await axiosInstance.post("/newsletter/create", {
        email,
        date: new Date(),
      });
      if (!data?.success) {
        setError(data?.message);
      } else {
        e.target.reset();
        alert("Thanks for subscribed.");
        setError("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full sm:w-[600px] mx-auto mt-16 flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg overflow-hidden">
      <form onSubmit={handleSubscribe} className="p-8">
        <h3 className="text-2xl font-bold mb-4">Newsletter</h3>
        <p className="text-gray-600 mb-6">
         Receive the latest news about our products and promotions in your inbox.
        </p>
        <div className="flex items-center ">
          <Mail className="h-5 w-5 text-[#188687] mr-3" />
          <input
            type="email"
            placeholder="E-address"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#188687] focus:border-[#188687] w-full"
            required
            name="email"
          />
        </div>
        <h2 className="text-sm font-bold text-red-700 mb-4 mt-2">{error}</h2>
        <button
          type="submit"
          className="bg-[#188687] text-white flex gap-2 items-center px-4 py-2 rounded-lg hover:bg-[#188687]">
          <span className="mr-2">Subscribe</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
