import Hero from "@/components/FrontLine/Hero";
import TestimonialSection from "@/components/FrontLine/TestimonialSection";
import TruthSection from "@/components//FrontLine/TruthSection";
import DonationSection from "@/components//FrontLine/DonationSection";
import { Footer } from "@/components/shared/Footer";
import './index.css';

const Index = () => {
  return (
    <div className="min-h-screen">
      <main>
        <Hero />
        <TestimonialSection />
        <TruthSection />
        <DonationSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
