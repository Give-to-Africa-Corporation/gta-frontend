import React from "react";

export const feature = [
  {
    title: "ON-PAGE GIVING",
    text: "Seamless and secure donations directly on campaign pages without redirects — making giving faster, easier, and trustworthy for supporters worldwide.",
    img: "/images/kf2.png",
  },
  {
    title: "VOLUNTEER RECRUITMENT",
    text: "Post volunteer opportunities and connect with global supporters who are ready to contribute skills, time, and energy to your mission.",
    img: "/images/kf1.png",
  },
  {
    title: "SMART DASHBOARD",
    text: "Track donations, manage volunteers, and monitor campaigns in one simple dashboard — helping nonprofits stay organized and efficient.",
    img: "/images/kf3.png",
  },
  {
    title: "TEAM MANAGEMENT",
    text: "Add up to 2 admins to manage your nonprofit, assign roles, or disable inactive users with ease — making teamwork simple and effective.",
    img: "/images/kf4.png",
  },
  {
    title: "AI TOOLS & SECURE DATA",
    text: "Use AI-powered outreach to engage donors and volunteers, while keeping all supporter data private, encrypted, and compliant with global standards.",
    img: "/images/kf5.png",
  },
];

export const KeyFeatures: React.FC = () => {
  return (
    <section className="bg-[#f8f9fb] px-4 md:px-6 py-16">
      {/* Heading */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#065f46] tracking-wide uppercase">
          Key Features
        </h2>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Feature 1 (Full Width on Top) */}
        <div className="bg-[#dcfce7] shadow-md p-10 rounded-lg flex flex-col items-center text-center md:flex-row md:text-left justify-between col-span-1 md:col-span-2">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <img className="w-full md:max-w-[280px] md:max-h-[200px]"
            src={feature[0].img} alt={feature[0].title} />
          </div>
          <div className="w-full md:w-2/3 md:pl-8">
            <h3 className="text-xl md:text-2xl font-bold uppercase text-[#065f46] mb-4">
              {feature[0].title}
            </h3>
            <p className="text-lg md:text-xl text-[#374151] leading-relaxed">
              {feature[0].text}
            </p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="bg-[#dcfce7] shadow-md p-10 rounded-lg flex flex-col items-center text-center">
          <img
            src={feature[1].img}
            alt={feature[1].title}
            className="w-full md:max-w-[280px] mb-6"
          />
          <h3 className="text-xl md:text-2xl font-bold uppercase text-[#065f46] mb-4">
            {feature[1].title}
          </h3>
          <p className="text-lg md:text-xl text-[#374151] leading-relaxed">
            {feature[1].text}
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-[#dcfce7] shadow-md p-10 rounded-lg flex flex-col items-center text-center">
          <img
            src={feature[2].img}
            alt={feature[2].title}
             className="w-full md:max-w-[280px] mb-6"
          />
          <h3 className="text-xl md:text-2xl font-bold uppercase text-[#065f46] mb-4">
            {feature[2].title}
          </h3>
          <p className="text-lg md:text-xl text-[#374151] leading-relaxed">
            {feature[2].text}
          </p>
        </div>

        {/* Feature 4 (Full Width) */}
        <div className="bg-[#dcfce7] shadow-md p-10 rounded-lg flex flex-col items-center text-center md:flex-row md:text-left justify-between col-span-1 md:col-span-2">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <img
            className="w-full md:max-w-[280px] md:max-h-[200px]" src={feature[3].img} alt={feature[3].title} />
          </div>
          <div className="w-full md:w-2/3 md:pl-8">
            <h3 className="text-xl md:text-2xl font-bold uppercase text-[#065f46] mb-4">
              {feature[3].title}
            </h3>
            <p className="text-lg md:text-xl text-[#374151] leading-relaxed">
              {feature[3].text}
            </p>
          </div>
        </div>

        {/* Feature 5 (Full Width) */}
        <div className="bg-[#dcfce7] shadow-md p-10 rounded-lg flex flex-col items-center text-center md:flex-row md:text-left justify-between col-span-1 md:col-span-2">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <img 
            className="w-full md:max-w-[280px] md:max-h-[200px]" src={feature[4].img} alt={feature[4].title} />
          </div>
          <div className="w-full md:w-2/3 md:pl-8">
            <h3 className="text-xl md:text-2xl font-bold uppercase text-[#065f46] mb-4">
              {feature[4].title}
            </h3>
            <p className="text-lg md:text-xl text-[#374151] leading-relaxed">
              {feature[4].text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
