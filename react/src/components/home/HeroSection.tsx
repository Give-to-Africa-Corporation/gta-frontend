import { useEffect, useState } from "react";

export const HeroSection = () => {
  // Animation states
  const [isLoaded, setIsLoaded] = useState(false);

  // Set loaded state after component mounts for animations
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative bg-brand-purple text-white overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-purple-darker opacity-30"></div>

      {/* Animated decorative elements */}
      <div
        className={`absolute left-20 top-20 w-32 h-32 rounded-full bg-brand-yellow/30 blur-xl transition-all duration-1000 ease-out ${
          isLoaded ? "opacity-60" : "opacity-0 translate-y-10"
        }`}
        style={{ animationDelay: "0.3s" }}
      ></div>
      <div
        className={`absolute right-40 bottom-40 w-40 h-40 rounded-full bg-brand-orange/20 blur-xl transition-all duration-1000 ease-out ${
          isLoaded ? "opacity-60" : "opacity-0 translate-y-10"
        }`}
        style={{ animationDelay: "0.5s" }}
      ></div>

      <div className="container-custom relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center py-16 lg:py-24">
          {/* Text Content with Animation */}
          <div className="text-left space-y-6 z-10">
            <h1
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight transition-all duration-700 ${
                isLoaded ? "opacity-100" : "opacity-0 translate-y-4"
              }`}
            >
              Transform Lives <br />
              <span className="text-brand-orange">Across Africa</span>
            </h1>

            <p
              className={`text-lg md:text-xl max-w-xl leading-relaxed text-white/90 transition-all duration-700 delay-200 ${
                isLoaded ? "opacity-100" : "opacity-0 translate-y-4"
              }`}
            >
              Join us in creating sustainable solutions and empowering
              communities through tax-deductible giving that makes a real
              difference.
            </p>

            {/* <div
              className={`flex flex-wrap gap-4 pt-4 transition-all duration-700 delay-400 ${
                isLoaded ? "opacity-100" : "opacity-0 translate-y-4"
              }`}
            >
              <Link to="/campaigns">
                <Button
                  className="bg-brand-orange hover:bg-brand-orange/90 text-white 
                    px-8 py-6 h-auto text-lg font-medium rounded-md 
                    transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Discover Our Causes
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link
                to="https://www.2africa.org/contact"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="bg-transparent border-2 border-white hover:bg-white/10 
                    px-8 py-6 h-auto text-lg font-medium rounded-md text-white
                    transition-all duration-300 hover:scale-105"
                >
                  Get Involved
                </Button>
              </Link>
            </div> */}
          </div>

          <div
            className={`relative h-[580px] hidden lg:block transition-all duration-1000 ${
              isLoaded ? "opacity-100" : "opacity-0 translate-y-10"
            }`}
          >
            {/* Main hero image - increased size */}
            <div
              className="absolute right-0 top-12 w-[580px] h-auto rounded-lg overflow-hidden shadow-2xl z-10 
              transition-transform duration-700 hover:scale-[1.02] hover:shadow-xl"
            >
              <img
                // src="/images/5.jpg"
                src="/images/face.png"
                alt="African children smiling"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Animated wave divider */}
      <div
        className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 delay-500 ${
          isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 100"
          fill="#ffffff"
          preserveAspectRatio="none"
          className="w-full h-[60px]"
        >
          <path d="M0,0 C150,90 350,80 500,60 C650,40 750,10 900,30 C1050,50 1300,90 1440,80 L1440,100 L0,100 Z"></path>
        </svg>
      </div>
    </section>
  );
};
