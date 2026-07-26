import type { PublicPet } from '@/lib/types';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

export default function PublicPassportView({ pet }: { pet: PublicPet }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div className="p-6">
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <PassportPetHeader pet={pet} variants={itemVariants} />
            <ContactOwnerButton variants={itemVariants} />
            <MedicalInfoSection pet={pet} variants={itemVariants} />
            {pet.last_seen_location && (
              <LastSeenMap location={pet.last_seen_location} variants={itemVariants} />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function PassportPetHeader({ pet }: { pet: PublicPet }, { variants }: { variants: Variants }) {
  return (
    <motion.div
      key="header"
      variants={variants}
      className="flex items-center gap-4 mb-6"
    >
      <img
        src={pet.photo || '/placeholder-pet.jpg'}
        alt={pet.name}
        className="w-32 h-32 object-cover rounded-full"
        aria-hidden="true"
      />
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-neutral-900">{pet.name}</h2>
        <div className="flex gap-2 text-sm text-neutral-600">
          <span>{pet.breed}</span>
          <span className="hidden md:inline">•</span>
          <span>{pet.gender === 'male' ? 'نار' : 'ماده'}</span>
          <span className="hidden md:inline">•</span>
          <span>{pet.age} سال</span>
        </div>
      </div>
    </motion.div>
  );
}

function ContactOwnerButton({ variants }: { variants: Variants }) {
  return (
    <motion.button
      key="contact"
      variants={variants}
      className="inline-flex items-center justify-center gap-2 bg-white text-primary border border-primary font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-neutral-50 transition-all focus:outline-none focus:ring-2 focus:ring-primary w-full"
    >
      تماس با مالک
    </motion.button>
  );
}

function MedicalInfoSection({ pet }: { pet: PublicPet }, { variants }: { variants: Variants }) {
  return (
    <motion.div
      key="medical"
      variants={variants}
      className="space-y-4"
    >
      <h3 className="text-xl font-semibold text-neutral-900">اطلاعات پزشکی</h3>
      <div className="space-y-2">
        <div className="flex items-start">
          <span className="flex-shrink-0 text-neutral-400">آلرژی:</span>
          <span className="ml-3">{pet.allergies || 'هیچ'}</span>
        </div>
        <div className="flex items-start">
          <span className="flex-shrink-0 text-neutral-400">اطلاعات حیاتی:</span>
          <span className="ml-3">{pet.criticalMedicalInfo || 'هیچ'}</span>
        </div>
      </div>
    </motion.div>
  );
}

function LastSeenMap({ location }: { location: { latitude: number; longitude: number } }, { variants }: { variants: Variants }) {
  return (
    <motion.div
      key="map"
      variants={variants}
      className="space-y-4"
    >
      <h3 className="text-xl font-semibold text-neutral-900">مکان آخر دیده شد</h3>
      <div className="aspect-w-16 aspect-h-9 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400">
        نقشه در دسترس نیست
      </div>
    </motion.div>
  );
}
