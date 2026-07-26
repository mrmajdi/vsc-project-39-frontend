import { useEffect, useState } from 'react';
import axios from '@/lib/api';
import VendorDashboardCards from '@/components/vendor/VendorDashboardCards';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from '@/components/shared/Toast';

const VendorDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<Array<{ name: string; sales: number }>>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/vendor/dashboard');
        setData(response.data);
        // Assuming response includes chartData array of { name: string, sales: number }
        if (response.data.chartData) {
          setChartData(response.data.chartData);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'خطا در بارگذاری داده‌ها');
        toast.error(err.response?.data?.message || 'خطا در بارگذاری داده‌ها');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Skeleton for cards */}
          <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((_, i) => (
              <motion.key
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="bg-neutral-100 rounded-lg shadow-sm h-20 animate-pulse"></div>
              </motion.key>
            ))}
          </div>

          {/* Skeleton for chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="bg-neutral-100 rounded-lg shadow-md h-64 animate-pulse mb-8"></div>
          </motion.div>

          {/* Skeleton for table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <motion.key
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                >
                  <div className="bg-neutral-100 rounded-md shadow-sm h-12 animate-pulse"></div>
                </motion.key>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-danger/10 text-danger border border-danger/20 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">خطا</h3>
            <p className="text-neutral-600">{error}</p>
          </div>
        </motion.div>
      </main>
    );
  }

  const {
    todaySales,
    monthlySales,
    orderCount,
    netProfit,
    recentOrders = [],
  } = data ?? {};

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VendorDashboardCards
          todaySales={todaySales}
          monthlySales={monthlySales}
          orderCount={orderCount}
          netProfit={netProfit}
        />
      </motion.div>

      {/* Sales Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="mt-8 bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">روند فروش ۳۰ روز اخیر</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  wrapperStyle={{ outline: 'none' }}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '4px' }}
                  labelStyle={{ fontWeight: 600, color: '#1e293b' }}
                  formatter={(value) => `${value} تومان`}
                />
                <Legend verticalAlign="top" height={36} />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#16A34A"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#16A34A' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Latest Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="mt-8 bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">آخرین سفارشات</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                      شماره سفارش
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                      مشتری
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                      مبلغ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                      وضعیت
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-neutral-500">
                        سفارشی یافت نشد
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order, index) => (
                      <motion.key
                        key={order.id ?? index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.5 }}
                      >
                        <tr className="hover:bg-neutral-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                            #{order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                            {order.customerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                            {order.amount?.toLocaleString()} تومان
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                order.status === 'pending'
                                  ? 'bg-warning/10 text-warning'
                                  : order.status === 'processing'
                                  ? 'bg-primary/10 text-primary'
                                  : order.status === 'delivered'
                                  ? 'bg-success/10 text-success'
                                  : 'bg-danger/10 text-danger'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      </motion.key>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
};

export default VendorDashboardPage;
