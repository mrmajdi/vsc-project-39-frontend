"use client";
import * as React from 'react';
import { motion } from 'framer-motion';
import { CartItem } from '@/lib/types';

interface CartItemRowProps {
  item: CartItem;
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, qty: number) => void;
}

export default function CartItemRow({ item, onRemove, onQuantityChange }: CartItemRowProps) {
  const [quantity, setQuantity] = React.useState(item.quantity);

  const handleMinus = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      onQuantityChange(item.id, quantity - 1);
    }
  };

  const handlePlus = () => {
    const max = item.stock ?? Infinity;
    if (quantity < max) {
      setQuantity(quantity + 1);
      onQuantityChange(item.id, quantity + 1);
    }
  };

  const price = item.price ?? 0;
  const originalPrice = item.originalPrice ?? price;
  const hasDiscount = originalPrice > price;

  const toPersianDigits = (num: number) => {
    const persianDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return num.toString().replace(/\d/g, d => persianDigits[parseInt(d, 10)]);
  };

  return (
    <motion.div
      initial={{ opacity: 1, x: 0, height: 'auto' }}
      animate={{ opacity: 1, x: 0, height: 'auto' }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-4 p-4 border-b border-neutral-200"
    >
      {/* Product Image */}
      <img
        src={item.image ?? '/placeholder.png'}
        alt={item.name ?? 'محصول'}
        className="w-12 h-12 rounded-lg object-cover"
      />

      {/* Middle Column */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-neutral-900">{item.name}</span>
          {item.pet_id && item.pet_avatar && item.pet_name ? (
            <>
              <span className="ms-2">
                <img
                  src={item.pet_avatar}
                  alt={`آواتار حیوان ${item.pet_name}`}
                  className="w-6 h-6 rounded-full"
                  title={`خرید برای ${item.pet_name}`}
                />
              </span>
            </>
          ) : null}
        </div>
        <div className="mt-1 text-xs text-neutral-600">
          {item.brand ?? item.vendorName ?? 'برند نامشخص'}
        </div>
      </div>

      {/* Quantity Stepper */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleMinus}
          disabled={quantity <= 1}
          className="w-8 h-8 rounded-md border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          −
        </button>
        <input
          type="text"
          readOnly
          value={toPersianDigits(quantity)}
          className="w-10 text-center font-medium text-neutral-900 bg-neutral-50 rounded-md border border-neutral-200 px-1"
        />
        <button
          onClick={handlePlus}
          disabled={quantity >= (item.stock ?? Infinity)}
          className="w-8 h-8 rounded-md border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>

      {/* Price Column */}
      <div className="text-right space-x-1">
        <span className="text-neutral-900 font-semibold">{toPersianDigits(price)} تومان</span>
        {hasDiscount && (
          <span className="text-neutral-400 text-xs line-through">{toPersianDigits(originalPrice)} تومان</span>
        )}
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.id)}
        aria-label="حذف از سبد"
        className="inline-flex items-center justify-center gap-2 bg-transparent text-danger font-medium text-sm px-2 py-1 rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
      >
        حذف
      </button>
    </motion.div>
  );
}
