import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { toPersianDate } from '@/lib/utils';

export default function BlogPostPage({ params }: { params: { id: string; slug: string } }) {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BlogPostClient id={params.id} slug={params.slug} />
      </main>
      <Footer />
    </>
  );
}

"use client";

function BlogPostClient({ id, slug }: { id: string; slug: string }) {
  const [blogPost, setBlogPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [blogPostLoading, setBlogPostLoading] = useState(true);
  const [relatedPostsLoading, setRelatedPostsLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogPost() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blog-posts/${id}`);
        if (!res.ok) {
          notFound();
        }
        const data = await res.json();
        setBlogPost(data);
        setBlogPostLoading(false);
      } catch (error) {
        notFound();
      }
    }
    fetchBlogPost();
  }, [id]);

  useEffect(() => {
    if (blogPost) {
      async function fetchRelatedPosts() {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blog-posts?category=${encodeURIComponent(blogPost.category)}&limit=3`);
          if (!res.ok) {
            setRelatedPosts([]);
          } else {
            const data = await res.json();
            setRelatedPosts(data);
          }
        } catch (error) {
          setRelatedPosts([]);
        } finally {
          setRelatedPostsLoading(false);
        }
      }
      fetchRelatedPosts();
    }
  }, [blogPost]);

  if (blogPostLoading) {
    return (
      <>
        <div className="space-y-8">
          <div className="flex items-center gap-4 text-neutral-600 text-sm animate-pulse">
            <div className="w-20 h-2 bg-neutral-200 rounded-ms"></div>
            <div className="flex-1 space-y-1">
              <div className="h-4 bg-neutral-200 rounded-ms w-3/4"></div>
              <div className="h-4 bg-neutral-200 rounded-ms w-full"></div>
              <div className="h-4 bg-neutral-200 rounded-ms w-1/2"></div>
            </div>
          </div>
          <div className="h-96 bg-neutral-200 rounded-lg animate-pulse"></div>
          <div className="prose prose-neutral max-w-none text-base font-normal leading-relaxed text-neutral-800 animate-pulse">
            <div className="space-y-4">
              <div className="h-4 bg-neutral-200 rounded-ms w-full"></div>
              <div className="h-4 bg-neutral-200 rounded-ms w-3/4"></div>
              <div className="h-4 bg-neutral-200 rounded-ms w-full"></div>
              <div className="h-4 bg-neutral-200 rounded-ms w-1/2"></div>
              <div className="h-4 bg-neutral-200 rounded-ms w-full"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!blogPost) {
    return notFound();
  }

  return (
    <>
      <nav className="mb-6 text-sm text-neutral-600">
        <a href="/" className="hover:text-primary ms-2 me-2">خانه</a>
        <span className="mx-2">/</span>
        <a href="/blog" className="hover:text-primary ms-2 me-2">وبلاگ</a>
        <span className="mx-2">/</span>
        <span className="text-neutral-800">{blogPost.title}</span>
      </nav>

      <div className="mb-8">
        <span className="inline-flex items-center bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full mb-4">
          {blogPost.category}
        </span>
        <h1 className="text-4xl font-bold leading-tight text-neutral-900 mb-4">
          {blogPost.title}
        </h1>
        <div className="flex items-center gap-4 text-neutral-600 text-sm">
          <img 
            src={blogPost.authorAvatar} 
            alt={blogPost.authorName} 
            className="rounded-full w-10 h-10"
          />
          <div>
            <p className="font-medium">{blogPost.authorName}</p>
            <p className="text-xs">
              {toPersianDate(blogPost.publishDate)} • {blogPost.readingTime} دقیقه زمان مطالعه
            </p>
          </div>
        </div>
      </div>

      {blogPost.coverImage && (
        <div className="mb-8">
          <img 
            src={blogPost.coverImage} 
            alt={blogPost.coverAlt || 'تصویر مقاله'} 
            className="w-full max-h-96 object-cover rounded-lg"
          />
        </div>
      )}

      <div className="prose prose-neutral max-w-none text-base font-normal leading-relaxed text-neutral-800 mb-12">
        <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
      </div>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-neutral-900 mb-6">مقالات مرتبط</h2>
        {relatedPostsLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1,2,3].map((_, index) => (
              <div key={index} className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden transition-all hover:shadow-md animate-pulse">
                <div className="h-48 bg-neutral-200"></div>
                <div className="p-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-neutral-200 rounded-ms w-full mb-2"></div>
                    <div className="h-4 bg-neutral-200 rounded-ms w-3/4"></div>
                    <div className="h-4 bg-neutral-200 rounded-ms w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      <div className="flex items-center gap-4 text-neutral-600">
        <span className="font-medium">اشتراک‌گذاری:</span>
        <div className="flex gap-3">
          <a 
            href={`https://telegram.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blogPost.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-transparent text-neutral-600 font-medium text-base px-4 py-2.5 rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            تلگرام
          </a>
          <a 
            href={`https://wa.me/?text=${encodeURIComponent(blogPost.title + ' ' + window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-transparent text-neutral-600 font-medium text-base px-4 py-2.5 rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            واتساپ
          </a>
          <button 
            onClick={async () => {
              await navigator.clipboard.writeText(window.location.href);
            }}
            className="inline-flex items-center justify-center gap-2 bg-transparent text-neutral-600 font-medium text-base px-4 py-2.5 rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            لینک کپی
          </button>
        </div>
      </div>
    </>
  );
}

function BlogCard({ post }: { post: any }) {
  return (
    <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
      {post.coverImage && (
        <img 
          src={post.coverImage} 
          alt={post.coverAlt || 'تصویر مقاله'} 
          className="w-full h-48 object-cover"
        )
      )}
      <div className="p-4">
        <span className="inline-flex items-center bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full mb-2">
          {post.category}
        </span>
        <h3 className="text-xl font-bold text-neutral-900 mb-2 line-clamp-2">{post.title}</h3>
        <div className="flex items-center gap-3 text-neutral-600 text-sm">
          <img 
            src={post.authorAvatar} 
            alt={post.authorName} 
            className="rounded-full w-8 h-8"
          />
          <div>
            <p className="font-medium">{post.authorName}</p>
            <p className="text-xs">{toPersianDate(post.publishDate)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
