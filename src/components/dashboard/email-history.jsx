"use client";

import { useState, useEffect } from "react";
import { Calendar, Mail, Search, Filter, Eye } from "lucide-react";
import axiosInstance from "@/utils/axios";
import { useAuth } from "@/context/AuthContext";

export default function CustomerEmailHistory() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showEmailContent, setShowEmailContent] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEmails = async () => {
      if (!user?.email) return;

      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/email/customer-history/${user.email}`
        );
        setEmails(response?.data?.data || []);
      } catch (error) {
        console.error("Error fetching email history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("nl-NL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEmailTypeLabel = (type) => {
    const typeMap = {
      payment_request: "Betalingsverzoek",
      order_confirmation: "Orderbevestiging",
      shipping_update: "Verzendupdate",
      order_delivered: "Levering",
      other: "Overig",
    };
    return typeMap[type] || "Overig";
  };

  const filteredEmails = emails.filter((email) => {
    const matchesSearch = email.subject
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || email.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleViewEmail = (email) => {
    setSelectedEmail(email);
    setShowEmailContent(true);
  };

  return (
    <div className="space-y-6">
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h1 className="text-2xl font-bold">Email History</h1>
    <p className="text-gray-600 mt-2">
      View all emails you have received from us
    </p>
  </div>

  {/* Search & Filter */}
  <div className="bg-white rounded-lg shadow-sm p-5 sm:p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by subject..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        <Search
          size={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
      </div>

      {/* Type Filter */}
      <div className="relative">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none">
          <option value="all">All emails</option>
          <option value="payment_request">Payment Requests</option>
          <option value="order_confirmation">Order Confirmations</option>
          <option value="shipping_update">Shipping Updates</option>
          <option value="order_delivered">Delivery</option>
          <option value="other">Other</option>
        </select>
        <Filter
          size={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
      </div>
    </div>
  </div>

  {/* Email List */}
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    {loading ? (
      <div className="p-12 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    ) : filteredEmails.length === 0 ? (
      <div className="p-12 text-center">
        <div className="bg-gray-50 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
          <Mail size={48} className="text-gray-300" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          No emails found
        </h3>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          {searchTerm || filterType !== "all"
            ? "Try different search or filter criteria"
            : "You haven’t received any emails yet"}
        </p>
        {(searchTerm || filterType !== "all") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterType("all");
            }}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Clear filters
          </button>
        )}
      </div>
    ) : (
      <>
        {/* Table view for larger screens */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmails.map((email) => (
                <tr key={email._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Mail size={16} className="text-gray-400 mr-2" />
                      <span className="font-medium text-gray-900">
                        {email.subject}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                      {getEmailTypeLabel(email.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(email.sentAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewEmail(email)}
                      className="text-teal-600 hover:text-teal-900 flex items-center">
                      <Eye size={16} className="mr-1" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card view for mobile */}
        <div className="md:hidden">
          <div className="divide-y divide-gray-200">
            {filteredEmails.map((email) => (
              <div key={email._id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <Mail
                      size={16}
                      className="text-gray-400 mr-2 flex-shrink-0"
                    />
                    <h3 className="font-medium text-gray-900 line-clamp-1">
                      {email.subject}
                    </h3>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 ml-2 flex-shrink-0">
                    {getEmailTypeLabel(email.type)}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar size={14} className="mr-1 flex-shrink-0" />
                  {formatDate(email.sentAt)}
                </div>

                <button
                  onClick={() => handleViewEmail(email)}
                  className="w-full mt-2 flex items-center justify-center px-4 py-2 border border-teal-600 rounded-md shadow-sm text-sm font-medium text-teal-600 bg-white hover:bg-teal-50">
                  <Eye size={16} className="mr-2" />
                  View Email
                </button>
              </div>
            ))}
          </div>
        </div>
      </>
    )}
  </div>

  {/* Email Content Modal */}
  {showEmailContent && selectedEmail && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">{selectedEmail.subject}</h3>
          <button
            onClick={() => setShowEmailContent(false)}
            className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-4 border-b text-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="font-medium">From:</span> {selectedEmail.sender}
            </div>
            <div>
              <span className="font-medium">Date:</span>{" "}
              {formatDate(selectedEmail.sentAt)}
            </div>
          </div>
          <div>
            <span className="font-medium">To:</span> {selectedEmail.recipient}
          </div>
        </div>
        <div className="flex-1 overflow-auto p-1 bg-gray-50">
          <iframe
            srcDoc={selectedEmail.body}
            title="Email Content"
            className="w-full h-full border-0 bg-white"
            sandbox="allow-same-origin allow-popups"
          />
        </div>
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={() => setShowEmailContent(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  )}
</div>

  );
}
