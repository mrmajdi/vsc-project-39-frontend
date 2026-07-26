'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

type Banner = {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  position: 'hero' | 'sidebar' | 'promo badge';
  sortOrder: number;
  isActive: boolean;
};

type BannerForm = {
  title: string;
  imageUrl: string;
  file: File | null;
  linkUrl: string;
  position: 'hero' | 'sidebar' | 'promo badge';
  sortOrder: number;
  isActive: boolean;
};

const BannersPage = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [currentBanner, setCurrentBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState<BannerForm>({
    title: '',
    imageUrl: '',
    file: null,
    linkUrl: '',
    position: 'hero',
    sortOrder: 0,
    isActive: true
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/banners');
      setBanners(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'خطا در بارگذاری بنرها');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await api.put(`/admin/banners/${id}`, { isActive });
      setBanners(prev =>
        prev.map(banner =>
          banner.id === id ? { ...banner, isActive } : banner
        )
      );
    } catch (err: any) {
      setBanners(prev =>
        prev.map(banner =>
          banner.id === id ? { ...banner, isActive: !isActive } : banner
        )
      );
      setError(err.response?.data?.message || 'خطا در تغییر وضعیت');
    }
  };

  const handleEdit = (banner: Banner) => {
    setCurrentBanner(banner);
    setModalType('edit');
    setFormData({
      title: banner.title,
      imageUrl: banner.imageUrl,
      file: null,
      linkUrl: banner.linkUrl,
      position: banner.position,
      sortOrder: banner.sortOrder,
      isActive: banner.isActive
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('آیا از حذف این بنر مطمئن هستید؟')) {
      try {
        await api.delete(`/admin/banners/${id}`);
        setBanners(prev => prev.filter(banner => banner.id !== id));
      } catch (err: any) {
        setError(err.response?.data?.message || 'خطا در حذف بنر');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append('title', formData.title);
    formDataObj.append('linkUrl', formData.linkUrl);
    formDataObj.append('position', formData.position);
    formDataObj.append('sortOrder', formData.sortOrder.toString());
    formDataObj.append('isActive', formData.isActive.toString());
    if (formData.file) {
      formDataObj.append('image', formData.file);
    }

    try {
      if (modalType === 'create') {
        await api.post('/admin/banners', formDataObj);
      } else {
        if (!currentBanner) throw new Error('هیچ بنری برای ویرایش یافت نشد');
        await api.put(`/admin/banners/${currentBanner.id}`, formDataObj);
      }
      setModalOpen(false);
      await fetchBanners();
    } catch (err: any) {
      setError(err.response?.data?.message || 'خطا در ذخیره‌سازی');
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {loading && (
        <p className="text-center text-neutral-500">در حال بارگذاری...</p>
      )}
      {error && (
        <p className="text-center text-danger">خطا: {error}</p>
      )}
      {!loading && !error && (
        <>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-neutral-900">مدیریت بنرها</h2>
            <button
              onClick={() => {
                setModalType('create');
                setCurrentBanner(null);
                setFormData({
                  title: '',
                  imageUrl: '',
                  file: null,
                  linkUrl: '',
                  position: 'hero',
                  sortOrder: 0,
                  isActive: true
                });
                setModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              افزودن بنر
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {banners.map(banner => (
              <div
                key={banner.id}
                className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden transition-all hover:shadow-md"
              >
                <div className="p-4">
                  {banner.imageUrl ? (
                    <img
                      src={banner.imageUrl}
                      alt="پیش‌نمایش بنر"
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center border-2 border-dashed border-neutral-200 rounded-md">
                      <span className="text-neutral-400">بدون تصویر</span>
                    </div>
                  )}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-neutral-900">{banner.title}</h3>
                    <div className="flex flex-wrap gap-2 text-sm text-neutral-600">
                      <span>موقعیت: {banner.position}</span>
                      <span>ترتیب: {banner.sortOrder}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={banner.isActive}
                          onChange={(e) => handleToggleActive(banner.id, e.target.checked)}
                          className="h-4 w-4 rounded border-neutral-200 text-primary focus:ring-primary"
                        />
                        <span className="text-neutral-600">فعال</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(banner)}
                          className="inline-flex items-center justify-center gap-2 bg-transparent text-neutral-600 font-medium text-base px-4 py-2.5 rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
                        >
                          ویرایش
                        </button>
                        <button
                          onClick={() => handleDelete(banner.id)}
                          className="inline-flex items-center justify-center gap-2 bg-danger text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                {modalType === 'create' ? 'افزودن بنر جدید' : 'ویرایش بنر'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-1.5 mb-4">
                  <label className="text-sm font-medium text-neutral-800">عنوان</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="عنوان بنر"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5 mb-4">
                  <label className="text-sm font-medium text-neutral-800">تصویر</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setFormData(prev => ({
                          ...prev,
                          file: file,
                          imageUrl: file ? URL.createObjectURL(file) : ''
                        }));
                      }}
                      className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                    {formData.imageUrl && (
                      <img
                        src={formData.imageUrl}
                        alt="پیش‌نمایش تصویر"
                        className="mt-2 w-full h-48 object-cover rounded-md"
                      />
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 mb-4">
                  <label className="text-sm font-medium text-neutral-800">لینک</label>
                  <input
                    type="text"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkUrl: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="flex flex-col gap-1.5 mb-4">
                  <label className="text-sm font-medium text-neutral-800">موقعیت</label>
                  <select
                    value={formData.position}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        position: e.target.value as 'hero' | 'sidebar' | 'promo badge'
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="hero">هيرو</option>
                    <option value="sidebar">سایدبار</option>
                    <option value="promo badge">Badge تبلیغاتی</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 mb-4">
                  <label className="text-sm font-medium text-neutral-800">ترتیب نمایش</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        sortOrder: Number(e.target.value) || 0
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    min="0"
                  />
                </div>

                <div className="flex flex-col gap-1.5 mb-6">
                  <label className="text-sm font-medium text-neutral-800">وضعیت</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="h-4 w-4 rounded border-neutral-200 text-primary focus:ring-primary"
                    />
                    <span className="text-neutral-600">فعال</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {modalType === 'create' ? 'ایجاد بنر' : 'به‌روزرسانی بنر'}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="inline-flex items-center justify-center gap-2 bg-transparent text-neutral-600 font-medium text-base px-4 py-2.5 rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400 ml-2"
                >
                  انصراف
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default BannersPage;
