import React from "react";
import { motion } from "framer-motion";
import { Footer } from "@/components/shared/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-800">

      {/* HERO - background color added (#8D9347) */}
      <section className="w-full bg-[#8D9347] text-white py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold"
          >
            Privacy Policy
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-4 text-lg max-w-2xl mx-auto opacity-90"
          >
            How we collect, use, and protect your information.
          </motion.p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-4xl mx-auto px-6 py-16 space-y-8">
        <section className="bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-3">Introduction</h2>
          <p className="leading-relaxed text-gray-700">
            At Yendaa, we care about protecting your privacy and your trust. This Privacy Policy explains how we collect,
            use, and protect information when you use our website, support a cause, sign up a cause, volunteer, or contact us.
            Yendaa is created and operated by Give to Africa, a U.S. 501(c)(3) public charity. By using our website you agree
            to this Privacy Policy. If you do not agree, please do not use the Site.
          </p>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-3">1. Who We Are</h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li><strong>Yendaa</strong> – The digital platform that helps people discover, donate to, and volunteer with African causes.</li>
            <li><strong>Give to Africa</strong> – The U.S. 501(c)(3) public charity that owns and operates Yendaa.</li>
            <li><strong>Site</strong> – The Yendaa website and any related pages or forms.</li>
            <li><strong>Cause</strong> – A school, church, nonprofit, NGO, NPO, association, foundation, or community group listed on Yendaa.</li>
            <li><strong>Donor</strong> – Anyone who donates to a Cause through Yendaa.</li>
            <li><strong>Volunteer</strong> – Anyone who offers time or skills through Yendaa.</li>
            <li><strong>User</strong> – Anyone who visits or uses the Site.</li>
            <li><strong>Personal Information</strong> – Any information that identifies you directly or indirectly.</li>
          </ul>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-3">2. What Information We Collect</h2>

          <h3 className="text-xl font-semibold mt-4">2.1 Information You Give Us Directly</h3>
          <p className="text-gray-700 leading-relaxed mt-2">
            When Causes sign up we may collect: name of the cause, type, country/city, primary contact, email, phone, website/social links,
            mission statement, photos/logos, and organizational bank account details (organization account, not personal).
          </p>

          <p className="text-gray-700 leading-relaxed mt-2">
            When Donors donate we may collect: name and email (if shared), donation amount, selected Cause, and country/region (if provided).
          </p>

          <p className="text-gray-700 leading-relaxed mt-2">
            When Volunteers express interest we may collect: name, email/phone, skills, interests, or message to the Cause. When you contact us we
            may collect your name, email, and any message content or attachments. We do not knowingly collect sensitive categories such as medical,
            political, or criminal history and ask you not to submit such data.
          </p>

          <h3 className="text-xl font-semibold mt-4">2.2 Payment Information</h3>
          <p className="text-gray-700 leading-relaxed mt-2">
            Payment details (card, bank, mobile money) are processed by third-party payment providers. Yendaa does not store full payment card or bank
            account details. We may receive limited transaction data such as amount, date/time, status, and a partial reference ID for reconciliation.
          </p>

          <h3 className="text-xl font-semibold mt-4">2.3 Information We Collect Automatically</h3>
          <p className="text-gray-700 leading-relaxed mt-2">
            When you visit the Site we automatically receive technical information such as IP address, browser type and version, device type,
            pages viewed and duration, and referring website. We may use cookies and similar technologies for site functionality and analytics.
          </p>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-3">3. How We Use Your Information</h2>

          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li><strong>To operate and improve Yendaa:</strong> Verify Causes, facilitate donations and volunteer features, display profiles, improve UX and performance, and analyze usage patterns.</li>
            <li><strong>To communicate with you:</strong> Respond to messages, send confirmations and notices, and notify about policy or system changes. Optional newsletters can be unsubscribed at any time.</li>
            <li><strong>To support Causes and donors:</strong> Share donor info with Causes only if donors choose to share; provide aggregated insights for Causes.</li>
            <li><strong>To comply with law and protect the platform:</strong> Prevent and investigate fraud, comply with legal obligations, and protect rights and safety.</li>
          </ul>

          <p className="text-gray-700 mt-3"><strong>Note:</strong> We do not sell your personal information.</p>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-3">4. When We Share Information</h2>

          <h3 className="text-lg font-semibold mt-2">4.1 With Causes (When You Choose to Share)</h3>
          <p className="text-gray-700 leading-relaxed mt-2">
            If you are a Donor or Volunteer and choose to share your details with a Cause, we may provide your name, email, donation details (amount, date, Cause),
            or volunteer message to that Cause. The Cause is then responsible for its use in line with local laws. If you opt for anonymous giving, we will honor it where possible.
          </p>

          <h3 className="text-lg font-semibold mt-4">4.2 With Service Providers</h3>
          <p className="text-gray-700 leading-relaxed mt-2">
            We may share limited information with payment processors, cloud hosts, email/messaging tools, analytics, and security providers. These parties are allowed to use your data only to provide services to Yendaa and must protect it.
          </p>

          <h3 className="text-lg font-semibold mt-4">4.3 For Legal & Safety Reasons</h3>
          <p className="text-gray-700 leading-relaxed mt-2">
            We may disclose information if required by law, court order, or to investigate/prevent fraud, abuse, or imminent harm.
          </p>

          <h3 className="text-lg font-semibold mt-4">4.4 Structural or Organizational Change</h3>
          <p className="text-gray-700 leading-relaxed mt-2">
            If Give to Africa or Yendaa is reorganized, your information may be transferred as part of the assets. We will seek to ensure your data remains protected under similar standards.
          </p>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-3">5. Donations & Transaction Data</h2>
          <p className="text-gray-700 leading-relaxed">
            Donations are made directly to Causes through our payment partners. Yendaa receives transactional metadata (amount, date, status) but not full payment details.
            We may store donation history for reporting, transparency, and troubleshooting. Donations to Give to Africa itself are retained as required for accounting and tax purposes.
          </p>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-3">6. Cookies & Analytics</h2>

          <h3 className="text-lg font-semibold mt-2">6.1 Cookies</h3>
          <p className="text-gray-700 leading-relaxed mt-2">
            Cookies are small text files placed on your device used to make the Site function, remember preferences, and understand usage. Some cookies are necessary for core functionality;
            others are used for analytics. You can control cookies via your browser settings, but disabling some cookies may affect site features.
          </p>

          <h3 className="text-lg font-semibold mt-4">6.2 Analytics</h3>
          <p className="text-gray-700 leading-relaxed mt-2">
            We may use services like Google Analytics or similar to analyze traffic and improve the Site. These services may set their own cookies and collect anonymized or pseudonymized data.
          </p>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-3">7. Links to Other Sites</h2>
          <p className="text-gray-700 leading-relaxed">
            Yendaa may link to external websites, including Causes’ sites or partner pages. We do not control third-party sites and this Privacy Policy does not apply to them.
            We encourage you to review their privacy practices before sharing personal information.
          </p>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-3">8. Children’s Privacy</h2>
          <p className="text-gray-700 leading-relaxed">
            Yendaa is not intended for children under 16. We do not knowingly collect information from children under 16. If we learn that such data was submitted, we will promptly delete it.
            If you believe a child has shared information, contact us at <strong>privacy@2africa.org</strong>.
          </p>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-3">9. Security</h2>
          <p className="text-gray-700 leading-relaxed">
            We use reasonable measures such as HTTPS encryption, restricted access, and reputable third-party services to protect data. However, no system is fully secure; we cannot guarantee absolute protection.
            In case of a serious data incident, we will take appropriate steps including notifications as required by law.
          </p>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-3">10. Data Retention</h2>
          <p className="text-gray-700 leading-relaxed">
            We retain personal information as long as necessary to operate the Site, fulfill legal or accounting obligations, or as otherwise required. When no longer needed, data will be deleted or anonymized.
          </p>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-3">11. Your Rights & Choices</h2>
          <p className="text-gray-700 leading-relaxed">
            Depending on your jurisdiction, you may have rights to access, correct, delete, restrict, or object to processing of your personal information.
            To exercise these rights, email <strong>privacy@2africa.org</strong> with your name, email, and a clear description of your request. We may require identity verification.
          </p>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-3">12. International Users</h2>
          <p className="text-gray-700 leading-relaxed">
            Yendaa is operated from the United States and serves users globally. By using the Site you consent to data transfer, storage, and processing in the United States or other countries with different data protection laws.
            We take reasonable steps to ensure your data is handled consistently with this Policy.
          </p>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-3">13. Changes to This Privacy Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time. When material changes occur we will update the “Last updated” date and may post a notice on the Site.
            Continued use of the Site after updates constitutes acceptance of the revised Policy.
          </p>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-3">14. Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            For questions, concerns, or requests about this Privacy Policy or how we handle data, please contact:
            <br />
            <strong>Yendaa / Give to Africa</strong>
            <br />
            General inquiries: <a href="mailto:info@2africa.org" className="text-indigo-600">info@2africa.org</a>
          </p>
        </section>

        <div className="mt-6 p-4 bg-white rounded-xl border">
          <strong>Short checkbox text for signup form:</strong>
          <p className="mt-2 text-gray-700">
            “I confirm that my cause is real, I will use donations only for charitable purposes, and I agree to Yendaa’s Privacy Policy.”
          </p>
        </div>
      </main>
        {/* FOOTER */}
        <Footer />
    </div>
  );
}
