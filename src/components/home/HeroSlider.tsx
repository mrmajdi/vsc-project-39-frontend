import { FC, useEffect, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Banner } from './types'; // Assuming we have a types file; if not, we can define inline.

interface HeroSliderProps {
  banners: Banner[];
  loading?: boolean;
}

const HeroSlider: FC<HeroSliderProps> = ({ banners, loading = false }) => {
  if (loading) {
    return (
      <div className="relative w-full h-[300px] md:h-[400px] rounded-lg bg-neutral-200 animate-pulse" />
    );
  }

  if (!banners.length) {
    return null;
  }

  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const next = () => {
    setIndex((prev) => (prev + 1) % banners.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Auto-play
  useEffect(() => {
    if (isHovered || banners.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [index, isHovered, banners.length]);

  // Pause on hover
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const slideVariants = {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { x: -100, opacity: 0, transition: { duration: 0.5, ease: 'easeIn' } },
  };

  return (
    <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-sm">
      <AnimatePresence mode="wait">
        {banners.map((banner, i) => (
          <motion.div
            key={banner.id}
            initial={i !== index ? slideVariants.initial : undefined}
            animate={i === index ? slideVariants.animate : undefined}
            exit={i !== index ? slideVariants.exit : undefined}
            className="absolute inset-0"
          >
            <a
              href={banner.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full"
            >
              <img
                src={banner.image_url}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
            </a>
            {/* Optional title overlay */}
            <div className="absolute bottom-4 start-4 bg-black/50 text-white px-3 py-1 rounded-md text-sm">
              {banner.title}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        aria-label="اسلاید قبلی"
        className="
          absolute top-1/2 -translate-y-1/2 start-2 z-10
          inline-flex items-center justify-center p-2 bg-white/20 rounded-lg
          hover:bg-white/30 transition-colors focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-primary
        "
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="اسلاید بعدی"
        className="
          absolute top-1/2 -translate-y-1/2 end-2 z-10
          inline-flex items-center justify-center p-2 bg-white/20 rounded-lg
          hover:bg-white/30 transition-colors focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-primary
        "
      >
        ›
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 start-1/2 -translate-x-1/2 flex space-x-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`اسلاید ${i + 1}`}
            className={
              'w-2 h-2 bg-white/50 rounded-full transition-colors' +
              (i === index ? ' bg-white' : '')
            }
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-primary
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
