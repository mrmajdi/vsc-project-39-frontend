'use client';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import SearchBar from './SearchBar';
import PetSwitcher from './PetSwitcher';
import CartBadge from './CartBadge';
import { useState } from 'react';

const Header = () => {
  const { user, isAuthenticated } = useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
  }));
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="/logo.svg"
            alt="پت‌شاپ"
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop: SearchBar, PetSwitcher, CartBadge, Auth */}
        <div className="hidden md:flex flex-1 items-center gap-4">
          <div className="flex-1 max-w-xl">
            <SearchBar />
          </div>
          <PetSwitcher />
          <CartBadge />
          {isAuthenticated ? (
            <Link
              href="/account"
              className="flex items-center gap-2"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="آواتار کاربر"
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center bg-primary text-white rounded-full text-sm font-medium">
                  {(user?.name?.charAt(0) ?? 'U').toUpperCase()}
                </span>
              )}
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              ورود
            </Link>
          )}
        </div>

        {/* Mobile: Hamburger */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-lg hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="باز کردن منو"
          >
            <span className="block h-0.5 w-5 bg-neutral-600"></span>
            <span className="block h-0.5 w-5 bg-neutral-600 mt-1"></span>
            <span className="block h-0.5 w-5 bg-neutral-600 mt-1"></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-4 sm:px-6 lg:px-8 flex flex-col items-start gap-4 pt-4 pb-2">
              {/* Logo */}
              <Link href="/" className="flex items-center mb-4">
                <img
                  src="/logo.svg"
                  alt="پت‌شاپ"
                  className="h-8 w-auto"
                />
              </Link>

              <div className="w-full max-w-xl">
                <SearchBar />
              </div>
              <PetSwitcher />
              <CartBadge />
              {isAuthenticated ? (
                <Link
                  href="/account"
                  className="flex items-center gap-2"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="آواتار کاربر"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center bg-primary text-white rounded-full text-sm font-medium">
                      {(user?.name?.charAt(0) ?? 'U').toUpperCase()}
                    </span>
                  )}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus-ring-primary"
                >
                  ورود
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
