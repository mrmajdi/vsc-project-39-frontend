import Link from 'next/link';
import { motion } from 'framer-motion';

interface BlogCardProps {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  author: string;
  publishedAt: string;
  readingTime: number;
}

export const BlogCard = ({
  id,
  slug,
  title,
  excerpt,
  coverImage,
  category,
  author,
  publishedAt,
  readingTime,
}: BlogCardProps) => {
  return (
    <Link href={`/blog/${id}/${slug}`} passThru>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden transition-all hover:shadow-md block"
      >
        <div className="w-full h-48 overflow-hidden">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
        <div className="p-4">
          <span className="inline-flex items-center bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full mb-2">
            {category}
          </span>
          <h3 className="text-xl font-semibold text-neutral-900 mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-neutral-600 line-clamp-3 mb-3">
            {excerpt}
          </p>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary text-white text-xs font-medium">
                {author.trim().charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-neutral-600">
                {author}
              </span>
            </div>
            <span className="text-xs text-neutral-400">
              {readingTime} دقیقه خواندن
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
