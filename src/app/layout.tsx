import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import ClientLayout from "@components/ClientLayout";
import { Providers } from "./providers";
// @ts-ignore
import "@styles/globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "700"],
})

export const metadata: Metadata = {
  title: "Jaja ID",
  description: "Jaja id E-Commerce app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased bg-gray-100`}
      >
        <Providers> 
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
