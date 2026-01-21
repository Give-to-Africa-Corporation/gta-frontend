import {
  Facebook,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
  Printer,
  Smile,
  CircleCheck,
  Gift
} from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <>
      <footer className="relative bg-gray-900 text-white" style={{
        backgroundImage:
          "url('/images/africanbg2.jpeg')", backgroundAttachment: 'fixed'
      }} >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2E3333]/95 via-[#2E3333]/100 to-[#2E3333]/100 z-0"></div>

        <section className="relative z-10 text-white py-20 flex justify-center flex-col items-center">
          <div className="text-center sm:w-[50%]">
            <h2 className="text-3xl font-bolder tracking-widest text-white uppercase mb-4">
              Easier giving. Greater good.
            </h2>
            <p className="text-2xl md:text-2xl font-light leading-snug text-white">
              YENDAA simplifies online giving for causes and donors in order to accelerate social impact around the world.
            </p>
          </div>
          <div className="container-custom grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
            {/* Card 1 */}
            <div className="p-6 text-center mb-2">
              <div className="flex gap-3 items-center justify-center mb-4 text-3xl text-brand-yellow">
                <Smile className="w-8 h-8" />
                <h3 className="text-3xl font-bold">Easy</h3>
              </div>
              <p className="text-md text-white">
                Modern fundraising made simple. Raise more by accepting all donation methods.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 text-center mb-2">
              <div className="flex gap-3 items-center justify-center mb-4 text-3xl text-brand-yellow">
                <Gift className="w-8 h-8" />
                <h3 className="text-3xl font-bold">Impactful</h3>
              </div>
              <p className="text-md text-white">
                Every dollar counts. No platform fees means more money goes directly to your cause.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 text-center mb-2">
              <div className="flex gap-3 items-center justify-center mb-4 text-3xl text-brand-yellow">
                <CircleCheck className="w-8 h-8" />
                <h3 className="text-3xl font-bold">Trusted</h3>
              </div>
              <p className="text-md text-white">
                Used by more than 6,000 causes for secure and reliable donation processing.
              </p>
            </div>
          </div>
        </section>
        <hr className="container-custom relative z-1 text-gray-800" /> 
        <div className="relative container-custom py-8 z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-white">
            {/* Column 1 - About */}
            <div>
              <h3 className="text-2xl font-bold mb-4">
                Causes to YENDAA
              </h3>
              <p className="text-gray-300 mb-4">
                YENDAA is a Public Benefit Corporation created by Give to Africa to drive innovation, sustainability, and impact.
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
                  <Link to="/" className="text-gray-300 hover:text-brand-purple">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/campaigns"
                    className="text-gray-300 hover:text-brand-purple"
                  >
                    Causes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/aboutus"  
                    className="text-gray-300 hover:text-brand-purple"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact" 
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
                    to="/faq" 
                    className="text-gray-300 hover:text-brand-purple"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacypolicy"
                    className="text-gray-300 hover:text-brand-purple"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/termsuse" 
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
                  <MapPin size={40} className="text-white" />
                  <span className="text-gray-300">
                    4240 Kearny Mesa Rd STE 120 San Diego, CA 92111 United States{" "}
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone size={20} className="text-white" />
                  <span className="text-gray-300">Call: 619-566-2004</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Printer size={20} className="text-white" />
                  <span className="text-gray-300">FAX: 858-327-3381 </span>
                </li>
              </ul>
            </div>
          </div>

          <div className=" border-gray-800 mt-10 pt-6 text-center text-gray-400 text-sm">
            <p>
              &copy; {new Date().getFullYear()} Causes to YENDAA. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};
