import React from "react";

export const NewTestimonialsSection: React.FC = () => {
  return (
    <div className="w-full bg-white py-12 px-4 md:px-6">
      {/* Heading */}
      <h2 className="text-center text-2xl md:text-3xl font-bold text-[#065f46] tracking-wide mb-10">
        What People Are Saying
      </h2>

      {/* Testimonials Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Card 1 */}
        <div className="bg-[#dcfce7] rounded-2xl shadow-sm p-6 flex flex-col justify-between">
          <p className="text-[#0a1a44] italic text-lg leading-relaxed mb-6">
           “YENDAA helped us raise funds and find volunteers from across the world.”
          </p>
          <div className="bg-white border border-[#d4f1d4] rounded-xl px-4 py-3 mt-auto">
            <p className="font-semibold text-[#0a1a44]">NGO Partner</p>
            {/* <p className="text-sm text-gray-700">
              Direction of Development Operations, <br /> The Legal Aid Society
            </p> */}
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#dcfce7] rounded-2xl shadow-sm p-6 flex flex-col justify-between">
          <p className="text-[#0a1a44] italic text-lg leading-relaxed mb-6">
          I can donate and volunteer with causes I truly believe in — all in one platform.
          </p>
          <div className="bg-white border border-[#d4f1d4] rounded-xl px-4 py-3 mt-auto">
            <p className="font-semibold text-[#0a1a44]">Donor & Volunteer</p>
            {/* <p className="text-sm text-gray-700">
              Managing Director, <br /> 2nd Story
            </p> */}
          </div>
        </div>

        {/* Card 3 (NEW) */}
        <div className="bg-[#dcfce7] rounded-2xl shadow-sm p-6 flex flex-col justify-between">
          <p className="text-[#0a1a44] italic text-lg leading-relaxed mb-6">
            “With YENDAA, we reached more people in just weeks than we could in years on our own.”
          </p>
          <div className="bg-white border border-[#d4f1d4] rounded-xl px-4 py-3 mt-auto">
            <p className="font-semibold text-[#0a1a44]">Community Leader</p>
          </div>
        </div>
      </div>
    </div>
  );
};
