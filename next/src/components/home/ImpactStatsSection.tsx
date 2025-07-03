
import { Users, Heart, Home, Globe } from "lucide-react";
import { useState, useEffect } from "react";

export const ImpactStatsSection = () => {
  const [animatedStats, setAnimatedStats] = useState({
    lives: 0,
    countries: 0,
    projects: 0,
    years: 0
  });
  
  const targetStats = {
    lives: 50000,
    countries: 15,
    projects: 78,
    years: 12
  };
  
  useEffect(() => {
    const duration = 2000; // 2 seconds for the animation
    const interval = 20; // update every 20ms
    const steps = duration / interval;
    
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      
      const progress = Math.min(currentStep / steps, 1);
      
      setAnimatedStats({
        lives: Math.round(progress * targetStats.lives),
        countries: Math.round(progress * targetStats.countries),
        projects: Math.round(progress * targetStats.projects),
        years: Math.round(progress * targetStats.years)
      });
      
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <h2 className="section-title mb-12">Our Impact</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          {/* Lives Changed */}
          <div className="flex flex-col items-center text-center p-6 bg-brand-green/5 rounded-xl">
            <div className="h-16 w-16 rounded-full bg-brand-green/10 flex items-center justify-center mb-4">
              <Users size={32} className="text-brand-green" />
            </div>
            <h3 className="text-4xl font-bold text-brand-green mb-2">{animatedStats.lives.toLocaleString()}</h3>
            <p className="text-gray-600">Lives Changed</p>
          </div>
          
          {/* Countries */}
          <div className="flex flex-col items-center text-center p-6 bg-brand-orange/5 rounded-xl">
            <div className="h-16 w-16 rounded-full bg-brand-orange/10 flex items-center justify-center mb-4">
              <Globe size={32} className="text-brand-orange" />
            </div>
            <h3 className="text-4xl font-bold text-brand-orange mb-2">{animatedStats.countries}</h3>
            <p className="text-gray-600">Countries</p>
          </div>
          
          {/* Projects Completed */}
          <div className="flex flex-col items-center text-center p-6 bg-brand-purple/5 rounded-xl">
            <div className="h-16 w-16 rounded-full bg-brand-purple/10 flex items-center justify-center mb-4">
              <Heart size={32} className="text-brand-purple" />
            </div>
            <h3 className="text-4xl font-bold text-brand-purple mb-2">{animatedStats.projects}</h3>
            <p className="text-gray-600">Projects Completed</p>
          </div>
          
          {/* Years of Experience */}
          <div className="flex flex-col items-center text-center p-6 bg-brand-yellow/5 rounded-xl">
            <div className="h-16 w-16 rounded-full bg-brand-yellow/10 flex items-center justify-center mb-4">
              <Home size={32} className="text-brand-yellow" />
            </div>
            <h3 className="text-4xl font-bold text-brand-yellow mb-2">{animatedStats.years}</h3>
            <p className="text-gray-600">Years of Experience</p>
          </div>
        </div>
      </div>
    </section>
  );
};
