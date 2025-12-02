'use client';

import { usePathname } from 'next/navigation';
import Header from '@components/Navigation';
import Footer from '@components/Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideLayout = [
    "/main/auth/login",
    "/main/auth/register",
    "/main/auth/lupaPassword",
    "/main/auth/reset-password",
    "/Privacy/Tentang",
    "/kebijakan-privasi",
    "/privacy"
  ];

  const shouldHideLayout = hideLayout.includes(pathname || "");

  if (shouldHideLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
