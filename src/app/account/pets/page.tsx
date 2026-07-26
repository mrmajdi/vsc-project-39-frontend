import { useState, useEffect } from 'react';
import Link from 'next/navigation';
import { motion } from 'framer-motion';
import axios from '@/lib/api';

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  photo: string;
}

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[] | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; petId: string | null }>({ isOpen: false, petId: null });

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get('/api/user/pets');
        setPets(response.data);
      } catch (error) {
        console.error('Failed to fetch pets:', error);
        setPets([]);
      }
    };
    fetchPets();
  }, []);

  const handleDelete = (id: string) => {
    setDeleteModal({ isOpen: true, petId: id });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.petId) return;
    try {
      await axios.delete(`/api/user/pets/${deleteModal.petId}`);
      setPets(prev => prev?.filter(pet => pet.id !== deleteModal.petId) || []);
      setDeleteModal({ isOpen: false, petId: null });
    } catch (error) {
      console.error('Failed to delete pet:', error);
      setDeleteModal({ isOpen: false, petId: null });
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false, petId: null });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col items-start gap-6">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-3xl font-bold text-neutral-900">حیوانات خانگی من</h1>
          <Link href="/account/pets/new">
            <button className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              افزودن حیوان جدید
            </button>
          </Link>
        </div>

        {pets === null ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="bg-white rounded-lg border border-neutral-200 shadow-sm p-4">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-full bg-neutral-200"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                    <div className="h-2 bg-neutral-200 rounded w-1/2"></div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-neutral-200 rounded w-1/3"></div>
                      <div className="h-2 bg-neutral-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <button className="inline-flex items-center justify-center gap-2 bg-white text-primary border border-primary font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-neutral-50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" disabled>
                    مشاهده پاسپورت
                  </button>
                  <button className="inline-flex items-center justify-center gap-2 bg-transparent text-neutral-600 font-medium text-base px-4 py-2.5 rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400" disabled>
                    ویرایش
                  </button>
                  <button className="inline-flex items-center justify-center gap-2 bg-danger text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger" disabled>
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : pets.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2c2.21 0 4 1.79 4 4h2c0-3.31-2.69-6-6-6-1.01 0-1.99.37-2.76 1l-.84.84A7.96 7.96 0 004 12c0 4.42 3.58 8 8 8v2c-3.31 0-6-2.69-6-6 0-1.01.37-1.99 1-2.76l.84-.84A7.96 7.96 0 0012 4z"></path>
              <line x1="9" y1="9" x2="9" y2="13"></line>
              <line x1="15" y1="9" x2="15" y2="13"></line>
              <path d="M9 17c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2z"></path>
            </svg>
            <p className="text-center text-neutral-600">هنوز حیوان خانگی ثبت نکرده‌اید</p>
            <Link href="/account/pets/new">
              <button className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                افزودن حیوان جدید
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pets.map((pet) => (
              <motion.div
                key={pet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: pets.indexOf(pet) * 0.1 }}
                className="bg-white rounded-lg border border-neutral-200 shadow-sm p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={pet.photo}
                    alt={`${pet.name} عکس`}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold text-neutral-900">{pet.name}</h3>
                    <span className="inline-flex items-center bg-secondary/10 text-secondary text-xs font-medium px-2.5 py-1 rounded-full">
                      {pet.species}
                    </span>
                    <p className="text-sm text-neutral-600">{pet.breed}</p>
                    <p className="text-xs text-neutral-400">
                      سن: {pet.age} سال • وزن: {pet.weight} kg
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Link href={`/account/pets/${pet.id}/passport`}>
                    <button className="inline-flex items-center justify-center gap-2 bg-white text-primary border border-primary font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-neutral-50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                      مشاهده پاسپورت
                    </button>
                  </Link>
                  <Link href={`/account/pets/${pet.id}/edit`}>
                    <button className="inline-flex items-center justify-center gap-2 bg-transparent text-neutral-600 font-medium text-base px-4 py-2.5 rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400">
                      ویرایش
                    </button>
                  </Link>
                  <button
                    className="inline-flex items-center justify-center gap-2 bg-danger text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger"
                    onClick={() => handleDelete(pet.id)}
                  >
                    حذف
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">تایید حذف</h3>
            <p className="text-neutral-600 mb-6">آیا از حذف این حیوان خانگی مطمئن هستید؟</p>
            <div className="flex flex-col sm:flex-row sm:justify-end gap-4">
              <button
                onClick={handleCancelDelete}
                className="inline-flex items-center justify-center gap-2 bg-transparent text-neutral-600 font-medium text-base px-4 py-2.5 rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
              >
                انصراف
              </button>
              <button
                onClick={handleConfirmDelete}
                className="inline-flex items-center justify-center gap-2 bg-danger text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger"
              >
                بله، حذف شود
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
