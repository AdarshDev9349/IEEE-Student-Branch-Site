'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
    </>
  );
}
