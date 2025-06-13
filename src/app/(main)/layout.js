import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SiteNotifications from "@/components/layout/SiteNotifications";
import { NotificationProvider } from "@/context/NotificationContext";

export const metadata = {
  title: "Save Life | Emergency Medical Assistance & Health Resources",
  description:
    "Access life-saving medical information, emergency assistance resources, and health support. Connecting people with critical healthcare services when they need it most.",
  keywords:
    "emergency medical help, health resources, life-saving tips, medical assistance, crisis support",
//   openGraph: {
//     title: "Save Life | Emergency Medical Assistance & Health Resources",
//     description:
//       "Connecting people with critical healthcare services when they need it most.",
//     url: "https://www.yourwebsite.com",
//     siteName: "Save Life",
//     images: [
//       {
//         url: "https://www.yourwebsite.com/images/og-image.jpg",
//         width: 1200,
//         height: 630,
//       },
//     ],
//     locale: "en_US",
//     type: "website",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Save Life | Emergency Medical Assistance & Health Resources",
//     description:
//       "Connecting people with critical healthcare services when they need it most.",
//     images: ["https://www.yourwebsite.com/images/twitter-card.jpg"],
//   },
//   icons: {
//     icon: [
//       {
//         url: "/favicon-32x32.png",
//         sizes: "32x32",
//         type: "image/png",
//       },
//       {
//         url: "/favicon-192x192.png",
//         sizes: "192x192",
//         type: "image/png",
//       },
//     ],
//     apple: "/apple-touch-icon.png",
//   },
//   manifest: "/site.webmanifest",
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
