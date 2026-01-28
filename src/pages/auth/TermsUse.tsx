import React from "react";
import { motion } from "framer-motion";
import { Footer } from "@/components/shared/Footer";

export default function TermsOfUse() {
  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-800">
      {/* HERO SECTION */}
      <section className="w-full bg-[#074C2D] text-white py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight"
          >
            Terms of Use
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mt-4 text-lg md:text-xl max-w-3xl mx-auto opacity-90"
          >
            Welcome to Yendaa. Please read these Terms of Use carefully before using our platform. By accessing Yendaa, you agree to comply with these rules.
          </motion.p>
        </div>
      </section>

                            <div
  className="relative min-h-[80vh] bg-fixed bg-center bg-cover"
  style={{
    backgroundImage:
      "url('https://cdn.pixabay.com/photo/2016/06/29/23/13/flag-1488013_1280.jpg')",
  }}
>
  {/* Blur & Dark Overlay */}
  <div className="absolute inset-0 bg-gray-900/60"></div>

      {/* CONTENT SECTION */}
      <div className="relative max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-white text-base md:text-lg"
        >
          <p className="mb-6">
            Yendaa is a platform created and operated by Give to Africa, a U.S. 501(c)(3) public charity. By using Yendaa or submitting information as a cause, donor, or volunteer, you agree to our Terms of Use and Privacy Policy.
          </p>
        </motion.div>

        {/* Terms Cards */}
        {[
          {
            title: "1. DEFINITIONS",
            content: (
              <ul className="list-disc ml-6 space-y-2 text-gray-700">
                <li><strong>Yendaa</strong> – Digital platform operated by Give to Africa.</li>
                <li><strong>Give to Africa</strong> – U.S. 501(c)(3) public charity.</li>
                <li><strong>Cause</strong> – Any listed nonprofit or community group.</li>
                <li><strong>Donor / Giver</strong> – Anyone donating through Yendaa.</li>
                <li><strong>Volunteer</strong> – Anyone offering skills/time to Causes.</li>
                <li><strong>User</strong> – Any visitor or participant on Yendaa.</li>
                <li><strong>Site</strong> – The Yendaa website and related pages.</li>
                <li><strong>User Content</strong> – Any info submitted by users.</li>
              </ul>
            ),
          },
          {
            title: "2. WHAT YENDAA DOES",
            content: <p>Yendaa provides tools for donors, volunteers, and verified Causes. Yendaa does NOT manage Causes or guarantee outcomes.</p>,
          },
          {
            title: "3. HOW DONATIONS WORK",
            content: <p>Donations go directly to Causes through secure payment partners. Yendaa does not hold or regrant funds.</p>,
          },
          {
            title: "4. REQUIREMENTS FOR CAUSES",
            content: <p>Causes must be real, transparent, and use funds ethically. Yendaa may pause or remove Causes.</p>,
          },
          {
            title: "5. FUNDRAISING RULES",
            content: <p>Donations must be used for genuine community impact. Personal or illegal use is strictly prohibited.</p>,
          },
          {
            title: "6. VOLUNTEERING",
            content: <p>All volunteer arrangements are directly between the Cause and volunteer. Yendaa is not responsible for disputes.</p>,
          },
          {
            title: "7. USER CONTENT",
            content: <p>You allow Yendaa to use submitted content. You remain responsible for it.</p>,
          },
          {
            title: "8. CODE OF CONDUCT",
            content: <p>Users must not post harmful, illegal, or abusive content. Violations may lead to removal.</p>,
          },
          {
            title: "9. INTELLECTUAL PROPERTY",
            content: <p>Yendaa branding and content cannot be copied or misused.</p>,
          },
          {
            title: "10. NO GUARANTEES",
            content: <p>Yendaa provides the platform “as is” with no guarantees of funding or activity.</p>,
          },
          {
            title: "11. LIMITATION OF LIABILITY",
            content: <p>Maximum liability for any issue is $100. Use the platform at your own risk.</p>,
          },
          {
            title: "12. INDEMNIFICATION",
            content: <p>You agree to hold Yendaa harmless for misuse or violations.</p>,
          },
          {
            title: "13. CHANGES TO TERMS",
            content: <p>We may update Terms anytime. Continued use means acceptance.</p>,
          },
          {
            title: "14. GOVERNING LAW",
            content: <p>These Terms follow California law.</p>,
          },
          {
            title: "15. CONTACT US",
            content: <p>Email: <a href="mailto:info@2africa.org" className="text-[#074C2D] font-semibold">info@2africa.org</a> | Partnerships: <a href="mailto:partners@2africa.org" className="text-[#074C2D] font-semibold">partners@2africa.org</a></p>,
          },
        ].map((term, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
          >
            <h2 className="text-xl md:text-2xl font-bold text-[#074C2D] mb-3">{term.title}</h2>
            <div className="text-gray-700">{term.content}</div>
          </motion.div>
        ))}

        {/* Checkbox Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 p-6 bg-[#F7FAFC] rounded-xl border border-gray-200 flex items-start space-x-3"
        >
          <span className="text-green-600 text-2xl mt-1">✔</span>
          <p className="text-gray-800 font-medium">
            <strong>Short version:</strong> I confirm that my cause is real, I will use donations only for charitable purposes, and I agree to Yendaa’s Terms of Use.
          </p>
        </motion.div>
      
      </div>
      </div>
        {/* FOOTER */}
        <Footer />
    </div>
  );
}
