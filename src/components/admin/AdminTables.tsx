src/components/admin/AdminTables.tsx
```tsx
import React, { useState, useEffect } from 'react';

interface AdminTableProps<T> {
  columns: Array<{
    key: keyof T;
    label: string;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
  }>;
  data: T[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

export const AdminTable = <T>({
  columns,
  data,
  pagination,
}: AdminTableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue, undefined, { sensitivity: 'base' })
        : bValue.localeCompare(aValue, undefined, { sensitivity: 'base' });
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  const requestSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right">
        <thead>
          <tr className="bg-neutral-100">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-2 text-left font-medium text-neutral-600 cursor-pointer ${
                  sortConfig?.key === col.key
                    ? sortConfig.direction === 'asc'
                      ? 'text-primary'
                      : 'text-danger'
                    : 'text-neutral-600'
                }`}
                onClick={() => requestSort(col.key)}
              >
                {col.label}
                {sortConfig?.key === col.key && (
                  <span className="ml-1">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`border-b border-neutral-200 hover:bg-neutral-50 ${
                rowIndex % 2 === 0 ? 'bg-neutral-50' : 'white'
              }`}
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-4 py-2">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCards = () => (
    <div className="space-y-4">
      {sortedData.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden transition-all hover:shadow-md"
        >
          <div className="p-4">
            {columns.map((col, index) => (
              <div key={index} className="mb-2">
                <span className="text-neutral-600">{col.label}:</span>
                <span className="ml-2">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="p-4">
        {pagination ? (
          <>
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <h3 className="text-xl font-semibold text-neutral-900">
                جدول داده‌ها
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => pagination.onPageChange(Math.max(pagination.currentPage - 1, 1))}
                  disabled={pagination.currentPage === 1}
                  className="inline-flex items-center justify-center gap-1 text-sm px-3 py-1.5 bg-transparent text-neutral-600 font-medium rounded-md hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
                >
                  صفحه قبلی
                </button>
                <span className="text-neutral-600">
                  صفحه {pagination.currentPage} از {pagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    pagination.onPageChange(Math.min(pagination.currentPage + 1, pagination.totalPages))
                  }
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="inline-flex items-center justify-center gap-1 text-sm px-3 py-1.5 bg-transparent text-neutral-600 font-medium rounded-md hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
                >
                  صفحه بعدی
                </button>
              </div>
            </div>
            {sortedData.length > 0 ? (
              <div className="hidden md:block">
                {renderTable()}
              </div>
            ) : (
              <p className="text-center py-8 text-neutral-500">
                داده‌ای برای نمایش یافت نشد.
              </p>
            )}
          </>
        ) : (
          <>
            {sortedData.length > 0 ? (
              <div className="hidden md:block">
                {renderTable()}
              </div>
            ) : (
              <p className="text-center py-8 text-neutral-500">
                داده‌ای برای نمایش یافت نشد.
              </p>
            )}
          </>
        )}
      </div>
      {pagination && (
        <div className="px-4 py-3 border-t border-neutral-200 flex flex-col md:flex-row md:items-center md:justify-between">
          <button
            onClick={() => pagination.onPageChange(Math.max(pagination.currentPage - 1, 1))}
            disabled={pagination.currentPage === 1}
            className="w-full md:w-auto inline-flex items-center justify-center gap-1 text-sm px-3 py-1.5 bg-transparent text-neutral-600 font-medium rounded-md hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            صفحه قبلی
          </button>
          <span className="mt-2 md:mt-0 text-center md:text-left text-neutral-600">
            صفحه {pagination.currentPage} از {pagination.totalPages}
          </span>
          <button
            onClick={() =>
              pagination.onPageChange(Math.min(pagination.currentPage + 1, pagination.totalPages))
            }
            disabled={pagination.currentPage === pagination.totalPages}
            className="w-full md:w-auto inline-flex items-center justify-center gap-1 text-sm px-3 py-1.5 bg-transparent text-neutral-600 font-medium rounded-md hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            صفحه بعدی
          </button>
        </div>
      )}
    </div>
  );
};

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const AdminModal = ({
  isOpen,
  onClose,
  title,
  children,
}: AdminModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:max-w-2xl">
        <div className="flex items-start justify-between mb-4">
          <h3 className="flex-1 text-xl font-semibold text-neutral-900">{title}</h3>
          <button
            onClick={onClose}
            className="me-auto rounded-md p-1.5 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            aria-label="بستن"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
};

interface AdminSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const AdminSearchBar = ({
  value,
  onChange,
  placeholder = 'جستجو...',
}: AdminSearchBarProps) => {
  const [inputValue, setInputValue] = useState(value);
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 300);
    return () => clearTimeout(handler);
  }, [inputValue]);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  return (
    <div className="relative">
      <span
        className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
        aria-hidden="true"
      >
        <svg
          className="h-4 w-4 text-neutral-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M15 10a5 5 0 11-9.999 0M9 10a1 1 0 012 0v4a1 1 0 01-2 0v-4z"
          />
        </svg>
      </span>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full ps-10 pe-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        placeholder={placeholder}
      />
    </div>
  );
};
