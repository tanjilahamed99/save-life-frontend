import DashboardLayout from "@/components/dashboard/dashboard-layout"
import AddressBook from "@/components/dashboard/address-book"

export const metadata = {
	title: "Address | Save Life",
	description: "View your address book",
}

export default function AddressesPage() {
	return (
		<DashboardLayout>
			<AddressBook />
		</DashboardLayout>
	)
}

