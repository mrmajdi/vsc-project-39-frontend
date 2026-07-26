import Link from 'next/link'
import { motion } from 'framer-motion'

interface Product {
  id: string
  slug: string
  name: string
  brandName: string
  mainImage: string
  price: number
  discountPercentage: number
  suitableFor: string[] | null
  rating: number
  inStock: boolean
}

interface Pet {
  id: string
  name: string
  photo: string
  species: string
}

export default function ProductCard({ product, activePet }: { product: Product; activePet: Pet | null }) {
  const originalPrice =
    product.discountPercentage > 0
      ? Math.round(product.price / (1 - product.discountPercentage / 100))
      : product.price

  return (
    <Link
      href={`/products/${product.id}/${product.slug}`}
      passHref
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div className="relative aspect-w-1 aspect-h-1">
          <img
            src={product.mainImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.discountPercentage > 0 && (
            <span className="absolute top-2 start-2 bg-danger text-white text-xs font-bold px-2 py-1 rounded-sm">
              %{product.discountPercentage} تخفیف
            </span>
          )}
          {activePet &&
            product.suitableFor?.includes(activePet.species) && (
              <motion.span
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-2 start-8 flex items-center gap-1 bg-success/10 text-success text-xs font-medium px-2.5 py-1 rounded-full"
                title={`این رو بخر برای ${activePet.name}!`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                <img
                  src={activePet.photo}
                  alt={activePet.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                {activePet.name}
              </motion.span>
            )}
        </div>

        <div className="p-4">
          <div className="mb-1">
            <span className="text-xs text-neutral-400">{product.brandName}</span>
          </div>
          <h3 className="text-sm font-medium text-neutral-800 line-clamp-2">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className="text-warning"
                aria-hidden="true"
              >
                {i <= Math.floor(product.rating)
                  ? '★'
                  : i <= product.rating
                  ? '⯪'
                  : '☆'}
              </span>
            ))}
            <span className="text-xs text-neutral-600 ml-1">
              ({product.rating?.toFixed(1) ?? '0'})
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-bold text-neutral-900">
              {product.price.toLocaleString()} تومان
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-xs text-neutral-400 line-through">
                {originalPrice.toLocaleString()} تومان
              </span>
            )}
          </div>

          {!product.inStock && (
            <p className="mt-2 text-xs text-danger">ناموجود</p>
          )}
        </div>
      </div>
    </Link>
  )
}
