import React, { useRef, useState, useEffect, ChangeEvent, KeyboardEvent, ClipboardEvent } from 'react';

type OtpInputProps = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

const getOrdinalPersian = (num: number): string => {
  const map: Record<number, string> = {
    1: 'اول',
    2: 'دوم',
    3: 'سوم',
    4: 'چهارم',
    5: 'پنجم',
    6: 'ششم',
    7: 'هفتم',
    8: 'هشتم',
    9: 'نهم',
    10: 'دهم',
  };
  return map[num] || `${num}`; // fallback to number if beyond map
};

const OtpInput: React.FC<OtpInputProps> = ({
  length = 4,
  value,
  onChange,
  disabled = false,
}) => {
  const refs = useRef<HTMLInputElement[]>([]);
  const [chars, setChars] = useState<string[]>(() => {
    const init = Array(length).fill('');
    const split = value.split('');
    for (let i = 0; i < Math.min(split.length, length); i++) {
      init[i] = split[i];
    }
    return init;
  });

  // Sync internal chars with external value prop
  useEffect(() => {
    if (value !== chars.join('')) {
      const newChars = Array(length).fill('');
      const split = value.split('');
      for (let i = 0; i < Math.min(split.length, length); i++) {
        newChars[i] = split[i];
      }
      setChars(newChars);
    }
  }, [value, length, chars]);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const entered = e.target.value;
    const last = entered.slice(-1);
    if (!/^\d$/.test(last)) {
      // reject non-digit, keep previous
      e.target.value = chars[index] ?? '';
      return;
    }
    const newChars = [...chars];
    newChars[index] = last;
    setChars(newChars);
    const joined = newChars.join('');
    onChange(joined);
    // auto-focus next if not last and filled
    if (index < length - 1 && last !== '') {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && (e.target as HTMLInputElement).value === '' && index > 0) {
      e.preventDefault();
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (index: number, e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const clipboardData = e.clipboardData?.getData('text') ?? '';
    const digits = clipboardData.replace(/\D/g, '');
    if (!digits) return;
    const newChars = [...chars];
    for (let i = 0; i < digits.length && index + i < length; i++) {
      newChars[index + i] = digits[i];
    }
    setChars(newChars);
    const joined = newChars.join('');
    onChange(joined);
    const nextIndex = index + digits.length;
    if (nextIndex < length) {
      refs.current[nextIndex]?.focus();
    }
  };

  const baseClass =
    'w-14 h-14 text-center text-2xl font-bold bg-white border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all';

  return (
    <div className="flex gap-3 justify-center" dir="rtl">
      {Array.from({ length }).map((_, i) => {
        const label = getOrdinalPersian(i + 1);
        return (
          <input
            key={i}
            ref={el => (refs.current[i] = el)}
            aria-label={`رقم ${label}`}
            value={chars[i] ?? ''}
            onChange={e => handleChange(i, e)}
            onKeyDown={e => handleKeyDown(i, e)}
            onPaste={e => handlePaste(i, e)}
            readOnly={disabled}
            className={`${baseClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            inputMode="numeric"
          />
        );
      })}
    </div>
  );
};

export default OtpInput;
