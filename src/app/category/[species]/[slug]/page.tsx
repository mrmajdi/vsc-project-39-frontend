"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const speciesMap = {
  dog: "سگ",
  cat: "گربه",
  bird: "پرنده",
  fish: "ماهی",
  reptile: "مرغوب",
  small: "حیوانات کوچک",
};

export default function CategoryPage() {
  const { species, slug } = useParams();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    brands: [],
    priceRange: [0, 1000000],
    inStock: false,
    sort: "featured",
  });
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          fetch(`/api/categories`),
          fetch(
            `/api/products?species=${species}&cat=${slug}${
              searchParams.toString() ? `&${searchParams.toString()}` : ""
            }`
          ),
        ]);
        const categoriesData = await categoriesRes.json();
        const productsData = await productsRes.json();
        setCategories(categoriesData);
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [species, slug, searchParams]);

  const categoryName = useMemo(() => {
    const category = categories.find((c) => c.slug === slug);
    return category ? category.name : slug;
  }, [categories, slug]);

  const speciesLabel = useMemo(() => {
    return speciesMap[species] || species;
  }, [species]);

  const availableBrands = useMemo(() => {
    return [...new Set(products.map((p) => p.brand))];
  }, [products]);

  const priceRange = useMemo(() => {
    if (products.length === 0) return [0, 1000000];
    const prices = products.map((p) => p.price);
    return [Math.min(...prices), Math.max(...prices)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (filters.brands.length > 0) {
      filtered = filtered.filter((p) => filters.brands.includes(p.brand));
    }

    filtered = filtered.filter(
      (p) =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    if (filters.inStock) {
      filtered = filtered.filter((p) => p.inStock);
    }

    switch (filters.sort) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) =>
          a.name.localeCompare(b.name, "fa", { sensitivity: "base" })
        );
        break;
      case "name-desc":
        filtered.sort((a, b) =>
          b.name.localeCompare(a.name, "fa", { sensitivity: "base" })
        );
        break;
      default:
        break;
    }

    return filtered;
  }, [products, filters]);

  const handleBrandChange = (brand, checked) => {
    setFilters((prev) => {
      const brands = [...prev.brands];
      if (checked) {
        if (!brands.includes(brand)) brands.push(brand);
      } else {
        const index = brands.indexOf(brand);
        if (index > -1) brands.splice(index, 1);
      }
      return { ...prev, brands };
    });
  };

  const handlePriceChange = (min, max) => {
    setFilters((prev) => ({ ...prev, priceRange: [min, max] }));
  };

  const handleInStockChange = (checked) => {
    setFilters((prev) => ({ ...prev, inStock: checked }));
  };

  const handleSortChange = (sort) => {
    setFilters((prev) => ({ ...prev, sort }));
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-neutral-900">
            بارگذاری محصولات...
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-neutral-200 shadow-sm h-64"
              ></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-8">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
            <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4">
              <nav className="text-sm text-neutral-600">
                <span>خانه</span>
                <span className="mx-2">/</span>
                <span>{speciesLabel}</span>
                <span className="mx-2">/</span>
                <span>{categoryName}</span>
              </nav>
              <h1 className="text-4xl font-bold text-neutral-900">
                {categoryName}
              </h1>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <lg:hidden>
            <button
              onClick={() => setShowFilterDrawer(true)}
              className="w-full bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all"
            >
              فیلترها
            </button>
          </lg:hidden>
          <hidden lg:block>
            <aside className="lg:col-span-1 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-neutral-800">
                    برندها
                  </label>
                  <div className="mt-2 space-y-1">
                    {availableBrands.map((brand) => (
                      <label
                        key={brand}
                        className="flex items-center text-sm font-normal text-neutral-600"
                      >
                        <input
                          type="checkbox"
                          checked={filters.brands.includes(brand)}
                          onChange={(e) =>
                            handleBrandChange(brand, e.target.checked)
                          }
                          className="h-4 w-4 text-primary border-neutral-200 rounded"
                        />
                        <span className="ml-2">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-800">
                    قیمت
                  </label>
                  <div className="mt-2 flex flex-col gap-2">
                    <div className="flex justify-between text-xs text-neutral-600">
                      <span>
                        {filters.priceRange[0].toLocaleString()} تومان
                      </span>
                      <span>
                        {filters.priceRange[1].toLocaleString()} تومان
                      </span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min={priceRange[0]}
                        max={priceRange[1]}
                        value={filters.priceRange[0]}
                        onChange={(e) =>
                          handlePriceChange(
                            Number(e.target.value),
                            filters.priceRange[1]
                          )
                        }
                        className="flex-1 h-1 bg-neutral-200 rounded"
                      />
                      <input
                        type="range"
                        min={priceRange[0]}
                        max={priceRange[1]}
                        value={filters.priceRange[1]}
                        onChange={(e) =>
                          handlePriceChange(
                            filters.priceRange[0],
                            Number(e.target.value)
                          )
                        }
                        className="flex-1 h-1 bg-neutral-200 rounded ml-2"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-800">
                    موجود در انبار
                  </label>
                  <div className="mt-2 flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => handleInStockChange(e.target.checked)}
                      className="h-4 w-4 text-primary border-neutral-200 rounded"
                    />
                    <span className="ml-2">بله</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-800">
                    مرتب‌سازی بر اساس
                  </label>
                  <div className="mt-2">
                    <select
                      value={filters.sort}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="featured">پیشنهاد شده</option>
                      <option value="price-low">قیمت: کم به زیاد</option>
                      <option value="price-high">قیمت: زیاد به کم</option>
                      <option value="name-asc">نام: الف تا ی</option>
                      <option value="name-desc">نام: ی تا الف</option>
                    </select>
                  </div>
                </div>
              </div>
            </aside>
          </hidden lg:block>

          <div className="lg:col-span-2 space-y-6">
            {filteredProducts.length === 0 ? (
              <p className="text-center text-neutral-600 py-12">
                محصولی در این دسته‌بندی یافت نشد
              </p>
            ) : (
              <motion.ul
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
              >
                {filteredProducts.map((product) => (
                  <motion.li
                    key={product.id}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                  >
                    <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
                      <div className="relative">
                        <Image
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                        {product.discount && (
                          <span className="absolute top-2 start-2 bg-danger text-white text-xs font-bold px-2 py-1 rounded-sm">
                            {product.discount}% تخفیف
                          </span>
                        )}
                        {!product.inStock && (
                          <span className="absolute top-2 start-2 bg-neutral-400/20 text-neutral-800 text-xs font-bold px-2 py-1 rounded-sm">
                            ناموجود
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                          {product.name}
                        </h3>
                        <p className="text-neutral-600 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-2xl font-bold text-primary">
                            {product.price.toLocaleString()} تومان
                          </span>
                          <button
                            className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-4 py-2 rounded-lg hover:bg-primary-dark transition-all"
                          >
                            افزودن به سبد
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </div>
        </div>
      </main>

      {showFilterDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-neutral-900">
                فیلترها
              </h2>
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="text-neutral-600 hover:text-neutral-900"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-800">
                  برندها
                </label>
                <div className="mt-2 space-y-1">
                  {availableBrands.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center text-sm font-normal text-neutral-600"
                    >
                      <input
                        type="checkbox"
                        checked={filters.brands.includes(brand)}
                        onChange={(e) =>
                          handleBrandChange(brand, e.target.checked)
                        }
                        className="h-4 w-4 text-primary border-neutral-200 rounded"
                      />
                      <span className="ml-2">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-800">
                  قیمت
                </label>
                <div className="mt-2 flex flex-col gap-2">
                  <div className="flex justify-between text-xs text-neutral-600">
                    <span>
                      {filters.priceRange[0].toLocaleString()} تومان
                    </span>
                    <span>
                      {filters.priceRange[1].toLocaleString()} تومان
                    </span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min={priceRange[0]}
                      max={priceRange[1]}
                      value={filters.priceRange[0]}
                      onChange={(e) =>
                        handlePriceChange(
                          Number(e.target.value),
                          filters.priceRange[1]
                        )
                      }
                      className="flex-1 h-1 bg-neutral-200 rounded"
                    />
                    <input
                      type="range"
                      min={priceRange[0]}
                      max={priceRange[1]}
                      value={filters.priceRange[1]}
                      onChange={(e) =>
                        handlePriceChange(
                          filters.priceRange[0],
                          Number(e.target.value)
                        )
                      }
                      className="flex-1 h-1 bg-neutral-200 rounded ml-2"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-800">
                  موجود در انبار
                </label>
                <div className="mt-2 flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => handleInStockChange(e.target.checked)}
                    className="h-4 w-4 text-primary border-neutral-200 rounded"
                  />
                  <span className="ml-2">بله</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-800">
                  مرتب‌سازی بر اساس
                </label>
                <div className="mt-2">
                  <select
                    value={filters.sort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="featured">پیشنهاد شده</option>
                    <option value="price-low">قیمت: کم به زیاد</option>
                    <option value="price-high">قیمت: زیاد به کم</option>
                    <option value="name-asc">نام: الف تا ی</option>
                    <option value="name-desc">نام: ی تا الف</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowFilterDrawer(false)}
                  className="w-full bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all"
                >
                  اعمال فیلترها
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
