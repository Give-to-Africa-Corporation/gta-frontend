import { Button } from "@/components/ui/button";
import { ArrowRight, HandHeart } from "lucide-react";
import { Link } from "react-router-dom";

export const CTASection = () => {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-r from-brand-purple to-brand-purple-dark">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full"></div>
      </div>

      <div className="container-custom relative">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 mb-4">
            <HandHeart className="w-5 h-5" />
            <span className="text-sm font-medium">Make a Difference Today</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Your Support Creates Lasting Change in Africa
          </h2>

          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Whether you donate, volunteer, or advocate, your contribution helps
            build stronger communities and brighter futures across the African
            continent.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
            <Link to="/campaigns" className="group">
              <Button
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90 text-white
                  text-lg px-8 py-6 h-auto font-medium 
                  shadow-lg hover:shadow-xl transition-all duration-300 
                  group-hover:-translate-y-1 
                  flex items-center gap-2 
                  rounded-md w-full sm:w-auto"
              >
                Donate Now
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link
              to="https://2africa.org/contact/"
              target="_blank"
              className="group"
            >
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white/70 text-black 
                  text-lg px-8 py-6 h-auto font-medium 
                  rounded-md 
                  transition-all duration-300 
                  group-hover:-translate-y-1 
                  flex items-center gap-2
                  w-full sm:w-auto"
              >
                Get Involved
                <ArrowRight className="h-5 w-5 opacity-70 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
