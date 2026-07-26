import { motion } from 'framer-motion';

type PetMatchBadgeProps = {
  petPhoto: string;
  petName: string;
  size?: 'sm' | 'md';
};

export default function PetMatchBadge({ petPhoto, petName, size = 'md' }: PetMatchBadgeProps) {
  const imgSize = size === 'sm' ? 'size-8' : 'size-10';
  const tooltipText = `این رو بخر برای ${petName}!`;

  return (
    <div className="relative group inline-block">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative"
      >
        <img
          src={petPhoto}
          alt={`${petName} عکس`}
          className={`rounded-full object-cover ${imgSize}` }
        />
        <div className="absolute bottom-0 end-0 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-success text-white rounded-full size-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4-4M11 7l2 2m2-2-2 2m2 2-2-2" />
          </svg>
        </div>
      </motion.div>

      <div
        className="absolute -top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:visible transition-opacity duration-200 bg-neutral-900 text-white text-xs rounded-md px-2 py-1 whitespace-nowrap"
        role="tooltip"
        aria-label={tooltipText}
      >
        {tooltipText}
      </div>
    </div>
  );
}
