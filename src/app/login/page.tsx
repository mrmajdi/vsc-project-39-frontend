import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';

export default function LoginPage() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otpValues, setOtpValues] = useState<Array<string>>(['', '', '', '']);
  const [otpFocus, setOtpFocus] = useState<number>(0);
  const [loading, setLoading] = useState<{ send?: boolean; verify?: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [resendEnabled, setResendEnabled] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const phoneRef = useRef<HTMLInputElement>(null);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([null, null, null, null]);

  // Start countdown when OTP sent
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendEnabled(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const handleSendOtp = async () => {
    if (!/^\d{11}$/.test(phone)) {
      setError('شماره موبایل نامعتبر است');
      return;
    }
    setLoading({ send: true });
    setError(null);
    try {
      const res = await api.post('/auth/send-otp', { phone });
      // Assume API returns { success: true }
      setStep('otp');
      setCountdown(60);
      setResendEnabled(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'خطا در ارسال کد');
    } finally {
      setLoading({ send: false });
    }
  };

  const handleResendOtp = async () => {
    setLoading({ send: true });
    setError(null);
    try {
      await api.post('/auth/send-otp', { phone });
      setCountdown(60);
      setResendEnabled(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'خطا در ارسال کد');
    } finally {
      setLoading({ send: false });
    }
  };

  const handleVerifyOtp = async () => {
    const code = otpValues.join('');
    if (!/^\d{4}$/.test(code)) {
      setError('لطفاً کد ۴ رقمی را کامل وارد کنید');
      return;
    }
    setLoading({ verify: true });
    setError(null);
    try {
      const res = await api.post('/auth/verify-otp', { phone, code });
      const { token, user, isNewUser } = res.data;
      useAuthStore.getState().setAuth(token, user);
      if (isNewUser) {
        router.push('/register');
      } else {
        router.push(callbackUrl);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'کد نامعتبر است');
    } finally {
      setLoading({ verify: false });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && otpValues[index] === '' && index > 0) {
      setOtpFocus(index - 1);
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length > 1) {
      e.target.value = value.slice(0, 1);
      return;
    }
    const newValues = [...otpValues];
    newValues[index] = value;
    setOtpValues(newValues);
    if (value && index < 3) {
      setOtpFocus(index + 1);
      otpRefs.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      setOtpFocus(index - 1);
      otpRefs.current[index - 1]?.focus();
    } else if (value && index === 3) {
      // All filled, blur
      e.target.blur();
    }
  };

  // Focus first OTP input when step changes to otp
  useEffect(() => {
    if (step === 'otp') {
      setOtpFocus(0);
      otpRefs.current[0]?.focus();
    }
  }, [step]);

  const variants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 sm:px-6 lg:px-8" dir="rtl">
      <AnimatePresence mode="wait">
        {step === 'phone' && (
          <motion.div
            key="phone"
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            className="bg-white rounded-xl shadow-lg p-8 border border-neutral-200 w-full max-w-[480px]"
          >
            <h2 className="text-2xl font-bold text-neutral-900 mb-2 text-center">
              ورود به پت‌شاپ
            </h2>
            <p className="text-sm text-neutral-600 mb-6 text-center">
              شماره موبایل خود را وارد کنید
            </p>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-800">
                شماره موبایل
              </label>
              <input
                type="tel"
                maxLength="11"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                ref={phoneRef}
                className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-start"
                dir="rtl"
                disabled={loading.send}
              />
            </div>
            {error && <p className="text-sm text-danger">{error}</p>}
            <button
              onClick={handleSendOtp}
              disabled={loading.send || !/^\d{11}$/.test(phone)}
              className="inline-flex items-center justify-center gap-2 w-full bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading.send ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  <span>در حال ارسال...</span>
                </>
              ) : (
                'ارسال کد تایید'
              )}
            </button>
          </motion.div>
        )}
        {step === 'otp' && (
          <motion.div
            key="otp"
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            className="bg-white rounded-xl shadow-lg p-8 border border-neutral-200 w-full max-w-[480px]"
          >
            <h2 className="text-2xl font-bold text-neutral-900 mb-2 text-center">
              کد تایید را وارد کنید
            </h2>
            <p className="text-sm text-neutral-600 mb-6 text-center">
              شماره موبایل: {phone}
            </p>
            <div className="flex gap-3 justify-center mb-4">
              {otpValues.map((val, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength="1"
                  value={val}
                  onChange={e => handleChange(e, idx)}
                  onKeyDown={e => handleKeyDown(e, idx)}
                  ref={otpRefs[idx]}
                  className={`w-14 h-14 text-center text-2xl font-bold border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary text-neutral-900`}
                  disabled={loading.verify}
                />
              ))}
            </div>
            {error && <p className="text-sm text-danger">{error}</p>}
            <div className="flex flex-col items-center gap-2">
              {!resendEnabled && (
                <p className="text-sm text-neutral-600">
                  ارسال مجدد کد در {countdown} ثانیه
                </p>
              )}
              {resendEnabled && (
                <button
                  onClick={handleResendOtp}
                  disabled={loading.send}
                  className="inline-flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-all"
                >
                  ارسال مجدد کد
                </button>
              )}
            </div>
            <button
              onClick={handleVerifyOtp}
              disabled={loading.verify || otpValues.some(v => v === '')}
              className="inline-flex items-center justify-center gap-2 w-full bg-primary text-white font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading.verify ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  <span>در حال تایید...</span>
                </>
              ) : (
                'تایید و ورود'
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
