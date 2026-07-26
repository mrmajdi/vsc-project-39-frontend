import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const { isAuthenticated, isNewUser } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  if (!isAuthenticated || !isNewUser) {
    router.push('/login');
    return null;
  }

  const [currentStep, setCurrentStep] = useState(1);
  const [species, setSpecies] = useState<'dog' | 'cat' | 'bird' | 'fish' | 'rabbit' | 'hamster' | null>(null);
  const [petName, setPetName] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [petAge, setPetAge] = useState<'زیر ۱ سال' | '۱-۳ سال' | '۳-۵ سال' | 'بالای ۵ سال' | null>(null);
  const [petPhoto, setPetPhoto] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');
  const [breedError, setBreedError] = useState<string>('');
  const [ageError, setAgeError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const speciesOptions = [
    { label: 'سگ', value: 'dog', emoji: '🐶' },
    { label: 'گربه', value: 'cat', emoji: '🐱' },
    { label: 'پرنده', value: 'bird', emoji: '🐦' },
    { label: 'ماهی', value: 'fish', emoji: '🐟' },
    { label: 'خرگوش', value: 'rabbit', emoji: '🐰' },
    { label: 'همستر', value: 'hamster', emoji: '🐹' }
  ];

  const ageOptions = [
    { label: 'زیر ۱ سال', value: 'زیر ۱ سال' },
    { label: '۱-۳ سال', value: '۱-۳ سال' },
    { label: '۳-۵ سال', value: '۳-۵ سال' },
    { label: 'بالای ۵ سال', value: 'بالای ۵ سال' }
  ];

  const commonBreeds = [
    'لابرادور', 'گولدن رтриیور', 'شیرازی', 'سایامی', 'پاروت', 'کنر', 'گلدفیش', 'طوطی', 'انگورا', 'خروس', 'همستر روسی'
  ];

  const handleNext = () => {
    setNameError(!petName ? 'نام پت الزامی است' : '');
    setBreedError(!petBreed ? 'نژاد الزامی است' : '');
    setAgeError(!petAge ? 'سن الزامی است' : '');
    setPhotoError(!petPhoto ? 'عکس پت الزامی است' : '');

    if (petName && petBreed && petAge && petPhoto) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const formData = new FormData();
      formData.append('name', petName);
      formData.append('breed', petBreed);
      formData.append('age', petAge);
      formData.append('photo', petPhoto!);

      const response = await fetch('/api/user/pets', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'خطا در ثبت اطلاعات پت');
      }

      router.push(`/products?species=${species}`);
    } catch (err: any) {
      setSubmitError(err.message || 'خطای نامشخص');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[480px] mx-auto">
        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Progress Bar */}
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map(step => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    step === currentStep
                      ? 'bg-primary'
                      : step < currentStep
                      ? 'bg-primary/20'
                      : 'bg-neutral-200'
                  }`}
                />
              ))}
            </div>

            {/* Steps */}
            <AnimatePresence>
              <motion.div
                key={currentStep}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {currentStep === 1 && (
                  <>
                    <div className="bg-neutral-100 rounded-xl h-48 flex items-center justify-center">
                      <div className="text-neutral-400 text-3xl">آیکون خوش‌آمدگویی</div>
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900">به پت‌شاپ خوش آمدی!</h2>
                    <p className="text-sm text-neutral-600">
                      بیا حیوان خانگی‌ت رو معرفی کنیم
                    </p>
                    <button
                      className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setCurrentStep(2)}
                    >
                      شروع کنیم
                    </button>
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <h2 className="text-2xl font-bold text-neutral-900">
                      حیوان خانگی‌ت رو انتخاب کن
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      {speciesOptions.map(option => (
                        <label
                          key={option.value}
                          className={`relative cursor-select flex flex-col items-center gap-2 p-6 rounded-lg border-2 border-neutral-200 hover:border-primary hover:scale-105 transition-all ${
                            species === option.value
                              ? 'border-primary bg-primary/5'
                              : ''
                          }`}
                        >
                          <input
                            type="radio"
                            name="species"
                            value={option.value}
                            checked={species === option.value}
                            onChange={() => setSpecies(option.value)}
                            className="absolute inset-0 h-0 w-0 opacity-0"
                            aria-hidden="true"
                          />
                          <div className="text-4xl">{option.emoji}</div>
                          <span className="text-sm font-medium text-neutral-800">{option.label}</span>
                        </label>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <button
                        className="inline-flex items-center justify-center gap-2 bg-transparent text-neutral-600 font-medium text-base px-4 py-2.5 rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
                        onClick={handleBack}
                      >
                        قبلی
                      </button>
                      <button
                        className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleNext}
                        disabled={!species}
                      >
                        بعد
                      </button>
                    </div>
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    <h2 className="text-2xl font-bold text-neutral-900">اطلاعات پت</h2>
                    <form className="space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-neutral-800">نام پت</label>
                        <input
                          type="text"
                          value={petName}
                          onChange={e => setPetName(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="نام پت را وارد کنید"
                        />
                        {nameError && <span className="text-xs text-danger">{nameError}</span>}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-neutral-800">نژاد</label>
                        <div className="relative">
                          <input
                            type="text"
                            list="breed-list"
                            value={petBreed}
                            onChange={e => setPetBreed(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            placeholder="نژاد را وارد کنید"
                          />
                          <datalist id="breed-list">
                            {commonBreeds.map(breed => (
                              <option key={breed} value={breed} />
                            ))}
                          </datalist>
                        </div>
                        {breedError && <span className="text-xs text-danger">{breedError}</span>}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-neutral-800">سن</label>
                        <select
                          value={petAge}
                          onChange={e => setPetAge(e.target.value as any)}
                          className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        >
                          <option value="">سن را انتخاب کنید</option>
                          {ageOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            )
                          ))}
                        </select>
                        {ageError && <span className="text-xs text-danger">{ageError}</span>}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-neutral-800">عکس پت</label>
                        <div className="relative">
                          <label
                            htmlFor="pet-photo"
                            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-300 rounded-lg hover:border-primary transition-all cursor-pointer"
                          >
                            <input
                              id="pet-photo"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={e => {
                                const file = e.target.files?.[0] ?? null;
                                setPetPhoto(file);
                                setPhotoError(!file ? 'عکس پت الزامی است' : '');
                              }}
                            />
                            <div className="text-neutral-500">عکس پت رو اینجا بذار یا کلیک کن</div>
                            {petPhoto && (
                              <div className="mt-2 text-sm text-neutral-600">
                                {petPhoto.name}
                              </div>
                            )}
                          </label>
                        </div>
                        {photoError && <span className="text-xs text-danger">{photoError}</span>}
                      </div>
                      {submitError && (
                        <div className="text-xs text-danger text-center mt-4">
                          {submitError}
                        </div>
                      )}
                      <div className="flex justify-between">
                        <button
                          className="inline-flex items-center justify-center gap-2 bg-transparent text-neutral-600 font-medium text-base px-4 py-2.5 rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
                          onClick={handleBack}
                        >
                          قبلی
                        </button>
                        <button
                          type="submit"
                          className={`inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed ${
                            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'در حال ثبت...' : 'بزن بریم'}
                        </button>
                      </div>
                    </form>
                  </>
                )}
                {currentStep === 4 && (
                  <>
                    <div className="relative">
                      {/* Confetti Animation */}
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(20)].map((_, i) => (
                          <motion.div
                            key={i}
                            style={{
                              position: 'absolute',
                              top: `${Math.random() * 100}%`,
                              left: `${Math.random() * 100}%`,
                              width: `${Math.random() * 10 + 5}px`,
                              height: `${Math.random() * 10 + 5}px`,
                              backgroundColor:
                                ['#16A34A', '#0EA5E9', '#F59E0B', '#22C55E', '#EAB308'][Math.floor(Math.random() * 5)],
                              borderRadius: '50%',
                              opacity: 0,
                            }}
                            animate={{
                              opacity: [0, 0.8, 0],
                              scale: [0, 1.5, 2],
                              rotate: [0, 0, 360]
                            }}
                            transition={{
                              duration: 1.5,
                              delay: i * 0.05,
                              ease: 'easeOut'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900 text-center">
                      آماده‌ای! {petName && `، ${petName}`}
                    </h2>
                    <p className="text-sm text-neutral-600 text-center">
                      محصولات مناسب {petName ? petName : 'حیوان خانگی‌ت'} رو ببین
                    </p>
                    <button
                      className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary w-full"
                      onClick={() => router.push(`/products?species=${species}`)}
                    >
                      بزن بریم
                    </button>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
