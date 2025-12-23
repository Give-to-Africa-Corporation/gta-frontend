import { useState } from "react"; 
import { Footer } from "@/components/shared/Footer";

const faqItems = [
  {
    question: "What is the nonprofit status of Give to Africa?",
    answer:
      "Give to Africa is a registered 501(c)(3) public charity in the United States. All donations made through Yendaa or directly to Give to Africa are tax-deductible for U.S. donors.",
  },
  {
    question: "How is Yendaa funded?",
    answer: `Yendaa does not charge nonprofits any platform fees. The platform is sustained through:
- Philanthropic partners
- Optional donor tips
- Supporters who believe in expanding generosity across Africa

This allows us to keep Yendaa free for nonprofits and low-cost for donors.`,
  },
  {
    question: "Which nonprofits can I support on Yendaa?",
    answer: `You can support:
- NGOs
- Nonprofits (NPOs)
- Community-based organizations
- Schools
- Churches
- Women’s groups
- Youth programs
- Social enterprises with community impact
- Community development projects across Africa`,
  },
  {
    question: "How does making a donation on Yendaa work?",
    answer: `Donors can give through:
- Credit and debit cards
- Bank transfers (ACH)
- PayPal or Venmo
- Apple Pay / Google Pay`,
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* PAGE CONTENT */}
      <main className="flex-grow">
        {/* HERO SECTION */}
        <section
          className="py-24 px-6 text-center text-white"
          style={{ backgroundColor: "#8D9347" }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl opacity-90">
            Find answers to common questions from donors and nonprofits.
          </p>
        </section>

        {/* CATEGORY TILES */}
        <section className="max-w-4xl mx-auto mt-12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
            <div className="p-6 border rounded-xl shadow bg-white hover:bg-gray-50 transition">
              <h2 className="text-xl font-semibold">I’m a Nonprofit</h2>
              <p className="text-gray-600 mt-2">
                I want to connect with donors and fundraise.
              </p>
            </div>

            <div className="p-6 border rounded-xl shadow bg-white hover:bg-gray-50 transition">
              <h2 className="text-xl font-semibold">I’m a Giver</h2>
              <p className="text-gray-600 mt-2">
                I want to donate or support nonprofits.
              </p>
            </div>
          </div>
        </section>

        {/* PROMOTED ARTICLES */}
        <section className="max-w-4xl mx-auto mt-16 px-4">
          <h2 className="text-2xl font-bold mb-6">Promoted Articles</h2>
          <ul className="list-disc pl-6 text-indigo-700 space-y-2 font-medium">
            <li>What is the nonprofit status of Give to Africa?</li>
            <li>How is Yendaa funded and sustained?</li>
            <li>Which nonprofits can I support on Yendaa?</li>
            <li>How do donations on Yendaa work?</li>
          </ul>
        </section>

        {/* FAQ ACCORDION */}
        <section className="max-w-4xl mx-auto mt-16 px-4 mb-24">
          <h2 className="text-3xl font-bold mb-6">FAQ Section</h2>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border rounded-xl p-6 bg-white shadow">
                <button
                  onClick={() => toggle(index)}
                  className="flex justify-between w-full text-left text-lg font-medium"
                >
                  {item.question}
                  <span className="text-xl">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>

                {openIndex === index && (
                  <div className="mt-4 text-gray-700 leading-relaxed whitespace-pre-line">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Faq;
