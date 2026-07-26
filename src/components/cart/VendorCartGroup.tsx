"use client";

import { motion } from 'framer-motion';
import CartItemRow from './CartItemRow';
import type { CartItem } from '@/lib/types';

interface VendorCartGroupProps {
  vendorId: string;
  vendorName: string;
  items: CartItem[];
  shippingCost: number;
  onRemove: (itemId: string) => void;
  onQuantityChange: (itemId: string, quantity: number) => void;
}

export default function VendorCartGroup({ vendorId, vendorName, items, shippingCost, onRemove, onQuantityChange }: VendorCartGroupProps) {
  return (
    <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
      <div className="bg-neutral-50 p-4 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* Store icon placeholder */}
            <svg className="w-5 h-5 text-secondary ms-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <span className="text-sm font-semibold text-neutral-900 me-4">{vendorName}</span>
          </div>
          <span className="text-xs text-neutral-600">
            {shippingCost === 0 ? 'ارسال رایگان' : `هزینه ارسال: ${shippingCost.toLocaleString()} تومان`}
          </span>
        </div>
      </div>
      <motion.ul className="divide-y divide-neutral-200" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ staggerChildren: 0.05 }}>
        {items.map(item => (
          <motion.li key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <CartItemRow item={item} onRemove={onRemove} onQuantityChange={onQuantityChange} />
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
