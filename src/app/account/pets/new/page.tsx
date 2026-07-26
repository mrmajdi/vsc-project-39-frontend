import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import Confetti from 'react-confetti';
import PetFormSteps from '@/components/pet/PetFormSteps';

const stepLabels = [
  'انتخاب نوع',
  'اطلاعات پایه',
  'آپلود عکس',
  'اطلاعات پزشکی',
  'تایید و ذخیره',
];

export default function NewPetPage() {
  const [formData, setFormData] = useState({
    species: '',
    name: '',
    gender: '',
    breed: '',
    weight: '',
    birthDate: '',
    photo: '',
    vaccines: [],
    allergies: [],
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();

  const validateStep = (step: number, data: typeof formData): boolean => {
    switch (step) {
      case 0: return data.species.trim() !== '';
      case 1: return data.name.trim() !== '' && data.gender.trim() !== '';
      case 2: return data.photo.trim() !== '';
      case 3: return true;
      case 4: return true;
      default: return false;
    }
  };

  const goToNextStep = () => {
    if (validateStep(currentStep, formData)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goToPrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/user/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('خطا در ایجاد حیوان خانگی');
      }

      const data = await res.json();
      const petId = data.id;

      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        router.push(`/account/pets/${petId}/passport`);
      }, 3000);
    } catch (error) {
      toast.error(error.message || 'خطای نامشخص');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex items-center relative">
          {stepLabels.map((label, index) => (
            <>
              <div key={index} className="flex flex-col items-center z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium 
                  ${index < currentStep ? 'bg-success' : 
                    index === currentStep ? 'bg-primary' : 'bg-neutral-200'}
                `}>
                  {index + 1}
                </div>
                <span className="mt-1 text-xs text-neutral-600">{label}</span>
              </div>
              {index < stepLabels.length - 1 && (
                <div className="flex-1 h-0.5 bg-neutral-200"></div>
              )}
            </>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentStep < 4 && (
          <motion.div
            key={currentStep}
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            exit={{ x: -20 }}
          >
            <PetFormSteps
              step={currentStep}
              formData={formData}
              onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
            />
          </motion.div>
        )}
        {currentStep === 4 && (
          <motion.div
            key={currentStep}
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            exit={{ x: -20 }}
          >
            <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">خلاصه اطلاعات حیوان خانگی</h3>
                <div className="space-y-4">
                  <div className="text-sm">
                    <span className="font-medium text-neutral-600">نوع:</span> <span className="ml-2">{formData.species}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-neutral-600">نام:</span> <span className="ml-2">{formData.name}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-neutral-600">جنسیت:</span> <span className="ml-2">{formData.gender}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-neutral-600">نژاد:</span> <span className="ml-2">{formData.breed}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-neutral-600">وزن:</span> <span className="ml-2">{formData.weight} kg</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-neutral-600">تاریخ تولد:</span> <span className="ml-2">{formData.birthDate}</span>
                  </div>
                  {formData.photo && (
                    <div className="mt-4">
                      <span className="font-medium text-neutral-600 block mb-1">عکس:</span>
                      <img
                        src={formData.photo}
                        alt="عکس حیوان خانگی"
                        className="w-32 h-32 object-cover rounded-md"
                      />
                    </div>
                  )}
                  {formData.vaccines.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium text-neutral-600 block mb-1> واکسن‌ها:</span>
                      <span className="ml-2">{formData.vaccines.join(', ')}</span>
                    </div>
                  )}
                  {formData.allergies.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium text-neutral-600 block mb-1> آلرژی‌ها:</span>
                      <span className="ml-2">{formData.allergies.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mt-6">
        {currentStep > 0 && (
          <button
            onClick={goToPrevStep}
            className="inline-flex items-center justify-center gap-2 bg-transparent text-neutral-600 font-medium text-base px-4 py-2.5 rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            مرحله قبل
          </button>
        )}
        {currentStep < 4 ? (
          <button
            onClick={goToNextStep}
            disabled={!validateStep(currentStep, formData)}
            className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            مرحله بعد
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {isSaving ? 'در حال ذخیره...' : 'ذخیره'}
            </button>
            {showConfetti && <Confetti />}
          </>
        )}
      </div>
    </main>
  );
}
