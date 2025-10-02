import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { PlanCards } from '@/components/PlanCards';
import { ProcessSteps } from '@/components/ProcessSteps';
import { Testimonials } from '@/components/Testimonials';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <PlanCards />
        <ProcessSteps />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
