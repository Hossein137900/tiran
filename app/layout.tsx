import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/static/navbar";
import { ray } from "@/next-persian-fonts/ray";
import Footer from "@/components/static/footer";
import { ToastContainer } from "react-toastify";
import { CartProvider } from "@/context/cartContext";

export const metadata: Metadata = {
  title: "تیران - فروشگاه آنلاین پوشاک",
  description: "فروشگاه آنلاین تیران، ارائه دهنده بهترین پوشاک با کیفیت",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa">
      <body className={` ${ray.className} antialiased relative`}>
        <ToastContainer
          position="top-center"
          rtl
          draggable
          draggableDirection="x"
        />
        <CartProvider>
          <Navbar />

          {children}

          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
