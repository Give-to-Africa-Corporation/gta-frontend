
import { CTAGridSection } from "@/components/home/CTAGridSection";
import { CTASection } from "@/components/home/CTASection";
import { FeaturedCausesSection } from "@/components/home/FeaturedCausesSection";
import { HeroSection } from "@/components/home/HeroSection";
import { DonationHighlight } from "@/components/home/DonationHighlight";
import { RecentDonations } from "@/components/home/RecentDonations";
import { ProblemSection } from "@/components/home/ProblemSection";
import { SolutionSection} from "@/components/home/SolutionSection";
import { KeyFeatures } from "@/components/home/KeyFeatures";
import { HowItWorks } from "@/components/home/HowItWorks";
import { NewTestimonialsSection } from "@/components/home/NewTestimonialsSection";
import { CallToAction } from "@/components/home/CallToAction";
import { MissionSection } from "@/components/home/MissionSection";
import { Footer } from "@/components/shared/Footer";
import { useAppContext } from "@/context/AppContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();

  // Redirect logged-in users to appropriate dashboard
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "ngo" && user.isVerified) {
        navigate("/dashboard");
      } else if (user.role === "ngo") {
        navigate("/verification-pending");
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <HeroSection />
        <RecentDonations />
        {/* <DonationHighlight /> */}
        {/* <ProblemSection /> */}
        {/* <SolutionSection /> */}
        {/* <KeyFeatures/> */}
        {/* <HowItWorks /> */}
        {/* <NewTestimonialsSection /> */}
        {/* <CallToAction /> */}
        {/* <CTAGridSection />
        <MissionSection />
        <FeaturedCausesSection />
        <CTASection /> */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
