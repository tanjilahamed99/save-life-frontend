import DashboardLayout from "@/components/dashboard/dashboard-layout"
import AccountDetails from "@/components/dashboard/account-details"

export const metadata = {
	title: "Account | Benzobestellen",
	description: "Account for Benzobestellen",
}

export default function AccountPage() {
	return (
		<DashboardLayout>
			<AccountDetails />
		</DashboardLayout>
	)
}

