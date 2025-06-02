import DashboardLayout from "@/components/dashboard/dashboard-layout"
import CustomerEmailHistory from "@/components/dashboard/email-history"

export const metadata = {
	title: "Email History | Save Life",
	description: "View your email history",
}

export default function EmailHistoryPage() {
	return (
		<DashboardLayout>
			<CustomerEmailHistory />
		</DashboardLayout>
	)
}
