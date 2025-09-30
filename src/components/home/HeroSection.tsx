// import { useEffect, useState } from "react";

// export const HeroSection = () => {
//   // Animation states
//   const [isLoaded, setIsLoaded] = useState(false);

//   // Set loaded state after component mounts for animations
//   useEffect(() => {
//     setIsLoaded(true);
//   }, []);

//   return (
//     <section className="relative bg-brand-purple text-white overflow-hidden">
//       {/* Background gradient overlay */}
//       <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-purple-darker opacity-30"></div>

//       {/* Animated decorative elements */}
//       <div
//         className={`absolute left-20 top-20 w-32 h-32 rounded-full bg-brand-yellow/30 blur-xl transition-all duration-1000 ease-out ${
//           isLoaded ? "opacity-60" : "opacity-0 translate-y-10"
//         }`}
//         style={{ animationDelay: "0.3s" }}
//       ></div>
//       <div
//         className={`absolute right-40 bottom-40 w-40 h-40 rounded-full bg-brand-orange/20 blur-xl transition-all duration-1000 ease-out ${
//           isLoaded ? "opacity-60" : "opacity-0 translate-y-10"
//         }`}
//         style={{ animationDelay: "0.5s" }}
//       ></div>

//       <div className="container-custom relative">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center py-16 lg:py-24">
//           {/* Text Content with Animation */}
//           <div className="text-left space-y-6 z-10">
//             <h1
//               className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight transition-all duration-700 ${
//                 isLoaded ? "opacity-100" : "opacity-0 translate-y-4"
//               }`}
//             >
//               Transform Lives <br />
//               <span className="text-brand-orange">Across Africa</span>
//             </h1>

//             <p
//               className={`text-lg md:text-xl max-w-xl leading-relaxed text-white/90 transition-all duration-700 delay-200 ${
//                 isLoaded ? "opacity-100" : "opacity-0 translate-y-4"
//               }`}
//             >
//               Join us in creating sustainable solutions and empowering
//               communities through tax-deductible giving that makes a real
//               difference.
//             </p>
//           </div>

//           <div
//             className={`relative h-[580px] hidden lg:block transition-all duration-1000 ${
//               isLoaded ? "opacity-100" : "opacity-0 translate-y-10"
//             }`}
//           >
//             {/* Main hero image - increased size */}
//             <div
//               className="absolute right-0 top-12 w-[580px] h-auto rounded-lg overflow-hidden shadow-2xl z-10 
//               transition-transform duration-700 hover:scale-[1.02] hover:shadow-xl"
//             >
//               <img
//                 // src="/images/5.jpg"
//                 src="/images/face.png"
//                 alt="African children smiling"
//                 className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Animated wave divider */}
//       <div
//         className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 delay-500 ${
//           isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
//         }`}
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 1440 100"
//           fill="#ffffff"
//           preserveAspectRatio="none"
//           className="w-full h-[60px]"
//         >
//           <path d="M0,0 C150,90 350,80 500,60 C650,40 750,10 900,30 C1050,50 1300,90 1440,80 L1440,100 L0,100 Z"></path>
//         </svg>
//       </div>
//     </section>
//   );
// };









// import { Link } from "react-router-dom";

// export const HeroSection = () => {
//   return (
//     <section className="relative bg-brand-purple text-white overflow-hidden py-16 pt-8">
//       {/* Background gradient overlay */}
//       <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-purple-darker opacity-30"></div>

//       <div className="container-custom relative z-10">
//         {/* Top link */}
//         <div className="text-center mb-4">
//           <a
//             href="#"
//             className="text-sm text-brand-yellow underline hover:text-brand-orange"
//           >
//             Raise more with our Free Fundraising Email Coach. Click here to try it out →
//           </a>
//         </div>

//         {/* Bold text */}
//         <div className="text-center text-brand-yellow font-semibold uppercase mb-2">
//           Built for Nonprofits
//         </div>

//         {/* Heading */}
//         <h1 className="text-center text-4xl md:text-5xl font-bold leading-tight mb-3">
//           All-in-One <br />{" "}
//           <span className="text-brand-orange">Digital Fundraising</span>
//         </h1>

//         {/* Subtext */}
//         <p className="text-center text-white/80 max-w-2xl mx-auto mb-6">
//           Discover and cultivate new donor relationships with the click of a button
//         </p>

//         {/* Button */}
//         <div className="text-center mb-10">
//           <Link
//             to="#"
//             className="px-6 py-3 bg-brand-orange text-white font-semibold rounded-md shadow hover:bg-brand-yellow transition"
//           >
//             Get Started
//           </Link>
//         </div>

//         {/* Image */}
//         <div className="flex justify-center">
//           <img
//             src="/images/dashbordimg.png" 
//             alt="Dashboard Preview"
//             className="rounded-lg shadow-2xl border border-white/20"
//           />
//         </div>
//       </div>

//       {/* Bottom wave divider (optional to match style) */}
//       <div className="absolute bottom-0 left-0 right-0">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 1440 100"
//           fill="#ffffff"
//           preserveAspectRatio="none"
//           className="w-full h-[60px]"
//         >
//           <path d="M0,0 C150,90 350,80 500,60 C650,40 750,10 900,30 C1050,50 1300,90 1440,80 L1440,100 L0,100 Z"></path>
//         </svg>
//       </div>
//     </section>
//   );
// };




import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  // Animation states
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative bg-brand-purple text-white overflow-hidden pt-8 pb-16">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-purple-darker opacity-30"></div>

      {/* Animated decorative elements */}
      <div
        className={`absolute left-20 top-20 w-32 h-32 rounded-full bg-brand-yellow/30 blur-xl transition-all duration-1000 ease-out ${
          isLoaded ? "opacity-60" : "opacity-0 translate-y-10"
        }`}
        style={{ animationDelay: "0.3s" }}
      ></div>
      <div
        className={`absolute right-40 bottom-40 w-40 h-40 rounded-full bg-brand-orange/20 blur-xl transition-all duration-1000 ease-out ${
          isLoaded ? "opacity-60" : "opacity-0 translate-y-10"
        }`}
        style={{ animationDelay: "0.5s" }}
      ></div>

      <div className="container-custom relative z-10">
        {/* Top link */}
        <div
          className={`text-center mb-4 transition-all duration-700 ${
            isLoaded ? "opacity-100" : "opacity-0 translate-y-3"
          }`}
        >
          <a
            href="/frontline-fund"
            className="text-sm text-brand-yellow underline hover:text-brand-orange"
          >
            Discover, support, and volunteer with African-led projects →
          </a>
        </div>

        {/* Bold text */}
        <div
          className={`text-center text-brand-yellow font-semibold uppercase mb-2 transition-all duration-700 delay-150 ${
            isLoaded ? "opacity-100" : "opacity-0 translate-y-3"
          }`}
        >
          Raising Africa
        </div>

        {/* Heading */}
        <h1
          className={`text-center text-4xl md:text-5xl font-bold leading-tight mb-3 transition-all duration-700 delay-200 ${
            isLoaded ? "opacity-100" : "opacity-0 translate-y-3"
          }`}
        >
          The All-in-One <br />{" "}
          <span className="text-brand-orange">
            Fundraising & Volunteer Platform
          </span>
        </h1>

        {/* Subtext */}
        <p
          className={`text-center text-white/80 max-w-2xl mx-auto mb-6 transition-all duration-700 delay-300 ${
            isLoaded ? "opacity-100" : "opacity-0 translate-y-3"
          }`}
        >
          Built for African nonprofits to raise funds, recruit volunteers, and
          grow impact — all in one place.
        </p>

        {/* Buttons */}
        {/* <div
          className={`flex justify-center gap-4 mb-10 transition-all duration-700 delay-400 ${
            isLoaded ? "opacity-100" : "opacity-0 translate-y-3"
          }`}
        >
          <Link
            to="/signup"
            className="px-6 py-3 bg-brand-orange text-white font-semibold rounded-md shadow hover:bg-brand-yellow transition"
          >
            Start a Campaign
          </Link>
          <Link
            to="/campaigns"
            className="px-6 py-3 bg-white text-brand-purple font-semibold rounded-md shadow hover:bg-gray-100 transition"
          >
            Find a Cause
          </Link>
        </div> */}


               <div
            className={`flex flex-col sm:flex-row justify-center gap-4 mb-10 transition-all duration-700 delay-400 ${
              isLoaded ? "opacity-100" : "opacity-0 translate-y-3"
            }`}
          >
            <Link
              to="/signup"
              className="w-full sm:w-auto text-center px-6 py-3 bg-brand-orange text-white font-semibold rounded-md shadow hover:bg-brand-yellow transition"
            >
              Start a Campaign
            </Link>
            <Link
              to="/campaigns"
              className="w-full sm:w-auto text-center px-6 py-3 bg-white text-brand-purple font-semibold rounded-md shadow hover:bg-gray-100 transition"
            >
              Find a Cause
            </Link>
          </div>

        {/* Image */}
        <div
          className={`flex justify-center transition-all duration-1000 delay-500 ${
            isLoaded ? "opacity-100" : "opacity-0 translate-y-5"
          }`}
        >
          <img
            src="/images/dashbordimg.png"
            alt="Raising Africa Dashboard Preview"
            className="rounded-lg shadow-2xl border border-white/20 transition-transform duration-700 hover:scale-[1.02]"
          />
        </div>
      </div>

      {/* Animated wave divider */}
      <div
        className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 delay-700 ${
          isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 100"
          fill="#ffffff"
          preserveAspectRatio="none"
          className="w-full h-[60px]"
        >
          <path d="M0,0 C150,90 350,80 500,60 C650,40 750,10 900,30 C1050,50 1300,90 1440,80 L1440,100 L0,100 Z"></path>
        </svg>
      </div>
    </section>
  );
};
