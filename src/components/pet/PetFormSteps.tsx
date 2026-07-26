import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import type { PetFormData } from '../../../lib/types';
import VaccinationTable from './VaccinationTable';

export const PetFormSteps = ({
  currentStep,
  data,
  updateData,
  errors,
}: {
  currentStep: number;
  data: PetFormData;
  updateData: (field: string, value: any) => void;
  errors: Record<string, string>;
}) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [allergyInput, setAllergyInput] = useState('');
  const [breedValue, setBreedValue] = useState(data.breed || '');
  const [showBreedDropdown, setShowBreedDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data.photo) {
      const url = URL.createObjectURL(data.photo);
      setPhotoUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPhotoUrl(null);
    }
  }, [data.photo]);

  const breedList: Record<string, string[]> = {
    dog: ['لابرادور ریکاوری', 'شلمberger', 'گولدن ریتریور', 'بولدگ انگلیسی', 'بیگل'],
    cat: ['سایامی', 'پرشی', 'ماین کون', 'بریتिश شورت‌هیر', 'اسکاتلندی فولد'],
    bird: ['قناری', 'بوم', 'طوطی', 'کاکتو', 'فنچ'],
    fish: ['طلایی', 'کوی', 'انجل فيش', 'دیسکس', 'گوپی'],
    rabbit: ['انگورا', 'کشیده گوش', 'لوپ', 'ریکس', 'دوتچ'],
    hamster: ['سوری', 'روбовسکی', 'کمپbell', 'چینی', 'روسی'],
    reptile: ['گربه مار', 'لاکرتو', 'کرم', 'گوجه', 'ایگوانا'],
    other: ['دیگه'],
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    updateData('photo', file);
  };

  const addAllergy = () => {
    const trimmed = allergyInput.trim();
    if (trimmed && !data.allergies?.includes(trimmed)) {
      updateData('allergies', [...(data.allergies || []), trimmed]);
      setAllergyInput('');
    }
  };

  const removeAllergy = (allergyToRemove: string) => {
    updateData(
      'allergies',
      (data.allergies || []).filter((allergy) => allergy !== allergyToRemove)
    );
  };

  const filteredBreeds = breedList[data.species as keyof typeof breedList] || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {currentStep === 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'سگ', value: 'dog' },
            { label: 'گربه', value: 'cat' },
            { label: 'پرنده', value: 'bird' },
            { label: 'ماهی', value: 'fish' },
            { label: 'خرگوش', value: 'rabbit' },
            { label: 'همستر', value: 'hamster' },
            { label: 'خزنده', value: 'reptile' },
            { label: 'دیگه', value: 'other' },
          ].map((species) => (
            <motion.div
              key={species.value}
              whileHover={{ scale: 1.1 }}
              onClick={() => updateData('species', species.value)}
              className={`inline-flex items-center justify-center w-24 h-24 rounded-2xl border border-neutral-200 bg-white text-neutral-800 font-medium text-sm transition-all hover:bg-neutral-50 ${
                data.species === species.value
                  ? 'ring-2 ring-primary bg-primary/5'
                  : ''
              }`}
            >
              {species.label}
            </motion.div>
          ))}
        </div>
      )}

      {currentStep === 1 && (
        <form className="space-y-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-800">نام</label>
            <input
              type="text"
              value={data.name || ''}
              onChange={(e) => updateData('name', e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="نام حیوان را وارد کنید"
            />
            <span className="text-xs text-danger">{errors.name || ''}</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-800">جنسیت</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-800">
                <input
                  type="radio"
                  name="gender"
                  value="نر"
                  checked={data.gender === 'نر'}
                  onChange={(e) => updateData('gender', e.target.value)}
                  className="h-4 w-4 text-primary border-neutral-200 rounded focus:ring-primary"
                />
                نر
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-800">
                <input
                  type="radio"
                  name="gender"
                  value="ماده"
                  checked={data.gender === 'ماده'}
                  onChange={(e) => updateData('gender', e.target.value)}
                  className="h-4 w-4 text-primary border-neutral-200 rounded focus:ring-primary"
                />
                ماده
              </label>
            </div>
            <span className="text-xs text-danger">{errors.gender || ''}</span>
          </div>

          <div className="relative">
            <label className="text-sm font-medium text-neutral-800">نژاد</label>
            <input
              type="text"
              value={breedValue}
              onChange={(e) => {
                setBreedValue(e.target.value);
                setShowBreedDropdown(true);
              }}
              onBlur={() => {
                setTimeout(() => setShowBreedDropdown(false), 200);
              }}
              className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="نژاد را وارد کنید"
            />
            {showBreedDropdown && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-md shadow-md z-10 max-h-60 overflow-y-auto">
                {filteredBreeds
                  .filter((breed) =>
                    breed.toLowerCase().includes(breedValue.toLowerCase())
                  )
                  .map((breed, index) => (
                    <div
                      key={index}
                      className={`px-3 py-2 text-sm cursor-default hover:bg-neutral-100 ${
                        breed === breedValue ? 'bg-primary/10' : ''
                      }`}
                      onClick={() => {
                        setBreedValue(breed);
                        updateData('breed', breed);
                        setShowBreedDropdown(false);
                      }}
                    >
                      {breed}
                    </div>
                  ))}
              </div>
            )}
            <span className="text-xs text-danger">{errors.breed || ''}</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-800">وزن (kg)</label>
            <div className="relative">
              <input
                type="number"
                value={data.weight !== null && data.weight !== undefined ? data.weight : ''}
                onChange={(e) => {
                  const value = e.target.value;
                  updateData(
                    'weight',
                    value === '' ? null : parseFloat(value)
                  );
                }}
                className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="وزن"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 text-neutral-600">
                kg
              </span>
            </div>
            <span className="text-xs text-danger">{errors.weight || ''}</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-800">تاریخ تولد</label>
            <input
              type="date"
              value={data.birthDate || ''}
              onChange={(e) => updateData('birthDate', e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            <span className="text-xs text-danger">{errors.birthDate || ''}</span>
          </div>
        </form>
      )}

      {currentStep === 2 && (
        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium text-neutral-800">عکس پالتو</label>
          <div className="relative">
            <div
              className="border-2 border-dashed border-neutral-200 rounded-lg p-8 text-center hover:border-primary transition-all cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDragLeave={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();
                const files = e.dataTransfer.files;
                if (files.length) {
                  handleFile(files[0]);
                }
              }}
            >
              {!photoUrl ? (
                <>
                  <p className="text-neutral-600">
                    کلیک کنید یا فایل را اینجا بکشید
                  </p>
                  <p className="text-xs text-neutral-400">
                    فرمت‌های مجاز: JPG, PNG, GIF
                  </>
                </>
              ) : (
                <img
                  src={photoUrl}
                  alt="پیش‌نمایش عکس"
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-2"
                />
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
          </div>
          <span className="text-xs text-danger">{errors.photo || ''}</span>
        </div>
      )}

      {currentStep === 3 && (
        <div className="grid gap-6">
          <div className="col-span-1">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">
              واکسن‌ها
            </h3>
            <VaccinationTable
              vaccinations={data.vaccinations || []}
              onUpdate={(field, value) => updateData(field, value)}
              errors={errors}
            />
          </div>
          <div className="col-span-1">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">
              آلرژی‌ها
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-800">
                  آلرژی
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={allergyInput}
                    onChange={(e) => setAllergyInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addAllergy();
                      }
                    }}
                    className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="نوع آلرژی را وارد کنید و Enter بزنید"
                  />
                </div>
                <span className="text-xs text-danger">{errors.allergies || ''}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.allergies?.map((allergy, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-danger text-white text-xs font-bold px-2 py-1 rounded-sm me-2 mb-2"
                  >
                    {allergy}
                    <button
                      onClick={() => removeAllergy(allergy)}
                      className="ml-1 text-xs hover:underline text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              تایید اطلاعات
            </h2>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-neutral-600">
                  جنس
                </label>
                <p className="text-base font-medium text-neutral-900">
                  {data.species}
                </p>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-neutral-600">نام</label>
                <p className="text-base font-medium text-neutral-900">
                  {data.name}
                </p>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-neutral-600">
                  جنسیت
                </label>
                <p className="text-base font-medium text-neutral-900">
                  {data.gender === 'نر' ? 'نر' : 'ماده'}
                </p>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-neutral-600">نژاد</label>
                <p className="text-base font-medium text-neutral-900">
                  {data.breed || '—'}
                </p>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-neutral-600">وزن</label>
                <p className="text-base font-medium text-neutral-900">
                  {data.weight !== null && data.weight !== undefined
                    ? `${data.weight} kg`
                    : '—'}
                </p>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-neutral-600">
                  تاریخ تولد
                </label>
                <p className="text-base font-medium text-neutral-900">
                  {data.birthDate
                    ? new Date(data.birthDate).toLocaleDateString('fa-IR')
                    : '—'}
                </p>
              </div>
              {photoUrl && (
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-neutral-600">
                    عکس
                  </label>
                  <div className="mt-2">
                    <img
                      src={photoUrl}
                      alt="عکس پالتو"
                      className="w-32 h-32 rounded-md object-cover"
                    />
                  </div>
                </div>
              )}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-neutral-600">
                  واکسن‌ها
                </label>
                <p className="text-base font-medium text-neutral-900">
                  {data.vaccinations && data.vaccinations.length > 0
                    ? data.vaccinations.map((v) => v.name).join(', ')
                    : 'ثبت نشده'}
                </p>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-neutral-600">
                  آلرژی‌ها
                </label>
                <p className="text-base font-medium text-neutral-900">
                  {data.allergies && data.allergies.length > 0
                    ? data.allergies.join(', ')
                    : 'ثبت نشده'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
