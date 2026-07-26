import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import VendorProductForm from '@/components/vendor/VendorProductForm';

type Listing = {
  id: string;
  productId: string;
  price: number;
  stock: number;
};

export default function AddProductPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();
  const [initialData, setInitialData] = useState<Listing | undefined>(undefined);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const res = await api.get(`/api/vendor/listings/${id}`);
          setInitialData(res.data);
        } catch (err) {
          console.error('Failed to fetch listing:', err);
          setToast({ type: 'error', message: 'خطا در بارگذاری محصول. لطفاً دوباره تلاش کنید.' });
        }
      };
      fetchData();
    }
  }, [id]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleSubmit = async (data: Listing) => {
    try {
      if (id) {
        await api.put(`/api/vendor/listings/${id}`, data);
      } else {
        await api.post('/api/vendor/listings', data);
      }
      showToast('success', 'محصول با موفقیت اضافه شد.');
      setTimeout(() => {
        router.push('/vendor/products');
      }, 1000);
    } catch (err: any) {
      const message = err.response?.data?.message || 'خطا در افزودن محصول. لطفاً دوباره تلاش کنید.';
      showToast('error', message);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`
              max-w-lg w-full rounded-lg shadow-md p-4 flex items-center gap-3
              ${toast.type === 'success'
                ? 'bg-success/10 text-success border border-success/20'
                : 'bg-danger/10 text-danger border border-danger/20'
              }
            `}
          >
            <span className="font-medium">{toast.message}</span>
          </motion.div>
        </motion.div>
      )}
      <nav className="flex items-center gap-2 text-sm text-neutral-600 mb-6">
        <a href="/vendor" className="hover:text-neutral-800">پنل فروشنده</a>
        <span className="mx-2">/</span>
        <a href="/vendor/products" className="hover:text-neutral-800">محصولات</a>
        <span className="mx-2">/</span>
        <span>افزودن محصول</span>
      </nav>
      <form onSubmit={handleSubmit}>
        <VendorProductForm
          initialData={initialData}
          onSubmit={handleSubmit}
        />
      </form>
    </main>
  );
}
