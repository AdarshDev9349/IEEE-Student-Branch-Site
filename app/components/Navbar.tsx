"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Only apply scroll listener on home page
    if (pathname !== '/') {
      return;
    }

    const handleScroll = () => {
      // Transition to solid black when scrolled past hero (approx 1 viewport height)
      if (window.scrollY > window.innerHeight - 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Execute on initial mount incase page is loaded already scrolled
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const isHomePage = pathname === '/';
  // Force black bg on non-home pages
  const navClasses = (isScrolled || !isHomePage) 
    ? 'bg-ieee-black shadow-xl' 
    : 'bg-transparent';

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`py-4 fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navClasses}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="text-white text-xl font-bold">
              IEEE Student Branch
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link 
                href="/" 
                className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/events" 
                className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Events
              </Link>
              <Link 
                href="/execom" 
                className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Execom
              </Link>
              <Link 
                href="/contact" 
                className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-white hover:text-gray-200">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}