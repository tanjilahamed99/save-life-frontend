import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SiteNotifications from "@/components/layout/SiteNotifications";
import { NotificationProvider } from "@/context/NotificationContext";

export const metadata = {
	title: "Benzo Bestellen Zonder Recept of Benzo Kopen",
	description:
		"Bestel veilig en eenvoudig benzodiazepinen zoals Zolpidem, Xanax, Diazepam en Lorazepam zonder recept. Snelle levering met iDeal of Bancontact via benzobestellen.com",
	icons: {
		icon: [
			{
				url: "https://benzobestellen.net/wp-content/uploads/2023/08/favicon_benzobestellen.png",
				sizes: "32x32",
			},
			{
				url: "https://benzobestellen.net/wp-content/uploads/2023/08/favicon_benzobestellen.png",
				sizes: "192x192",
			},
		],
		apple:
			"https://benzobestellen.net/wp-content/uploads/2023/08/favicon_benzobestellen.png",
	},
};

export default function MainLayout({ children }) {
	return (
		<>
			<NotificationProvider>
				<SiteNotifications />
				{/* Rest of your layout */}
				<Header />
				<main>{children}</main>
				<Footer />
			</NotificationProvider>
		</>
	);
}
