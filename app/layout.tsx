import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/context/CartContext"; // ইমপোর্ট করা আছে

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Foodie - Exquisite Menu",
  description: "Order your favorite food online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {/* CartProvider-কে এখানে যুক্ত করা হয়েছে যেন পুরো অ্যাপ ডাটা পায় */}
          <CartProvider>
            <Providers>
              <Toaster />
              {children}
            </Providers>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}