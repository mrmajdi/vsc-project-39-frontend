import React from 'react';

type AuthCardProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
};

const AuthCard: React.FC<AuthCardProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-[480px] bg-white rounded-xl shadow-lg p-8 border border-neutral-200">
        <div className="text-2xl font-bold text-primary text-center mb-6">
          🐾 پت‌شاپ
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 text-center mb-2">
          {title}
        </h2>
        <p className="text-sm text-neutral-600 text-center mb-6">
          {subtitle}
        </p>
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
};

export default AuthCard;
