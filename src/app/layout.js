import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/dashboard/navbar/Navbar";
import Footer from "@/components/dashboard/footer/Footer";

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
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
