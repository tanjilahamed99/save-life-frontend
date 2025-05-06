"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/admin-layout";
import {
  Wallet,
  Clock,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  ShoppingBag,
  XCircle,
  AlertTriangle,
  Plus,
  Minus,
  Send,
  CheckCircle,
} from "lucide-react";
import axiosInstance from "@/utils/axios";
import Link from "next/link";
import SendPaymentLinkModal from "@/components/admin/wallet/SendPaymentLinkModal";
import AdminOnly from "@/components/admin/AdminOnly";

export default function AdminWalletPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("transactions");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [adjustWalletData, setAdjustWalletData] = useState({
    email: "",
    amount: "",
    description: "",
  });
  const [adjustError, setAdjustError] = useState("");
  const [adjustSuccess, setAdjustSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentLinkModalOpen, setIsPaymentLinkModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, [page, statusFilter, typeFilter]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page,
        limit: 10,
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(typeFilter !== "all" && { type: typeFilter }),
        ...(searchTerm && { email: searchTerm }),
      }).toString();

      const response = await axiosInstance.get(
        `/wallet/transactions?${queryParams}`
      );
      if (response.data.status) {
        setTransactions(response.data.data || []);
        setTotalPages(response.data.data.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTransactions();
  };

  const handleAdjustWalletChange = (e) => {
    const { name, value } = e.target;
    setAdjustWalletData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdjustWallet = async (e) => {
    e.preventDefault();
    setAdjustError("");
    setAdjustSuccess("");

    if (!adjustWalletData.email) {
      setAdjustError("E-mail is verplicht");
      return;
    }

    if (
      !adjustWalletData.amount ||
      isNaN(Number.parseFloat(adjustWalletData.amount))
    ) {
      setAdjustError("Voer een geldig bedrag in");
      return;
    }

    if (!adjustWalletData.description) {
      setAdjustError("Beschrijving is verplicht");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post(
        "/wallet/admin/adjust",
        adjustWalletData
      );

      if (response.data.status) {
        setAdjustSuccess(
          `Wallet saldo succesvol aangepast. Nieuw saldo: €${response.data.data.balance.toFixed(
            2
          )}`
        );
        setAdjustWalletData({
          email: "",
          amount: "",
          description: "",
        });
        fetchTransactions();
      } else {
        setAdjustError(response.data.message || "Er is een fout opgetreden");
      }
    } catch (error) {
      console.error("Error adjusting wallet:", error);
      setAdjustError(
        "Er is een fout opgetreden bij het aanpassen van het wallet saldo"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendPaymentLink = (transaction) => {
    setSelectedTransaction(transaction);
    setIsPaymentLinkModalOpen(true);
  };

  const handleCompleteDeposit = async (transactionId) => {
    try {
      const response = await axiosInstance.put(
        `/wallet/deposit/${transactionId}/complete`
      );
      if (response.data.status) {
        setSuccessMessage("Storting succesvol voltooid");
        fetchTransactions();
      }
    } catch (error) {
      console.error("Error completing deposit:", error);
    }
  };

  const handlePaymentLinkSuccess = (message) => {
    setSuccessMessage(message);
    fetchTransactions();
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("nl-NL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get transaction icon
  const getTransactionIcon = (transaction) => {
    const { type, status } = transaction;

    if (status === "failed" || status === "cancelled") {
      return <XCircle className="text-red-500" />;
    }

    if (status === "pending") {
      return <Clock className="text-yellow-500" />;
    }

    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="text-green-500" />;
      case "withdrawal":
        return <ArrowUpRight className="text-red-500" />;
      case "order_payment":
        return <ShoppingBag className="text-blue-500" />;
      default:
        return <AlertTriangle className="text-gray-500" />;
    }
  };

  // Get transaction status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusMap[status] || "bg-gray-100 text-gray-800"
        }`}>
        {status === "completed"
          ? "Voltooid"
          : status === "pending"
          ? "In behandeling"
          : status === "failed"
          ? "Mislukt"
          : status === "cancelled"
          ? "Geannuleerd"
          : status}
      </span>
    );
  };

  // Get transaction type label
  const getTypeLabel = (type) => {
    switch (type) {
      case "deposit":
        return "Storting";
      case "withdrawal":
        return "Opname";
      case "order_payment":
        return "Bestelling";
      default:
        return type;
    }
  };

  return (
    <AdminOnly>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          Wallet Beheer
        </h1>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
            <p className="text-green-700">{successMessage}</p>
          </div>
        )}

        <div className="mb-6 border-b">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("transactions")}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "transactions"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              <Clock size={16} className="inline mr-2" />
              Transacties
            </button>
            <button
              onClick={() => setActiveTab("adjust")}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "adjust"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              <Wallet size={16} className="inline mr-2" />
              Saldo aanpassen
            </button>
          </nav>
        </div>

        {activeTab === "transactions" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-5 sm:p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                Transactiegeschiedenis
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Bekijk en beheer alle wallet transacties
              </p>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <form
                onSubmit={handleSearch}
                className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Zoek op e-mail..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">Alle statussen</option>
                    <option value="pending">In behandeling</option>
                    <option value="completed">Voltooid</option>
                    <option value="failed">Mislukt</option>
                    <option value="cancelled">Geannuleerd</option>
                  </select>
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}>
                    <option value="all">Alle types</option>
                    <option value="deposit">Stortingen</option>
                    <option value="withdrawal">Opnames</option>
                    <option value="order_payment">Bestellingen</option>
                  </select>
                  <button
                    type="submit"
                    className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors">
                    Zoeken
                  </button>
                </div>
              </form>
            </div>

            {/* Transactions List */}
            {loading ? (
              <div className="p-12 flex justify-center">
                <div className="h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="p-12 text-center">
                <div className="bg-gray-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                  <Clock size={40} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Geen transacties gevonden
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Er zijn geen transacties die overeenkomen met je zoekopdracht
                  of filter.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Transactie
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gebruiker
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Datum
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bedrag
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acties
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions.map((transaction) => (
                        <tr key={transaction._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mr-3">
                                {getTransactionIcon(transaction)}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {getTypeLabel(transaction.type)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {transaction.reference}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {transaction.email}
                            </div>
                            {transaction.userId && (
                              <div className="text-sm text-gray-500">
                                ID: {transaction.userId?._id}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(transaction.createdAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`text-sm font-medium ${
                                transaction.type === "order_payment"
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}>
                              {transaction.type === "order_payment" ? "-" : "+"}{" "}
                              €{transaction.amount.toFixed(2)}
                            </div>
                            {transaction.paymentMethod && (
                              <div className="text-xs text-gray-500">
                                via {transaction.paymentMethod}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(transaction.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {transaction.status === "pending" &&
                              transaction.type === "deposit" && (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() =>
                                      handleSendPaymentLink(transaction)
                                    }
                                    className="text-blue-600 hover:text-blue-900 flex items-center">
                                    <Send size={14} className="mr-1" />
                                    Link sturen
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleCompleteDeposit(transaction._id)
                                    }
                                    className="text-green-600 hover:text-green-900 flex items-center">
                                    <CheckCircle size={14} className="mr-1" />
                                    Voltooien
                                  </button>
                                </div>
                              )}
                            {transaction.orderId && (
                              <Link
                                href={`/admin/orders/${transaction.orderId}`}
                                className="text-blue-600 hover:text-blue-900">
                                Bestelling bekijken
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className={`px-3 py-1 rounded-md ${
                        page === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}>
                      Vorige
                    </button>
                    <span className="text-sm text-gray-700">
                      Pagina {page} van {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className={`px-3 py-1 rounded-md ${
                        page === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}>
                      Volgende
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "adjust" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-5 sm:p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                Wallet saldo aanpassen
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Pas het saldo van een gebruiker handmatig aan
              </p>
            </div>

            <form onSubmit={handleAdjustWallet} className="p-5 sm:p-6">
              {adjustError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{adjustError}</p>
                </div>
              )}

              {adjustSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm">{adjustSuccess}</p>
                </div>
              )}

              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="gebruiker@voorbeeld.nl"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  value={adjustWalletData.email}
                  onChange={handleAdjustWalletChange}
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrag (€) *
                </label>
                <div className="flex items-center">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">€</span>
                    </div>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-8 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      value={adjustWalletData.amount}
                      onChange={handleAdjustWalletChange}
                      required
                    />
                  </div>
                  <div className="ml-4 flex space-x-2">
                    <button
                      type="button"
                      onClick={() =>
                        setAdjustWalletData((prev) => ({
                          ...prev,
                          amount:
                            Number.parseFloat(prev.amount || 0) > 0
                              ? prev.amount
                              : "",
                        }))
                      }
                      className={`p-2 rounded-md ${
                        Number.parseFloat(adjustWalletData.amount || 0) > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                      <Plus size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setAdjustWalletData((prev) => ({
                          ...prev,
                          amount:
                            Number.parseFloat(prev.amount || 0) < 0
                              ? prev.amount
                              : "-" + (prev.amount || ""),
                        }))
                      }
                      className={`p-2 rounded-md ${
                        Number.parseFloat(adjustWalletData.amount || 0) < 0
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                      <Minus size={18} />
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Positief bedrag om saldo toe te voegen, negatief bedrag om
                  saldo af te trekken
                </p>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Beschrijving *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  placeholder="Reden voor aanpassing"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  value={adjustWalletData.description}
                  onChange={handleAdjustWalletChange}
                  required></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}>
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Verwerken...
                    </span>
                  ) : (
                    "Saldo aanpassen"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Payment Link Modal */}
      <SendPaymentLinkModal
        isOpen={isPaymentLinkModalOpen}
        onClose={() => setIsPaymentLinkModalOpen(false)}
        transaction={selectedTransaction}
        onSuccess={handlePaymentLinkSuccess}
      />
    </AdminOnly>
  );
}
