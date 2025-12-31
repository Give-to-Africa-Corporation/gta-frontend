import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    id: "item-1",
    question: "Is my donation tax-deductible?",
    answer:
      "Yes. Causes to YENDAA is a registered 501(c)(3) nonprofit organization. Your donation is tax-deductible to the extent allowed by law. You will receive an email receipt for your records.",
  },
  {
    id: "item-2",
    question: "How will my donation be used?",
    answer:
      "Your donation supports trusted, African-led causes doing critical work in their communities. Funds are used for programs, operations, and regranting to vetted grassroots organizations across Africa.",
  },
  {
    id: "item-3",
    question: "Can I choose which country or project to support?",
    answer:
      "Yes. You can direct your donation to a specific NGO, country, or cause on our donation form. If you don't select a preference, your donation will support the highest priority needs across our network.",
  },
  {
    id: "item-4",
    question: "Is this a secure donation?",
    answer:
      "Absolutely. All donations are processed through a secure, encrypted system. Your personal and financial information is protected and never shared.",
  },
  {
    id: "item-5",
    question: "Can I make a recurring donation?",
    answer:
      "Yes! You can choose to make a monthly gift to provide ongoing support. Recurring donations help sustain long-term impact in communities.",
  },
  {
    id: "item-6",
    question: "Can I donate in someone's honor or memory?",
    answer:
      "Yes. On our donation form, you can dedicate your gift and choose to notify the recipient with a personalized message.",
  },
  {
    id: "item-7",
    question: "Do you accept international donations?",
    answer:
      "Yes, we welcome donations from around the world. Our platform supports multiple currencies and payment methods.",
  },
  {
    id: "item-8",
    question: "What other ways can I give?",
    answer:
      "In addition to one-time and monthly donations, you can support us through donor-advised funds (DAFs), stock gifts, cryptocurrency, corporate matching, and legacy giving. Contact us at info@2africa.org for details.",
  },
  {
    id: "item-9",
    question: "How can I update or cancel my monthly donation?",
    answer:
      "You can manage your donation preferences anytime. Just email us at info@2africa.org and we'll be happy to assist.",
  },
  {
    id: "item-10",
    question: "Will I receive a receipt?",
    answer:
      "Yes. A donation receipt will be emailed to you immediately after your donation is processed. Year-end summaries are also available upon request.",
  },
];

const FAQSection = () => {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Find answers to common questions about donating and supporting our
            cause.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
