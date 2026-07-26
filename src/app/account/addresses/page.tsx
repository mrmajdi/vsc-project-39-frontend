import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

// Define types for address and form data
type Address = {
  id: string;
  recipient_name: string;
  phone: string;
  province: string;
  city: string;
  address_line: string;
  postal_code: string;
  address_type: 'home' | 'work' | 'other';
};

type FormData = {
  recipient_name: string;
  phone: string;
  province: string;
  city: string;
  address_line: string;
  postal_code: string;
  address_type: 'home' | 'work' | 'other';
};

// Static data for provinces and cities (simplified for example)
const provinces = [
  { value: 'tehran', label: 'تهران' },
  { value: 'esfahan', label: 'اصفهان' },
  { value: 'fars', label: 'فارس' },
  { value: 'khorasan_razavi', label: 'خراسان رضوی' },
];

const citiesByProvince: Record<string, { value: string; label: string }[]> = {
  tehran: [
    { value: 'tehran', label: 'تهران' },
    { value: 'karaj', label: 'کرج' },
    { value: 'qom', label: 'قم' },
    { value: 'rey', label: 'ری' },
  ],
  esfahan: [
    { value: 'esfahan', label: 'اصفهان' },
    { value: 'kashan', label: 'کاشان' },
    { value: 'khansar', label: 'خانسار' },
  ],
  fars: [
    { value: 'shiraz', label: 'شیراز' },
    { value: 'marvdasht', label: 'مرودشت' },
    { value: 'jahrom', label: 'جهrom' },
  ],
  khorasan_razavi: [
    { value: 'mashhad', label: 'مشهد' },
    { value: 'neyshabur', label: 'نیشابور' },
    { value: 'sabzevar', label: 'سبzewار' },
  ],
};

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [formData, setFormData] = useState<FormData>({
    recipient_name: '',
    phone: '',
    province: '',
    city: '',
    address_line: '',
    postal_code: '',
    address_type: 'home',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editAddressId, setEditAddressId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [addressToDeleteId, setAddressToDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch addresses from API
  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/user/addresses');
      if (!res.ok) throw new Error('Failed to fetch addresses');
      const data: Address[] = await res.json();
      setAddresses(data);
    } catch (err) {
      console.error(err);
      setAddresses([]); // Treat as empty on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field on input
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle province change to update cities
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceValue = e.target.value;
    setFormData(prev => ({
      ...prev,
      province: provinceValue,
      city: '', // Reset city when province changes
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.recipient_name.trim()) {
      newErrors.recipient_name = 'نام گیرنده الزامی است';
    }
    const phoneRegex = /^09\d{9}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'شماره تماس الزامی است';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'شماره تماس باید 11 رقم باشد و با 09 شروع شود';
    }
    if (!formData.province) {
      newErrors.province = 'استان الزامی است';
    }
    if (!formData.city) {
      newErrors.city = 'شهر الزامی است';
    }
    if (!formData.address_line.trim()) {
      newErrors.address_line = 'آدرس کامل الزامی است';
    }
    const postalCodeRegex = /^\d{10}$/;
    if (!formData.postal_code.trim()) {
      newErrors.postal_code = 'کد پستی الزامی است';
    } else if (!postalCodeRegex.test(formData.postal_code)) {
      newErrors.postal_code = 'کد پستی باید 10 رقم باشد';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit (add or edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let res;
      if (isEditMode && editAddressId) {
        res = await fetch(`/api/user/addresses/${editAddressId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch('/api/user/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }

      if (!res.ok) throw new Error('Failed to save address');
      await fetchAddresses();
      closeModals();
    } catch (err) {
      console.error(err);
      alert('خطا در ذخیره آدرس');
    } finally {
      setIsLoading(false);
    }
  };

  // Open add modal
  const openAddModal = () => {
    setIsEditMode(false);
    setEditAddressId(null);
    setFormData({
      recipient_name: '',
      phone: '',
      province: '',
      city: '',
      address_line: '',
      postal_code: '',
      address_type: 'home',
    });
    setErrors({});
    setIsModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (address: Address) => {
    setIsEditMode(true);
    setEditAddressId(address.id);
    setFormData({
      recipient_name: address.recipient_name,
      phone: address.phone,
      province: address.province,
      city: address.city,
      address_line: address.address_line,
      postal_code: address.postal_code,
      address_type: address.address_type,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  // Close modals
  const closeModals = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!addressToDeleteId) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/user/addresses/${addressToDeleteId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete address');
      await fetchAddresses();
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('خطا در حذف آدرس');
    } finally {
      setDeleteLoading(false);
      setAddressToDeleteId(null);
    }
  };

  // Render address type badge
  const renderAddressTypeBadge = (type: Address['address_type']) => {
    switch (type) {
      case 'home':
        return (
          <span className="inline-flex items-center bg-secondary/10 text-secondary text-xs font-medium px-2.5 py-1 rounded-full">
            خانه
          </span>
        );
      case 'work':
        return (
          <span className="inline-flex items-center bg-accent/10 text-accent text-xs font-medium px-2.5 py-1 rounded-full">
            محل کار
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center bg-neutral-100 text-neutral-600 text-xs font-medium px-2.5 py-1 rounded-full">
            سایر
          </span>
        );
    }
  };

  // Render location pin SVG
  const LocationPin = () => (
    <svg
      aria-hidden="true"
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 5.5 12 5.5s2.5 1.12 2.5 2.5S13.38 10.5 12 10.5z"
        fill="currentColor"
      />
    </svg>
  );

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header and Footer are provided by layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page title and add button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-neutral-900">آدرس‌های من</h1>
          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            افزودن آدرس
          </button>
        </div>

        {/* Loading state */}
        {isLoading && addresses === null && (
          <div className="flex min-h-[200px] items-center justify-center">
            <div className="flex h-5 w-5 items-center justify-center border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Empty state */}
        {addresses === [] && (
          <div className="text-center py-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-neutral-100 text-neutral-400 rounded-full">
                <LocationPin />
              </div>
            </div>
            <p className="text-base text-neutral-600">هیچ آدرسی ثبت نشده است</p>
            <button
              onClick={openAddModal}
              className="mt-4 inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              افزودن آدرس
            </button>
          </div>
        )}

        {/* Addresses list */}
        {addresses && addresses.length > 0 && (
          <motion.ul
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            {addresses.map((address) => (
              <motion.li
                key={address.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Left side: icon and details */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-neutral-50 text-neutral-600 rounded-full">
                      <LocationPin />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-lg font-semibold">{address.recipient_name}</p>
                      <p className="text-sm text-neutral-600">{address.phone}</p>
                      <p className="text-sm text-neutral-800">
                        {address.province}, {address.city}, {address.address_line} - کد پستی: {address.postal_code}
                      </p>
                      {renderAddressTypeBadge(address.address_type)}
                    </div>
                  </div>

                  {/* Right side: action buttons */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
                    <button
                      onClick={() => openEditModal(address)}
                      className="inline-flex items-center justify-center gap-1 bg-transparent text-neutral-600 font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
                    >
                      ویرایش
                    </button>
                    <button
                      onClick={() => {
                        setAddressToDeleteId(address.id);
                        setIsDeleteModalOpen(true);
                      }}
                      className="inline-flex items-center justify-center gap-1 bg-transparent text-danger font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-danger/10 transition-all focus:outline-none focus:ring-2 focus:ring-danger"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>

      {/* Add/Edit Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ isModalOpen ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 } }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      >
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 relative">
          <button
            onClick={closeModals}
            className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-600"
            aria-label="بستن"
          >
            <svg
              aria-hidden="true"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <h3 className="text-xl font-semibold text-neutral-900 mb-4">
            {isEditMode ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Recipient name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-800">نام گیرنده</label>
              <input
                type="text"
                name="recipient_name"
                value={formData.recipient_name}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                  errors.recipient_name ? 'border-danger' : ''
                }`}
                placeholder="نام گیرنده را وارد کنید"
                required
              />
              {errors.recipient_name && (
                <span className="text-xs text-danger">{errors.recipient_name}</span>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-800">شماره تماس</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                  errors.phone ? 'border-danger' : ''
                }`}
                placeholder="09123456789"
                required
              />
              {errors.phone && (
                <span className="text-xs text-danger">{errors.phone}</span>
              )}
            </div>

            {/* Province */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-800">استان</label>
              <select
                name="province"
                value={formData.province}
                onChange={handleProvinceChange}
                className={`w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                  errors.province ? 'border-danger' : ''
                }`}
                required
              >
                <option value="">استان را انتخاب کنید</option>
                {provinces.map((province) => (
                  <option key={province.value} value={province.value}>
                    {province.label}
                  </option>
                ))}
              </select>
              {errors.province && (
                <span className="text-xs text-danger">{errors.province}</span>
              )}
            </div>

            {/* City */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-800">شهر</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                  errors.city ? 'border-danger' : ''
                }`}
                required
              >
                <option value="">شهر را انتخاب کنید</option>
                {citiesByProvince[formData.province]?.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                )) || []}
              </select>
              {errors.city && (
                <span className="text-xs text-danger">{errors.city}</span>
              )}
            </div>

            {/* Address line */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-800">آدرس کامل</label>
              <textarea
                name="address_line"
                value={formData.address_line}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all h-16 resize-none ${
                  errors.address_line ? 'border-danger' : ''
                }`}
                placeholder="آدرس کامل را وارد کنید"
                required
              />
              {errors.address_line && (
                <span className="text-xs text-danger">{errors.address_line}</span>
              )}
            </div>

            {/* Postal code */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-800">کد پستی</label>
              <input
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                  errors.postal_code ? 'border-danger' : ''
                }`}
                placeholder="1234567890"
                required
              />
              {errors.postal_code && (
                <span className="text-xs text-danger">{errors.postal_code}</span>
              )}
            </div>

            {/* Address type */}
            <fieldset className="flex flex-col gap-1.5">
              <legend className="text-sm font-medium text-neutral-800">نوع آدرس</legend>
              <div className="flex flex-col gap-2 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="address_type"
                    value="home"
                    checked={formData.address_type === 'home'}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <label className="text-sm font-medium text-neutral-800">خانه</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="address_type"
                    value="work"
                    checked={formData.address_type === 'work'}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <label className="text-sm font-medium text-neutral-800">محل کار</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="address_type"
                    value="other"
                    checked={formData.address_type === 'other'}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <label className="text-sm font-medium text-neutral-800">سایر</label>
                </div>
              </fieldset>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed ${
                isLoading ? 'pointer-events-none' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <div className="flex h-4 w-4 items-center justify-center border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-2">در حال ذخیره...</span>
                </>
              ) : (
                isEditMode ? 'به‌روزرسانی آدرس' : 'افزودن آدرس'
              )}
            </button>
          </form>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ isDeleteModalOpen ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 } }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      >
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 relative">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-600"
            aria-label="بستن"
          >
            <svg
              aria-hidden="true"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <h3 className="text-xl font-semibold text-neutral-900 mb-4">تایید حذف</h3>
          <p className="text-neutral-600 mb-6">
            آیا از حذف این آدرس مطمئن هستید؟ این عمل غیرقابل بازگشت است.
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-end sm:gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="inline-flex items-center justify-center gap-2 bg-transparent text-neutral-600 font-medium text-base px-6 py-2.5 rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
            >
              لغو
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
              className={`inline-flex items-center justify-center gap-2 bg-danger text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger disabled:opacity-50 disabled:cursor-not-allowed ${
                deleteLoading ? 'pointer-events-none' : ''
              }`}
            >
              {deleteLoading ? 'در حال حذف...' : 'حذف'}
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
