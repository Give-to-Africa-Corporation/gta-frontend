import { Card } from "@/components/ui/card";
import { AlertTriangle, Heart, Target } from "lucide-react";

const TruthSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-6xl mx-auto">
        {/* The Hard Truth */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground frontline-truthSection">
            The Hard Truth
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="impact-card text-center">
              <AlertTriangle className="text-cta mx-auto mb-4" size={48} />
              <h3 className="text-3xl font-bold mb-2 text-foreground">200+</h3>
              <p className="text-lg text-muted-foreground">
                NGOs have lost critical U.S. funding in just the last year
              </p>
            </Card>

            <Card className="impact-card text-center">
              <Heart className="text-primary mx-auto mb-4" size={48} />
              <h3 className="text-3xl font-bold mb-2 text-foreground">
                Millions
              </h3>
              <p className="text-lg text-muted-foreground">
                of lives now depend on leaders working without reliable funding
              </p>
            </Card>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center text-foreground frontline-truthsection2">
            That is Give to Africa's Mission
          </h2>

          <div className="max-w-4xl mx-auto">
            <p className="text-lg leading-relaxed mb-8 text-muted-foreground">
              Give to Africa is a transformative 501(c)(3) nonprofit bridging
              the gap between compassionate global donors and visionary
              African-led organizations. Through strategic regrants,
              cutting-edge digital tools, and comprehensive training programs,
              we empower local nonprofits to create lasting change across the
              African continent.
            </p>

            <div className="bg-primary/10 border-l-4 border-primary p-8 rounded-r-2xl mb-8">
              <p className="text-2xl font-semibold text-foreground">
                We believe those closest to the challenges are the architects of
                sustainable solutions.
              </p>
              <p className="text-lg mt-3 text-muted-foreground">
                Our mission is to amplify local voices and support indigenous
                innovation.
              </p>
            </div>

            <p className="text-lg leading-relaxed text-muted-foreground">
              When you give to Give to Africa, you become part of a powerful
              movement.{" "}
              <span className="frontline-truthSection font-medium">
                Your contribution doesn't just fund projects — it empowers
                communities, fuels innovation, and builds lasting partnerships
                for positive change.
              </span>
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-12">
          <Target className="text-primary mx-auto mb-6" size={64} />
          <h3 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            They're not featured in headlines. They don't have big donors
            backing them. But they've never stopped.
          </h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            That's why we created The Frontline Fund — to stand with African-led
            nonprofits who continue serving, not for recognition, but because
            their communities depend on them.
          </p>
          <p className="text-2xl font-bold text-primary mb-8">
            Join us. Stand with those who have stayed. Support The Frontline
            Fund, today.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TruthSection;
