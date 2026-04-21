import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../app/globals.css";
import AuthProvider from "@/context/AuthProvider";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/context/CartContext";



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
       <CartProvider>
         <Providers>
          <Toaster
  position="top-right"
  toastOptions={{
    style: {
      zIndex: 999999,
    },
  }}
/>

          {children}
          
        </Providers>
       </CartProvider>
            </AuthProvider>
            
      </body>
    </html>
  );
}