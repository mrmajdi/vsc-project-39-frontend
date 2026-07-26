import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  photoUrl?: string;
  age?: number;
  gender: 'male' | 'female';
}

/**
 * انترفیس فروشگاه zustand برای مدیریت حیوان فعال
 */
export interface PetContextStore {
  pets: Pet[];
  activePetId: string | null;
  /** Getter محاسبه‌شده که شیء حیوان فعال را برمی‌گرداند یا null */
  activePet: () => Pet | null;
  setActivePet: (id: string) => void;
  addPet: (pet: Pet) => void;
  updatePet: (id: string, partial: Partial<Pet>) => void;
  removePet: (id: string) => void;
  clearActivePet: () => void;
}

/**
 * zustand store با persist در localStorage تحت کلید 'petshop-pet-context'
 */
const usePetStore = create<PetContextStore>()(
  persist(
    (set, get) => ({
      pets: [],
      activePetId: null,
      setActivePet: (id) => set({ activePetId: id }),
      addPet: (pet) =>
        set((state) => {
          const newPets = [...state.pets, pet];
          // اگر حیوانی فعال انتخاب نشده باشد، این حیوان جدید را فعال کن
          const newActivePetId =
            state.activePetId === null ? pet.id : state.activePetId;
          return { pets: newPets, activePetId: newActivePetId };
        }),
      updatePet: (id, partial) =>
        set((state) => ({
          pets: state.pets.map((pet) =>
            pet.id === id ? { ...pet, ...partial } : pet
          ),
        })),
      removePet: (id) =>
        set((state) => {
          const newPets = state.pets.filter((pet) => pet.id !== id);
          const newActivePetId =
            state.activePetId === id ? null : state.activePetId;
          return { pets: newPets, activePetId: newActivePetId };
        }),
      clearActivePet: () => set({ activePetId: null }),
      /** محاسبه حیوان فعال بر اساس activePetId */
      activePet: () => {
        const { pets, activePetId } = get();
        return activePetId
          ? pets.find((pet) => pet.id === activePetId) ?? null
          : null;
      },
    }),
    {
      name: 'petshop-pet-context',
    }
  )
);

export default usePetStore;
