import { motion } from 'framer-motion';
import { usePetStore } from '@/store/petContext';
import { useState } from 'react';

const SpeciesSelector: React.FC = () => {
  const { activePet } = usePetStore();
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);

  const speciesData = [
    {
      id: 'dog',
      label: 'سگ',
      emoji: '🐶',
      subCategories: ['سگ گربه‌ای', 'سگ رومی', 'سگ لابرادور', 'سگ پودل', 'سگ هاسکی'],
    },
    {
      id: 'cat',
      label: 'گربه',
      emoji: '🐱',
      subCategories: ['گربه ایرانی', 'گربه شیری', 'گربه פרסی', 'گربه siamese', 'گربه ماین کون'],
    },
    {
      id: 'bird',
      label: 'پرنده',
      emoji: '🐦',
      subCategories: ['طوطی', 'канарейка', 'پاپوگا', 'فنچ', 'کاکتو'],
    },
    {
      id: 'fish',
      label: 'ماهی',
      emoji: '🐟',
      subCategories: ['ماهی طلایی', 'ماهی کوی', 'ماهی انجل', 'ماهی بتا', 'ماهی دیسکس'],
    },
    {
      id: 'rabbit',
      label: 'خرگوش',
      emoji: '🐰',
      subCategories: ['خرگوش 귀 짧은', 'خرگوش لوپ', 'خرگوش انگورا', 'خرگوش رکس', 'خرگوش فلامینگو'],
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
      {speciesData.map((species) => {
        const isActivePetMatch = activePet && activePet.species === species.id;
        return (
          <div key={species.id} className="relative">
            <motion.button
              whileHover={{ scale: 1.15 }}
              className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all
                ${isActivePetMatch ? 'bg-transparent' : 'bg-neutral-100 hover:bg-neutral-200'}
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
              `}
              onClick={() =>
                setSelectedSpecies(selectedSpecies === species.id ? null : species.id)
              }
              aria-label={`انتخاب ${species.label}`}
            >
              {isActivePetMatch ? (
                <img
                  src={activePet!.avatarUrl}
                  alt={activePet!.name}
                  className="w-full h-full object-cover ring-2 ring-primary rounded-full"
                />
              ) : (
                <span className="text-2xl md:text-3xl">{species.emoji}</span>
              )}
            </motion.button>
            {selectedSpecies === species.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg border border-neutral-200 shadow-md z-20"
              >
                <div className="space-y-2 p-3 text-right">
                  {species.subCategories.map((subCat, index) => (
                    <div
                      key={index}
                      className="text-sm text-neutral-600 hover:text-neutral-900 cursor-pointer px-2 py-1 rounded hover:bg-neutral-50"
                    >
                      {subCat}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SpeciesSelector;
