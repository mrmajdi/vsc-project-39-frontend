"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Address {
  id: string;
  recipientName: string;
  phone: string;
  province: string;
  city: string;
  postalCode: string;
  address: string;
}

interface FormData {
  recipientName: string;
  phone: string;
  province: string;
  city: string;
  postalCode: string;
  address: string;
}

const CheckoutAddressForm = ({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddAddress,
}: {
  addresses: Address[];
  selectedAddressId: string | null;
  onSelectAddress: (id: string) => void;
  onAddAddress: (data: FormData) => void;
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<FormData>({
    recipientName: "",
    phone: "",
    province: "",
    city: "",
    postalCode: "",
    address: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.recipientName.trim()) newErrors.recipientName = "نام گیرنده الزامی است";
    const phoneRegex = /^09\d{9}$/;
    if (!form.phone.trim()) newErrors.phone = "شماره تماس الزامی است";
    else if (!phoneRegex.test(form.phone)) newErrors.phone = "شماره تماس باید 11 رقم و با 09 شروع شود";
    if (!form.province.trim()) newErrors.province = "استان الزامی است";
    if (!form.city.trim()) newErrors.city = "شهر الزامی است";
    const postalRegex = /^\d{10}$/;
    if (!form.postalCode.trim()) newErrors.postalCode = "کد پستی الزامی است";
    else if (!postalRegex.test(form.postalCode)) newErrors.postalCode = "کد پستی باید 10 رقم باشد";
    if (!form.address.trim()) newErrors.address = "آدرس کامل الزامی است";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onAddAddress(form);
      setForm({
        recipientName: "",
        phone: "",
        province: "",
        city: "",
        postalCode: "",
        address: "",
      });
      setIsAdding(false);
    }
  };

  return (
    <div dir="rtl" className="bg-white rounded-lg border border-neutral-200 shadow-sm transition-all hover:shadow-md p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">
        آدرس تحویل
      </h3>

      {addresses.length > 0 ? (
        <>
          {addresses.map((addr) => (
            <label
              key={addr.id}
              onClick={() => onSelectAddress(addr.id)}
              className={`block p-4 border border-neutral-200 rounded-lg mb-3 cursor-pointer hover:border-primary transition-all ${
                selectedAddressId === addr.id
                  ? "border-primary bg-primary/5"
                  : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="address"
                  value={addr.id}
                  checked={selectedAddressId === addr.id}
                  onChange={() => onSelectAddress(addr.id)}
                  className="h-4 w-4 text-primary border-neutral-200 rounded focus:ring-primary"
                  aria-hidden="true"
                />
                <div className="flex-1 space-y-1">
                  <div className="text-sm font-medium">{addr.recipientName}</div>
                  <div className="text-sm text-neutral-600">
                    {addr.address}, {addr.city}, {addr.province} {addr.postalCode}
                  </div>
                  <div className="text-xs text-neutral-400">{addr.phone}</div>
                </div>
              </div>
            </label>
          ))}
          <button
            type="button"
            onClick={() => setIsAdding((prev) => !prev)}
            className="mt-4 inline-flex items-center justify-center gap-2 bg-transparent text-neutral-600 font-medium text-base px-4 py-2.5 rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            افزودن آدرس جدید
          </button>
        </>
      ) : (
        <p className="text-neutral-600">هیچ آدرسی ثبت نشده است.</p>
      )}

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden mt-6"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-800">
                  نام گیرنده
                </label>
                <input
                  type="text"
                  placeholder="نام و نام خانوادگی"
                  value={form.recipientName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, recipientName: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                {errors.recipientName && (
                  <span className="text-xs text-danger">{errors.recipientName}</span>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-800">
                  شماره تماس
                </label>
                <input
                  type="tel"
                  placeholder="09123456789"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                {errors.phone && (
                  <span className="text-xs text-danger">{errors.phone}</span>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-800">
                  استان
                </label>
                <input
                  type="text"
                  placeholder="استان"
                  value={form.province}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, province: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                {errors.province && (
                  <span className="text-xs text-danger">{errors.province}</span>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-800">
                  شهر
                </label>
                <input
                  type="text"
                  placeholder="شهر"
                  value={form.city}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, city: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                {errors.city && (
                  <span className="text-xs text-danger">{errors.city}</span>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-800">
                  کد پستی
                </label>
                <input
                  type="text"
                  placeholder="1234567890"
                  value={form.postalCode}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, postalCode: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                {errors.postalCode && (
                  <span className="text-xs text-danger">{errors.postalCode}</span>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-800">
                  آدرس کامل
                </label>
                <textarea
                  placeholder="خیابان، پلاک، واحد و ..."
                  value={form.address}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, address: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  rows={3}
                />
                {errors.address && (
                  <span className="text-xs text-danger">{errors.address}</span>
                )}
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-sm px-4 py-2 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ذخیره آدرس
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckoutAddressForm;
