"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import PassportCard from "@/components/pet/PassportCard";
import VaccinationTable from "@/components/pet/VaccinationTable";

export default function PetPassportPage({ params }: { params: { id: string } }) {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPetPassport = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await api.get(`/api/user/pets/${params.id}/passport`);
        setPet(res.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError(true);
        } else {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPetPassport();
  }, [params.id]);

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-600">در حال بارگذاری پاسپورت...</p>
        </div>
      </main>
    );
  }

  if (error || !pet) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            پت مورد نظر یافت نشد
          </h2>
          <Link href="/account/pets">
            <a
              className="inline-flex items-center justify-center gap-2 bg-white text-primary border border-primary font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-neutral-50 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            >
              بازگشت به لیست
            </a>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/account/pets">
        <a
          className="mb-6 inline-flex items-center gap-2 bg-transparent text-neutral-600 font-medium text-base px-4 py-2.5 rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
        >
          بازگشت به لیست
        </a>
      </Link>

      <h1 className="text-2xl font-bold text-neutral-900 mb-6">
        پاسپورت {pet.name}
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <PassportCard pet={pet} />
      </motion.div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          سوابق واکسیناسیون
        </h2>
        <VaccinationTable vaccines={pet.vaccines} editable={false} />
      </div>

      {pet.allergies && pet.allergies.length > 0 && (
        <div className="mt-8">
          <h3 className="text-base font-medium text-neutral-900 mb-2">
            حساسیت‌ها
          </h3>
          <div className="flex flex-wrap gap-2">
            {pet.allergies.map((allergy, index) => (
              <span
                key={index}
                className="inline-flex items-center bg-danger/10 text-danger text-xs font-medium px-2.5 py-1 rounded-full"
              >
                {allergy}
              </span>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
