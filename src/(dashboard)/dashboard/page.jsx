import DashboardLayout from "@/components/dashboard/dashboard-layout"
import DashboardOverview from "@/components/dashboard/dashboard-overview"

export const metadata = {
	title: "Dashboard | Benzobestellen",
	description: "Dashboard for Benzobestellen",
}
export default function DashboardPage() {
	return (
		<DashboardLayout>
			<DashboardOverview />
		</DashboardLayout>
	)
}

