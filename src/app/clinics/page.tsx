import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

const ClinicsPage = () => {
  const [mapOpen, setMapOpen] = useState(false);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cityFilter, setCityFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatus = (workingHours) => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const time = now.toTimeString().slice(0, 5); // "HH:MM"

    const today = workingHours.find(wh => wh.day === day);
    if (!today) return 'بسته';
    if (today.is_closed) return 'بسته';

    const [openHours, openMinutes] = today.open.split(':').map(Number);
    const [closeHours, closeMinutes] = today.close.split(':').map(Number);
    const openTime = openHours * 60 + openMinutes;
    const closeTime = closeHours * 60 + closeMinutes;
    const currentTime = now.getHours() * 60 + now.getMinutes();

    return currentTime >= openTime && currentTime <= closeTime ? 'باز' : 'بسته';
  };

  const fetchClinics = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (cityFilter) query.append('city', cityFilter);
      if (searchTerm) query.append('search', searchTerm);
      const res = await fetch(`/api/clinics?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch clinics');
      const data = await res.json();
      setClinics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, [cityFilter, searchTerm]);

  const ClinicMap = dynamic(() => import('@/components/shared/ClinicMap'), {
    ssr: false,
    loading: () => <div className="h-64 bg-neutral-200 animate-pulse rounded-lg"></div>,
  });

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-neutral-900">کلینیک‌های دامپزشکی</h1>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            {/* Map Column */}
            <div className="w-full lg:w-1/2">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setMapOpen(!mapOpen)}
                  className="inline-flex items-center gap-2 bg-white text-primary border border-primary font-medium text-base px-6 py-2.5 rounded-lg shadow-sm hover:bg-neutral-50 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {mapOpen ? 'پنهان کردن نقشه' : 'نمایش نقشه'}
                </button>
              </div>
              
              {mapOpen && (
                <ClinicMap clinics={clinics} />
              )}
            </div>
            
            {/* List Column */}
            <div className="w-full lg:w-1/2 space-y-4">
              {/* Filters */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-800">شهر</label>
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="">همه شهرها</option>
                  {/* In a real app, we would populate this from an API */}
                </select>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-800">جستجو</label>
                <input
                  type="text"
                  placeholder="نام کلینیک، آدرس، ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
              
              {/* Clinic List */}
              {loading ? (
                <>
                  <div className="space-y-3">
                    {[1,2,3,4].map((_, i) => (
                      <div key={i} className="h-12 bg-neutral-200 animate-pulse rounded-lg"></div>
                    ))}
                  </div>
                </>
              ) : error ? (
                <p className="text-danger">{error}</p>
              ) : clinics.length === 0 ? (
                <p className="text-neutral-600">کلینیکی یافت نشد</p>
              ) : (
                <motion.ul
                  className="divide-y divide-neutral-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, stagger: 0.1 }}
                >
                  {clinics.map(clinic => (
                    <motion.li
                      key={clinic.id}
                      className="py-4"
                    >
                      <Link
                        href={`/clinics/${clinic.id}/${clinic.slug}`}
                        className="block hover:no-underline"
                      >
                        <div className="flex flex-col gap-2">
                          <h3 className="text-lg font-semibold text-neutral-900">
                            {clinic.name}
                          </h3>
                          <p className="text-sm text-neutral-600">
                            {clinic.address}
                          </p>
                          <div className="flex flex-wrap gap-2 items-center">
                            <span
                              className={`inline-flex items-center ${
                                getStatus(clinic.working_hours) === 'باز'
                                  ? 'bg-success/10 text-success'
                                  : 'bg-danger/10 text-danger'
                              } text-xs font-medium px-2.5 py-1 rounded-full`}
                            >
                              {getStatus(clinic.working_hours)}
                            </span>
                            <span className="text-sm text-neutral-600">
                              {clinic.phone}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ClinicsPage;
