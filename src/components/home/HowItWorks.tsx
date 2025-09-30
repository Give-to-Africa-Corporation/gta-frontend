import React from "react";
import { UserPlus, Megaphone, Globe } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: <UserPlus size={40} className="text-brand-purple" />,
    title: "Sign Up",
    text: "Nonprofits apply and get verified.",
  },
  {
    id: 2,
    icon: <Megaphone size={40} className="text-brand-purple" />,
    title: "Launch Campaigns",
    text: "Start fundraising and post volunteer opportunities in minutes.",
  },
  {
    id: 3,
    icon: <Globe size={40} className="text-brand-purple" />,
    title: "Connect Globally",
    text: "Donors give. Volunteers serve. Communities thrive.",
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section className="bg-brand-purple py-16 px-4 md:px-6">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-wide text-white uppercase">
          How It Works
        </h2>
      </div>

      {/* Steps */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="bg-white rounded-xl shadow-lg p-8 text-center relative"
          >
            <div className="flex justify-center mb-4">{step.icon}</div>
            <h3 className="text-lg font-bold text-brand-purple mb-3">
              {step.id}. {step.title}
            </h3>
            <p className="text-gray-600">{step.text}</p>

            {/* Arrow between cards */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 right-[-30px] transform -translate-y-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-12 h-12 text-brand-orange"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 12h16m0 0l-6-6m6 6l-6 6"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
