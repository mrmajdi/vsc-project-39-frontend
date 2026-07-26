'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import Link from 'next/link';
import { cartStore } from '@/store/cartStore';

const CartBadge = () => {
  const totalItems = cartStore((state) => state.totalItems);

  return (
    <Link
      href="/cart"
      aria-label="سبد خرید"
      className="relative inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      {/* Cart icon */}
      <span className="ms-2">
        <svg
          aria-hidden="true"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          className="w-5 h-5 text-neutral-800"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </span>

      {/* Badge */}
      {totalItems > 0 && (
        <motion.span
          key={totalItems}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 0.3 }}
          className="absolute -top-1 -end-1 flex items-center justify-center w-5 h-5 bg-danger text-white text-xs font-bold rounded-full"
        >
          {totalItems}
        </motion.span>
      )}
    </Link>
  );
};

export default CartBadge;
