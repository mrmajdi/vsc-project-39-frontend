import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';

type Product = {
  id: string;
  name: string;
};

type FormData = {
  price: number;
  stock: number;
  isAuthentic: boolean;
  expiryDate: string;
};

const formSchema = z.object({
  price: z.number().min(0, 'قیمت باید عددی مثبت باشد'),
  stock: z.number().min(0, 'موجودی باید عددی مثبت باشد'),
  isAuthentic: z.boolean(),
  expiryDate: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    { message: 'تاریخ انقضا نامعتبر است' }
  ),
});

interface VendorProductFormProps {
  products: Product[];
  onProductSelect: (productId: string) => void;
  onSuggestNewProduct: () => void;
  onSubmit: SubmitHandler<FormData>;
  initialData?: FormData;
}

export const VendorProductForm: React.FC<VendorProductFormProps> = ({
  products,
  onProductSelect,
  onSuggestNewProduct,
  onSubmit,
  initialData,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          price: initialData.price ?? 0,
          stock: initialData.stock ?? 0,
          isAuthentic: initialData.isAuthentic ?? false,
          expiryDate: initialData.expiryDate ?? '',
        }
      : undefined,
  });

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    onProductSelect(productId);
    setSearchTerm('');
  };

  const handleSubmitForm = handleSubmit(onSubmit);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="space-y-6">
      {!selectedProductId ? (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-800">جستجوی محصول</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full ps-4 pe-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="نام محصول را وارد کنید"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={onSuggestNewProduct}
                  className="absolute inset-y-0 end-0 me-2 flex items-center px-3 text-neutral-500 hover:text-neutral-600"
                >
                  + محصول جدید
                </button>
              )}
            </div>
            {searchTerm && filteredProducts.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 w-full bg-white border border-neutral-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="ps-4 pe-4 py-2 text-sm text-neutral-800 hover:bg-neutral-100 cursor-pointer"
                    onClick={() => handleProductSelect(product.id)}
                  >
                    {product.name}
                  </div>
                ))}
              </div>
            )}
            {searchTerm && filteredProducts.length === 0 && (
              <button
                type="button"
                onClick={onSuggestNewProduct}
                className="mt-2 inline-flex items-center justify-center gap-2 bg-white text-primary border border-primary font-medium text-base ps-6 pe-4 py-2.5 rounded-md shadow-sm hover:bg-neutral-50 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
              >
                پیشنهاد محصول جدید
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <form onSubmit={handleSubmitForm} className="space-y-4">
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              key="price"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-800">قیمت</label>
                <input
                  type="number"
                  {...register('price')}
                  className="w-full ps-4 pe-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  min="0"
                  step="0.01"
                  placeholder="0"
                />
                {errors.price && (
                  <span className="text-danger text-xs">{errors.price.message}</span>
                )}
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              key="stock"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-800">موجودی</label>
                <input
                  type="number"
                  {...register('stock')}
                  className="w-full ps-4 pe-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  min="0"
                  placeholder="0"
                />
                {errors.stock && (
                  <span className="text-danger text-xs">{errors.stock.message}</span>
                )}
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              key="authenticity"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('isAuthentic')}
                  className="h-4 w-4 text-primary border-neutral-200 rounded focus:ring-2 focus:ring-primary"
                />
                <label className="text-sm font-medium text-neutral-800">اصالت کالا</label>
              </div>
              {errors.isAuthentic && (
                <span className="text-danger text-xs">{errors.isAuthentic.message}</span>
              )}
            </motion.div>

            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              key="expiry"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-800">تاریخ انقضا</label>
                <input
                  type="date"
                  {...register('expiryDate')}
                  className="w-full ps-4 pe-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                {errors.expiryDate && (
                  <span className="text-danger text-xs">{errors.expiryDate.message}</span>
                )}
              </div>
            </motion.div>

            <div className="mt-6">
              <button
                type="submit"
                className={`inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base ps-6 pe-4 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSubmitting ? 'opacity-70' : ''
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    در حال ثبت...
                  </>
                ) : (
                  'ثبت محصول'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};
