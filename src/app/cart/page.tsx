'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import CheckoutSummary from '@/components/cart/CheckoutSummary';
import { motion } from 'framer-motion';
import Link from 'next/link';
import CartItemRow from '@/components/cart/CartItemRow'; // Assuming CartItemRow exists

const CartPage = () => {
  const { cart, loading, error, fetchCart, groupByVendor, removeItem, updateQuantity } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleRemove = (itemId: string) => {
    removeItem(itemId);
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    updateQuantity(itemId, quantity);
  };

  const groups = groupByVendor();

  if (loading) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-6">سبد خرید</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2">
              <div className="space-y-4">
                <div className="animate-pulse bg-neutral-100 rounded-lg h-20 mb-4"></div>
                <div className="animate-pulse bg-neutral-100 rounded-lg h-20 mb-4"></div>
                <div className="animate-pulse bg-neutral-100 rounded-lg h-20 mb-4"></div>
              </div>
            </section>
            <aside className="lg:col-span-1 lg:sticky lg:top-20">
              <div className="animate-pulse bg-neutral-100 rounded-lg h-24 mb-4"></div>
            </aside>
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-6">سبد خرید</h1>
          <div className="text-danger bg-danger/10 rounded-lg p-4 mb-6">
            {error}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2">
              {/* Content will render below error */}

            </section>
            <aside className="lg:col-span-1 lg:sticky lg:top-20">
              {/* Summary will render below error */}
            </aside>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-6">سبد خرید</h1>
          <div className="text-center py-12">
            <p className="text-neutral-600 mb-4">سبد خرید شما خالی است.</p>
            <Link href="/products">
              <a className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                ادامه خرید
              </a>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-6">سبد خرید</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, staggerChildren: 0.1 }}
            >
              {groups.map((group) => (
                <motion.div
                  key={group.vendorId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-6">
                    <h4 className="text-xl font-semibold mb-4">
                      {group.vendorName || `فروشنده #${group.vendorId}`}
                    </h4>
                    <div className="space-y-4">
                      {group.items.map((item) => (
                        <CartItemRow
                          key={item.id}
                          item={item}
                          onRemove={handleRemove}
                          onUpdateQuantity={handleUpdateQuantity}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>
          <aside className="lg:col-span-1 lg:sticky lg:top-20">
            <CheckoutSummary isCheckoutMode={false} />
          </aside>
        </div>
      </main>

      {/* Mobile bottom bar */}
      <div className="hidden lg:block fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 z-40">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-neutral-900">
            جمع کل: {new Intl.NumberFormat('fa-IR', { style: 'currency', currency: 'IRR' }).format(cart.grandTotal)}
          </div>
          <Link href="/checkout">
            <a className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              پرداخت و تکمیل خرید
            </a>
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CartPage;
