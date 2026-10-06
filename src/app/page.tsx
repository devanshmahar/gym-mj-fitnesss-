import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  HeroSection,
  StatsSection,
  AboutSection,
  FacilitiesSection,
  TrainersSection,
  PricingSection,
  TestimonialsSection,
  ContactSection,
} from '@/components/HomeSections';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <AboutSection />
        <FacilitiesSection />
        <TrainersSection />
        <PricingSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
