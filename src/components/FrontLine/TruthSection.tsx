import { Card } from "@/components/ui/card";
import { AlertTriangle, Heart, Target } from "lucide-react";
import Image1 from "./../../../public/images/front-line1.png";
import Image2 from "./../../../public/images/front-line2.png";

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
              <h3 className="text-3xl font-bold mb-2 text-foreground">Millions</h3>
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
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg leading-relaxed mb-6 text-muted-foreground">
                Give to Africa is a 501(c)(3) nonprofit that connects everyday donors with extraordinary African-led organizations. We provide regrants, digital tools, and training to amplify the impact of local nonprofits across the continent.
              </p>
              
              <div className="bg-primary/10 border-l-4 border-primary p-6 rounded-r-2xl mb-6">
                <p className="text-xl font-semibold text-foreground">
                  We believe those closest to the problem are closest to the solution.
                </p>
              </div>
              
              <p className="text-lg leading-relaxed text-muted-foreground">
                When you give to Give to Africa, you're not just donating. <span className="frontline-truthSection">You're sustaining their mission. You're standing with them.
                </span>
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="rounded-2xl overflow-hidden shadow-card">
                <img 
                  src={Image1} 
                  alt="Education in Africa" 
                  className="w-full h-48 object-cover-front-line"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-card">
                <img 
                  src={Image2} 
                  alt="Women's shelter support" 
                  className="w-full h-48 object-cover-front-line"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-12">
          <Target className="text-primary mx-auto mb-6" size={64} />
          <h3 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            They're not featured in headlines. They don't have big donors backing them. But they've never stopped.
          </h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            That's why we created The Frontline Fund — to stand with African-led nonprofits who continue serving, not for recognition, but because their communities depend on them.
          </p>
          <p className="text-2xl font-bold text-primary mb-8">
            Join us. Stand with those who have stayed. Support The Frontline Fund, today.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TruthSection;