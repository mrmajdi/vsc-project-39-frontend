import { motion } from 'framer-motion';
import React from 'react';

type SpeciesSelectorProps = {
  value: string | null;
  onChange: (species: string) => void;
};

const speciesOptions = [
  { label: 'سگ', emoji: '🐶', value: 'dog' },
  { label: 'گربه', emoji: '🐱', value: 'cat' },
  { label: 'پرنده', emoji: '🐦', value: 'bird' },
  { label: 'ماهی', emoji: '🐠', value: 'fish' },
  { label: 'خرگوش', emoji: '🐰', value: 'rabbit' },
  { label: 'همستر', emoji: '🐹', value: 'hamster' },
];

const SpeciesSelector: React.FC<SpeciesSelectorProps> = ({ value, onChange }) => {
  return (
    <motion.div className="grid grid-cols-2 sm:grid-cols-3 gap-4" dir="rtl">
      {speciesOptions.map((option) => {
        const selected = value === option.value;
        return (
          <motion.button
            key={option.value}
            layoutId={option.value}
            onClick={() => onChange(option.value)}
            aria-label={`انتخاب ${option.label}`}
            aria-pressed={selected}
            className={`
              flex flex-col items-center gap-2 p-6 rounded-lg border-2 transition-all cursor-pointer
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
              ${selected
                ? 'border-primary bg-primary/5 scale-105 shadow-sm'
                : 'border-neutral-200 hover:border-primary hover:scale-105'}
            `}
          >
            <span className="text-4xl">{option.emoji}</span>
            <span className="text-sm font-medium text-neutral-800">{option.label}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default SpeciesSelector;
