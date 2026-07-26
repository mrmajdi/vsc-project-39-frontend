import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import VendorListingTable from '@/components/product/VendorListingTable';
import ReviewList from '@/components/product/ReviewList';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';

export default function ProductDetailPage({ params }: { params: { id: string; slug: string } }) {
  const [product, setProduct] = useState(null);
  const [listings, setListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [userPets, setUserPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'specs' | 'description' | 'reviews'>('specs');
  const [zoomEnabled, setZoomEnabled] = useState(false);
  const router = useRouter();
  const { user } = useAuthStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productRes, listingsRes, reviewsRes] = await Promise.all([
          fetch(`/api/products/${params.id}`),
          fetch(`/api/products/${params.id}/listings`),
          fetch(`/api/products/${params.id}/reviews`),
        ]);

        if (!productRes.ok) {
          if (productRes.status === 404) {
            notFound();
          }
          throw new Error('Failed to fetch product');
        }
        const productData = await productRes.json();
        if (productData.slug !== params.slug) {
          router.push(`/products/${productData.id}/${productData.slug}`);
          return;
        }
        setProduct(productData);

        if (!listingsRes.ok) throw new Error('Failed to fetch listings');
        const listingsData = await listingsRes.json();
        setListings(listingsData);

        if (!reviewsRes.ok) throw new Error('Failed to fetch reviews');
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);

        if (user) {
          const petsRes = await fetch(`/api/user/pets`);
          if (petsRes.ok) {
            const petsData = await petsRes.json();
            setUserPets(petsData);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطای نامشخص');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, user]);

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-160px)] flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-64 h-8 bg-neutral-200 rounded mb-4"></div>
          <div className="w-full h-48 bg-neutral-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-neutral-200 rounded"></div>
            <div className="h-16 bg-neutral-200 rounded"></div>
            <div className="h-16 bg-neutral-200 rounded"></div>
            <div className="h-16 bg-neutral-200 rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[calc(100vh-160px)] flex items-center justify-center">
        <p className="text-neutral-600 text-center">{error}</p>
      </main>
    );
  }

  if (!product) {
    return <div className="min-h-[calc(100vh-160px)] flex items-center justify-center">محصول یافت نشد</div>;
  }

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      quantity: 1,
      petId: selectedPetId || null,
    });
    router.push('/cart');
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleZoomToggle = () => {
    setZoomEnabled(!zoomEnabled);
  };

  const isPetSuitable = (petType: string) => {
    return product.suitableFor?.includes(petType) ?? false;
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-sm text-neutral-600 mb-6">
        <a href="/" className="hover:text-primary">
          خانه
        </a>
        <span className="mx-2">></span>
        <a href={`/category/${product.category.slug}`} className="hover:text-primary">
          {product.category.name}
        </a>
        <span className="mx-2">></span>
        <span aria-current="page" className="font-medium text-neutral-900">
          {product.name}
        </span>
      </nav>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Gallery and Info */}
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
          {/* Info */}
          <div className="lg:order-1 space-y-4">
            <h1 className="text-4xl font-bold text-neutral-900">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <span>برند:</span>
              <span className="font-medium">{product.brand.name}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.suitableFor?.map((petType: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-secondary/10 text-secondary text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {petType}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={star <= (product.rating ?? 0)
                      ? 'text-warning'
                      : 'text-neutral-200'
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-neutral-600">
                ({product.reviewsCount ?? 0} نظر)
              </span>
            </div>

            {/* Pet Match Section */}
            <section className="border-t border-neutral-200 pt-4">
              <h2 className="text-xl font-semibold text-neutral-900 mb-3">
                تطابق با پت‌های شما
              </h2>
              {userPets.length === 0 ? (
                <p className="text-neutral-600">
                  برای مشاهده تطابق، ابتدا وارد شوید و پت‌های خود را اضافه کنید.
                </p>
              ) : (
                <div className="space-y-2">
                  {userPets.map((pet) => {
                    const suitable = isPetSuitable(pet.type);
                    return (
                      <div
                        key={pet.id}
                        onClick={() => setSelectedPetId(pet.id)}
                        className={`cursor-pointer flex items-center gap-2 p-2 rounded-md hover:bg-neutral-50 transition-colors ${
                          selectedPetId === pet.id
                            ? 'ring-2 ring-primary'
                            : ''
                        }`}
                      >
                        <span className={`text-${suitable ? 'success' : 'warning'} text-xl`}>
                          {suitable ? '✅' : '⚠️'}
                        </span>
                        <span className="text-neutral-900">{pet.name}</span>
                        <span className="ml-auto text-xs">
                          {suitable ? 'مناسب' : 'مناسب نیست'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Description */}
            <div className="prose prose-neutral max-w-none">
              dangerouslySetInnerHTML={{ __html: product.description }}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:gap-3 mt-6">
              <button
                onClick={handleAddToCart}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {selectedPetId ? `خرید برای ${userPets.find((p) => p.id === selectedPetId)?.name}` : 'افزودن به سبد خرید'}
              </button>
              <button
                onClick={() => router.push(`/vendors/${product.vendorId}`)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-primary border border-primary font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-neutral-50 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
              >
                مشاهده فروشنده
              </button>
            </div>
          </div>

          {/* Gallery */}
          <div className="lg:order-2 relative group">
            <div className="relative w-full h-96 bg-neutral-100 overflow-hidden rounded-lg">
              <img
                src={product.images?.[currentImageIndex] || ''}
                alt={`${product.name} - تصویر ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
                onLoad={(e) => {
                  // Add zoom effect on desktop
                  if (window.innerWidth >= 1024) {
                    setZoomEnabled(true);
                  }
                }}
              />
              {zoomEnabled && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={handleZoomToggle}
                    className="text-white text-2xl hover:text-primary"
                    aria-label="بزرگنمایی"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto">
              {product.images?.map((src, index) => (
                <button
                  key={index}
                  onClick={() => handleImageClick(index)}
                  className={`flex-shrink-0 w-16 h-16 border-2 ${
                    currentImageIndex === index
                      ? 'border-primary'
                      : 'border-neutral-200'
                  } rounded-md overflow-hidden hover:border-primary transition-all`}
                >
                  <img
                    src={src}
                    alt={`${product.name} -thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="space-y-4">
          <div className="flex gap-2 border-b border-neutral-200">
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'specs'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              مشخصات فنی
            </button>
            <button
              onClick={() => setActiveTab('description')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'description'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              توضیحات
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'reviews'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              نظرات کاربران ({product.reviewsCount ?? 0})
            </button>
          </div>
          {activeTab === 'specs' && (
            <div className="space-y-2">
              {Object.entries(product.specs || {}).map(([key, value], index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-neutral-600">{key}</span>
                  <span className="text-neutral-900">{value}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'description' && (
            <div className="prose prose-neutral max-w-none">
              dangerouslySetInnerHTML={{ __html: product.description }}
            </div>
          )}
          {activeTab === 'reviews' && (
            <ReviewList reviews={reviews} />
          )}
        </div>

        {/* Vendor Listings */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            فروشندگان و قیمت‌ها
          </h2>
          {listings.length === 0 ? (
            <p className="text-neutral-600">در حال حاضر فروشی برای این محصول ثبت نشده است.</p>
          ) : (
            <VendorListingTable listings={listings} />
          )}
        </section>

        {/* Related Products */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            محصولات مرتبط
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Placeholder for related products - in a real app, we would fetch these */}
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index} className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
                <div className="h-48 bg-neutral-200"></div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">
                    محصول مرتبط
                  </h3>
                  <p className="text-neutral-600 line-clamp-2">توضیح کوتاه محصول مرتبط</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-medium text-primary">۱۲۰,۰۰۰ تومان</span>
                    <button
                      className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-xs px-3 py-1.5 rounded-lg hover:bg-primary-dark transition-all"
                    >
                      افزودن
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
