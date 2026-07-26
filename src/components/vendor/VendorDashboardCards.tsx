import { motion } from 'framer-motion';
import React from 'react';

interface VendorDashboardCardsProps {
  cards: Array<{
    title: string;
    value: string;
    icon: React.ReactNode;
    trend?: string;
  }>;
}

export const VendorDashboardCards = ({ cards }: VendorDashboardCardsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.25, 0.1, 0.25, 1.0], 
        staggerChildren: 0.1 
      }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {cards.map((card, index) => (
        <motion.div
          key={index}
          className="bg-white rounded-lg border border-neutral-200 shadow-sm p-4 hover:shadow-md transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-full mb-3" aria-hidden="true">
              {card.icon}
            </div>
          </div>
          <h3 className="text-sm text-neutral-600 mb-2">{card.title}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-neutral-900">{card.value}</span>
            {card.trend && (
              <span className={`text-xs font-medium ${card.trend.startsWith('-') ? 'text-danger' : 'text-success'}`}>
                {card.trend} {card.trend.startsWith('-') ? '↓' : '↑'}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
