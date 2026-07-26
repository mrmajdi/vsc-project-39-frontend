"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../../lib/api";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/admin/dashboard");
        setData(response.data);
        setError(null);
      } catch (err) {
        setError("خطا در بارگذاری داده‌ها");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-neutral-900">پنل مدیریت</h1>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-danger text-center text-lg">خطا در بارگذاری داده‌ها</p>
        </div>
        <footer className="bg-neutral-900 text-neutral-400 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-neutral-900">درباره پت‌شاپ</h3>
              <p className="text-neutral-600">
                مارکت‌پلچس چند فروشنده‌ای برای محصولات و خدمات حیوانات خانگی
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-neutral-900">دسترسی سریع</h3>
              <nav className="space-y-2">
                <a href="/" className="text-neutral-600 hover:text-primary transition-colors">
                  صفحه اصلی
                </a>
                <a href="/products" className="text-neutral-600 hover:text-primary transition-colors">
                  محصولات
                </a>
                <a href="/vendors" className="text-neutral-600 hover:text-primary transition-colors">
                  فروشندگان
                </a>
                <a href="/blogs" className="text-neutral-600 hover:text-primary transition-colors">
                  وبلاگ
                </a>
              </nav>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-neutral-900">دسترسی سریع</h3>
              <nav className="space-y-2">
                <a href="/account" className="text-neutral-600 hover:text-primary transition-colors">
                  حساب کاربری
                </a>
                <a href="/vendor" className="text-neutral-600 hover:text-primary transition-colors">
                  پنل فروشنده
                </a>
                <a href="/admin" className="text-neutral-600 hover:text-primary transition-colors">
                  پنل مدیریت
                </a>
                <a href="/help" className="text-neutral-600 hover:text-primary transition-colors">
                  راهنمایی
                </a>
              </nav>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-neutral-900">تماس با ما</h3>
              <p className="text-neutral-600">
                <span className="mr-2">📞</span> 021-12345678
              </p>
              <p className="text-neutral-600">
                <span className="mr-2">📧</span> info@petshop.ir
              </p>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="text-neutral-500 hover:text-primary transition-colors"
                  aria-label="اینستاگرام"
                >
                  <!-- Instagram icon placeholder -->
                  <span className="material-icons">photo_camera</span>
                </a>
                <a
                  href="#"
                  className="text-neutral-500 hover:text-primary transition-colors"
                  aria-label="توییتر"
                >
                  <!-- Twitter icon placeholder -->
                  <span className="material-icons">public</span>
                </a>
                <a
                  href="#"
                  className="text-neutral-500 hover:text-primary transition-colors"
                  aria-label="تلگرام"
                >
                  <!-- Telegram icon placeholder -->
                  <span className="material-icons">chat</span>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-neutral-800 py-6 text-center text-sm">
            © ۲۰۲۳ پت‌شاپ. تمام حقوق محفوظ است.
          </div>
        </footer>
      </main>
    );
  }

  const renderSkeleton = () => (
    <div className="animate-pulse bg-neutral-200 h-4 rounded"></div>
  );

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + " میلیون";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + " هزار";
    }
    return num.toString();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-neutral-900">پنل مدیریت</h1>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((_, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                  }}
                >
                  <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-flex items-center justify-center text-white font-bold">
                          {/* Placeholder icon */}
                          {index === 0 && "ر"}
                          {index === 1 && "س"}
                          {index === 2 && "ف"}
                          {index === 3 && "و"}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-neutral-600">
                            {/* Placeholder labels */}
                            {index === 0 && "درآمد کل"}
                            {index === 1 && "تعداد سفارشات"}
                            {index === 2 && "تعداد فروشندگان"}
                            {index === 3 && "تعداد کاربران"}
                          </p>
                          <p className="text-2xl font-bold text-neutral-900">
                            {renderSkeleton()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6">
                <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                  درآمد پلتفرم
                </div>
                <div className="h-48 bg-neutral-200 animate-pulse rounded"></div>
              </div>

              <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6">
                <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                  توزیع پت‌های ثبت‌شده
                </h3>
                <div className="h-48 bg-neutral-200 animate-pulse rounded flex items-center justify-center">
                  <span className="text-neutral-400">در حال بارگذاری...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="bg-neutral-900 text-neutral-400 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-neutral-900">درباره پت‌شاپ</h3>
              <p className="text-neutral-600">
                مارکت‌پلچس چند فروشنده‌ای برای محصولات و خدمات حیوانات خانگی
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-neutral-900">دسترسی سریع</h3>
              <nav className="space-y-2">
                <a href="/" className="text-neutral-600 hover:text-primary transition-colors">
                  صفحه اصلی
                </a>
                <a href="/products" className="text-neutral-600 hover:text-primary transition-colors">
                  محصولات
                </a>
                <a href="/vendors" className="text-neutral-600 hover:text-primary transition-colors">
                  فروشندگان
                </a>
                <a href="/blogs" className="text-neutral-600 hover:text-primary transition-colors">
                  وبلاگ
                </a>
              </nav>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-neutral-900">دسترسی سریع</h3>
              <nav className="space-y-2">
                <a href="/account" className="text-neutral-600 hover:text-primary transition-colors">
                  حساب کاربری
                </a>
                <a href="/vendor" className="text-neutral-600 hover:text-primary transition-colors">
                  پنل فروشنده
                </a>
                <a href="/admin" className="text-neutral-600 hover:text-primary transition-colors">
                  پنل مدیریت
                </a>
                <a href="/help" className="text-neutral-600 hover:text-primary transition-colors">
                  راهنمایی
                </a>
              </nav>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-neutral-900">تماس با ما</h3>
              <p className="text-neutral-600">
                <span className="mr-2">📞</span> 021-12345678
              </p>
              <p className="text-neutral-600">
                <span className="mr-2">📧</span> info@petshop.ir
              </p>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="text-neutral-500 hover:text-primary transition-colors"
                  aria-label="اینستاگرام"
                >
                  <span className="material-icons">photo_camera</span>
                </a>
                <a
                  href="#"
                  className="text-neutral-500 hover:text-primary transition-colors"
                  aria-label="توییتر"
                >
                  <span className="material-icons">public</span>
                </a>
                <a
                  href="#"
                  className="text-neutral-500 hover:text-primary transition-colors"
                  aria-label="تلگرام"
                >
                  <span className="material-icons">chat</span>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-neutral-800 py-6 text-center text-sm">
            © ۲۰۲۳ پت‌شاپ. تمام حقوق محفوظ است.
          </div>
        </footer>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-neutral-900">پنل مدیریت</h1>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-neutral-600">در حال بارگذاری...</p>
        </div>
        <footer className="bg-neutral-900 text-neutral-400 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-neutral-900">درباره پت‌شاپ</h3>
              <p className="text-neutral-600">
                مارکت‌پلچس چند فروشنده‌ای برای محصولات و خدمات حیوانات خانگی
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-neutral-900">دسترسی سریع</h3>
              <nav className="space-y-2">
                <a href="/" className="text-neutral-600 hover:text-primary transition-colors">
                  صفحه اصلی
                </a>
                <a href="/products" className="text-neutral-600 hover:text-primary transition-colors">
                  محصولات
                </a>
                <a href="/vendors" className="text-neutral-600 hover:text-primary transition-colors">
                  فروشندگان
                </a>
                <a href="/blogs" className="text-neutral-600 hover:text-primary transition-colors">
                  وبلاگ
                </a>
              </nav>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-neutral-900">دسترسی سریع</h3>
              <nav className="space-y-2">
                <a href="/account" className="text-neutral-600 hover:text-primary transition-colors">
                  حساب کاربری
                </a>
                <a href="/vendor" className="text-neutral-600 hover:text-primary transition-colors">
                  پنل فروشنده
                </a>
                <a href="/admin" className="text-neutral-600 hover:text-primary transition-colors">
                  پنل مدیریت
                </a>
                <a href="/help" className="text-neutral-600 hover:text-primary transition-colors">
                  راهنمایی
                </a>
              </nav>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-neutral-900">تماس با ما</h3>
              <p className="text-neutral-600">
                <span className="mr-2">📞</span> 021-12345678
              </p>
              <p className="text-neutral-600">
                <span className="mr-2">📧</span> info@petshop.ir
              </p>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="text-neutral-500 hover:text-primary transition-colors"
                  aria-label="اینستاگرام"
                >
                  <span className="material-icons">photo_camera</span>
                </a>
                <a
                  href="#"
                  className="text-neutral-500 hover:text-primary transition-colors"
                  aria-label="توییتر"
                >
                  <span className="material-icons">public</span>
                </a>
                <a
                  href="#"
                  className="text-neutral-500 hover:text-primary transition-colors"
                  aria-label="تلگرام"
                >
                  <span className="material-icons">chat</span>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-neutral-800 py-6 text-center text-sm">
            © ۲۰۲۳ پت‌شاپ. تمام حقوق محفوظ است.
          </div>
        </footer>
      </main>
    );
  }

  const {
    totalRevenue,
    totalOrders,
    totalVendors,
    totalUsers,
    revenueOverTime,
    petSpeciesDistribution,
  } = data;

  const getLineChartPath = (points) => {
    if (points.length < 2) return "";
    const path = points
      .map(([x, y], index) => (index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`))
      .join(" ");
    return path;
  };

  const getPieChartPath = (centerX, centerY, radius, startAngle, endAngle) => {
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY - radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY - radius * Math.sin(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const lineChartPoints = revenueOverTime.map((point, index) => {
    const x = 40 + index * ((800 - 80) / (revenueOverTime.length - 1));
    const maxRev = Math.max(...revenueOverTime.map((p) => p.revenue));
    const y = 160 - (point.revenue / maxRev) * 120;
    return [x, y];
  });

  const pieChartSlices = petSpeciesDistribution.map((slice, index) => {
    const total = petSpeciesDistribution.reduce(
      (sum, item) => sum + item.count,
      0
    );
    const startAngle =
      (petSpeciesDistribution.slice(0, index).reduce((sum, item) => sum + item.count, 0) /
        total) *
      2 *
      Math.PI;
    const endAngle =
      (petSpeciesDistribution.slice(0, index + 1).reduce((sum, item) => sum + item.count, 0) /
        total) *
      2 *
      Math.PI;
    return {
      startAngle,
      endAngle,
      color: [
        "#16A34A",
        "#0EA5E9",
        "#F59E0B",
        "#22C55E",
        "#EF4444",
        "#94A3B8",
      ][index % 6],
      label: slice.species,
    };
  });

  return (
    <main className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-neutral-900">پنل مدیریت</h1>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              key="revenue"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-flex items-center justify-center text-white font-bold">
                      ر
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-neutral-600">
                        درآمد کل
                      </p>
                      <p className="text-2xl font-bold text-neutral-900">
                        {formatNumber(totalRevenue)} تومان
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              key="orders"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-flex items-center justify-center text-white font-bold">
                      س
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-neutral-600">
                        تعداد سفارشات
                      </p>
                      <p className="text-2xl font-bold text-neutral-900">
                        {formatNumber(totalOrders)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              key="vendors"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-flex items-center justify-center text-white font-bold">
                      ف
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-neutral-600">
                        تعداد فروشندگان
                      </p>
                      <p className="text-2xl font-bold text-neutral-900">
                        {formatNumber(totalVendors)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              key="users"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-flex items-center justify-center text-white font-bold">
                      و
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-neutral-600">
                        تعداد کاربران
                      </p>
                      <p className="text-2xl font-bold text-neutral-900">
                        {formatNumber(totalUsers)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6">
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                درآمد پلتفرم
              </h3>
              <div className="relative h-48">
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 800 200"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Axes */}
                  <line
                    x1="40"
                    y1="160"
                    x2="760"
                    y2="160"
                    stroke="neutral-200"
                    strokeWidth="1"
                  />
                  <line
                    x1="40"
                    y1="40"
                    x2="40"
                    y2="160"
                    stroke="neutral-200"
                    strokeWidth="1"
                  />
                  {/* Line */}
                  <path
                    d={getLineChartPath(lineChartPoints)}
                    stroke="primary"
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* Points */}
                  {lineChartPoints.map(([x, y], index) => (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="primary"
                    />
                  ))}
                </svg>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6">
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                توزیع پت‌های ثبت‌شده
              </h3>
              <div className="relative h-48 flex items-center justify-center">
                <svg
                  className="w-32 h-32"
                  viewBox="0 0 200 200"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {pieChartSlices.map((slice, index) => (
                    <path
                      key={index}
                      d={getPieChartPath(100, 100, 80, slice.startAngle, slice.endAngle)}
                      fill={slice.color}
                    />
                  ))}
                  {/* Center circle */}
                  <circle cx="100" cy="100" r="40" fill="white" />
                  {/* Labels */}
                  {pieChartSlices.map((slice, index) => (
                    <div
                      key={index}
                      className="absolute flex items-center gap-2 text-sm font-medium text-neutral-900"
                      style={{
                        transformOrigin: "center",
                        transform: `rotate(${
                          ((slice.startAngle + slice.endAngle) / 2) *
                            (180 / Math.PI) -
                          90
                        }deg) translateY(-40px)`,
                      }}
                    >
                      <div
                        className="w-2 h-2"
                        style={{ backgroundColor: slice.color }}
                      />
                      <span>{slice.label}</span>
                    </div>
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-neutral-900 text-neutral-400 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-neutral-900">درباره پت‌شاپ</h3>
            <p className="text-neutral-600">
              مارکت‌پلچس چند فروشنده‌ای برای محصولات و خدمات حیوانات خانگی
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-neutral-900">دسترسی سریع</h3>
            <nav className="space-y-2">
              <a href="/" className="text-neutral-600 hover:text-primary transition-colors">
                صفحه اصلی
              </a>
              <a href="/products" className="text-neutral-600 hover:text-primary transition-colors">
                محصولات
              </a>
              <a href="/vendors" className="text-neutral-600 hover:text-primary transition-colors">
                فروشندگان
              </a>
              <a href="/blogs" className="text-neutral-600 hover:text-primary transition-colors">
                وبلاگ
              </a>
            </nav>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-neutral-900">دسترسی سریع</h3>
            <nav className="space-y-2">
              <a href="/account" className="text-neutral-600 hover:text-primary transition-colors">
                حساب کاربری
              </a>
              <a href="/vendor" className="text-neutral-600 hover:text-primary transition-colors">
                پنل فروشنده
              </a>
              <a href="/admin" className="text-neutral-600 hover:text-primary transition-colors">
                پنل مدیریت
              </a>
              <a href="/help" className="text-neutral-600 hover:text-primary transition-colors">
                راهنمایی
              </a>
            </nav>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-neutral-900">تماس با ما</h3>
            <p className="text-neutral-600">
              <span className="mr-2">📞</span> 021-12345678
            </p>
            <p className="text-neutral-600">
              <span className="mr-2">📧</span> info@petshop.ir
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="text-neutral-500 hover:text-primary transition-colors"
                aria-label="اینستاگرام"
              >
                <span className="material-icons">photo_camera</span>
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-primary transition-colors"
                aria-label="توییتر"
              >
                <span className="material-icons">public</span>
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-primary transition-colors"
                aria-label="تلگرام"
              >
                <span className="material-icons">chat</span>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-800 py-6 text-center text-sm">
          © ۲۰۲۳ پت‌شاپ. تمام حقوق محفوظ است.
        </div>
      </footer>
    </main>
  );
};

export default AdminDashboard;
