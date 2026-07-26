"use client";

import { useEffect, useState } from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import HeroSlider from '@/components/home/HeroSlider';
import SpeciesSelector from '@/components/home/SpeciesSelector';
import DealsSection from '@/components/home/DealsSection';
import BestSellers from '@/components/home/BestSellers';
import TopVendors from '@/components/home/TopVendors';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { usePetContext } from '@/store/petContext';
import Link from 'next/link';

// Simple skeleton placeholder
const SkeletonBox = ({ className = '' }) => (
  <div className={`h-64 bg-neutral-100 rounded-lg animate-pulse ${className}`} />
);

export default function HomePage() {
  const [banners, setBanners] = useState([]);
  const [specialDeals, setSpecialDeals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuthStore();
  const { pet } = usePetContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch banners
        const bannersRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/banners`);
        if (!bannersRes.ok) throw new Error('Failed to fetch banners');
        const bannersData = await bannersRes.json();
        setBanners(bannersData);

        // Fetch special deals
        const dealsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/special-deals`);
        if (!dealsRes.ok) throw new Error('Failed to fetch special deals');
        const dealsData = await dealsRes.json();
        setSpecialDeals(dealsData);

        // Fetch best sellers (sort=best-selling)
        const bestRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products?sort=best-selling&limit=8`);
        if (!bestRes.ok) throw new Error('Failed to fetch best sellers');
        const bestData = await bestRes.json();
        setBestSellers(bestData);

        // Fetch vendors
        const vendorsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vendors?limit=6`);
        if (!vendorsRes.ok) throw new Error('Failed to fetch vendors');
        const vendorsData = await vendorsRes.json();
        setVendors(vendorsData);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message || 'خطا در بارگذاری داده‌ها');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Variants for fade-in stagger
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-danger text-white text-sm px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && !error ? (
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            {!banners.length ? (
              <SkeletonBox className="mb-6" />
            ) : (
              <HeroSlider banners={banners} />
            )}
            {!specialDeals.length ? (
              <SkeletonBox className="mb-6" />
            ) : (
              <DealsSection specialDeals={specialDeals} />
            )}
            {!bestSellers.length ? (
              <SkeletonBox className="mb-6" />
            ) : (
              <BestSellers products={bestSellers} title="پرفروش‌ها" />
            )}
            {!vendors.length ? (
              <SkeletonBox className="mb-6" />
            ) : (
              <TopVendors vendors={vendors} title="بهترین فروشندگان" />
            )}
            {/* PetNeeds section */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="mt-8"
            >
              {pet ? (
                <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                    محصولات پیشنهادی برای {pet.name}
                  </h3>
                  <p className="text-neutral-600">
                    بر اساس نیازهای {pet.type} {pet.breed ? `(${pet.breed})` : ''}
                    محصولات مناسب را برای شما انتخاب کردیم.
                  </p>
                  {/* Placeholder for recommended products */}
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {/* Example cards - in real implementation fetch recommended products */}
                    <div className="bg-white rounded-lg border border-neutral-200 p-4">
                      <div className="h-32 bg-neutral-100 mb-3 rounded"></div>
                      <h4 className="font-medium text-neutral-900">غذای premium</h4>
                      <p className="text-neutral-500 line-clamp-2">برای رشد و سلامت</p>
                    </div>
                    <div className="bg-white rounded-lg border border-neutral-200 p-4">
                      <div className="h-32 bg-neutral-100 mb-3 rounded"></div>
                      <h4 className="font-medium text-neutral-900">لوازم بهداشت</h4>
                      <p className="text-neutral-500 line-clamp-2">شامپو و موشک‌کش</p>
                    </div>
                    <div className="bg-white rounded-lg border border-neutral-200 p-4">
                      <div className="h-32 bg-neutral-100 mb-3 rounded"></div>
                      <h4 className="font-medium text-neutral-900">اسبیاب و بازی</h4>
                      <p className="text-neutral-500 line-clamp-2">برای سرگرمی و ورزش</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-neutral-50 rounded-lg p-6 text-center border border-neutral-200">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                    هنوز حیوانی ثبت نکرده‌اید!
                  </h3>
                  <p className="text-neutral-600 mb-4">
                    برای دریافت پیشنهادات شخصی‌سازی شده و دسترسی به سوابق سلامت،
                    اول یک پالتو برای حیوان خود ثبت کنید.
                  </p>
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all"
                  >
                    ثبت حیوان جدید
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        ) : (
          <>
            {/* Loading skeletons */}
            <div className="space-y-6">
              <SkeletonBox className="mb-6" />
              <SkeletonBox className="mb-6" />
              <SkeletonBox className="mb-6" />
              <SkeletonBox className="mb-6" />
              <SkeletonBox className="mt-8" />
            </>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
