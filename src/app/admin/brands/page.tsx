"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

const API_BRANDS = "/api/admin/brands";

type Brand = {
  id: string;
  name: string;
  logoUrl?: string;
  productCount?: number;
  description?: string;
};

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Brand>>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; show: boolean }>({
    message: "",
    type: "success",
    show: false,
  });

  // Fetch brands
  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BRANDS);
      if (!res.ok) throw new Error("خطا در دریافت برندها");
      const data: Brand[] = await res.json();
      setBrands(data);
    } catch (err) {
      showToast((err as Error).message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Add brand
  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", formData.name ?? "");
    form.append("description", formData.description ?? "");
    if (logoFile) form.append("logo", logoFile);
    try {
      const res = await fetch(API_BRANDS, {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error("خطا در افزودن برند");
      showToast("برند با موفقیت افزوده شد", "success");
      setModalOpen(false);
      resetForm();
      await fetchBrands();
    } catch (err) {
      showToast((err as Error).message, "error");
    }
  };

  // Update brand
  const handleUpdateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    const form = new FormData();
    form.append("name", formData.name ?? "");
    form.append("description", formData.description ?? "");
    if (logoFile) form.append("logo", logoFile);
    try {
      const res = await fetch(`${API_BRANDS}/${editingId}`, {
        method: "PUT",
        body: form,
      });
      if (!res.ok) throw new Error("خطا در ویرایش برند");
      showToast("برند با موفقیت ویرایش شد", "success");
      setModalOpen(false);
      resetForm();
      await fetchBrands();
    } catch (err) {
      showToast((err as Error).message, "error");
    }
  };

  // Delete brand
  const handleDeleteBrand = async (id: string) => {
    if (!window.confirm("آیا از حذف این برند اطمینان دارید؟")) return;
    try {
      const res = await fetch(`${API_BRANDS}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("خطا در حذف برند");
      showToast("برند حذف شد", "success");
      await fetchBrands();
    } catch (err) {
      showToast((err as Error).message, "error");
    }
  };

  // Toast
  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ message: msg, type, show: true });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  // Reset form
  const resetForm = () => {
    setFormData({});
    setLogoPreview(null);
    setLogoFile(null);
  };

  // Open add modal
  const openAddModal = () => {
    setEditingId(null);
    resetForm();
    setModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (brand: Brand) => {
    setEditingId(brand.id);
    setFormData({
      name: brand.name,
      description: brand.description ?? "",
    });
    setLogoPreview(brand.logoUrl ?? null);
    setLogoFile(null);
    setModalOpen(true);
  };

  // Handle logo change
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const preview = URL.createObjectURL(file);
    setLogoPreview(preview);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Filtered brands
  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  // Skeleton card
  const SkeletonCard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.random() * 0.2 }}
      className="bg-neutral-100 rounded-lg overflow-hidden hover:shadow-md transition-all"
    >
      <div className="h-48"></div>
      <div className="p-4">
        <div className="h-6 bg-neutral-200 rounded mb-2 w-1/2 animate-pulse"></div>
        <div className="h-4 bg-neutral-200 rounded mb-1 w-3/4 animate-pulse"></div>
        <div className="h-4 bg-neutral-200 rounded w-1/2 animate-pulse"></div>
      </div>
    </motion.div>
  );

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-160px)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex flex-col items-center justify-between sm:flex-row sm:items-start">
            <h1 className="text-3xl font-bold text-neutral-900 mb-4 sm:mb-0">مدیریت برندها</h1>
            <div className="w-full max-w-sm sm:w-auto">
              <label className="text-sm font-medium text-neutral-800 mb-1 block">جستجو بر اساس نام</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="نام برند..."
                dir="ltr"
              />
            </div>
          </div>

          {/* Add Brand Button */}
          <div className="mb-6">
            <button
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              افزودن برند
            </button>
          </div>

          {/* Toast */}
          {toast.show && (
            <div className="fixed bottom-4 start-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg">
              {toast.type === "success" ? (
                <svg className="h-5 w-5 text-success" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-danger" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span className="text-base">{toast.message}</span>
            </div>
          )}

          {/* Brands Grid */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            ) : filteredBrands.length === 0 ? (
              <p className="col-span-full text-center text-neutral-600 py-8">برندی یافت نشد.</p>
            ) : (
              filteredBrands.map((brand) => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden transition-all hover:shadow-md"
                >
                  <div className="relative">
                    {brand.logoUrl ? (
                      <img
                        src={brand.logoUrl}
                        alt={`لوگو ${brand.name}`}
                        className="w-full h-48 object-center"
                      />
                    ) : (
                      <div className="w-full h-48 bg-neutral-100 flex items-center justify-center">
                        <span className="text-neutral-400">بدون لوگو</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">{brand.name}</div>
                    <p className="text-sm text-neutral-600 mb-4">
                      تعداد محصولات: {brand.productCount ?? 0}
                    </p>
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                      <button
                        onClick={() => openEditModal(brand)}
                        className="inline-flex items-center justify-center gap-2 bg-white text-primary border border-primary font-medium text-sm px-3 py-1.5 rounded-md hover:bg-neutral-50 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        ویرایش
                      </button>
                      <button
                        onClick={() => handleDeleteBrand(brand.id)}
                        className="inline-flex items-center justify-center gap-2 bg-danger text-white font-medium text-sm px-3 py-1.5 rounded-md hover:bg-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger"
                        aria-label={`حذف برند ${brand.name}`}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">
              {editingId ? "ویرایش برند" : "افزودن برند"}
            </h3>
            <form onSubmit={editingId ? handleUpdateBrand : handleAddBrand} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-800 block mb-1">نام برند</label>
                <input
                  type="text"
                  value={formData.name ?? ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="نام برند"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-800 block mb-1">توضیحات (اختیاری)</label>
                <textarea
                  value={formData.description ?? ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all h-20 resize-y"
                  placeholder="توضیحات برند"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-800 block mb-1">لوگو برند</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="w-full px-4 py-2.5 text-sm font-medium text-neutral-600"
                />
                {logoPreview && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-neutral-800 mb-1">پیش‌نمایش لوگو</p>
                    <img
                      src={logoPreview}
                      alt="پیش‌نمایش لوگو"
                      className="w-32 h-32 object-center border border-neutral-200 rounded-md"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    resetForm();
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-transparent text-neutral-600 font-medium text-base px-4 py-2.5 rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingId ? "بروزرسانی" : "افزودن"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
