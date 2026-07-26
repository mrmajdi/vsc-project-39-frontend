import { Pet, Vaccine } from '@/lib/types';
import { formatPersianDate } from '@/lib/utils';

type PassportCardProps = {
  pet: Pet;
  vaccines: Vaccine[];
  uniqueCode: string;
};

export default function PassportCard({ pet, vaccines, uniqueCode }: PassportCardProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(uniqueCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadPdf = () => {
    window.print();
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/pets/${uniqueCode}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'پاسپورت حیوان خانگی',
          text: 'مشاهده پاسپورت حیوان خانگی در پت‌شاپ',
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  const passportUrl = `${window.location.origin}/pets/${uniqueCode}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
    passportUrl
  )}`;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-2xl mx-auto">
      {/* Header band */}
      <div className="bg-gradient-to-l from-primary to-primary-dark text-white p-6 flex flex-col items-start gap-2">
        <div className="flex items-center gap-2">
          {/* Simple pet icon */}
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.86 8.16 6.83 9.45C10.28 22.07 9.5 21.27 9.5 20.2V16h3.5v3.25c0 .41.34.75.75.75h2.5c.41 0 .75-.34.75-.75V16H15v4.25c0 .93.76 1.69 1.7 1.55C19.14 20.16 22 16.42 22 12c0-5.52-4.48-10-10-10z"
              fill="currentColor"
            />
          </svg>
          <h1 className="text-xl font-bold">پاسپورت حیوان خانگی</h1>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 grid grid-cols-1 gap-6">
        <div className="flex items-start gap-6">
          {/* Left column */}
          <div className="w-1/3 flex flex-col items-center gap-4">
            {/* Pet photo */}
            <img
              src={pet.photoUrl ?? '/placeholder-pet.png'}
              alt={`عکس ${pet.name}`}
              className="w-32 h-32 rounded-lg object-cover border-4 border-neutral-100"
            />
            {/* QR code */}
            <div className="flex flex-col items-center gap-2">
              <img src={qrSrc} alt="QR code برای دسترسی به پاسپورت" className="w-12 h-12" />
              <span className="text-xs text-neutral-600">اسکن برای مشاهده</span>
            </div>
          </div>

          {/* Right column */}
          <div className="w-2/3 space-y-4">
            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-xs text-neutral-400 uppercase">نام</label>
                <p className="text-neutral-900 font-medium">{pet.name}</p>
              </div>
              <div>
                <label className="block text-xs text-neutral-400 uppercase">نوع</label>
                <p className="text-neutral-900 font-medium">{pet.species}</p>
              </div>
              <div>
                <label className="block text-xs text-neutral-400 uppercase">نژاد</label>
                <p className="text-neutral-900 font-medium">{pet.breed ?? 'نامشخص'}</p>
              </div>
              <div>
                <label className="block text-xs text-neutral-400 uppercase">جنسیت</label>
                <p className="text-neutral-900 font-medium">
                  {pet.gender === 'male' ? 'نار' : 'ماده'}
                </p>
              </div>
              <div>
                <label className="block text-xs text-neutral-400 uppercase">وزن</label>
                <p className="text-neutral-900 font-medium">
                  {pet.weight} kg
                </p>
              </div>
              <div>
                <label className="block text-xs text-neutral-400 uppercase">
                  تاریخ تولد
                </label>
                <p className="text-neutral-900 font-medium">
                  {formatPersianDate(pet.birthDate)}
                </p>
              </div>
            </div>

            {/* Unique code */}
            <div className="flex flex-col items-start gap-2">
              <label className="text-xs text-neutral-400 uppercase">
                کد یکتا
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-neutral-900 break-all">
                  {uniqueCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark"
                >
                  {copied ? 'کپی شد' : 'کپی'}
                  {!copied && (
                    <svg
                      className="w-3 h-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16 13.5V16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M12 8v4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer band */}
      <div className="bg-neutral-50 border-t border-neutral-200 p-4 text-center text-xs text-neutral-400">
        این پاسپورت توسط پت‌شاپ صادر شده است
      </div>
    </div>

    {/* Action buttons */}
    <div className="mt-6 flex flex-col sm:flex-row sm:gap-3 w-full max-w-2xl mx-auto">
      <button
        onClick={handleDownloadPdf}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-primary border border-primary font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-neutral-50 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
      >
        دانلود PDF
      </button>
      <button
        onClick={handleShare}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-primary border border-primary font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-neutral-50 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
      >
        اشتراک‌گذاری
      </button>
    </div>
  );
}
