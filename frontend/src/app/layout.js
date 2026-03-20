import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import LayoutWrapper from "@/components/LayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NexCart - Smarter Shopping with AI",
  description: "LSTM-based personalized AI E-Commerce System",
};

import { Web3Provider } from "@/context/Web3Context";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#f9f9fa] text-gray-800 antialiased overflow-hidden`}>
        <AuthProvider>
          <Web3Provider>
            <CartProvider>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </CartProvider>
          </Web3Provider>
        </AuthProvider>
      </body>
    </html>
  );
}
