import { ArrowRight, Circle } from "lucide-react";

export const MissionSection = () => {
  const keyPoints = [
    "Tax-deductible giving to African communities",
    "Transparent and accountable fund management",
    "Direct support to local grassroots organizations",
    "Sustainable and community-driven solutions",
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img
                // src="/images/3.jpg"
                src="/images/africa_hand.png"
                alt="Community meeting in Africa"
                className="w-full h-[500px] md:h-[600px] object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-brand-orange text-white p-8 rounded-lg shadow-lg hidden md:block">
              <p className="text-3xl font-bold">Since 2023</p>
              <p className="text-base">Making a difference</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-brand-purple/10 px-4 py-2 rounded-full text-brand-purple font-medium text-sm">
              Our Mission
            </div>

            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Bridging Continents, <br />
              <span className="text-brand-orange">Connecting Hearts</span>
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed">
              Connect generous donors with trusted local causes across
              Africa. We make cross-border giving easier, more transparent, and
              more impactful—so communities can thrive on their own terms. From
              education to the environment, we support locally led solutions
              through smart technology, strong partnerships, and a deep belief
              that lasting change starts within.
            </p>

            <ul className="space-y-3">
              {keyPoints.map((point, index) => (
                <li key={index} className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                    <Circle size={16} />
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <a
                href="https://www.2africa.org/aboutus"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-purple font-medium hover:text-brand-orange transition-colors inline-flex items-center gap-2"
              >
                Learn more about our story
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
