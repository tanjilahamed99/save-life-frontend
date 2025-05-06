import DashboardLayout from "@/components/dashboard/dashboard-layout"
import OrderHistory from "@/components/dashboard/order-history"

export const metadata = {
	title: "Bestellingen | Benzobestellen",
	description: "Bestellingen for Benzobestellen",
}

export default function OrdersPage() {
	return (
		<DashboardLayout>
			<OrderHistory />
		</DashboardLayout>
	)
}

