import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "Smart Investor Homepage",
    template: "%s | Smart Investor",
  },
  description: "Smart Investor app description",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="container">
          <SessionProvider>
            <Navbar />
            {children}
            <Footer />
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
