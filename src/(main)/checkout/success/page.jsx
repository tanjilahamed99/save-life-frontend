"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function CheckoutSuccessPage({ searchParams }) {
  const router = useRouter();
  const orderId = searchParams.orderId;

  // useEffect(() => {
  //   // Redirect to home if accessed directly (without completing checkout)
  //   const hasCompletedCheckout = sessionStorage.getItem('checkoutCompleted');
  //   if (!hasCompletedCheckout) {
  //     router.push('/');
  //   } else {
  //     sessionStorage.removeItem('checkoutCompleted');
  //   }
  // }, [router]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold mb-2">
            Bedankt voor uw bestelling!
          </h1>
          <p className="text-gray-600 mb-6">
            Uw bestelling is succesvol geplaatst en wordt nu verwerkt.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <p className="text-gray-600 mb-2">Bestelnummer:</p>
            <p className="text-2xl font-bold text-gray-900">#{orderId && orderId.slice(-4)}</p>
          </div>

          <p className="text-gray-600 mb-6">
            We hebben een bevestigingsmail gestuurd naar uw e-mailadres met de
            details van uw bestelling. U kunt de status van uw bestelling volgen
            in uw account.
          </p>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/"
              className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">
              Terug naar de homepage
            </Link>

            <Link
              href="/dashboard/orders"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center">
              Bekijk mijn bestelling
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
