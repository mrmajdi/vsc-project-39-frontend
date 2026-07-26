"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  price: number;
  quantity: number;
}

interface CheckoutSummaryProps {
  items: CartItem[];
  shippingPerVendor: Record<string, number>;
  vendorNames: Record<string, string>;
  onCheckout: () => void;
  isLoading: boolean;
  isCheckoutMode?: boolean;
}

const formatPrice = (amount: number): string => {
  return amount.toLocaleString("fa-IR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }) + " تومان";
};

export const CheckoutSummary = ({
  items,
  shippingPerVendor,
  vendorNames,
  onCheckout,
  isLoading,
  isCheckoutMode = false,
}: CheckoutSummaryProps) => {
  const router = useRouter();

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shippingTotal = Object.values(shippingPerVendor).reduce(
    (sum, cost) => sum + cost,
    0
  );

  const grandTotal = subtotal + shippingTotal;

  const handleCheckout = () => {
    if (isCheckoutMode) {
      onCheckout();
    } else {
      router.push("/checkout");
    }
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">
        خلاصه سفارش
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-base text-neutral-600">
          <span>جمع کالاها</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
      </div>

      {Object.keys(shippingPerVendor).length === 0 ? (
        <div className="mb-2 flex justify-between text-sm text-neutral-600">
          <span>هزینه ارسال</span>
          <span>ارسال رایگان</span>
        </div>
      ) : (
        <>
          {Object.entries(shippingPerVendor).map(([vendorId, cost]) => (
            <div
              key={vendorId}
              className="mb-2 flex justify-between text-sm text-neutral-600"
            >
              <span>
                هزینه ارسال {vendorNames[vendorId] || vendorId}
              </span>
              <span>{formatPrice(cost)}</span>
            </div>
          ))}
        </>
      )}

      <hr className="border-t border-neutral-200 my-4" />

      <div className="flex justify-between text-lg font-bold text-neutral-900">
        <span>مبلغ قابل پرداخت</span>
        <span>{formatPrice(grandTotal)}</span>
      </div>

      <p className="text-xs text-neutral-400 mt-2">
        قیمت‌ها شامل مالیات می‌باشند
      </p>

      <button
        onClick={handleCheckout}
        disabled={isLoading}
        className={`w-full inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed ${
          isLoading ? "pointer-events-none" : ""
        }`}
      >
        {isLoading ? (
          <div className="h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
        ) : (
          isCheckoutMode ? "پرداخت نهایی" : "تسویه حساب"
        )}
      </button>
    </div>
  );
};
