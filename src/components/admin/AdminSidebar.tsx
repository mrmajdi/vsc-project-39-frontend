"use client";
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

// Icon components (simple SVG placeholders)
const DashboardIcon = () => (
  <svg aria-hidden="true" className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M3 3h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
    <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ProductsIcon = () => (
  <svg aria-hidden="true" className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M3 3h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
    <path d="M8 6h8" strokeWidth="2" strokeLinecap="round" />
    <path d="M8 10h8" strokeWidth="2" strokeLinecap="round" />
    <path d="M8 14h8" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const VendorsIcon = () => (
  <svg aria-hidden="true" className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M3 3h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
    <path d="M7 7h10" strokeWidth="2" strokeLinecap="round" />
    <path d="M7 11h10" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const OrdersIcon = () => (
  <svg aria-hidden="true" className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M3 3h5l2 9H2a2 2 0 0 0 0 4h10a2 2 0 0 0 0-4H6l1-1h9a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1zM7 9h10V5H7z" />
  </svg>
);
const SpecialDealsIcon = () => (
  <svg aria-hidden="true" className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M12 2l2 2l-4 5.46L6 8l2-4z" />
    <path d="M16.5 6.5l-4 4-1.5-1.5 4-4z" />
  </svg>
);
const FinanceIcon = () => (
  <svg aria-hidden="true" className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M3 3v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" />
    <path d="M7 9h4" strokeWidth="2" strokeLinecap="round" />
    <path d="M7 13h4" strokeWidth="2" strokeLinecap="round" />
    <path d="M11 7h4" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const ClinicsIcon = () => (
  <svg aria-hidden="true" className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M3 3v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" />
    <path d="M7 7h10" strokeWidth="2" strokeLinecap="round" />
    <path d="M7 11h10" strokeWidth="2" strokeLinecap="round" />
    <path d="M9 3v8" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const CategoriesIcon = () => (
  <svg aria-hidden="true" className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M3 3h18a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM3 8h18a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-2zM3 13h18a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-2z" />
  </svg>
);
const BrandsIcon = () => (
  <svg aria-hidden="true" className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M12 2L15 5l-3 6 2 2-6-3z" />
    <path d="M9 11l3-3" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const UsersIcon = () => (
  <svg aria-hidden="true" className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a6 6 0 0 1-6 6v1h12v-1a6 6 0 0 1-6-6zM16 7a2 2 0 1 0-4 0 2 2 0 0 0 4 0z" />
  </svg>
);
const BannersIcon = () => (
  <svg aria-hidden="true" className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M3 3h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM7 7h10M7 11h10" />
  </svg>
);
const BlogIcon = () => (
  <svg aria-hidden="true" className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M4 3h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2z" />
    <path d="M8 5h4" strokeWidth="2" strokeLinecap="round" />
    <path d="M8 9h4" strokeWidth="2" strokeLinecap="round" />
    <path d="M8 13h4" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const SettingsIcon = () => (
  <svg aria-hidden="true" className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M12 4v1a1 1 0 0 0 1 1h1a3 3 0 0 1 0 6h-1a1 1 0 0 0-1-1V7a3 3 0 0 0-3-3 1 1 0 0 0-2 0v1a1 1 0 0 0-1 1h-1a3 3 0 0 1 0-6h1a1 1 0 0 0 1-1zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    <path d="M16.5 12a1.5 1.5 0 0 1-2.12 0L15 12.88a1.5 1.5 0 0 1-2.12 0L12.12 15a1.5 1.5 0 0 1 0-2.12L11.12 12a1.5 1.5 0 0 1 0-2.12L12 9.88a1.5 1.5 0 0 1 2.12 0l1.12 1.12a1.5 1.5 0 0 1 0 2.12z" />
  </svg>
);

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { href: '/admin', label: 'داشبورد', icon: DashboardIcon },
  { href: '/admin/products', label: 'محصولات', icon: ProductsIcon },
  { href: '/admin/vendors', label: 'فروشندگان', icon: VendorsIcon },
  { href: '/admin/orders', label: 'سفارشات', icon: OrdersIcon },
  { href: '/admin/special-deals', label: 'تخفیف‌های ویژه', icon: SpecialDealsIcon },
  { href: '/admin/finance', label: 'مالی', icon: FinanceIcon },
  { href: '/admin/clinics', label: 'کلینیک‌ها', icon: ClinicsIcon },
  { href: '/admin/categories', label: 'دسته‌بندی‌ها', icon: CategoriesIcon },
  { href: '/admin/brands', label: 'برندها', icon: BrandsIcon },
  { href: '/admin/users', label: 'کاربران', icon: UsersIcon },
  { href: '/admin/banners', label: 'بنرها', icon: BannersIcon },
  { href: '/admin/blog', label: 'بلاگ', icon: BlogIcon },
  { href: '/admin/settings', label: 'تنظیمات', icon: SettingsIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-s border-neutral-200 h-screen sticky top-0 flex flex-col" dir="rtl">
      <div className="p-4 text-xl font-bold text-neutral-900 flex items-center gap-3 justify-start">
        <span>پت‌شاپ ادمین</span>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <motion.ul className="space-y-1 mt-6" layout>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <motion.li
                key={item.href}
                initial={false}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium
                  ${isActive
                    ? 'bg-primary text-white'
                    : 'text-neutral-600 hover:bg-neutral-100'}
                `}
              >
                <span className="flex-1 text-right">{item.label}</span>
                <item.icon className="flex-shrink-0" />
              </motion.li>
            );
          })}
        </motion.ul>
      </nav>
    </aside>
  );
}
