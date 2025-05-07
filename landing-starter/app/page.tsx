import Header from '@/components/header';
import Hero from '@/components/hero';
import FeaturedProducts from '@/components/featured-products';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <FeaturedProducts />
    </main>
  );
}