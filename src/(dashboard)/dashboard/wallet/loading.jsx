import DashboardLayout from "@/components/dashboard/dashboard-layout";

export default function WalletLoading() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>

        <div className="mb-6 border-b">
          <div className="flex space-x-8 pb-4">
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-6">
          <div className="p-5 sm:p-6 border-b border-gray-100">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="h-8 w-40 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-3"></div>
              </div>

              <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-5 sm:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="p-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-0">
                <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
