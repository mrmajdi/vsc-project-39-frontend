import React from 'react';

interface Listing {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorLogo: string;
  vendorRating: number;
  price: number;
  discountPercentage: number;
  finalPrice: number;
  shippingCost: number;
  shippingTimeDays: number;
  city: string;
  isAuthentic: boolean;
  expiryDate: string;
  stockCount: string | number;
}

interface VendorListingTableProps {
  listings: Listing[];
  onBuy: (listingId: string) => void;
}

export const VendorListingTable: React.FC<VendorListingTableProps> = ({
  listings,
  onBuy,
}) => {
  if (listings.length === 0) {
    return <p className="text-center text-neutral-500 py-4">فروشگاهی یافت نشد</p>;
  }

  return (
    <div className="w-full">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600">
                فروشگاه
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600">
                امتیاز
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600">
                قیمت
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600">
                تخفیف
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600">
                قیمت نهایی
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600">
                هزینه ارسال
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600">
                زمان ارسال
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600">
                شهر
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600">
                اصالت کالا
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600">
                تاریخ انقضا
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600">
                موجودی
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-600">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {listings.map((listing) => (
              <tr key={listing.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3 text-sm flex items-center gap-2">
                  <img
                    src={listing.vendorLogo}
                    alt={listing.vendorName}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-medium">{listing.vendorName}</span>
                </td>
                <td className="px-4 py-3 text-sm">{listing.vendorRating}</td>
                <td className="px-4 py-3 text-sm">{listing.price}</td>
                <td className="px-4 py-3 text-sm">
                  {listing.discountPercentage}%
                </td>
                <td className="px-4 py-3 text-sm font-bold text-neutral-900">
                  {listing.finalPrice}
                </td>
                <td className="px-4 py-3 text-sm">
                  {listing.shippingCost === 0 ? (
                    <span className="text-success">رایگان</span>
                  ) : (
                    listing.shippingCost
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  {listing.shippingTimeDays} روز
                </td>
                <td className="px-4 py-3 text-sm">{listing.city}</td>
                <td className="px-4 py-3 text-sm">
                  {listing.isAuthentic ? (
                    <span className="inline-flex items-center text-success">
                      ✓ اصل
                    </span>
                  ) : (
                    <span className="text-neutral-400">غیرواقعی</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">{listing.expiryDate}</td>
                <td className="px-4 py-3 text-sm flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    aria-hidden="true"
                  ></span>
                  <span>{listing.stockCount}</span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => onBuy(listing.id)}
                    className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-sm px-4 py-2 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    خرید
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="block md:hidden space-y-4">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden transition-all hover:shadow-md p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <img
                src={listing.vendorLogo}
                alt={listing.vendorName}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-medium">{listing.vendorName}</span>
            </div>
            <div className="text-sm text-neutral-600 mb-1">
              امتیاز: {listing.vendorRating}
            </div>
            <div className="flex flex-wrap gap-4 mb-2 text-sm">
              <div>قیمت: {listing.price}</div>
              <div>تخفیف: {listing.discountPercentage}%</div>
              <div className="font-bold text-neutral-900">
                قیمت نهایی: {listing.finalPrice}
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mb-2 text-sm">
              <div>
                هزینه ارسال:{' '}
                {listing.shippingCost === 0 ? (
                  <span className="text-success">رایگان</span>
                ) : (
                  listing.shippingCost
                )}
              </div>
              <div>زمان ارسال: {listing.shippingTimeDays} روز</div>
              <div>شهر: {listing.city}</div>
            </div>
            <div className="flex items-center gap-2 mb-2 text-sm">
              {listing.isAuthentic ? (
                <span className="inline-flex items-center text-success">
                  ✓ اصل
                </span>
              ) : (
                <span className="text-neutral-400">غیرواقعی</span>
              )}
            </div>
            <div className="text-sm text-neutral-600 mb-2">
              تاریخ انقضا: {listing.expiryDate}
            </div>
            <div className="flex items-center gap-2 mb-4 text-sm">
              <span
                className="w-2 h-2 rounded-full"
                aria-hidden="true"
              ></span>
              <span>موجودی: {listing.stockCount}</span>
            </div>
            <button
              onClick={() => onBuy(listing.id)}
              className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-sm px-4 py-2 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              خرید
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
