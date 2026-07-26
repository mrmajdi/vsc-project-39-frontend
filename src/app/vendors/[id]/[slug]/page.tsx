import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Header, Footer } from '@/components/shared';
import { ProductCard } from '@/components/product/ProductCard';
import { ReviewList } from '@/components/product/ReviewList';
import api from '@/lib/api';

interface Vendor {
  id: string;
  name: string;
  slug: string;
  bannerImage: string;
  logoImage: string;
  description: string;
  rating: number;
  productCount: number;
  salesCount: number;
  city: string;
  listings: Array<{
    id: string;
    name: string;
    slug: string;
    images: string[];
    price: number;
    discountPercentage?: number;
    stock: number;
    rating: number;
    reviewCount: number;
    suitableFor: string[];
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
      name: string;
      avatar: string;
    };
  }>;
}

export default function VendorStorefrontPage({ params }: { params: { id: string; slug: string } }) {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'about' | 'reviews'>('products');

  useEffect(() => {
    let isMounted = true;
    const fetchVendor = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/api/vendors/${params.id}`);
        if (isMounted) {
          setVendor(res.data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('فروشنده یافت نشد');
          setLoading(false);
        }
      }
    };

    fetchVendor();

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-[calc(100vh-160px)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="mb-8">
            <div class="h-48 sm:h-64 bg-neutral-200 rounded-lg"></div>
          </div>
          <div class="space-y-6">
            <div class="flex gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-1 h-2 bg-neutral-200 rounded"></div>
              ))}
            </div>
            <div class="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-neutral-200 rounded"></div>
              ))}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-24 bg-neutral-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !vendor) {
    return (
      <>
        <Header />
        <main className="min-h-[calc(100vh-160px)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center py-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">فروشنده یافت نشد</h1>
          <p className="text-neutral-600 text-center">
            متأسفانه فروشنده مورد نظر یافت نشد یا ممکن است حذف شده باشد.
          </p>
          <Link href="/vendors" className="mt-6 inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            بازگشت به لیست فروشندگان
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-160px)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-6 flex items-center gap-2 text-sm text-neutral-600">
          <Link href="/" className="hover:text-neutral-800">
            خانه
          </Link>
          <span className="mx-2">></span>
          <Link href="/vendors" className="hover:text-neutral-800">
            فروشندگان
          </Link>
          <span className="mx-2">></span>
          <span className="font-medium text-neutral-900">{vendor.name}</span>
        </nav>

        <div className="relative mb-8">
          <img
            src={vendor.bannerImage}
            alt={`${vendor.name} بنر`}
            className="w-full h-48 sm:h-64 object-cover rounded-lg"
          />
          <div className="absolute bottom-4 start-4 flex items-center gap-3">
            <img
              src={vendor.logoImage}
              alt={`${vendor.name} لوگو`}
              className="w-24 h-24 rounded-full border-4 border-white shadow-md"
            />
            <div className="text-left">
              <h1 className="text-3xl font-bold text-neutral-900">{vendor.name}</h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="inline-flex items-center bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">
                  ⭐ {vendor.rating.toFixed(1)}
                </span>
                <div className="flex items-center gap-4 text-sm text-neutral-600">
                  <span>{vendor.productCount} محصول</span>
                  <span>{vendor.salesCount} فروش</span>
                  <span>{vendor.city}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex gap-4">
          <button
            className={`${activeTab === 'products'
              ? 'border-b-2 border-primary pb-1 text-neutral-900'
              : 'text-neutral-600 hover:text-neutral-800'}`}
            onClick={() => setActiveTab('products')}
          >
            محصولات
          </button>
          <button
            className={`${activeTab === 'about'
              ? 'border-b-2 border-primary pb-1 text-neutral-900'
              : 'text-neutral-600 hover:text-neutral-800'}`}
            onClick={() => setActiveTab('about')}
          >
            درباره ما
          </button>
          <button
            className={`${activeTab === 'reviews'
              ? 'border-b-2 border-primary pb-1 text-neutral-900'
              : 'text-neutral-600 hover:text-neutral-800'}`}
            onClick={() => setActiveTab('reviews')}
          >
            نظرات
          </button>
        </div>

        <AnimatePresence>
          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendor.listings.map((listing) => (
                  <ProductCard key={listing.id} listing={listing} />
                ))}
              </div>
            </motion.div>
          )}
          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-neutral-600 leading-relaxed">{vendor.description}</p>
            </motion.div>
          )}
          {activeTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ReviewList reviews={vendor.reviews} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}
