"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ContactOwnerButton = ({ ownerPhone, ownerName }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const formatPhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 11 && digits.startsWith("09")) {
      return digits.replace(/(\d{2})(\d{3})(\d{4})/, "$1 $2 $3");
    }
    return phone;
  };

  const formattedPhone = formatPhoneNumber(ownerPhone);
  const initialLabel = ownerName
    ? `دکمه تماس با صاحب ${ownerName}`
    : "دکمه تماس با صاحب";
  const revealedLabel = ownerName
    ? `دکمه شماره تماس صاحب ${ownerName}: ${formattedPhone}`
    : `دکمه شماره تماس: ${formattedPhone}`;

  return (
    <button
      className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      aria-label={isRevealed ? revealedLabel : initialLabel}
      onClick={() => setIsRevealed(!isRevealed)}
    >
      {isRevealed ? (
        <AnimatePresence>
          <motion.span
            key="revealed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <span className="mr-1">{formattedPhone}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 015.516-5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 5 16.284 5 11V5z"
              />
            </svg>
          </motion.span>
        </AnimatePresence>
      ) : (
        <span key="initial">تماس با صاحب</span>
      )}
    </button>
  );
};

export default ContactOwnerButton;
