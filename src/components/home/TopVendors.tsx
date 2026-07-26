import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

const TopVendors = () => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await api.get('/vendors');
        setVendors(res.data);
      } catch (err) {
        setVendors([]);
      }
    };

    fetchVendors();
  }, []);

  if (vendors.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {vendors.map(vendor => (
        <motion.div
          key={vendor.id}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-200px" }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <Link href={`/vendors/${vendor.id}/${vendor.slug}`} className="w-full hover:no-underline">
            <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-4 flex flex-col items-center gap-2 transition-all hover:shadow-md">
              <div className="w-16 h-16 overflow-hidden rounded-full">
                <img
                  src={vendor.logoUrl}
                  alt={`${vendor.name} لوگو`}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">{vendor.name}</h3>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-accent">★</span>
                <span className="text-neutral-600">{vendor.rating}</span>
                <span className="text-neutral-600">ستاره</span>
              </div>
              <div className="text-neutral-600 text-sm">
                {vendor.productCount} محصول
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default TopVendors;
