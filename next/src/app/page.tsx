"use client";

import { CTAGridSection } from "../components/home/CTAGridSection";
import { CTASection } from "../components/home/CTASection";
import { FeaturedCausesSection } from "../components/home/FeaturedCausesSection";
import { HeroSection } from "../components/home/HeroSection";
import { MissionSection } from "../components/home/MissionSection";
import { Footer } from "../components/shared/Footer";
import { useAppContext } from "../context/AppContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();
  const { user } = useAppContext();

  // Redirect logged-in users to appropriate dashboard
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else if (user.role === "ngo" && user.isVerified) {
        router.push("/dashboard");
      } else if (user.role === "ngo") {
        router.push("/verification-pending");
      }
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <HeroSection />
        <CTAGridSection />
        <MissionSection />
        <FeaturedCausesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
