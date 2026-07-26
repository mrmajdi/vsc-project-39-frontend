import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import NotFoundState from '@/components/shared/NotFoundState';
import PublicPassportView from '@/components/pet/PublicPassportView';
import { motion } from 'framer-motion';
import type { Metadata } from 'next';

export const generateMetadata = async ({
  params,
}: {
  params: { uniqueCode: string };
}): Promise<Metadata> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/pets/public/${params.uniqueCode}`,
      {
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return {};
    const pet = await res.json();
    return {
      title: `${pet.name} - پاسپورت حیوان`,
      description: `پاسپورت عمومی برای ${pet.name}، یک ${pet.species} ${pet.breed || ''}`.trim(),
    };
  } catch {
    return {};
  }
};

export default async function PetPublicPassportPage({
  params,
}: {
  params: { uniqueCode: string };
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/pets/public/${params.uniqueCode}`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <NotFoundState />
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  const pet = await res.json();

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PublicPassportView pet={pet} />
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
