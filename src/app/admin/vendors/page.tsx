<div class="min-h-screen bg-neutral-50">
  <header class="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-neutral-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <h1 class="text-2xl font-bold text-neutral-900">مدیریت فروشندگان</h1>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-8">
      <div class="flex flex-wrap gap-4">
        <button
          onClick={() => setFilterStatus('all')}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus-ring-offset-2 focus-ring-primary ${
            filterStatus === 'all'
              ? 'bg-primary text-white hover:bg-primary-dark'
              : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
          }`}
        >
          همه
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus-ring-offset-2 focus-ring-primary ${
            filterStatus === 'pending'
              ? 'bg-warning text-white hover:bg-warning-dark'
              : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
          }`}
        >
          در انتظار
        </button>
        <button
          onClick={() => setFilterStatus('approved')}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus-ring-offset-2 focus-ring-primary ${
            filterStatus === 'approved'
              ? 'bg-success text-white hover:bg-success-dark'
              : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
          }`}
        >
          تاییدشده
        </button>
        <button
          onClick={() => setFilterStatus('blocked')}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus-ring-offset-2 focus-ring-primary ${
            filterStatus === 'blocked'
              ? 'bg-danger text-white hover:bg-danger-dark'
              : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
          }`}
        >
          مسدودشده
        </button>
      </div>
    </div>

    {toasts.length > 0 && (
      <div class="mb-6">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-4 p-4 rounded-lg border-l-4 ${
              toast.type === 'success'
                ? 'bg-success/10 text-success border-success'
                : 'bg-danger/10 text-danger border-danger'
            }`}
          >
            <div class="flex-shrink-0">
              {toast.type === 'success' ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div>{toast.message}</div>
          </div>
        ))}
      </div>
    )}

    {loading ? (
      <div class="h-96 flex items-center justify-center">
        <div class="space-y-4">
          <div class="flex space-x-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 w-4 bg-neutral-200 rounded-full animate-pulse" />
            ))}
          </div>
          <div class="flex space-x-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 w-20 bg-neutral-200 rounded-md animate-pulse" />
            ))}
          </div>
          <div class="flex space-x-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 w-32 bg-neutral-200 rounded-md animate-pulse" />
            ))}
          </div>
          <div class="flex space-x-4 mt-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-4 w-16 bg-neutral-200 rounded-md animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    ) : error ? (
      <div class="p-6 bg-danger/10 text-danger rounded-lg border border-danger/20">
        خطا در بارگذاری داده‌ها: {error.message}
      </div>
    ) : (
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-neutral-200">
          <thead>
            <tr class="border-b">
              <th
                className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider"
              >
                نام فروشنده
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider"
              >
                لوگو
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider"
              >
                تلفن
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider"
              >
                میزان کمیسیون
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider"
              >
                وضعیت
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider"
              >
                تعداد محصولات
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider"
              >
                تاریخ ثبت
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider"
              >
                عملیات
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-200">
            {vendors.map((vendor) => (
              <motion.tr
                key={vendor.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: vendors.indexOf(vendor) * 0.02 }}
              >
                <td className="px-6 py-4 text-start text-sm font-medium text-neutral-900">
                  {vendor.name}
                </td>
                <td className="px-6 py-4 flex items-center">
                  <div class="w-10 h-10 flex-shrink-0">
                    <img
                      src={vendor.logo || '/placeholder-vendor.png'}
                      alt={vendor.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-start text-sm font-medium text-neutral-900">
                  {vendor.phone}
                </td>
                <td className="px-6 py-4 text-start text-sm font-medium text-neutral-900">
                  {vendor.commission_rate}٪
                </td>
                <td className="px-6 py-4 flex items-center">
                  {(() => {
                    const status = vendor.status || 'pending';
                    let bgColor, textColor, label;
                    switch (status) {
                      case 'pending':
                        bgColor = 'bg-warning/10';
                        textColor = 'text-warning';
                        label = 'در انتظار';
                        break;
                      case 'approved':
                        bgColor = 'bg-success/10';
                        textColor = 'text-success';
                        label = 'تاییدشده';
                        break;
                      case 'rejected':
                        bgColor = 'bg-danger/10';
                        textColor = 'text-danger';
                        label = 'رد شده';
                        break;
                      case 'blocked':
                        bgColor = 'bg-danger/10';
                        textColor = 'text-danger';
                        label = 'مسدودشده';
                        break;
                      default:
                        bgColor = 'bg-neutral-100';
                        textColor = 'text-neutral-600';
                        label = status;
                    }
                    return (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
                        {label}
                      </span>
                    );
                  })()}
                </td>
                <td className="px-6 py-4 text-start text-sm font-medium text-neutral-900">
                  {vendor.product_count}
                </td>
                <td className="px-6 py-4 text-start text-sm font-medium text-neutral-900">
                  {new Date(vendor.created_at).toLocaleDateString('fa-IR')}
                </td>
                <td className="px-6 py-4 text-start space-x-2">
                  {vendor.status !== 'approved' && (
                    <button
                      onClick={() => handleStatusChange(vendor.id, 'approved')}
                      className="inline-flex items-center justify-center gap-1.5 bg-success text-white font-medium text-xs px-3 py-1.5 rounded-lg hover:bg-success-dark transition-all focus:outline-none focus:ring-2 focus-ring-offset-2 focus-ring-success disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      تایید
                    </button>
                  )}
                  {vendor.status !== 'rejected' && (
                    <button
                      onClick={() => handleStatusChange(vendor.id, 'rejected')}
                      className="inline-flex items-center justify-center gap-1.5 bg-danger text-white font-medium text-xs px-3 py-1.5 rounded-lg hover:bg-red-600 transition-all focus:outline-none focus:ring-2 focus-ring-offset-2 focus-ring-danger disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      رد
                    </button>
                  )}
                  {vendor.status !== 'blocked' && (
                    <button
                      onClick={() => handleStatusChange(vendor.id, 'blocked')}
                      className="inline-flex items-center justify-center gap-1.5 bg-danger text-white font-medium text-xs px-3 py-1.5 rounded-lg hover:bg-red-600 transition-all focus:outline-none focus:ring-2 focus-ring-offset-2 focus-ring-danger disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      مسدود
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditVendorId(vendor.id);
                      setEditCommission(vendor.commission_rate || 0);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 bg-neutral-100 text-neutral-800 font-medium text-xs px-3 py-1.5 rounded-lg hover:bg-neutral-200 transition-all focus:outline-none focus:ring-2 focus-ring-offset-2 focus-ring-neutral-400"
                    disabled={loading}
                  >
                    ویرایش کمیسیون
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </main>

  {/* Edit Commission Modal */}
  {editVendorId !== null && (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-semibold text-neutral-900">ویرایش کمیسیون فروشنده</h3>
          <button
            onClick={() => setEditVendorId(null)}
            className="text-neutral-400 hover:text-neutral-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveCommission();
          }}
          className="space-y-4"
        >
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-neutral-800">میزان کمیسیون (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={editCommission}
              onChange={(e) => setEditCommission(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="مثال: 15.5"
            />
            {editCommissionError && (
              <span className="text-xs text-danger">{editCommissionError}</span>
            )}
          </div>
          <div class="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditVendorId(null)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus-ring-neutral-400"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus-ring-offset-2 focus-ring-primary"
            >
              ذخیره
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>
