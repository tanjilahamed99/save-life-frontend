"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import WalletOverview from "@/components/dashboard/wallet/wallet-overview";
import TransactionHistory from "@/components/dashboard/wallet/transaction-history";
import DepositForm from "@/components/dashboard/wallet/deposit-form";
import { Wallet, Clock, CreditCard } from "lucide-react";
import axiosInstance from "@/utils/axios";

export default function WalletPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [depositSuccess, setDepositSuccess] = useState(false);
  const [depositMessage, setDepositMessage] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (user) {
      fetchWalletData();
    }
  }, [user, authLoading, router]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const walletResponse = await axiosInstance.get(
        `/wallet/user/${user.email}`
      );
      if (walletResponse.data.status) {
        setWalletData(walletResponse.data.data);
      }

      const transactionsResponse = await axiosInstance.get(
        `/wallet/transactions/${user.email}`
      );
      if (transactionsResponse.data.status) {
        setTransactions(transactionsResponse.data.data);
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDepositSuccess = (message) => {
    setDepositSuccess(true);
    setDepositMessage(message);
    fetchWalletData(); // Refresh wallet data
    setActiveTab("overview"); // Switch to overview tab

    // Clear success message after 5 seconds
    setTimeout(() => {
      setDepositSuccess(false);
      setDepositMessage("");
    }, 5000);
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          Mijn Wallet
        </h1>

        {depositSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700">{depositMessage}</p>
          </div>
        )}

        <div className="mb-6 border-b">
          <nav className="flex sm:space-x-8 space-x-4">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-1 border-b-2 font-medium sm:text-sm text-[12px] flex items-center ${
                activeTab === "overview"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              <Wallet size={16} className="inline mr-2" />
              Overzicht
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`py-4 px-1 border-b-2 font-medium sm:text-sm text-[12px] flex items-center ${
                activeTab === "transactions"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              <Clock size={16} className="inline mr-2" />
              Transacties
            </button>
            <button
              onClick={() => setActiveTab("deposit")}
              className={`py-4 px-1 border-b-2 font-medium sm:text-sm text-[12px] flex items-center ${
                activeTab === "deposit"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              <CreditCard size={16} className="inline mr-2" />
              Geld storten
            </button>
          </nav>
        </div>

        {activeTab === "overview" && (
          <WalletOverview wallet={walletData} transactions={transactions} />
        )}
        {activeTab === "transactions" && (
          <TransactionHistory transactions={transactions} />
        )}
        {activeTab === "deposit" && (
          <DepositForm user={user} onSuccess={handleDepositSuccess} />
        )}
      </div>
    </DashboardLayout>
  );
}
