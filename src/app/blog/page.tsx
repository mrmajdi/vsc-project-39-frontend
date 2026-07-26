import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { motion } from 'framer-motion';
import axios from '@/lib/api';
import { useState, useEffect } from 'react';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('/api/blog-posts');
        setPosts(res.data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header />
      <main className="max-w-7xl ms-auto me-auto ps-4 sm:ps-6 lg:ps-8 pe-4 sm:pe-6 lg:pe-8 py-8">
        <h1 className="text-4xl font-bold leading-tight text-neutral-900 mb-6">
          بلاگ پت‌شاپ
        </h1>
        <div className="mb-6">
          <label className="text-sm font-medium text-neutral-800 block mb-2">
            جستجو در مقالات
          </label>
          <input
            type="text"
            className="w-full ps-4 pe-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="جستجو..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading && !posts.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="animate-pulse bg-neutral-100 rounded-lg h-64"></div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <p className="text-center text-neutral-600 col-span-full">
            مقاله‌ای یافت نشد
          </p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPosts.map((post) => (
              <motion.key
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
                  <img
                    src={post.cover_image_url}
                    alt={post.title || 'تصویر مقاله'}
                    className="w-full h-48 object-cover"
                  />
                  <div className="pt-4 pb-4 ps-4 pe-4">
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-neutral-600 mb-4">
                      {post.excerpt}
                    </p>
                    <a
                      href={`/blog/${post.id}/${post.slug}`}
                      className="inline-flex items-center justify-center gap-2 bg-white text-primary border border-primary font-medium text-sm ps-4 pe-4 py-2 rounded-lg hover:bg-neutral-50 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      ادامه مطلب
                    </a>
                  </div>
                </div>
              </motion.key>
            ))}
          </motion.div>
        )}
      </main>
      <Footer />
    </>
  );
}
