"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";

const days = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];

export default function ClinicsPage() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit">("create");
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    phone: "",
    address: "",
    city: "",
    lat: "",
    lng: "",
    workingHours: Array.from({ length: 7 }, () => ({
      isOpen: false,
      openTime: "",
      closeTime: "",
    })),
    services: [],
    newService: "",
    images: [],
    isSubmitting: false,
  });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchClinics = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/clinics`, { params: { search: searchTerm } });
      setClinics(response.data);
    } catch (error) {
      showToast("خطا در بارگذاری کلینیک‌ها", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, [searchTerm]);

  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      setSearchTerm(searchTerm);
      fetchClinics();
    }, 300);
    setDebounceTimer(timer);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleCreateClinic = async (data: FormData) => {
    try {
      await api.post(`/admin/clinics`, data);
      showToast("کلینیک با موفقیت افزوده شد", "success");
      closeModal();
      fetchClinics();
    } catch (error) {
      showToast("خطا در افزودن کلینیک", "error");
    }
  };

  const handleUpdateClinic = async (id: string, data: FormData) => {
    try {
      await api.put(`/admin/clinics/${id}`, data);
      showToast("کلینیک با موفقیت به‌روزرسانی شد", "success");
      closeModal();
      fetchClinics();
    } catch (error) {
      showToast("خطا در به‌روزرسانی کلینیک", "error");
    }
  };

  const handleDeleteClinic = async (id: string) => {
    if (!window.confirm("آیا از حذف این کلینیک مطمئن هستید؟")) return;
    try {
      await api.delete(`/admin/clinics/${id}`);
      showToast("کلینیک با موفقیت حذف شد", "success");
      fetchClinics();
    } catch (error) {
      showToast("خطا در حذف کلینیک", "error");
    }
  };

  const openCreateModal = () => {
    setModalType("create");
    setSelectedClinic(null);
    setFormState({
      name: "",
      description: "",
      phone: "",
      address: "",
      city: "",
      lat: "",
      lng: "",
      workingHours: Array.from({ length: 7 }, () => ({
        isOpen: false,
        openTime: "",
        closeTime: "",
      })),
      services: [],
      newService: "",
      images: [],
      isSubmitting: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (clinic: any) => {
    setModalType("edit");
    setSelectedClinic(clinic);
    setFormState({
      name: clinic.name || "",
      description: clinic.description || "",
      phone: clinic.phone || "",
      address: clinic.address || "",
      city: clinic.city || "",
      lat: clinic.lat?.toString() || "",
      lng: clinic.lng?.toString() || "",
      workingHours: clinic.workingHours
        ? clinic.workingHours.map((wh: any) => ({
            isOpen: wh.isOpen,
            openTime: wh.openTime || "",
            closeTime: wh.closeTime || "",
          }))
        : Array.from({ length: 7 }, () => ({
            isOpen: false,
            openTime: "",
            closeTime: "",
          })),
      services: clinic.services || [],
      newService: "",
      images: [],
      isSubmitting: false,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedClinic(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState((prev) => ({ ...prev, isSubmitting: true }));

    const formData = new FormData();
    formData.append("name", formState.name);
    formData.append("description", formState.description);
    formData.append("phone", formState.phone);
    formData.append("address", formState.address);
    formData.append("city", formState.city);
    formData.append("lat", formState.lat);
    formData.append("lng", formState.lng);
    formData.append(
      "workingHours",
      JSON.stringify(
        formState.workingHours.map((wh, index) => ({
          day: days[index],
          isOpen: wh.isOpen,
          openTime: wh.openTime,
          closeTime: wh.closeTime,
        }))
      )
    );
    formData.append("services", JSON.stringify(formState.services));
    formState.images.forEach((file) => {
      formData.append("images", file);
    });

    if (modalType === "create") {
      await handleCreateClinic(formData);
    } else if (selectedClinic) {
      await handleUpdateClinic(selectedClinic.id, formData);
    }

    setFormState((prev) => ({ ...prev, isSubmitting: false }));
  };

  const addService = () => {
    if (formState.newService.trim()) {
      setFormState((prev) => ({
        ...prev,
        services: [...prev.services, formState.newService.trim()],
        newService: "",
      }));
    }
  };

  const removeService = (index: number) => {
    setFormState((prev) => {
      const services = [...prev.services];
      services.splice(index, 1);
      return { ...prev, services };
    });
  };

  const getWorkingHoursSummary = (workingHours: any[]) => {
    if (!workingHours || workingHours.length === 0) return "غير مشخص";

    const openDays: string[] = [];
    workingHours.forEach((wh, index) => {
      if (wh.isOpen) {
        openDays.push(`${days[index]}: ${wh.openTime}-${wh.closeTime}`);
      }
    });

    if (openDays.length === 0) return "بسته تمام روزها";
    if (openDays.length === 7) return "باز 24 ساعته";

    return openDays.join(", ");
  };

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900">مدیریت کلینیک‌ها</h1>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          افزودن کلینیک
        </button>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium text-neutral-800 mb-2 block">جستجو</label>
        <input
          type="text"
          className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          placeholder="جستجو..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-neutral-200 shadow-sm">
              <div className="h-8 w-24 bg-neutral-200 rounded"></div>
              <div className="h-4 w-24 bg-neutral-200 rounded"></div>
              <div className="h-4 w-16 bg-neutral-200 rounded"></div>
              <div className="h-4 w-20 bg-neutral-200 rounded"></div>
              <div className="h-4 w-24 bg-neutral-200 rounded"></div>
              <div className="h-4 w-16 bg-neutral-200 rounded"></div>
              <div className="h-4 w-12 bg-neutral-200 rounded"></div>
              <div className="flex gap-2">
                <div className="h-4 w-8 bg-neutral-200 rounded"></div>
                <div className="h-4 w-8 bg-neutral-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-neutral-50">
              <th className="text-left text-sm font-medium text-neutral-600 py-3 px-4">لوگو</th>
              <th className="text-left text-sm font-medium text-neutral-600 py-3 px-4">نام کلینیک</th>
              <th className="text-left text-sm font-medium text-neutral-600 py-3 px-4">شهر</th>
              <th className="text-left text-sm font-medium text-neutral-600 py-3 px-4">تلفن</th>
              <th className="text-left text-sm font-medium text-neutral-600 py-3 px-4">ساعات کاری</th>
              <th className="text-left text-sm font-medium text-neutral-600 py-3 px-4">تعداد خدمات</th>
              <th className="text-left text-sm font-medium text-neutral-600 py-3 px-4">وضعیت</th>
              <th className="text-left text-sm font-medium text-neutral-600 py-3 px-4">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {clinics.map((clinic) => (
              <tr key={clinic.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                <td className="py-4 px-4 flex items-center">
                  {clinic.logo ? (
                    <img
                      src={clinic.logo}
                      alt={`${clinic.name} لوگو`}
                      className="h-8 w-8 object-cover rounded"
                    />
                  ) : (
                    <div className="h-8 w-8 bg-neutral-200 rounded flex items-center justify-center">
                      <span className="text-xs text-neutral-400">بدون لوگو</span>
                    </div>
                  )}
                </td>
                <td className="py-4 px-4 text-neutral-900">{clinic.name}</td>
                <td className="py-4 px-4 text-neutral-600">{clinic.city}</td>
                <td className="py-4 px-4 text-neutral-600">{clinic.phone}</td>
                <td className="py-4 px-4 text-neutral-600">
                  {getWorkingHoursSummary(clinic.workingHours)}
                </td>
                <td className="py-4 px-4 text-neutral-600">
                  {clinic.services?.length || 0}
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-flex items-center bg-${
                      clinic.isActive ? "success" : "danger"
                    }/10 text-${clinic.isActive ? "success" : "danger"} text-xs font-medium px-2.5 py-1 rounded-full`}
                  >
                    {clinic.isActive ? "فعال" : "غیرفعال"}
                  </span>
                </td>
                <td className="py-4 px-4 flex gap-2">
                  <button
                    onClick={() => openEditModal(clinic)}
                    className="inline-flex items-center justify-center gap-2 bg-white text-primary border border-primary font-medium text-base px-3 py-1.5 rounded-lg shadow-sm hover:bg-neutral-50 transition-all focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDeleteClinic(clinic.id)}
                    className="inline-flex items-center justify-center gap-2 bg-danger text-white font-medium text-base px-3 py-1.5 rounded-lg shadow-sm hover:bg-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger text-sm"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {toast && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
          toast.type === "success" ? "bg-success/90 text-white" : "bg-danger/90 text-white"
        }`}>
          {toast.message}
        </div>
      )}

      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        modalOpen ? "bg-black/50 backdrop-blur-sm" : "hidden"
      }`}>
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-neutral-900">
              {modalType === "create" ? "افزودن کلینیک جدید" : "ویرایش کلینیک"}
            </h3>
            <button
              onClick={closeModal}
              className="text-neutral-400 hover:text-neutral-600"
              aria-label="بستن مودال"
            >
              ×
            </button>
          </div>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-800">نام کلینیک</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-800">توضیحات</label>
              <textarea
                required
                className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all min-h-[80px]"
                value={formState.description}
                onChange={(e) => setFormState({ ...formState, description: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-800">شماره تماس</label>
              <input
                type="tel"
                required
                className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                value={formState.phone}
                onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-800">آدرس</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                value={formState.address}
                onChange={(e) => setFormState({ ...formState, address: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-800">شهر</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                value={formState.city}
                onChange={(e) => setFormState({ ...formState, city: e.target.value })}
              />
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-800">عرض جغرافیایی</label>
                <input
                  type="number"
                  step="any"
                  required
                  className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  value={formState.lat}
                  onChange={(e) => setFormState({ ...formState, lat: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-800">طول جغرافیایی</label>
                <input
                  type="number"
                  step="any"
                  required
                  className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  value={formState.lng}
                  onChange={(e) => setFormState({ ...formState, lng: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-800">ساعات کاری</label>
              <div className="space-y-2">
                {days.map((day, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formState.workingHours[index]?.isOpen || false}
                        onChange={(e) => {
                          const newWorkingHours = [...formState.workingHours];
                          newWorkingHours[index] = {
                            ...newWorkingHours[index],
                            isOpen: e.target.checked,
                          };
                          setFormState({ ...formState, workingHours: newWorkingHours });
                        }}
                        className="h-4 w-4 text-primary"
                      />
                      <span className="text-sm font-medium text-neutral-800">{day}</span>
                    </div>
                    {formState.workingHours[index]?.isOpen ? (
                      <>
                        <div className="flex-1">
                          <label className="text-xs font-medium text-neutral-600 mb-1">ساعت شروع</label>
                          <input
                            type="time"
                            required
                            className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            value={formState.workingHours[index]?.openTime || ""}
                            onChange={(e) => {
                              const newWorkingHours = [...formState.workingHours];
                              newWorkingHours[index] = {
                                ...newWorkingHours[index],
                                openTime: e.target.value,
                              };
                              setFormState({ ...formState, workingHours: newWorkingHours });
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs font-medium text-neutral-600 mb-1">ساعت پایان</label>
                          <input
                            type="time"
                            required
                            className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            value={formState.workingHours[index]?.closeTime || ""}
                            onChange={(e) => {
                              const newWorkingHours = [...formState.workingHours];
                              newWorkingHours[index] = {
                                ...newWorkingHours[index],
                                closeTime: e.target.value,
                              };
                              setFormState({ ...formState, workingHours: newWorkingHours });
                            }}
                          />
                        </div>
                      </>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-800">خدمات</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="نام خدمت را وارد کنید"
                  className="flex-1 px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  value={formState.newService}
                  onChange={(e) => setFormState({ ...formState, newService: e.target.value })}
                />
                <button
                  onClick={addService}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-4 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  افزودن
                </button>
              </div>
              {formState.services.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm font-medium text-neutral-800">لیست خدمات:</span>
                  <ul className="mt-2 space-y-1">
                    {formState.services.map((service, index) => (
                      <li key={index} className="flex items-center justify-between bg-neutral-50 p-2 rounded">
                        <span className="text-neutral-700">{service}</span>
                        <button
                          onClick={() => removeService(index)}
                          className="text-neutral-500 hover:text-neutral-600"
                          aria-label={`حذف خدمت ${service}`}
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-800">تصاویر</label>
              <div className="flex flex-wrap gap-2">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  id="image-upload"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setFormState({ ...formState, images: files });
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById("image-upload")?.click()}
                  className="inline-flex items-center justify-center gap-2 bg-neutral-100 text-neutral-600 font-medium text-base px-4 py-2.5 rounded-lg hover:bg-neutral-200 transition-all"
                >
                  انتخاب تصاویر
                </button>
                {formState.images.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formState.images.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`پیش‌نمایش تصویر ${index + 1}`}
                          className="h-16 w-16 object-cover rounded"
                        />
                        <button
                          onClick={() => {
                            const newImages = [...formState.images];
                            newImages.splice(index, 1);
                            setFormState({ ...formState, images: newImages });
                          }}
                          className="absolute -top-2 -right-2 h-6 w-6 bg-danger text-white text-xs font-bold flex items-center justify-center rounded-full hover:bg-red-600"
                          aria-label={`حذف تصویر ${index + 1}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex items-center justify-center gap-2 bg-neutral-100 text-neutral-600 font-medium text-base px-6 py-2.5 rounded-lg hover:bg-neutral-200 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={formState.isSubmitting}
                className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {formState.isSubmitting ? "در حال ذخیره..." : modalType === "create" ? "افزودن کلینیک" : "به‌روزرسانی"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
