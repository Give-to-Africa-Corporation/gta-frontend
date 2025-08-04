import { Card } from "@/components/ui/card";
import Image from "@/components/ui/Image";
import { AlertTriangle, Check, Heart } from "lucide-react";
import { DonationDialog } from "../payments/DonationDialog";

const TruthSection = () => {
  return (
    <section className="py-24 px-6 md:px-12 bg-background">
      <div className="max-w-[1400px] mx-auto">
        {/* The Hard Truth */}
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-foreground frontline-truthSection">
            The Hard Truth
          </h2>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <Card className="impact-card text-center p-8 border-2 border-cta shadow-lg">
              <AlertTriangle className="text-cta mx-auto mb-2" size={36} />
              <h3 className="text-4xl font-bold mb-2 text-cta">200+</h3>
              <p className="text-sm font-medium text-foreground">
                NGOs have lost critical U.S. funding in just the last year
              </p>
            </Card>

            <Card className="impact-card text-center p-5 border-2 border-primary shadow-lg">
              <Heart className="text-primary mx-auto mb-2" size={36} />
              <h3 className="text-4xl font-bold mb-2 text-primary">Millions</h3>
              <p className="text-sm font-medium text-foreground">
                of lives now depend on leaders working without reliable funding
              </p>
            </Card>
          </div>
        </div>
        {/* Mission Section */}
        <div className="mb-24">
          <p className="text-3xl font-bold mb-16 text-center">
            We have ensured trusted giving. Give Where It Matters. Stand With
            African-Led Change.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* One */}
            <div className="rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative h-[500px] group">
              <div className="absolute inset-0">
                <Image
                  src="/images/4.jpg"
                  alt="Mission"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-brand-purple opacity-80 group-hover:opacity-90 transition-opacity"></div>
              </div>

              <div className="relative z-10 h-full p-10 flex flex-col justify-between text-white">
                <div>
                  <p className="text-lg leading-relaxed mb-6">
                    Give to Africa is a transformative 501(c)(3) nonprofit
                    bridging the gap between compassionate global donors and
                    visionary African-led organizations.
                  </p>

                  <div className="border-l-4 border-white/40 p-6 rounded-r-2xl mb-6 bg-white/10">
                    <p className="text-xl font-semibold">
                      We believe those closest to the challenges are the
                      architects of sustainable solutions.
                    </p>
                  </div>
                </div>

                <p className="text-lg leading-relaxed font-medium">
                  Your contribution empowers communities, fuels innovation, and
                  builds lasting partnerships for change.
                </p>
              </div>
            </div>

            {/* Two */}
            <div className="rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative h-[500px] group">
              <div className="absolute inset-0">
                <Image
                  src="/images/6.jpg"
                  alt="Frontline Fund"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-brand-orange opacity-80 group-hover:opacity-90 transition-opacity"></div>
              </div>

              <div className="relative z-10 h-full p-8 flex flex-col justify-between text-white text-center">
                <div>
                  <h3 className="text-2xl font-bold mb-6">
                    They're not featured in headlines. They don't have big
                    donors backing them. But they've never stopped.
                  </h3>
                  <p className="text-lg mb-6">
                    That's why we created The Frontline Fund — to stand with
                    African-led nonprofits who continue serving, not for
                    recognition, but because their communities depend on them.
                  </p>
                </div>
                <p className="text-xl font-bold">
                  Join us. Stand with those who have stayed.
                </p>
              </div>
            </div>

            {/* Three */}
            <div className="rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative h-[500px] group">
              <div className="absolute inset-0">
                <Image
                  src="/images/7.jpg"
                  alt="Call to Action"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-brand-green opacity-80 group-hover:opacity-90 transition-opacity"></div>
              </div>

              <div className="relative z-10 h-full p-8 flex flex-col justify-center text-white text-center">
                <h3 className="text-2xl font-bold mb-6">
                  Because when they say, "We are still here"
                </h3>
                <p className="text-xl font-semibold mb-6">
                  Let's be the ones who answer: "So are we."
                </p>
                <p className="text-lg">
                  Be part of a global movement that restores dignity through
                  giving.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center">
        <div className="mb-24">
          <DonationDialog
            trigger={
              <button className="mx-auto lg:w-1/4 hero-button-frontline text-lg px-8 py-4 bg-white text-primary hover:bg-white/90 font-bold rounded-xl hover:scale-105 transition-all duration-300">
                DONATE NOW
              </button>
            }
          />
        </div>

        {/* Impact Section */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white/5 p-6 rounded-xl flex items-start gap-6 group hover:bg-white/10 transition-colors">
              <div className="p-2 rounded-full bg-brand-green/20 group-hover:bg-brand-green/30 transition-colors">
                <Check className="w-6 h-6 text-brand-green" />
              </div>
              <p className="text-lg font-semibold">100% tax-deductible</p>
            </div>
            <div className="bg-white/5 p-2 rounded-xl flex items-start gap-4 group hover:bg-white/10 transition-colors">
              <div className="p-2 rounded-full bg-brand-green/20 group-hover:bg-brand-green/30 transition-colors">
                <Check className="w-6 h-6 text-brand-green" />
              </div>
              <p className="text-lg font-semibold">
                Impact updates from the ground
              </p>
            </div>
            <div className="bg-white/5 p-2 rounded-xl flex items-start gap-4 group hover:bg-white/10 transition-colors">
              <div className="p-2 rounded-full bg-brand-green/20 group-hover:bg-brand-green/30 transition-colors">
                <Check className="w-6 h-6 text-brand-green" />
              </div>
              <p className="text-lg font-semibold">
                Vetted, trusted, community-rooted leaders
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TruthSection;
