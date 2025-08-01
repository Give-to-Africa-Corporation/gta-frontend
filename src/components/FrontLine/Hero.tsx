import { DonationDialog } from "@/components/payments/DonationDialog";

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-[#034623]">
      {/* Split Layout Container */}
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Hero Image */}
        <div className="w-full lg:w-1/2 relative">
          <div className="relative h-full">
            <div className="absolute inset-0 bg-gradient-to-l from-[#034623] via-transparent to-transparent lg:block hidden"></div>
            <img
              src="/images/frontline_hero.png"
              alt="Frontline Hero"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Hero Content */}
        <div className="w-full lg:w-1/2 text-white px-4 lg:px-8">
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            The Frontline Fund
          </h1>

          <p className="text-xl lg:text-3xl font-medium mb-4 leading-relaxed">
            Stand with Africa's grassroots leaders still showing up when the
            world walks away.
          </p>

          <p className="text-lg mb-8 opacity-90">
            From classrooms to crisis zones, local nonprofits are leading the
            way — with little to no support.
          </p>

          <div className="space-y-4">
            <DonationDialog
              trigger={
                <button className="hero-button-frontline text-lg px-8 py-4 bg-white text-primary hover:bg-white/90 font-bold rounded-xl hover:scale-105 transition-all duration-300">
                  DONATE NOW
                </button>
              }
            />

            <p className="text-lg font-medium">
              100% of your gift supports vetted frontline NGOs across Africa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
