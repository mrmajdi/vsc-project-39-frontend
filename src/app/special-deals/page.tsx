"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimate } from "framer-motion";
import { api } from "@/lib/api";

export default function SpecialDealsPage() {
  const [deals, setDeals] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const confettiRef = useRef(null);
  const animation = useAnimate();

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/special-deals");
        setDeals(response.data);
        setError(null);
      } catch (err) {
        setError("خطا در بارگذاری داده‌ها");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeals();
  }, []);

  useEffect(() => {
    if (deals && deals.length > 0) {
      animation.start([
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "backOut" } }
      ]);
    }
  }, [deals, animation]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fa-IR", {
      style: "currency",
      currency: "IRR",
    }).format(price);
  };

  const calculateTimeLeft = (endTime) => {
    const end = new Date(endTime).getTime();
    const now = new Date().getTime();
    const diff = end - now;

    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true };

    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { hours, minutes, seconds, expired: false };
  };

  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-160px)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Confetti Hero Skeleton */}
          <div className="mb-8">
            <div className="h-96 bg-neutral-100 rounded-lg animate-pulse"></div>
          </div>
          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <div key={index} className="bg-neutral-100 rounded-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-neutral-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-neutral-200 mb-2"></div>
                  <div className="h-2 bg-neutral-200 w-2/3 mb-2"></div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-neutral-200 rounded-full"></div>
                    <div className="h-3 w-3 bg-neutral-200 rounded-full"></div>
                    <div className="h-3 w-3 bg-neutral-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[calc(100vh-160px)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-danger text-2xl font-bold mb-4">
              خطا در بارگذاری
            </div>
            <p className="text-neutral-600">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!deals || deals.length === 0) {
    return (
      <main className="min-h-[calc(100vh-160px)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          {/* Confetti Hero */}
          <div className="mb-8">
            <motion.div
              ref={confettiRef}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.8, ease: "backOut" } }}
              className="inline-block"
            >
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary"
              >
                <circle cx="60" cy="60" r="50" fill="none" strokeWidth="4" strokeDasharray="157" strokeDashoffset="157">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 60 60"
                    to="360 60 60"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
                {/* Confetti particles */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <rect
                    key={i}
                    x={Math.random() * 120}
                    y={-20}
                    width={6}
                    height={6}
                    fill={["#16A34A", "#0EA5E9", "#F59E0B", "#EF4444", "#22C55E"][Math.floor(Math.random() * 5)]}
                    opacity={0.8}
                  >
                    <animate
                      attributeName="y"
                      from="-20"
                      to="140"
                      dur={`${3 + Math.random() * 2}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.8;0;0.8"
                      dur={`${2 + Math.random() * 2}s`}
                      repeatCount="indefinite"
                    />
                  </rect>
                ))}
              </svg>
            </motion.div>
            <h1 className="mt-6 text-4xl font-bold text-neutral-900">
              تخفیف‌های ویژه
            </h1>
            <p className="mt-2 text-neutral-600">
              بهترین تخفیف‌های روز برای حیوانات خانگی شما
            </p>
          </div>

          {/* Empty State */}
          <div className="space-y-6">
            <div className="text-neutral-400 text-5xl">
              🎉
            </div>
            <p className="text-xl font-medium text-neutral-900">
              در حال حاضر تخفیف ویژه‌ای فعال نیست
            </p>
            <p className="text-neutral-600">
              به زودی تخفیف‌های جدید و جذابی برای شما اضافه خواهیم کرد.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-160px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Confetti Hero */}
        <div className="mb-8">
          <motion.div
            ref={confettiRef}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.8, ease: "backOut" } }}
            className="inline-block"
          >
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary"
            >
              <circle cx="60" cy="60" r="50" fill="none" strokeWidth="4" strokeDasharray="157" strokeDashoffset="157">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 60 60"
                  to="360 60 60"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              {/* Confetti particles */}
              {[1, 2, 3, 4, 5].map((i) => (
                <rect
                  key={i}
                  x={Math.random() * 120}
                  y={-20}
                  width={6}
                  height={6}
                  fill={["#16A34A", "#0EA5E9", "#F59E0B", "#EF4444", "#22C55E"][Math.floor(Math.random() * 5)]}
                  opacity={0.8}
                >
                  <animate
                    attributeName="y"
                    from="-20"
                    to="140"
                    dur={`${3 + Math.random() * 2}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.8;0;0.8"
                    dur={`${2 + Math.random() * 2}s`}
                    repeatCount="indefinite"
                  />
                </rect>
              ))}
            </svg>
          </motion.div>
          <h1 className="mt-6 text-4xl font-bold text-neutral-900">
            تخفیف‌های ویژه
          </h1>
          <p className="mt-2 text-neutral-600">
            بهترین تخفیف‌های روز برای حیوانات خانگی شما
          </p>
        </div>

        {/* Countdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => {
            const timeLeft = calculateTimeLeft(deal.endTime);
            const progressPercent = (deal.soldCount / deal.totalStock) * 100;

            return (
              <div
                key={deal.id}
                className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden transition-all hover:shadow-md"
              >
                {/* Image */}
                <div className="relative h-48">
                  <img
                    src={deal.productImage}
                    alt={`${deal.productName} - تصویر محصول`}
                    className="w-full h-full object-cover"
                  />
                  {/* Discount Badge */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-3 start-3 bg-danger text-white text-xs font-bold px-2 py-1 rounded-sm z-10"
                  >
                    %{deal.discountPercent} تخفیف
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-2">
                    {deal.productName}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline mb-3">
                    <span className="text-neutral-400 line-through text-sm me-2">
                      {formatPrice(deal.originalPrice)}
                    </span>
                    <span className="text-primary font-bold text-lg">
                      {formatPrice(deal.discountedPrice)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-neutral-600 mb-1">
                      <span>فروش رفته:</span>
                      <span>
                        {deal.soldCount} از {deal.totalStock}
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div
                        className={`bg-primary h-2 rounded-full transition-all duration-500 w-${progressPercent}%`}
                      ></div>
                    </div>
                  </div>

                  {/* Countdown */}
                  <div className="mb-4">
                    <div className="flex items-center justify-center gap-2">
                      {timeLeft.expired ? (
                        <span className="bg-danger/10 text-danger text-xs font-medium px-2.5 py-1 rounded-full">
                          پایان یافت
                        </span>
                      ) : (
                        <>
                          <div className="flex items-center gap-1">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="flex items-center justify-center w-8 h-8 bg-neutral-50 rounded-md text-neutral-800 font-mono"
                            >
                              {String(timeLeft.hours).padStart(2, "0")}
                            </motion.div>
                            <span className="text-neutral-600">:</span>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="flex items-center justify-center w-8 h-8 bg-neutral-50 rounded-md text-neutral-800 font-mono"
                            >
                              {String(timeLeft.minutes).padStart(2, "0")}
                            </motion.div>
                            <span className="text-neutral-600">:</span>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="flex items-center justify-center w-8 h-8 bg-neutral-50 rounded-md text-neutral-800 font-mono"
                            >
                              {String(timeLeft.seconds).padStart(2, "0")}
                            </motion.div>
                          </div>
                          <span className="ml-2 text-xs text-neutral-600">
                            زمان باقی‌مانده
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Buy Button */}
                  <button
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={timeLeft.expired || deal.soldCount >= deal.totalStock}
                  >
                    خرید الآن
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
