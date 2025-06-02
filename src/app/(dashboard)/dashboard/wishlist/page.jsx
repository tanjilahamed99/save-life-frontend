import DashboardLayout from "@/components/dashboard/dashboard-layout"
import Wishlist from "@/components/dashboard/wishlist"

export const metadata = {
    title: "Wishlist | Save Life",
    description: "View and manage your wishlist",
}

export default function WishlistPage() {
	return (
		<DashboardLayout>
			<Wishlist />
		</DashboardLayout>
	)
}

