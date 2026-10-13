import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/Components/Layout/navbar";
import Footer from "@/Components/Layout/footer";

export const metadata: Metadata = {
  title: "Portfolio Blog Website",
  description: "Check out my latest Books, Artworks, and Web Projects!",
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
