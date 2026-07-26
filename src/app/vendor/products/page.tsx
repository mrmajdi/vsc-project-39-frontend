import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getVendorListings } from '@/lib/api';

export default function VendorProductsPage() {
  const [listings, setListings] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVendorListings();
      setListings(data);
    } catch (err) {
      setError('خطا در بارگذاری محصولات');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const totalPages = Math.ceil(listings.length / perPage);
  const paginatedListings = listings.slice((page - 1) * perPage, page * perPage);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      // Assuming DELETE endpoint exists
      await fetch(`/api/vendor/listings/${deleteId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      // Refetch after deletion
      await fetchListings();
    } catch (err) {
      setError('خطا در حذف محصول');
      console.error(err);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  if (loading && listings.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-neutral-900">مدیریت محصولات</h1>
          <Link href="/vendor/products/add">
            <button className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              افزودن محصول
            </button>
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm">
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12"
            >
              <div className="h-8 w-8 bg-neutral-200 rounded-full mx-auto mb-4"></div>
              <p className="text-base font-medium text-neutral-600">در حال بارگذاری...</p>
            </motion.div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900">مدیریت محصولات</h1>
        <Link href="/vendor/products/add">
          <button className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            افزودن محصول
          </button>
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-danger/10 text-danger rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                تصویر محصول
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                نام محصول
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                قیمت
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                موجودی
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                وضعیت
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                اقدامات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {listings.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-neutral-500">
                  <img
                    src="/assets/empty.svg"
                    alt="محصولی ثبت نشده است"
                    className="mx-auto h-40 mb-4"
                  />
                  <p className="text-base font-medium text-neutral-600">
                    محصولی ثبت نشده است
                  </p>
                </td>
              </tr>
            ) : (
              paginatedListings.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-4 py-3 flex items-center space-x-2">
                    <img
                      src={item.imageUrl || '/placeholder.png'}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex-1">{item.name}</div>
                  </td>
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{item.price.toLocaleString()} تومان</td>
                  <td className="px-4 py-3">{item.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                    }`}>
                      {item.status === 'active' ? 'فعال' : 'غیرفعال'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link
                      href={`/vendor/products/add?id=${item.id}`}
                      className="text-primary font-medium hover:underline"
                    >
                      ویرایش
                    </Link>
                    <button
                      onClick={() => {
                        setDeleteId(item.id);
                        setShowDeleteModal(true);
                      }}
                      className="text-danger font-medium hover:underline"
                    >
                      حذف
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {listings.length > 0 && (
        <div className="mt-6 flex items-center justify-between text-sm text-neutral-600">
          <div>
            showing{' '}
            <span className="font-medium">
              {(page - 1) * perPage + 1} -{' '}
              {Math.min(page * perPage, listings.length)}
            </span>
            of {listings.length} products
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1.5 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50 transition-colors"
            >
              قبلی
            </button>
            <span className="px-3 py-1.5">
              {page} / {totalPages > 0 ? totalPages : 1}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages || totalPages === 0}
              className="px-3 py-1.5 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50 transition-colors"
            >
              بعدی
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">
              حذف محصول
            </h3>
            <div className="mb-4 text-neutral-600">
              آیا از حذف این محصول اطمینان دارید؟ این عمل قابل بازگشت نیست.
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="inline-flex items-center justify-center gap-2 bg-transparent text-neutral-600 font-medium text-base px-4 py-2.5 rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
              >
                لغو
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center justify-center gap-2 bg-danger text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-disabled:opacity-50"
              >
                {deleting ? 'در حال حذف...' : 'بله، حذف'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
