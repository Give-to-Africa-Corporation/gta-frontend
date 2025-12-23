// components/Solution.tsx
import React from "react";

export const SolutionSection: React.FC = () => {
  return (
    <section className="w-full bg-brand-purple py-16 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute -left-20 top-20 w-40 h-40 rounded-full bg-brand-yellow/20 blur-3xl"></div>
      <div className="absolute -right-20 bottom-20 w-48 h-48 rounded-full bg-brand-orange/20 blur-3xl"></div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center px-6 gap-12 relative z-10">
        {/* Left Side - Text */}
        <div className="flex-1 text-white">
          <h4 className="text-sm uppercase tracking-widest text-brand-yellow mb-4">
            The Solution
          </h4>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            A simple, secure, <br /> Africa-centered platform.
          </h2>
          <p className="text-white/70 mb-6">
            With YENDAA, causes can:
          </p>
          <ul className="space-y-3 text-lg">
            <li className="flex items-start gap-2">
              <span className="text-brand-orange">●</span>
              Raise funds directly on their campaign page
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-orange">●</span>
              Recruit and manage volunteers globally
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-orange">●</span>
              Build trust with impact updates
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-orange">●</span>
              Access tools and training to grow their mission
            </li>
          </ul>
        </div>

        {/* Right Side - Image */}
        <div className="flex-1 relative flex justify-center">
          <img
            src="/images/solution-demo1.png"
            alt="Solution demo"
            className="rounded-xl shadow-2xl w-[700px] h-auto border border-white/20 transition-transform duration-700 hover:scale-[1.02]"
          />
        </div>
      </div>
    </section>
  );
};
