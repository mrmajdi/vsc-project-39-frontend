// @vsc repo:vsc-project-39-frontend file:src/app/vendor/layout.tsx task:f11-src-app-vendor-layout-tsx module:frontend session:39
import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    href: '/vendor',
    label: 'داشبورد',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/vendor/products',
    label: 'محصولات',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    href: '/vendor/products/add',
    label: 'افزودن محصول',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: '/vendor/orders',
    label: 'سفارشات',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2m4-4l2-2" />
      </svg>
    ),
  },
];

const additionalNavItems: NavItem[] = [
    {
        href: '/vendor/special-deals',
        label: 'تخفیف‌های ویژه',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0x0 -100 -100 -100" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.848.773c.24-.24.583-.353.927-.353s.687.113.927.353l.586.586c.24.24.583.353.927.353h.828c.687-.001-.353-.583-.353-.927s-.113-.687-.353-.927l-.586-.586c-.24-.24-.353-.583-.353-.927s.113-.687.353-.927l.586-.586c.24-.24.583-.353.927-.353s.687.113.927.353l.586.586c.24.24.583.353.927.353h.828c.344-.001 .687 .113 .927 .353l .586 .586c .24 .24 .583 .353 .927 .353 s .687 -.113 .927 -.353 l .586 -.586 c .24 -.24 .583 -.353 .927 -.353 s .687 .113 .927 .353 l .586 .586 c .24 .24 .583 .353 .927 .353 h .828 c .344 -.001 .687 -.113 .927 -.353 l .586 -.586 c .24 -.24 .583 -.353 .927 -.353 s .687 .113 .927 .353 l -1.293 -1.293 c -.24 -.24 -.583 -.353 -.927 -.353 s -.687 .113 -.927 .353 l -1.293 -1.293 c -.24 -.24 -.583 -.353 -.927 -.353 s -.687 .113 -.927 .353 l -1.293 -1.293 c -.24 -.24 -.583 -.353 -.927 -.353 s -.687 .113 -.927 .353 l -1.293 -1.293 c -.24 -.24 -.583 -.353 -.927 -.353 s -.687 .113 -.927 .353 l -1.293 -1.293 c -.24 -.24 -.583 -.353 -.927 -.353 s -.687 .113 -.927 .353 l -1.293 -1.293 c -.24 -.24 -.583 -.353 -.927 -.353 s -.687 .113 -.927 .353 l -1.293 -1.293 c-.24-.24-.583-.353-.927-.353z"/>
          </svg>
        ),
      },
      {
        href: '/vendor/finance',
        label: 'مالی',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="-100 -100 -100 -100" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17,12 L22,12 L22,14 L17,14 L17,12 M20,15 L22,15 L22,17 L20,17 L20,15 M13,21 L13,19 L11,19 L11,21 L13,21 M13,18 L13,16 L11,16 L11,18 L13,18 M13,15 L13,13 L11,13 L11,15 L13,15 M13,12 L13,10 L11,10 L11,12 L13,12 M21,21 L21,19 L19,19 L19,21 L21,21 M21,18 L21,16 L19,16 L19,18 L21,18 M21,15 L21,13 L19,13 L19,15 L21,15 M21,12 L21,10 L19,10 L19,12 L21,12 M17,18 L17,16 L15,16 L15,18 L17,18 M17,15 L17,13 L15,13 L15,15 L17,15 M17,21 L17,19 L15,19 L15,21 L17,21 M17,-10 L17,-10 z"/>
          </svg>
        ),
      },
      {
        href: '/vendor/settings',
        label: 'تنظیمات',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="-100 -100 -100 -100" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="-85,-85 m95,-95 a95,-95,-100,-100,-100,-100 z"/>
          </svg>
        ),
      }
];

const allNavItems = [...navItems];

const VendorSidebar = ({ pathname }: { pathname: string }) => {
    return (
        <aside className="hidden lg:flex flex-col w-64 bg-white border-s border-neutral-200 h-screen sticky top-0">
            <div className="p-6 border-b border-neutral-200">
                <Link href="/vendor" className="flex items-center gap-2 text-neutral-900">
                    <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">پ</div>
                    <span className="text-xl font-bold">پنل فروشنده</span>
                </Link>
            </div>
            <nav className="flex flex-col gap-1 p-4 flex-grow overflow-y-auto">
                {allNavItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/vendor' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                                isActive
                                    ? 'bg-primary text-white font-medium shadow-sm'
                                    : 'text-neutral-600 hover:bg-neutral-100'
                            }`}
                        >
                            <span className={isActive ? 'text-white' : 'text-neutral-600'}>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-neutral-200 mt-auto">
                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-neutral-600 bg-transparent rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
                >
                    بازگشت به فروشگاه
                </Link>
            </div>
        </aside>
    );
};

const VendorMobileNav = ({ pathname }: { pathname: string }) => {
    return (
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-neutral-200 shadow-md">
            <div className="grid grid-cols-5 gap-1 p-2 max-w-md mx-auto">
                {allNavItems.slice(0, -1).map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/vendor' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center gap-1 p-2 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                                isActive ? 'text-primary' : 'text-neutral-600'
                            }`}
                        >
                            {item.icon}
                            <span className={`text-xs ${isActive ? 'font-medium' : 'font-normal'}`}>{item.label.split(' ')[0]}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default function VendorLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const token = useAuthStore((state) => state.token);

    useEffect(() => {
        if (!token || user?.role !== 'vendor') {
            router.replace('/login');
        }
    }, [token, user?.role]);

    if (!token || user?.role !== 'vendor') {
        return null;
    }

    return (
        <div dir="rtl" lang="fa" className="min-h-screen bg-neutral-50 flex flex-col">
            <div className="flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
                <VendorSidebar pathname={pathname} />
                <main className="flex-grow p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8 w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: opacity }}
                            animate={{ opacity: opacity }}
                            exit={{ opacity: opacity }}
                            transition={{ duration }}
                            className=""
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
            <VendorMobileNav pathname={pathname} />
        </div>
    );
}
