import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import Link from 'next/link';

export default function AccountPage() {
  const [userName, setUserName] = useState<string>('');
  const [petsCount, setPetsCount] = useState<number>(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState<number>(0);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [addressesCount, setAddressesCount] = useState<number>(0);
  const [pets, setPets] = useState<Array<{ id: string; name: string; avatarUrl?: string }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [userRes, petsRes, ordersRes, wishlistRes, addressesRes, petsListRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/user/pets'),
          api.get('/user/orders?status=pending'),
          api.get('/user/wishlist'),
          api.get('/user/addresses'),
          api.get('/user/pets'), // same endpoint for list
        ]);
        if (!cancelled) {
          setUserName(userRes.data?.name ?? '');
          setPetsCount(petsRes.data?.length ?? 0);
          setPendingOrdersCount(ordersRes.data?.length ?? 0);
          setWishlistCount(wishlistData?.length ?? 0);
          setAddressesCount(addressesRes.data?.length ?? 0);
          setPets(petsListRes.data?.map((p: any) => ({
            id: p.id,
            name: p.name,
            avatarUrl: p.avatarUrl,
          })) ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError('خطا در بارگذاری داده‌ها');
          console.error(err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-6 text-2xl font-bold text-neutral-900">
            سلام ... 👋
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((_, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-4 animate-pulse flex flex-col items-start">
                  <div className="flex items-center bg-primary/10 p-2 rounded-md mb-2">
                    <span className="text-primary text-xl" aria-hidden="true">🐾</span>
                  </div>
                  <div className="h-8 w-20 bg-neutral-200 rounded"></div>
                  <div className="h-4 w-16 mt-2 bg-neutral-200 rounded"></div>
                </div>
              </motion.div>
            ))}
          </div>
          <section className="mt-8">
            <h2 className="mb-4 text-xl font-semibold text-neutral-900">پت‌های من</h2>
            <div className="flex overflow-x-auto space-x-4 pb-2">
              {[1, 2, 3, 4, 5].map((_, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="flex flex-col items-center min-w-[80px] animate-pulse"
                >
                  <div className="w-16 h-16 rounded-full bg-neutral-200 mb-2"></div>
                  <div className="h-4 w-24 bg-neutral-200 rounded mt-2"></div>
                </div>
              ))}
            </div>
          </section>
        </motion.div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-6 text-2xl font-bold text-neutral-900">
            سلام {userName} 👋
          </h1>
          <p className="text-danger">خطا در بارگذاری داده‌ها</p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mb-6 text-2xl font-bold text-neutral-900">
          سلام {userName} 👋
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* تعداد پت‌ها */}
          <motion.div
            key="pets-count"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-4 flex flex-col items-start">
              <div className="flex items-center bg-primary/10 p-2 rounded-md mb-2">
                <span className="text-primary text-xl" aria-hidden="true">🐾</span>
              </div>
              <p className="text-3xl font-bold text-neutral-900">{petsCount}</p>
              <p className="text-sm text-neutral-600">تعداد پت‌ها</p>
            </div>
          </motion.div>

          {/* سفارش‌های در انتظار */}
          <motion.div
            key="pending-orders"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-4 flex flex-col items-start">
              <div className="flex items-center bg-secondary/10 p-2 rounded-md mb-2">
                <span className="text-secondary text-xl" aria-hidden="true">📦</span>
              </div>
              <p className="text-3xl font-bold text-neutral-900">{pendingOrdersCount}</p>
              <p className="text-sm text-neutral-600">سفارش‌های در انتظار</p>
            </div>
          </motion.div>

          {/* آیتم‌های علاقه‌مندی */}
          <motion.div
            key="wishlist"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-4 flex flex-col items-start">
              <div className="flex items-center bg-accent/10 p-2 rounded-md mb-2">
                <span className="text-accent text-xl" aria-hidden="true">❤️</span>
              </div>
              <p className="text-3xl font-bold text-neutral-900">{wishlistCount}</p>
              <p className="text-sm text-neutral-600">آیتم‌های علاقه‌مندی</p>
            </div>
          </motion.div>

          {/* آدرس‌های ثبت شده */}
          <motion.div
            key="addresses"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-4 flex flex-col items-start">
              <div className="flex items-center bg-warning/10 p-2 rounded-md mb-2">
                <span className="text-warning text-xl" aria-hidden="true">📍</span>
              </div>
              <p className="text-3xl font-bold text-neutral-900">{addressesCount}</p>
              <p className="text-sm text-neutral-600">آدرس‌های ثبت شده</p>
            </div>
          </motion.div>
        </div>

        {/* Pet Carousel */}
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-neutral-900">پت‌های من</h2>
          <div className="flex overflow-x-auto space-x-4 pb-2">
            {pets.length > 0 ? (
              pets.map(pet => (
                <motion.div
                  key={pet.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="flex flex-col items-center min-w-[80px]"
                >
                  <img
                    src={pet.avatarUrl ?? '/default-pet.png'}
                    alt={pet.name}
                    className="w-16 h-16 rounded-full object-cover mb-2"
                  />
                  <p className="text-sm font-medium text-neutral-800">{pet.name}</p>
                </motion.div>
              ))
            ) : (
              <motion.div
                className="bg-primary/5 border-dashed border-primary rounded-lg p-6 text-center"
              >
                <p className="mb-4">هنوز پتی ثبت نکرده‌اید</p>
                <Link href="/account/pets/new">
                  <button className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    افزودن پت
                  </button>
                </Link>
              </motion.div>
            )}
          </div>
        </section>
      </motion.div>
    </main>
  );
}
