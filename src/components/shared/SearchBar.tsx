'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchIcon } from '@heroicons/react/24/outline';
import { api } from '@/lib/api';

interface Product {
  id: string | number;
  slug: string;
  title: string;
  imageUrl?: string;
  price: number | string;
}

const SearchBar: React.FC = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Debounced API call
  useEffect(() => {
    if (query.length < 3) {
      setResults(null);
      setLoading(false);
      setShowDropdown(false);
      return;
    }
    const handler = setTimeout(() => {
      setLoading(true);
      api
        .get('/products', { params: { q: query, limit: 8 } })
        .then((res) => {
          // Assuming API returns { data: [...] } or directly array
          const data = Array.isArray(res.data) ? res.data : (res.data.data ?? []);
          setResults(data);
          setLoading(false);
          setShowDropdown(true);
        })
        .catch(() => {
          setLoading(false);
          setResults(null);
          setShowDropdown(false);
        });
    }, 400);
    return () => clearTimeout(handler);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
        setResults(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
      setResults(null);
    }, 150);
  };

  const handleFocus = () => {
    if (query.length >= 3) {
      setShowDropdown(true);
    }
  };

  const handleSelect = (product: Product) => {
    router.push(`/products/${product.id}/${product.slug}`);
    setShowDropdown(false);
    setResults(null);
    setQuery('');
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="جستجو..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onBlur={handleBlur}
        onFocus={handleFocus}
        ref={inputRef}
        aria-label="جستجوی محصولات"
        className="w-full pl-12 pr-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <SearchIcon className="h-4 w-4 text-neutral-400" aria-hidden="true" />
      </div>

      {showDropdown && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute left-0 right-0 mt-1 w-full bg-white border border-neutral-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto"
            ref={dropdownRef}
          >
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : results === null ? null : (
              results.length > 0 ? (
                results.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center px-3 py-2 hover:bg-neutral-50 cursor-pointer"
                    onClick={() => handleSelect(product)}
                  >
                    <img
                      src={product.imageUrl ?? ''}
                      alt={product.title ?? ''}
                      className="w-8 h-8 rounded me-3 object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-900">{product.title}</p>
                      <p className="text-xs text-neutral-600">
                        {typeof product.price === 'number' ? product.price.toLocaleString() : product.price} تومان
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-neutral-600">
                  نتیجه‌ای یافت نشد
                </div>
              )
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default SearchBar;
