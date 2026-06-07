import Hero from '@/components/Hero';
import CategoryMenu from '@/components/CategoryMenu';
import RecommendedSection from '@/components/RecommendedSection';
import Footer from '@/components/Footer';

// Homepage
export default function HomePage() {
  return (
    <main className='min-h-screen bg-white'>
      {/* hero */}
      <Hero />

      {/* categories */}
      <CategoryMenu />

      {/* recommended */}
      <RecommendedSection />

      {/* footer */}
      <Footer />
    </main>
  );
}
