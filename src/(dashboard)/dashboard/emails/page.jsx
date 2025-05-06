import DashboardLayout from "@/components/dashboard/dashboard-layout"
import CustomerEmailHistory from "@/components/dashboard/email-history"

export const metadata = {
	title: "E-mail geschiedenis | Benzobestellen",
	description: "Bekijk je e-mail geschiedenis",
}

export default function EmailHistoryPage() {
	return (
		<DashboardLayout>
			<CustomerEmailHistory />
		</DashboardLayout>
	)
}
