"use client";

import { usePathname } from "next/navigation";
import Navigation from "@components/Navigation";
import Footer from "@components/Footer";

export default function ClientLayout({ children, }: { children: React.ReactNode; }) {
  const pathname = usePathname();
  const hideLayout = ["/auth/login", "/auth/register", "/auth/lupaPassword", "/auth/lupaPassword/verification", "/auth/lupaPassword/new-password"];
  const shouldHideLayout = hideLayout.includes(pathname || "");

  return (
    <>
      {!shouldHideLayout && <Navigation />}
      <main>{children}</main>
      {!shouldHideLayout && <Footer />}
    </>
  );
}
