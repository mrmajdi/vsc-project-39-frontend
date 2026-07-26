'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

type Clinic = {
  id: string;
  slug: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  working_hours: { day: string; open: string; close: string }[];
  image: string;
  rating: number;
  lat: number;
  lng: number;
};

function isClinicOpen(workingHours: Clinic['working_hours']): boolean {
  const now = new Date();
  const dayNamesFa = ["یکشنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنجشنبه","جمعه","شنبه"];
  const dayName = dayNamesFa[now.getDay()];
  const time = now.toTimeString().slice(0, 5);
  const today = workingHours.find((wh) => wh.day === dayName);
  if (!today) return false;
  return time >= today.open && time <= today.close;
}

export default function ClinicCard({ clinic }: { clinic: Clinic }) {
  const isOpen = isClinicOpen(clinic.working_hours);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Link href={`/clinics/${clinic.id}/${clinic.slug}`} passHref>
        <a
          className="block bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden transition-all hover:shadow-md"
        >
          <img
            src={clinic.image}
            alt={clinic.name}
            className="w-full h-32 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              {clinic.name}
            </h3>
            <div className="flex items-center text-sm text-neutral-600 mb-1">
              <span aria-hidden="true">📍</span>
              <span className="ms-1">{clinic.address}, {clinic.city}</span>
            </div>
            <div className="flex items-center text-sm text-neutral-600 mb-2">
              <span aria-hidden="true">📞</span>
              <span className="ms-1">{clinic.phone}</span>
            </div>
            <span
              className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${
                isOpen
                  ? 'bg-success/10 text-success'
                  : 'bg-danger/10 text-danger'
              }`}
            >
              {isOpen ? 'باز' : 'بسته'}
            </span>
          </div>
        </a>
      </Link>
    </motion.div>
  );
}
