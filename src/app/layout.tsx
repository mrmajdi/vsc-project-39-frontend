import '../styles/globals.css';
import '@fontsource-variable/vazirmatn';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';

export const metadata = {
  title: 'پت‌شاپ | فروشگاه آنلاین حیوانات خانگی',
  description: 'فروشگاه آنلاین لوازم و غذاهای حیوانات خانگی، خدمات بهداشتی و فروش حیوانات.',
  charset: 'utf-8',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className="font-vazirmatn bg-neutral-50 text-neutral-800">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
