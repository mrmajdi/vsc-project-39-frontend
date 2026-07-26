import { motion } from 'framer-motion';
import React from 'react';

type OnboardingProgressBarProps = {
  currentStep: number;
  totalSteps?: number;
};

const OnboardingProgressBar: React.FC<OnboardingProgressBarProps> = ({
  currentStep,
  totalSteps = 4,
}) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div dir="rtl" className="w-full flex flex-col items-center">
      <div className="w-full flex gap-2">
        {steps.map((step) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          const bgColor = isCompleted || isCurrent ? 'var(--primary)' : 'var(--neutral-200)';

          const baseStyle = {
            height: 2,
            borderRadius: 9999,
            flexGrow: 1,
            transition: 'background-color 0.5s ease',
          };

          if (isCurrent) {
            return (
              <motion.div
                key={step}
                style={{ ...baseStyle, backgroundColor: bgColor }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            );
          }

          return (
            <motion.div
              key={step}
              style={{ ...baseStyle, backgroundColor: bgColor }}
            />
          );
        })}
      </div>
      <div className="text-xs text-neutral-600 text-center mt-2">
        مرحله {currentStep} از {totalSteps}
      </div>
    </div>
  );
};

export default OnboardingProgressBar;
