'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePetStore } from '@/store/petContext';

export default function PetSwitcher() {
  const { pets, activePet, setActivePet } = usePetStore();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        buttonRef.current && !buttonRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const selectPet = (petId: string) => {
    setActivePet(petId);
    setIsOpen(false);
  };

  if (!pets || pets.length === 0) {
    return (
      <button
        ref={buttonRef}
        className="inline-flex items-center justify-center gap-2 w-10 h-10 rounded-full border-2 border-primary overflow-hidden focus:ring-2 focus:ring-primary"
        aria-label="انتخاب حیوان خانگی"
        onClick={toggleDropdown}
      >
        {/* Default paw icon */}
        <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0 2c-2.65 0-4.8 2.15-5 4.8-.2 2.65 2.15 4.8 5 4.8s5.2-2.15 5-4.8c-.2-2.65-2.35-4.8-5-4.8z"/>
        </svg>
      </button>
    );
  }

  const activePetObj = pets.find(p => p.id === activePet) || null;

  return (
    <>
      <button
        ref={buttonRef}
        className="inline-flex items-center justify-center gap-2 w-10 h-10 rounded-full border-2 border-primary overflow-hidden focus:ring-2 focus:ring-primary"
        aria-label="انتخاب حیوان خانگی"
        onClick={toggleDropdown}
      >
        {activePetObj?.photoUrl ? (
          <img
            src={activePetObj.photoUrl}
            alt={`${activePetObj.name} عکس`}
            className="w-full h-full object-cover"
          />
        ) : (
          <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0 2c-2.65 0-4.8 2.15-5 4.8-.2 2.65 2.15 4.8 5 4.8s5.2-2.15 5-4.8c-.2-2.65-2.35-4.8-5-4.8z"/>
          </svg>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            className="absolute start-0 mt-2 w-56 max-h-96 overflow-y-auto bg-white rounded-lg border border-neutral-200 shadow-lg p-2 z-50"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {pets.map(pet => (
              <div
                key={pet.id}
                onClick={() => selectPet(pet.id)}
                className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-md cursor-pointer"
              >
                <img
                  src={pet.photoUrl || '/default-pet.png'}
                  alt={`${pet.name} عکس`}
                  className="w-8 h-8 rounded-full border-2 border-primary overflow-hidden object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-neutral-900">{pet.name}</p>
                  <p className="text-xs text-neutral-600">{pet.species}</p>
                </div>
              </div>
            ))}
            {!pets || pets.length === 0 ? (
              <div className="flex flex-col items-center pt-4">
                <p className="text-sm text-neutral-600 text-center">پت خود را اضافه کنید</p>
                <Link
                  href="/account/pets/new"
                  className="mt-1 text-sm font-medium text-primary hover:underline"
                >
                  افزودن پت جدید
                </Link>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
