'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '@/lib/api';
import ProductCard from '../product/ProductCard';

const BestSellers: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('همه');
  const [speciesList, setSpeciesList] = useState<string[]>(['همه']);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/products', {
          params: { sort: 'best-selling' },
        });
        const data = response.data; // assume array of products
        setProducts(data);

        // extract unique species
        const species = [...new Set(data.map((p: any) => p.species))].sort();
        setSpeciesList(['همه', ...species]);
      } catch (err: any) {
        setError(err.response?.data?.message || 'خطا در بارگذاری محصولات');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts =
    activeTab === 'همه'
      ? products
      : products.filter((p: any) => p.species === activeTab);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  if (loading) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">
          محصولات پرفروش
        </h2>
        <p className="text-neutral-600">در حال بارگذاری...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">
          محصولات پرفروش
        </h2>
        <p className="text-danger">{error}</p>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-neutral-900 mb-4">
        محصولات پرفروش
      </h2>

      {/* Tab Bar */}
      <div className="flex gap-2 border-b border-neutral-200 mb-6">
        {speciesList.map((species) => (
          <button
            key={species}
            onClick={() => setActiveTab(species)}
            className={`inline-flex items-center px-4 py-2 text-base font-medium ${
              activeTab === species
                ? 'text-primary border-b-2 border-primary'
                : 'text-neutral-600 hover:text-neutral-800'
            }`}
          >
            {species}
          </button>
        ))}
      </div>

      {/* Product Grid with Motion */}
      <AnimatePresence>
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          exit="hidden"
        >
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  className="flex"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="col-span-full text-center text-neutral-600 py-8">
              محصولی یافت نشد
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default BestSellers;
