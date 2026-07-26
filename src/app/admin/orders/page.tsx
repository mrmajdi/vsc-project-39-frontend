'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { formatPersianNumber } from '@/lib/utils';
import api from '@/lib/api';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  vendorName: string;
  itemsCount: number;
  totalAmount: number;
  commission: number;
  tax: number;
  netVendorAmount: number;
  status: OrderStatus;
  createdAt: string;
  items?: OrderItem[];
}

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const statusOptions: Array<{ value: OrderStatus | ''; label: string }> = [
    { value: '', label: 'همه' },
    { value: 'pending', label: 'در انتظار' },
    { value: 'processing', label: 'در حال پردازش' },
    { value: 'shipped', label: 'ارسال شده' },
    { value: 'delivered', label: 'تحویل شده' },
    { value: 'cancelled', label: 'لغو شده' },
  ];

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/orders', {
        params: { page, limit, search, status: statusFilter || undefined },
      });
      setOrders(res.data.data);
      setTotal(res.data.total);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'خطا در بارگذاری سفارشات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, limit, search, statusFilter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as OrderStatus);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const openDetail = (order: Order) => {
    setSelectedOrder(order);
  };

  const closeDetail = () => {
    setSelectedOrder(null);
  };

  if (loading && orders.length === 0) {
    return (
      <main className="min-h-[calc(100vh-160px)] dir-rtl p-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-6">مدیریت سفارشات</h1>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="text-sm font-medium text-neutral-800">جستجو:</label>
                <input
                  type="text"
                  className="w-full sm:w-64 px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="شماره سفارش، نام مشتری، نام فروشنده"
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="text-sm font-medium text-neutral-800">وضعیت:</label>
                <select
                  className="w-full sm:w-48 px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  value={statusFilter}
                  onChange={handleStatusChange}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-600">
                در حال بارگذاری...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[calc(100vh-160px)] dir-rtl p-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-6">مدیریت سفارشات</h1>
          <div className="bg-danger/10 text-danger border border-danger/20 rounded-lg p-4">
            {error}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-160px)] dir-rtl p-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-6">مدیریت سفارشات</h1>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm font-medium text-neutral-800">جستجو:</label>
              <input
                type="text"
                className="w-full sm:w-64 px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="شماره سفارش، نام مشتری، نام فروشنده"
                value={search}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm font-medium text-neutral-800">وضعیت:</label>
              <select
                className="w-full sm:w-48 px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                value={statusFilter}
                onChange={handleStatusChange}
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">شماره سفارش</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">نام مشتری</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">نام فروشنده</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">تعداد آیتم‌ها</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">مبلغ کل</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">کمیسیون</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">مالیات</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">مبلغ خالص فروشنده</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">وضعیت</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">تاریخ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {orders.length === 0 ? (
                    <tr>
                      <td colspan="11" className="px-6 py-4 text-center text-neutral-500">
                        سفارشی یافت نشد
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <motion.tr
                        key={order.id}
                        whileEnter={{ opacity: 0, y: 10 }}
                        whileExit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="cursor-pointer hover:bg-neutral-50"
                        onClick={() => openDetail(order)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                          {order.orderNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                          {order.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                          {order.vendorName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                          {formatPersianNumber(order.itemsCount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                          {formatPersianNumber(order.totalAmount)} تومان
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                          {formatPersianNumber(order.commission)} تومان
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                          {formatPersianNumber(order.tax)} تومان
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                          {formatPersianNumber(order.netVendorAmount)} تومان
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'pending'
                              ? 'bg-warning/10 text-warning'
                              : order.status === 'processing'
                              ? 'bg-secondary/10 text-secondary'
                              : order.status === 'shipped'
                              ? 'bg-accent/10 text-accent'
                              : order.status === 'delivered'
                              ? 'bg-success/10 text-success'
                              : 'bg-danger/10 text-danger'
                          }`}>
                            {order.status === 'pending'
                              ? 'در انتظار'
                              : order.status === 'processing'
                              ? 'در حال پردازش'
                              : order.status === 'shipped'
                              ? 'ارسال شده'
                              : order.status === 'delivered'
                              ? 'تحویل شده'
                              : 'لغو شده'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                          {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                          <button
                            className="inline-flex items-center justify-center gap-2 bg-transparent text-neutral-600 font-medium text-base px-4 py-2.5 rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDetail(order);
                            }}
                          >
                            مشاهده
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-neutral-600">
              نمایش{' '}
              {orders.length > 0
                ? `${formatPersianNumber((page - 1) * limit + 1)} تا ${formatPersianNumber(
                    Math.min(page * limit, total)
                  )}`}
                : '0'
              } از {formatPersianNumber(total)} سفارش
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (page > 1) handlePageChange(page - 1);
                }}
                disabled={page === 1}
                className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                  page === 1
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    : 'bg-white text-primary border border-primary hover:bg-neutral-50 transition-all'
                }`}
              >
                قبلی
              </button>
              <button
                onClick={() => {
                  if (page * limit < total) handlePageChange(page + 1);
                }}
                disabled={page * limit >= total}
                className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                  page * limit >= total
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    : 'bg-white text-primary border border-primary hover:bg-neutral-50 transition-all'
                }`}
              >
                بعدی
              </button>
            </div>
          </div>
        </div>

        {/* Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-neutral-900">
                  جزئیات سفارش #{selectedOrder.orderNumber}
                </h3>
                <button
                  className="inline-flex items-center justify-center gap-2 bg-transparent text-neutral-600 font-medium text-base px-4 py-2.5 rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
                  onClick={closeDetail}
                >
                  بستن
                </button>
              </div>
              <div className="space-y-6">
                {/* Order Info */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                    <span className="text-sm font-medium text-neutral-800">مشتری:</span>
                    <span className="text-sm text-neutral-600">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                    <span className="text-sm font-medium text-neutral-800">فروشنده:</span>
                    <span className="text-sm text-neutral-600">{selectedOrder.vendorName}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                    <span className="text-sm font-medium text-neutral-800">تاریخ:</span>
                    <span className="text-sm text-neutral-600">
                      {new Date(selectedOrder.createdAt).toLocaleDateString('fa-IR')}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                    <span className="text-sm font-medium text-neutral-800">وضعیت:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedOrder.status === 'pending'
                        ? 'bg-warning/10 text-warning'
                        : selectedOrder.status === 'processing'
                        ? 'bg-secondary/10 text-secondary'
                        : selectedOrder.status === 'shipped'
                        ? 'bg-accent/10 text-accent'
                        : selectedOrder.status === 'delivered'
                        ? 'bg-success/10 text-success'
                        : 'bg-danger/10 text-danger'
                    }`}>
                      {selectedOrder.status === 'pending'
                        ? 'در انتظار'
                        : selectedOrder.status === 'processing'
                        ? 'در حال پردازش'
                        : selectedOrder.status === 'shipped'
                        ? 'ارسال شده'
                        : selectedOrder.status === 'delivered'
                        ? 'تحویل شده'
                        : 'لغو شده'}
                    </span>
                  </div>
                </div>

                {/* Items Table */}
                <div>
                  <h4 className="text-lg font-semibold text-neutral-900 mb-2">کالاهای سفارش</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200">
                      <thead className="bg-neutral-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                            محصول
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                            تعداد
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                            قیمت واحد
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                            جمع
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        {selectedOrder.items?.length ? (
                          selectedOrder.items.map((item) => (
                            <tr key={`${selectedOrder.id}-${item.productName}`}>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-neutral-600">
                                {item.productName}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-neutral-600">
                                {formatPersianNumber(item.quantity)}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-neutral-600">
                                {formatPersianNumber(item.price)} تومان
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-neutral-600">
                                {formatPersianNumber(item.price * item.quantity)} تومان
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colspan="4" className="px-4 py-2 text-center text-sm text-neutral-500">
                              اطلاعات آیتم‌ها موجود نیست
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Financial Breakdown */}
                <div className="border-t border-neutral-200 pt-4">
                  <h4 className="text-lg font-semibold text-neutral-900 mb-2">تفkesli مالی</h4>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <span className="text-sm font-medium text-neutral-800">مبلغ کل (خالص):</span>
                      <span className="text-sm text-neutral-600">
                        {formatPersianNumber(selectedOrder.totalAmount)} تومان
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <span className="text-sm font-medium text-neutral-800">کمیسیون:</span>
                      <span className="text-sm text-neutral-600">
                        {formatPersianNumber(selectedOrder.commission)} تومان
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <span className="text-sm font-medium text-neutral-800">مالیات:</span>
                      <span className="text-sm text-neutral-600">
                        {formatPersianNumber(selectedOrder.tax)} تومان
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <span className="text-sm font-medium text-neutral-800">مبلغ خالص فروشنده:</span>
                      <span className="text-sm text-neutral-600 font-medium text-primary">
                        {formatPersianNumber(selectedOrder.netVendorAmount)} تومان
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminOrdersPage;
