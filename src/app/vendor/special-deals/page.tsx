'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import api from '@/lib/api';

export default function SpecialDealsPage() {
  const [listings, setListings] = useState<Array<{ id: string; productName: string }>>([]);
  const [selectedListingId, setSelectedListingId] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [deals, setDeals] = useState<Array<{
    id: string;
    productName: string;
    discountPercent: number;
    startDate: string;
    endDate: string;
    status: 'pending' | 'approved' | 'rejected';
  }>>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch vendor listings
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/vendor/listings');
        setListings(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'خطا در بارگذاری محصولات');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Fetch vendor special deals
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/vendor/special-deals');
        setDeals(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'خطا در بارگذاری تخفیف‌های ویژه');
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListingId || !discountPercent || !startDate || !endDate) {
      setError('لطفاً تمام فیلدها را پر کنید');
      return;
    }
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await api.post(`/vendor/listings/${selectedListingId}/special-deal`, {
        discountPercent: Number(discountPercent),
        startDate,
        endDate,
      });
      setSuccess('تخفیف ویژه با موفقیت ثبت شد');
      // Reset form
      setSelectedListingId('');
      setDiscountPercent('');
      setStartDate('');
      setEndDate('');
      // Refetch deals
      const res = await api.get('/vendor/special-deals');
      setDeals(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'خطا در ثبت تخفیف');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-[calc(100vh-144px)] flex items-center justify-center">
          <div class="text-center">
            <div class="inline-block animate-pulse rounded-full bg-primary h-8 w-8"></div>
            <p className="mt-2 text-neutral-600">در حال بارگذاری...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-144px)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Form Card */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6 space-y-4"
          >
            <h2 className="text-2xl font-bold text-neutral-900">ثبت تخفیف ویژه</h2>

            {error && (
              <p className="text-sm text-danger">{error}</p>
            )}
            {success && (
              <p className="text-sm text-success">{success}</p>
            )}

            {/* Listing Select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-800">انتخاب محصول</label>
              <select
                value={selectedListingId}
                onChange={(e) => setSelectedListingId(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="">-- محصول را انتخاب کنید --</option>
                {listings.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.productName}
                  </option>
                ))}
              </select>
            </div>

            {/* Discount Percent */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-800">درصد تخفیف</label>
              <input
                type="number"
                min="0"
                max="100"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                placeholder="مثلاً 20"
                className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* Start Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-800">تاریخ شروع</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* End Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-800">تاریخ پایان</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'در حال ثبت...' : 'ثبت تخفیف'}
            </button>
          </motion.form>

          {/* Deals Table Card */}
          <div className="mt-8 bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h3 className="text-xl font-semibold text-neutral-900">تخفیف‌های ویژه ثبت‌شده</h3>
            </div>
            {deals.length === 0 ? (
              <div className="px-6 py-4 text-neutral-600">هیچ تخفیفی ثبت نشده است.</div>
            ) : (
              <table className="w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="text-left text-xs font-medium text-neutral-600 py-3 px-4">محصول</th>
                    <th className="text-left text-xs font-medium text-neutral-600 py-3 px-4">درصد تخفیف</th>
                    <th className="text-left text-xs font-medium text-neutral-600 py-3 px-4">تاریخ شروع</th>
                    <th className="text-left text-xs font-medium text-neutral-600 py-3 px-4">تاریخ پایان</th>
                    <th className="text-left text-xs font-medium text-neutral-600 py-3 px-4">وضعیت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {deals.map((deal) => (
                    <tr key={deal.id} className="hover:bg-neutral-50">
                      <td className="text-sm font-neutral-800 py-4 px-4">{deal.productName}</td>
                      <td className="text-sm font-neutral-800 py-4 px-4">{deal.discountPercent}%</td>
                      <td className="text-sm font-neutral-800 py-4 px-4">{new Date(deal.startDate).toLocaleDateString('fa-IR')}</td>
                      <td className="text-sm font-neutral-800 py-4 px-4">{new Date(deal.endDate).toLocaleDateString('fa-IR')}</td>
                      <td className="text-sm font-medium py-4 px-4">
                        {deal.status === 'pending' ? (
                          <span className="inline-flex items-center bg-warning/10 text-warning text-xs font-bold px-2 py-1 rounded-sm">در انتظار</span>
                        ) : deal.status === 'approved' ? (
                          <span className="inline-flex items-center bg-success/10 text-success text-xs font-bold px-2 py-1 rounded-sm">تایید شده</span>
                        ) : (
                          <span className="inline-flex items-center bg-danger/10 text-danger text-xs font-bold px-2 py-1 rounded-sm">رد شده</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
