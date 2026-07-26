import React from 'react';
import { CartItem } from '@/lib/types';

const toPersianDigits = (num: number): string => {
  return num.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d, 10)]);
};

interface CheckoutOrderItemsProps {
  items: CartItem[];
}

export const CheckoutOrderItems: React.FC<CheckoutOrderItemsProps> = ({ items }) => {
  const displayedItems = items.slice(0, 5);
  const hasMore = items.length > 5;

  return (
    <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          اقلام سفارش
        </h3>
        {displayedItems.map((item, index) => (
          <div
            key={`${item.productId}-${index}`}
            className="flex items-center gap-3 py-3 border-b border-neutral-200 last:border-0"
          >
            <img
              src={item.productImage}
              alt={item.productName}
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div className="flex-1 text-sm font-medium text-neutral-900">
              {item.productName}
            </div>
            {item.petId ? (
              <span className="w-5 h-5 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-xs">
                🐾
              </span>
            ) : null}
            <span className="text-xs text-neutral-600">x{toPersianDigits(item.quantity)}</span>
            <span className="text-sm font-semibold text-neutral-900 ml-4">
              {toPersianDigits(item.totalPrice)} تومان
            </span>
          </div>
        ))}
        {hasMore && (
          <p className="text-sm text-neutral-600 text-center py-2">
            و {items.length - 5} محصول دیگر...
          </p>
        )}
      </div>
    </div>
  );
};
