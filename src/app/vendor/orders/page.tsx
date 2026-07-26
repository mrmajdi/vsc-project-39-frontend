"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type Order = {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  grossAmount: number;
  commission: number;
  tax: number;
  status: string; // 'در حال پردازش' | 'ارسال شده' | 'تحویل شده'
};

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{ open: boolean; orderId: string | null; newStatus: string }>({
    open: false,
    orderId: null,
    newStatus: '',
  });
  const [toasts, setToasts] = useState<Array<{ id: string; type: 'success' | 'error'; message: string }>>([]);

  useEffect(() => {
    const fetchOrders = async () {
      try {
        setLoading(true);
        const response = await fetch('/api/vendor/orders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('خطا در دریافت سفارشات');
        }
        const data: Order[] = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطای نامشخص');
        addToast('error', err instanceof Error ? err.message : 'خطای نامشخص');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const addToast = (type: 'success' | 'error', message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setModalState({
      open: true,
      orderId,
      newStatus,
    });
  };

  const confirmStatusChange = async () => {
    if (!modalState.orderId || !modalState.newStatus) return;
    try {
      const response = await fetch(`/api/vendor/orders/${modalState.orderId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: modalState.newStatus }),
      });
      if (!response.ok) {
        throw new Error('خطا در تغییر وضعیت');
      }
      // Update the order in state
      setOrders(prev => {
        if (!prev) return prev;
        return prev.map(order =>
          order.id === modalState.orderId
            ? { ...order, status: modalState.newStatus }
            : order
        );
      });
      addToast('success', 'وضعیت با موفقیت تغییر کرد');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای نامشخص');
      addToast('error', err instanceof Error ? err.message : 'خطای نامشخص');
    } finally {
      setModalState({
        open: false,
        orderId: null,
        newStatus: '',
      });
    }
  };

  const cancelStatusChange = () => {
    setModalState({
      open: false,
      orderId: null,
      newStatus: '',
    });
  };

  if (loading) {
    return (
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="flex flex-col items-center">
              <div className="animate-pulse h-8 w-32 mb-4 bg-neutral-200 rounded"></div>
              <div className="animate-pulse h-4 w-24 mb-2 bg-neutral-200 rounded"></div>
              <div className="animate-pulse h-4 w-full mb-2 bg-neutral-200 rounded"></div>
              <div className="animate-pulse h-4 w-3/4 bg-neutral-200 rounded"></div>
            </div>
          </div>
        </div>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">سفارشات فروشنده</h2>
              {/* Loading Skeleton Table */}
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="ps-4 pe-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">شماره سفارش</th>
                      <th className="ps-4 pe-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">تاریخ</th>
                      <th className="ps-4 pe-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">مشتری</th>
                      <th className="ps-4 pe-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">مبلغ ناخالص</th>
                      <th className="ps-4 pe-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">کمیسیون</th>
                      <th className="ps-4 pe-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">مالیات</th>
                      <th className="ps-4 pe-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">سود خالص</th>
                      <th className="ps-4 pe-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">وضعیت</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {[1, 2, 3, 4, 5].map((_, index) => (
                      <tr key={index} className="bg-neutral-50">
                        <td className="ps-0 pe-0 py-4"><div className="h-2 w-24 bg-neutral-200 rounded"></div></td>
                        <td className="ps-0 pe-0 py-4"><div className="h-2 w-16 bg-neutral-200 rounded"></div></td>
                        <td className="ps-0 pe-0 py-4"><div className="h-2 w-32 bg-neutral-200 rounded"></div></td>
                        <td className="ps-0 pe-0 py-4"><div className="h-2 w-24 bg-neutral-200 rounded"></div></td>
                        <td className="ps-0 pe-0 py-4"><div className="h-2 w-20 bg-neutral-200 rounded"></div></td>
                        <td className="ps-0 pe-0 py-4"><div className="h-2 w-20 bg-neutral-200 rounded"></div></td>
                        <td className="ps-0 pe-0 py-4"><div className="h-2 w-24 bg-neutral-200 rounded text-success font-medium"></div></td>
                        <td className="ps-0 pe-0 py-4 relative">
                          <div className="flex items-center space-x-2">
                            <div className="h-2 w-4 bg-neutral-200 rounded"></div>
                            <div className="h-2 w-4 bg-neutral-200 rounded"></div>
                            <div className="h-2 w-4 bg-neutral-200 rounded"></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">سفارشات فروشنده</h2>
              <p className="text-neutral-600">{error}</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">سفارشات فروشنده</h2>
            <p className="text-neutral-600">هیچ سفارشی یافت نشد.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      {/* Toasts Container */}
      <div className="fixed top-4 start-4 z-50 flex flex-col gap-4">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex w-full max-w-xs items-center gap-3 rounded-lg border p-4 shadow-lg 
              ${toast.type === 'success'
                ? 'bg-success/10 text-success border-success/20'
                : 'bg-danger/10 text-danger border-danger/20'}`}
          >
            <div>{toast.message}</div>
          </div>
        ))}
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">سفارشات فروشنده</h2>
        </div>

        {/* Responsive: Table on md and up, Cards on below md */}
        <div className="hidden md:block">
          {/* Table View */}
          <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
            <table className="w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="ps-4 pe-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">شماره سفارش</th>
                  <th className="ps-4 pe-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">تاریخ</th>
                  <th className="ps-4 pe-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">مشتری</th>
                  <th className="ps-4 pe-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">مبلغ ناخالص</th>
                  <th className="ps-4 pe-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">کمیسیون</th>
                  <th className="ps-4 pe-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">مالیات</th>
                  <th className="ps-4 pe-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">سود خالص</th>
                  <th className="ps-4 pe-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">وضعیت</th>
                </tr>
              </thead>
              <motion.tbody
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, stagger: 0.07 }}
              >
                {orders.map(order => (
                  <motion.tr
                    key={order.id}
                    className="bg-white hover:bg-neutral-50"
                  >
                    <td className="ps-0 pe-0 py-4">
                      <span className="text-sm text-neutral-900">{order.orderNumber}</span>
                    </td>
                    <td className="ps-0 pe-0 py-4">
                      <span className="text-sm text-neutral-900">{new Date(order.date).toLocaleDateString('fa-IR')}</span>
                    </td>
                    <td className="ps-0 pe-0 py-4">
                      <span className="text-sm text-neutral-900">{order.customerName}</span>
                    </td>
                    <td className="ps-0 pe-0 py-4">
                      <span className="text-sm text-neutral-900">{order.grossAmount.toLocaleString('fa-IR')} تومان</span>
                    </td>
                    <td className="ps-0 pe-0 py-4">
                      <span className="text-sm text-neutral-900">{order.commission.toLocaleString('fa-IR')} تومان</span>
                    </td>
                    <td className="ps-0 pe-0 py-4">
                      <span className="text-sm text-neutral-900">{order.tax.toLocaleString('fa-IR')} تومان</span>
                    </td>
                    <td className="ps-0 pe-0 py-4">
                      <span className="text-sm font-medium text-success">
                        {(order.grossAmount - order.commission - order.tax).toLocaleString('fa-IR')} تومان
                      </span>
                    </td>
                    <td className="ps-0 pe-0 py-4 relative">
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        className="block w-full ps-4 pe-4 py-2.5 text-sm text-neutral-700 bg-white border border-neutral-300 rounded-md focus:outline-none focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="در حال پردازش">در حال پردازش</option>
                        <option value="ارسال شده">ارسال شده</option>
                        <option value="تحویل شده">تحویل شده</option>
                      </select>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </div>

        <div className="md:hidden">
          {/* Cards View */}
          <div className="space-y-4">
            {orders.map(order => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, stagger: 0.07 }}
              >
                <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
                  <div className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-neutral-900">شماره سفارش:</span>
                        <span className="text-sm text-neutral-600">{order.orderNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-neutral-900">تاریخ:</span>
                        <span className="text-sm text-neutral-600">{new Date(order.date).toLocaleDateString('fa-IR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-neutral-900">مشتری:</span>
                        <span className="text-sm text-neutral-600">{order.customerName}</span>
                      </div>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-neutral-900">مبلغ ناخالص:</span>
                          <span className="text-sm text-neutral-600">{order.grossAmount.toLocaleString('fa-IR')} تومان</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-neutral-900">کمیسیون:</span>
                          <span className="text-sm text-neutral-600">{order.commission.toLocaleString('fa-IR')} تومان</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-neutral-900">مالیات:</span>
                          <span className="text-sm text-neutral-600">{order.tax.toLocaleString('fa-IR')} تومان</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-success">سود خالص:</span>
                          <span className="text-sm text-success">
                            {(order.grossAmount - order.commission - order.tax).toLocaleString('fa-IR')} تومان
                          </span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-neutral-700 mb-1">وضعیت:</label>
                        <select
                          value={order.status}
                          onChange={e => handleStatusChange(order.id, e.target.value)}
                          className="block w-full ps-4 pe-4 py-2.5 text-sm text-neutral-700 bg-white border border-neutral-300 rounded-md focus:outline-none focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="در حال پردازش">در حال پردازش</option>
                          <option value="ارسال شده">ارسال شده</option>
                          <option value="تحویل شده">تحویل شده</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Status Change Modal */}
        {modalState.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">تغییر وضعیت سفارش</h3>
              <p className="text-neutral-600 mb-4">
                آیا از تغییر وضعیت سفارش به <span className="font-medium">{modalState.newStatus}</span> مطمئن هستید؟
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelStatusChange}
                  className="inline-flex items-center justify-center gap-2 bg-transparent text-neutral-600 font-medium text-base px-4 py-2.5 rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
                >
                  انصراف
                </button>
                <button
                  onClick={confirmStatusChange}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  تأیید
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
