"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import { NotificationProvider } from "@/context/NotificationContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <NotificationProvider>
              <div>
                <Toaster richColors position="top-right" />
                <div className="flex-grow">{children}</div>
              </div>
            </NotificationProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
