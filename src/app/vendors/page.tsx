import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { useEffect, useState } from 'react';

interface Vendor {
  id: number;
  name: string;
  slug: string;
  logo: string;
  rating: number;
  productCount: number;
  description: string;
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const res = await api.get('/vendors');
        setVendors(res.data);
        setError(null);
      } catch (err) {
        setError('خطا در بارگذاری فروشگاه‌ها');
        setVendors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  if (loading && !vendors.length) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-6">
            فروشگاه‌های برتر
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-neutral-200 rounded-lg h-48"></div>
            ))}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-6">
            فروشگاه‌های برتر
          </h1>
          <p className="text-danger text-center">{error}</p>
        </main>
        <Footer />
      </>
    );
  }

  if (vendors.length === 0) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-6">
            فروشگاه‌های برتر
          </h1>
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-neutral-600">فروشگاهی یافت نشد</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } },
  };

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-6">
          فروشگاه‌های برتر
        </h1>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor) => (
              <motion.div key={vendor.id} variants={cardVariants}>
                <Link href={`/vendors/${vendor.id}/${vendor.slug}`} passThru>
                  <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
                    <div className="p-4 flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={vendor.logo}
                          alt={vendor.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900">
                            {vendor.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="inline-flex items-center bg-success/10 text-success text-xs font-medium px-2.5 py-0.5 rounded-full">
                              {vendor.rating}
                            </span>
                            <span className="text-neutral-600">|</span>
                            <span className="text-neutral-600">
                              {vendor.productCount} محصول
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-neutral-600 text-sm">{vendor.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
