import React from "react";
import { FaHandsHelping, FaDonate, FaGlobeAfrica, FaLightbulb } from "react-icons/fa";
import { Footer } from "@/components/shared/Footer";

const cards = [
  {
    title: "For Nonprofits",
    description: `Free, modern fundraising tools built for Africa.
Donation buttons, peer-to-peer pages, mobile-friendly giving, secure payments, and no platform fees.`,
    icon: <FaHandsHelping size={36} className="text-green-500 mb-4" />,
  },
  {
    title: "For Givers",
    description: `Donate to verified nonprofits, support schools, hospitals, women's groups, youth programs, and community projects. Receive instant tax-deductible receipts and manage recurring donations.`,
    icon: <FaDonate size={36} className="text-indigo-500 mb-4" />,
  },
  {
    title: "Trusted Across Africa",
    description: `YENDAA and Give to Africa have supported nonprofits in Education, Health, Food Security, Women's empowerment, Youth innovation, Community development, Faith-based programs.`,
    icon: <FaGlobeAfrica size={36} className="text-yellow-500 mb-4" />,
  },
  {
    title: "Our Values",
    description: `Generosity, Responsible Technology, Collaboration & Partnership — ethics, transparency, and long-term impact guide every decision.`,
    icon: <FaLightbulb size={36} className="text-purple-500 mb-4" />,
  },
];

const AboutUs = () => {
  return (
    <div className="bg-gray-50">
      {/* HERO SECTION */}
      <section
        className="text-white py-20 px-6 text-center"
        style={{ backgroundColor: "#074C2D" }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
        Easier giving. Greater impact.
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl opacity-90">
           YENDAA is the digital fundraising platform created by Give to Africa, a U.S. 501(c)(3) public charity dedicated to expanding generosity and strengthening nonprofits across Africa.
        </p>
      </section>

      {/* CARDS SECTION */}
      <section className="max-w-6xl mx-auto py-16 px-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer group"
          >
            <div className="flex justify-center">{card.icon}</div>
            <h3 className="text-xl font-semibold mb-3 text-center group-hover:text-indigo-600 transition duration-300">
              {card.title}
            </h3>
            <p className="text-gray-700 text-sm md:text-base text-center">{card.description}</p>
          </div>
        ))}
      </section>

      {/* JOIN US SECTION */}
      <section className="max-w-4xl mx-auto py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Join Us</h2>
        <p className="text-gray-700 max-w-3xl mx-auto">
          Together, we can build a continent where generosity flows freely, communities flourish, and every act of giving creates lasting change.
        </p>
      </section>
        {/* FOOTER */}
        <Footer />
    </div>
  );
};

export default AboutUs;
