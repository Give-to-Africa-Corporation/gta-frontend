import { Button } from "@/components/ui/button";

const Hero = () => {
  const handleOpenLink = () => {
    window.open('https://2africa.org/g2a-campaign-copy/', '_blank');
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundColor: `#034623` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto section-padding text-white">
        <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
          The Frontline Fund
        </h1>
        
        <p className="text-2xl md:text-3xl font-medium mb-4 leading-relaxed">
          Stand with Africa's grassroots leaders still showing up when the world walks away.
        </p>
        
        <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          From classrooms to crisis zones, local nonprofits are leading the way — with little to no support.
        </p>
        
        <div className="space-y-4">
          <Button className="hero-button-frontline text-xl px-12 py-6" onClick={handleOpenLink}>
            DONATE NOW
          </Button>
          
          <p className="text-lg font-medium">
            100% of your gift supports vetted frontline NGOs across Africa.
          </p>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;