'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

interface Deal {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  endsAt: string; // ISO string
}

function FlipNumber({ value }: { value: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={value}
        style={{ display: 'inline-block', overflow: 'hidden' }}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 10, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {value}
      </motion.div>
    </AnimatePresence>
  );
}

function formatTime(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return { hours, minutes, seconds };
}

export default function DealsSection() {
  const [deals, setDeals] = useState<Deal[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDeals() {
      try {
        setLoading(true);
        const res = await api.get<Deal[]>('/special-deals');
        setDeals(res.data);
      } catch (err) {
        console.error('Failed to fetch deals', err);
        setDeals([]);
      } finally {
        setLoading(false);
      }
    }
    fetchDeals();
  }, []);

  if (loading) return null;
  if (!deals || deals.length === 0) return null;

  return (
    <section dir="rtl" className="mb-8">
      <div className="overflow-hidden">
        <div
          className="flex gap-4 overflow-x-auto pb-4 scroll-snap-x snap-x space-x-4"
        >
          {deals.map((deal) => {
            const endsAt = new Date(deal.endsAt).getTime();
            const [timeLeft, setTimeLeft] = useState(() => endsAt - Date.now());

            useEffect(() => {
              if (timeLeft <= 0) {
                setTimeLeft(0);
                return;
              }
              const timer = setInterval(() => {
                setTimeLeft((prev) => {
                  const newPrev = prev - 1000;
                  return newPrev <= 0 ? 0 : newPrev;
                });
              }, 1000);
              return () => clearInterval(timer);
            }, [timeLeft]);

            const { hours, minutes, seconds } = formatTime(timeLeft);

            return (
              <div
                key={deal.id}
                className="
                  min-w-[250px]
                  bg-white
                  rounded-lg
                  border
                  border-neutral-200
                  shadow-sm
                  overflow-hidden
                  flex
                  flex-col
                  snap-start
                "
              >
                <img
                  src={deal.image}
                  alt={deal.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                    {deal.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="line-through text-neutral-400 text-sm">
                      {deal.originalPrice.toLocaleString()} تومان
                    </span>
                    <span className="text-primary font-bold text-lg">
                      {deal.discountedPrice.toLocaleString()} تومان
                    </span>
                  </div>
                  <motion.span
                    whileTap={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, type: 'spring' }}
                    className="inline-flex items-center bg-danger text-white text-xs font-bold px-2 py-1 rounded-sm mb-3"
                  >
                    -{deal.discountPercent}% تخفیف
                  </motion.span>
                  <div className="flex items-center gap-2 text-sm font-medium text-neutral-600">
                    <span>زمان باقی‌مانده:</span>
                    <span className="flex items-center gap-1">
                      <FlipNumber value={hours} />
                      <span>:</span>
                      <FlipNumber value={minutes} />
                      <span>:</span>
                      <FlipNumber value={seconds} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
