import DashboardLayout from "@/components/dashboard/dashboard-layout";
import OrderHistory from "@/components/dashboard/order-history";

export const metadata = {
  title: "Orders | Save Life",
  description: "Orders for Save Life",
};

export default function OrdersPage() {
  return (
    <DashboardLayout>
      <OrderHistory />
    </DashboardLayout>
  );
}
