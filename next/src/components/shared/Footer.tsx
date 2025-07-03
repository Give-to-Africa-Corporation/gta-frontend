import {
  Facebook,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
  Printer,
} from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1 - About */}
          <div>
            <h3 className="text-2xl font-bold text-primary-light mb-4">
              Give to Africa Corporation
            </h3>
            <p className="text-gray-300 mb-4">
              Give to Africa (EIN 33-1917403) is a 501(C)(3) public charity
              based in California. The full amount of your gift qualifies as a
              charitable contribution for federal tax purposes in the United
              States.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://2africa.org/"
                target="_blank"
                className="text-gray-300 hover:text-brand-purple"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/give2africa/"
                target="_blank"
                className="text-gray-300 hover:text-brand-purple"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.linkedin.com/company/give-to-africa/"
                target="_blank"
                className="text-gray-300 hover:text-brand-purple"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-brand-purple">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/campaigns"
                  className="text-gray-300 hover:text-brand-purple"
                >
                  Campaigns
                </Link>
              </li>
              <li>
                <Link
                  href="https://2africa.org/about-us/"
                  target="_blank"
                  className="text-gray-300 hover:text-brand-purple"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="https://2africa.org/contact/"
                  target="_blank"
                  className="text-gray-300 hover:text-brand-purple"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Resources */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://2africa.org/international-giving-donor-faq/"
                  target="_blank"
                  className="text-gray-300 hover:text-brand-purple"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-300 hover:text-brand-purple"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="https://2africa.org/terms-of-use/"
                  target="_blank"
                  className="text-gray-300 hover:text-brand-purple"
                >
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin size={40} className="text-brand-orange" />
                <span className="text-gray-300">
                  4240 Kearny Mesa Rd STE 120 San Diego, CA 92111 United States{" "}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-brand-purple" />
                <span className="text-gray-300">Call: 619-566-2004</span>
              </li>
              <li className="flex items-center space-x-3">
                <Printer size={20} className="text-brand-purple" />
                <span className="text-gray-300">FAX: 858-327-3381 </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Give to Africa. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
