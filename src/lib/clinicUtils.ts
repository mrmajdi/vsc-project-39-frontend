import { WorkingHours } from './types';

const persianDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

function convertToPersianDigits(str: string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/\d/g, (ch) => persianDigits[parseInt(ch, 10)]);
}

function formatTime(time: string): string {
  const [h, m] = time.split(':');
  const hourStr = h.replace(/^0+/, '') || '0';
  const formattedHour = convertToPersianDigits(hourStr);
  const formattedMinute = convertToPersianDigits(m);
  return `${formattedHour}:${formattedMinute}`;
}

export function isClinicOpen(workingHours: WorkingHours[]): boolean {
  if (!workingHours || workingHours.length === 0) {
    return false;
  }
  const todayJs = new Date().getDay();
  const todayPersian = (todayJs + 1) % 7;
  const todayWorkingHour = workingHours.find(wh => {
    const whPersianDay = (wh.day_of_week + 1) % 7;
    return whPersianDay === todayPersian;
  });
  if (!todayWorkingHour) {
    return false;
  }
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);
  return currentTime >= todayWorkingHour.open_time && currentTime < todayWorkingHour.close_time;
}

export function formatWorkingHours(workingHours: WorkingHours[]): string[] {
  if (!workingHours || workingHours.length === 0) {
    return [];
  }
  return workingHours.map(wh => {
    const persianDayIndex = (wh.day_of_week + 1) % 7;
    const dayName = persianDays[persianDayIndex];
    const openTimeFormatted = formatTime(wh.open_time);
    const closeTimeFormatted = formatTime(wh.close_time);
    return `${dayName}: ${openTimeFormatted} - ${closeTimeFormatted}`;
  });
}

export function getTodayPersianDay(): number {
  const jsDay = new Date().getDay();
  return (jsDay + 1) % 7;
}
