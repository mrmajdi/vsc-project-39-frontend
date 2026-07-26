import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from '../../../lib/api';

type WishlistItem = {
  productId: string;
  product: {
    id: string;
    slug: string;
    image: string;
    name: string;
    brand: string;
    price: number;
  };
};

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const res = await api.get('/user/wishlist');
        setWishlist(res.data);
        setError(null);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            'خطا در بارگذاری لیست علاقه‌مندی‌ها. لطفاً دوباره امتحان کنید.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemove = async (productId: string) => {
    try {
      await api.delete(`/user/wishlist/${productId}`);
      setWishlist((prev) => prev.filter((item) => item.productId !== productId));
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'خطا در حذف محصول از علاقه‌مندی‌ها. لطفاً دوباره امتحان کنید.'
      );
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">
        علاقه‌مندی‌ها
      </h1>

      {error && (
        <div className="bg-danger/10 text-danger border border-danger/20 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="relative group bg-white rounded-lg border border-neutral-200 shadow-sm p-4"
            >
              <div
                className="absolute top-2 left-2 z-10 text-danger hover:text-danger/80 transition-colors p-1 rounded-full hover:bg-neutral-100"
              >
                <div className="h-5 w-5 bg-neutral-200 rounded-full animate-pulse"></div>
              </div>
              <div className="h-40 w-full rounded-md bg-neutral-200 mb-3 animate-pulse"></div>
              <div className="space-y-1">
                <div className="h-4 bg-neutral-200 rounded animate-pulse"></div>
                <div className="h-2 bg-neutral-200 rounded w-1/2 animate-pulse"></div>
                <div className="h-5 bg-neutral-200 rounded w-2/3 animate-pulse"></div>
                <div className="flex items-center justify-between">
                  <div className="h-3 bg-neutral-200 rounded w-full animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-12">
          <div className="flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-danger"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-base font-medium text-neutral-900 mb-4">
            لیست علاقه‌مندی‌های شما خالی است
          </p>
          <Link href="/products">
            <button
              className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              کاوش محصولات
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {wishlist.map((item) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <div
                  className="relative group bg-white rounded-lg border border-neutral-200 shadow-sm p-4 hover:shadow-md transition-all"
                >
                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="absolute top-2 left-2 z-10 text-danger hover:text-danger/80 transition-colors p-1 rounded-full hover:bg-neutral-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-40 rounded-md object-cover mb-3"
                  />
                  <div>
                    <h3 className="text-sm font-medium text-neutral-900">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      {item.product.brand}
                    </p>
                    <p className="text-lg font-bold text-primary">
                      {item.product.price.toLocaleString()} تومان
                    </p>
                  </div>
                  <Link href={`/products/${item.product.id}/${item.product.slug}`}>
                    <button
                      className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-sm px-4 py-2 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      افزودن به سبد
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </main>
  );
}
