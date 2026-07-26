import Link from 'next/link';
import { motion } from 'framer-motion';

const EmptyCart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 gap-4"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-24 h-24 text-neutral-400"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.737 1.707h17.414c.921 0 1.367-.966.737-1.707L19 7m-4 8H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v6a2 2 0 01-2 2z"
        />
      </svg>
      <h2 className="text-xl font-semibold text-neutral-900">
        سبد خرید شما خالی است
      </h2>
      <p className="text-sm text-neutral-600">
        هنوز محصولی به سبد خرید اضافه نکرده‌اید
      </p>
      <Link href="/products">
        <a
          className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          شروع خرید
        </a>
      </Link>
    </motion.div>
  );
};

export default EmptyCart;
