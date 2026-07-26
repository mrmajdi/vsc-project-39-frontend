import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { api } from '@/lib/api';

type Settings = {
  siteName: string;
  siteDescription: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  defaultLanguage: string;
  defaultCommissionRate: number;
  taxRate: number;
  minimumSettlementAmount: number;
  currencySymbol: string;
  notifyNewOrder: boolean;
  notifyNewVendor: boolean;
  notifyNewDealRequest: boolean;
  notifySettlementRequest: boolean;
};

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState<Settings>({
    siteName: '',
    siteDescription: '',
    contactPhone: '',
    contactEmail: '',
    address: '',
    defaultLanguage: 'fa',
    defaultCommissionRate: 0,
    taxRate: 0,
    minimumSettlementAmount: 0,
    currencySymbol: '',
    notifyNewOrder: false,
    notifyNewVendor: false,
    notifyNewDealRequest: false,
    notifySettlementRequest: false,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | 'finance' | 'notifications'>('general');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/admin/settings');
        setSettings(res.data);
      } catch (err) {
        console.error('Failed to fetch settings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/admin/settings', settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings', err);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-[calc(100vh-160px)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-neutral-900">تنظیمات مدیریت</h2>
              <div className="grid gap-4">
                {[...Array(6)].map((_, i) => (
                  <motion.key
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <div className="h-10 w-full rounded-md bg-neutral-200 animate-pulse" />
                  </motion.key>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-160px)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-neutral-900">تنظیمات مدیریت</h2>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-neutral-200 pb-2">
              <button
                onClick={() => setActiveTab('general')}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium ${
                  activeTab === 'general'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-neutral-600 hover:text-neutral-800'
                }`}
              >
                عمومی
              </button>
              <button
                onClick={() => setActiveTab('finance')}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium ${
                  activeTab === 'finance'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-neutral-600 hover:text-neutral-800'
                }`}
              >
                مالی
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium ${
                  activeTab === 'notifications'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-neutral-600 hover:text-neutral-800'
                }`}
              >
                اعلان‌ها
              </button>
            </div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {activeTab === 'general' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-neutral-800">نام سایت</label>
                    <input
                      name="siteName"
                      type="text"
                      value={settings.siteName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="نام سایت"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-neutral-800">توضیح سایت</label>
                    <textarea
                      name="siteDescription"
                      rows={3}
                      value={settings.siteDescription}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="توضیح سایت"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-neutral-800">شماره تماس</label>
                    <input
                      name="contactPhone"
                      type="tel"
                      value={settings.contactPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="شماره تماس"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-neutral-800">ایمیل تماس</label>
                    <input
                      name="contactEmail"
                      type="email"
                      value={settings.contactEmail}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="ایمیل تماس"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-neutral-800">آدرس</label>
                    <textarea
                      name="address"
                      rows={3}
                      value={settings.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="آدرس"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-neutral-800">زبان پیش‌فرض</label>
                    <select
                      name="defaultLanguage"
                      value={settings.defaultLanguage}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="fa">فارسی</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </>
              )}

              {activeTab === 'finance' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-neutral-800">درصد کمیسیون پیش‌فرض</label>
                    <input
                      name="defaultCommissionRate"
                      type="number"
                      value={settings.defaultCommissionRate}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="درصد"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-neutral-800">درصد مالیات</label>
                    <input
                      name="taxRate"
                      type="number"
                      value={settings.taxRate}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="درصد"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-neutral-800">حداقل مبلغ تسویه</label>
                    <input
                      name="minimumSettlementAmount"
                      type="number"
                      value={settings.minimumSettlementAmount}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="مبلغ"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-neutral-800">نماد ارز</label>
                    <input
                      name="currencySymbol"
                      type="text"
                      value={settings.currencySymbol}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="مثلاً $"
                    />
                  </div>
                </>
              )}

              {activeTab === 'notifications' && (
                <>
                  <div className="flex items-center gap-3">
                    <input
                      id="notifyNewOrder"
                      type="checkbox"
                      name="notifyNewOrder"
                      checked={settings.notifyNewOrder}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary focus:ring-primary"
                    />
                    <label className="text-sm font-medium text-neutral-800" htmlFor="notifyNewOrder">
                      اعلان سفارش جدید
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      id="notifyNewVendor"
                      type="checkbox"
                      name="notifyNewVendor"
                      checked={settings.notifyNewVendor}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary focus:ring-primary"
                    />
                    <label className="text-sm font-medium text-neutral-800" htmlFor="notifyNewVendor">
                      اعلان ثبت‌نام فروشنده جدید
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      id="notifyNewDealRequest"
                      type="checkbox"
                      name="notifyNewDealRequest"
                      checked={settings.notifyNewDealRequest}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary focus:ring-primary"
                    />
                    <label className="text-sm font-medium text-neutral-800" htmlFor="notifyNewDealRequest">
                      اعلان درخواست تخفیف جدید
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      id="notifySettlementRequest"
                      type="checkbox"
                      name="notifySettlementRequest"
                      checked={settings.notifySettlementRequest}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary focus:ring-primary"
                    />
                    <label className="text-sm font-medium text-neutral-800" htmlFor="notifySettlementRequest">
                      اعلان درخواست تسویه
                    </label>
                  </div>
                </>
              )}
            </motion.div>

            {/* Save Button */}
            <div className="mt-6">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
              </button>
            </div>

            {/* Success Toast */}
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-4 bg-success/10 text-success border border-success/20 rounded-lg text-sm font-medium"
                role="alert"
              >
                تنظیمات با موفقیت ذخیره شد.
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AdminSettingsPage;
