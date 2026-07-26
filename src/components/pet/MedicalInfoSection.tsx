"use client";

import { motion } from "framer-motion";

interface MedicalInfoSectionProps {
  allergies: string[];
  vaccines: { name: string; date: string }[];
  medicalNotes: string;
}

export default function MedicalInfoSection({
  allergies,
  vaccines,
  medicalNotes,
}: MedicalInfoSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold text-neutral-900 text-start">
        اطلاعات پزشکی
      </h2>

      {/* Allergies */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-neutral-800 text-start">
          آلرژی‌ها
        </h3>
        <div className="flex flex-wrap gap-2">
          {allergies.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {allergies.map((allergy, index) => (
                <motion.span
                  key={allergy}
                  variants={itemVariants}
                  className="inline-flex items-center bg-danger/10 text-danger text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {allergy}
                </motion.span>
              ))}
            </motion.div>
          ) : (
            <p className="text-sm text-neutral-600 text-start">
              بدون حساسیت شناخته شده
            </p>
          )}
        </div>
      </div>

      {/* Vaccines */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-neutral-800 text-start">
          واکسن‌ها
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-start px-3 py-2 text-xs font-medium text-neutral-600">
                  واکسن
                </th>
                <th className="text-start px-3 py-2 text-xs font-medium text-neutral-600">
                  تاریخ
                </th>
              </tr>
            </thead>
            <motion.tbody
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {vaccines.length > 0 ? (
                vaccines.map((vaccine, index) => (
                  <motion.tr
                    key={vaccine.name}
                    variants={itemVariants}
                    className="border-b border-neutral-200"
                  >
                    <td className="text-start px-3 py-2">{vaccine.name}</td>
                    <td className="text-start px-3 py-2">{vaccine.date}</td>
                  </motion.tr>
                ))
              ) : (
                <motion.tr
                  key="empty"
                  variants={itemVariants}
                  className="border-b border-neutral-200"
                >
                  <td
                    colSpan="2"
                    className="px-3 py-2 text-start text-neutral-600"
                  >
                    واکسنی ثبت نشده
                  </td>
                </motion.tr>
              )}
            </motion.tbody>
          </table>
        </div>
      </div>

      {/* Medical Notes */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-neutral-800 text-start">
          یادداشت‌های پزشکی
        </h3>
        <div className="border border-neutral-200 rounded-md p-4 bg-neutral-50">
          {medicalNotes.trim() ? (
            <p className="text-sm text-neutral-700 text-start">
              {medicalNotes}
            </p>
          ) : (
            <p className="text-sm text-neutral-600 text-start">
              یادداشتی ثبت نشده
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
