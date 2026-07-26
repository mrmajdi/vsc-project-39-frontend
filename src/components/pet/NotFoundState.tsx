"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFoundState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 gap-4 text-center"
    >
      <span className="text-6xl">😔</span>
      <h2 className="text-2xl font-bold text-neutral-900">
        پاسپورت یافت نشد
      </h2>
      <p className="text-base text-neutral-600">
        کد پاسپورت وارد شده نامعتبر است یا حذف شده است
      </p>
      <Link href="/">
        <a
          className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          بازگشت به صفحه اصلی
        </a>
      </Link>
    </motion.div>
  );
}
