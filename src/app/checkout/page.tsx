import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import CheckoutAddressForm from '@/components/cart/CheckoutAddressForm';
import CheckoutOrderItems from '@/components/cart/CheckoutOrderItems';
import CheckoutSummary from '@/components/cart/CheckoutSummary';
import { toast } from '@/components/shared/Toast'; // Assuming a toast system exists per design system

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, fetchCart, clearCart } = useCartStore();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [addressesError, setAddressesError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [toastId, setToastId] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      await fetchCart();
      if (cartItems.length === 0) {
        toast.error('سبد خرید شما خالی است');
        router.push('/cart');
        return;
      }
      try {
        setAddressesLoading(true);
        const response = await fetch('/api/user/addresses', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('خطا در دریافت آدرس‌ها');
        const data = await response.json();
        setAddresses(data);
      } catch (err: any) {
        setAddressesError(err.message || 'خطا در دریافت آدرس‌ها');
        toast.error(err.message || 'خطا در دریافت آدرس‌ها');
      } finally {
        setAddressesLoading(false);
      }
    };

    loadData();
  }, [cartItems.length, fetchCart, router]);

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
  };

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      toast.error('لطفاً آدرس تحویل را انتخاب کنید');
      return;
    }

    setCheckoutLoading(true);
    try {
      const items = cartItems.map(item => ({
        item_id: item.id,
        quantity: item.quantity,
        pet_id: item.pet_id || null,
      }));

      const response = await fetch('/api/orders/checkout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address_id: selectedAddressId, items }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'خطا در ثبت سفارش');
      }

      toast.success('سفارش با موفقیت ثبت شد');
      clearCart();
      router.push('/account/orders');
    } catch (err: any) {
      toast.error(err.message || 'خطا در ثبت سفارش');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4">
          {/* Toast container will be handled by the toast component */}
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-6">تسویه حساب</h1>

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {!addressesLoading && !addressesError && addresses.length === 0 ? (
                <p className="text-neutral-600">هیچ آدرسی یافت نشد. لطفاً ابتدا آدرس اضافه کنید.</p>
              ) : (
                <CheckoutAddressForm
                  addresses={addresses}
                  selectedAddressId={selectedAddressId}
                  onAddressChange={handleAddressSelect}
                  loading={addressesLoading}
                  error={addressesError}
                />
              )}
              <CheckoutOrderItems items={cartItems} />
            </div>
            <div className="lg:col-span-1 lg:sticky lg:top-20">
              <CheckoutSummary
                isCheckoutMode={true}
                onCheckout={handleCheckout}
                loading={checkoutLoading}
              />
            </div>
          </div>

          {/* Mobile sticky summary */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 px-4 sm:px-6 lg:px-8 pb-4 pt-2">
            <CheckoutSummary
              isCheckoutMode={true}
              onCheckout={handleCheckout}
              loading={checkoutLoading}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
