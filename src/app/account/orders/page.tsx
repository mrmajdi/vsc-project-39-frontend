// @vsc repo:vsc-project-39-frontend file:src/app/account/orders/page.tsx task:f8-src-app-account-orders-page-tsx module:frontend session:39
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  thumbnail: string;
}

interface Order {
  id: number;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  totalAmount: number;
  vendorCount: number;
  items: OrderItem[];
}

const statusConfig: Record<OrderStatus, { label: string; badgeClass: string }> = {
  pending: { label: "در انتظار", badgeClass: "bg-warning/10 text-warning" },
  shipped: { label: "ارسال شده", badgeClass: "bg-secondary/10 text-secondary" },
  delivered: { label: "تحویل شده", badgeClass: "bg-success/10 text-success" },
  cancelled: { label: "لغو شده", badgeClass: "bg-danger/10 text-danger" },
};

const tabs: Array<{ key: "all" | OrderStatus; label: string }> = [
  { key: "all", label: "همه" },
  { key: "pending", label: "در انتظار" },
  { key: "shipped", label: "ارسال شده" },
  { key: "delivered", label: "تحویل شده" },
  { key: "cancelled", label: "لغو شده" },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fa-IR").format(price);
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | OrderStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await api.get("/user/orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => order.status === activeTab);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">سفارش‌های من</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-4 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
              activeTab === tab.key
                ? "bg-primary text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-neutral-200 shadow-sm p-4 animate-pulse"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="h-6 w-32 bg-neutral-200 rounded-md"></div>
                <div className="h-6 w-24 bg-neutral-200 rounded-full"></div>
              </div>
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-neutral-200 rounded-md"></div>
                  <div className="h-4 w-48 bg-neutral-200 rounded-md"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-neutral-200 rounded-md"></div>
                  <div className="h-4 w-40 bg-neutral-200 rounded-md"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-6 w-24 bg-neutral-200 rounded-md"></div>
                <div className="h-8 w-24 bg-neutral-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      ) : paginatedOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-24 h-24 text-neutral-400 mb-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4m11.25-.75H4.5a1.5 1.5 0 00-1.5 1.5v9A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-9a1.5 1.5 0 00-1.5-1.5z"
            />
          </svg>
          <p className="text-lg font-medium text-neutral-800 mb-2">
            هنوز سفارشی ثبت نکرده‌اید
          </p>
          <p className="text-sm text-neutral-600 mb-6">
            می‌توانید محصولات مورد علاقه خود را خریداری کنید
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            شروع خرید
          </Link>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4"
          >
            {paginatedOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg border border-neutral-200 shadow-sm p-4 transition-all hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-x-4 gap-y-1 flex-wrap">
                    <span className="text-lg font-semibold text-neutral-900">
                      سفارش #{order.orderNumber}
                    </span>
                    <span className="text-sm text-neutral-600">
                      {formatDate(order.date)}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${
                      statusConfig[order.status].badgeClass
                    }`}
                  >
                    {statusConfig[order.status].label}
                  </span>
                </div>

                <div className="flex flex-col gap-2 mb-4 border-t border-b border-neutral-100 py-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.thumbnail}
                        alt={item.productName}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div className="flex flex-col flex-grow">
                        <span className="text-sm font-medium text-neutral-800">
                          {item.productName}
                        </span>
                        <span className="text-xs text-neutral-600">
                          تعداد: {formatPrice(item.quantity)} عدد
                        </span>
                      </div>
                      <span className="text-sm font-medium text-neutral-800 ms-auto">
                        {formatPrice(item.price)} تومان
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-baseline gap-x-3 gap-y-1 flex-wrap">
                    <span className="text-xs text-neutral-400">
                      از {formatPrice(order.vendorCount)} فروشنده
                    </span>
                    <span className="text-lg font-bold text-neutral-900">
                      مبلغ کل: {formatPrice(order.totalAmount)} تومان
                    </span>
                  </div>
                  <button
                    className="inline-flex items-center justify-center gap-2 bg-transparent text-neutral-600 font-medium text-base px-4 py-2.5 rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
                  >
                    مشاهده جزئیات
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={currentPage === 1}
                className="inline-flex items-center justify-center gap-2 bg-white text-primary border border-primary font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-neutral-50 transition-all focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                قبلی
              </button>
              <span className="text-sm text-neutral-600">
                صفحه {formatPrice(currentPage)} از {formatPrice(totalPages)}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="inline-flex items-center justify-center gap-2 bg-white text-primary border border-primary font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-neutral-50 transition-all focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                بعدی
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
