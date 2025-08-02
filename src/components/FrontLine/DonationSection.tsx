import { DonationDialog } from "@/components/payments/DonationDialog";
import { Check } from "lucide-react";

const DonationSection = () => {
  // const donationTiers = [
  //   {
  //     amount: 25,
  //     impact: "Feeds a community and supports trauma care for one week",
  //   },
  //   {
  //     amount: 50,
  //     impact: "Buys seeds and tools for a community-led farming collective",
  //   },
  //   {
  //     amount: 100,
  //     impact: "Sponsors access for frontline humanitarian teams",
  //   },
  //   {
  //     amount: 250,
  //     impact: "Helps a community rebuild their lives post-disaster",
  //   },
  //   {
  //     amount: 500,
  //     impact: "Fuels regranting to vetted, high-impact African NGOs",
  //     featured: true,
  //   },
  // ];

  const benefits = [
    "100% tax-deductible",
    "Impact updates from the ground",
    "Vetted, trusted, community-rooted leaders",
  ];

  // Removed external link handler as we're using the dialog now

  return (
    <section className="section-padding bg-gradient-to-br from-accent/5 to-primary/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Your Impact
          </h2>
          <p className="text-xl text-muted-foreground mb-8 frontline-testimonial">
            We have ensured trusted giving. Give Where It Matters. Stand With
            African-Led Change.
          </p>
        </div>

        {/* Donation Tiers */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* {donationTiers.map((tier, index) => (
            <Card
              key={index}
              className={`impact-card text-center ${
                tier.featured ? "ring-2 ring-primary scale-105" : ""
              }`}
            >
              <div className="flex items-center justify-center mb-4">
                <DollarSign className="text-primary" size={32} />
                <span className="text-4xl font-bold text-foreground">
                  {tier.amount}
                </span>
                {tier.amount >= 500 && (
                  <span className="text-xl text-muted-foreground">+</span>
                )}
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {tier.impact}
              </p>
              {tier.featured && (
                <div className="mt-4 px-3 py-1 bg-primary/20 text-primary text-sm font-semibold rounded-full inline-block">
                  Most Popular
                </div>
              )}
            </Card>
          ))} */}
        </div>

        {/* Benefits */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 mb-12">
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="text-primary flex-shrink-0" size={24} />
                <span className="text-lg font-medium text-foreground">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-r from-primary to-primary-glow rounded-3xl p-12 text-white">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Because when they say, "We are still here"
          </h3>
          <p className="text-2xl font-semibold mb-8">
            Let's be the ones who answer: "So are we."
          </p>

          <DonationDialog
            trigger={
              <button className="hero-button-frontline text-lg px-8 py-4 bg-white text-primary hover:bg-white/90 font-bold rounded-xl hover:scale-105 transition-all duration-300">
                DONATE NOW
              </button>
            }
          />

          <p className="text-lg mt-6 opacity-90">
            Be part of a global movement that restores dignity through giving.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DonationSection;
