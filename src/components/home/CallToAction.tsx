import React from "react";

export const CallToAction: React.FC = () => {
  return (
    <div className="w-full bg-[#f4fbf7] py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* Left Section */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a1a44] leading-snug mb-3 hidden md:block">
            YENDAA <br /> The All-in-One Platform
          </h2>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a1a44] leading-snug mb-3 block md:hidden">
            YENDAA – The All-in-One Platform
          </h2>

          <p className="text-lg text-gray-700 mb-6">
            Discover, support, and volunteer with African-led projects — all in one place.
          </p>

          {/* Email Form (unchanged design) */}
          <div className="flex w-full max-w-md mx-auto md:mx-0">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-300"
            />
            <button className="bg-brand-orange text-white px-2 py-2 md:px-6 md:py-3 rounded-r-lg font-semibold shadow-md hover:bg-[#08153a] transition">
              Get Started Today
            </button>
          </div>
        </div>

        {/* Right Section - Illustration */}
        <div className="flex-1 flex justify-center hidden md:block">
          <img
            src="/images/cta123.png"
            alt="YENDAA"
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};
