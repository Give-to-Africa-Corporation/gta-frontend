// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// export const HeroSection = () => {
//   // Animation states
//   const [isLoaded, setIsLoaded] = useState(false);

//   useEffect(() => {
//     setIsLoaded(true);
//   }, []);

//   return (
//     <section className="relative bg-brand-purple text-white overflow-hidden pt-8 pb-16">
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

//       <div className="container-custom relative z-10">
//         {/* Top link */}
//         <div
//           className={`text-center mb-4 transition-all duration-700 ${
//             isLoaded ? "opacity-100" : "opacity-0 translate-y-3"
//           }`}
//         >
//           <a
//             href="/frontline-fund"
//             className="text-sm text-brand-yellow underline hover:text-brand-orange"
//           >
//             Discover, support, and volunteer with African-led projects →
//           </a>
//         </div>

//         {/* Bold text */}
//         <div
//           className={`text-center text-brand-yellow font-semibold uppercase mb-2 transition-all duration-700 delay-150 ${
//             isLoaded ? "opacity-100" : "opacity-0 translate-y-3"
//           }`}
//         >
//           Raising Africa
//         </div>

//         {/* Heading */}
//         <h1
//           className={`text-center text-4xl md:text-5xl font-bold leading-tight mb-3 transition-all duration-700 delay-200 ${
//             isLoaded ? "opacity-100" : "opacity-0 translate-y-3"
//           }`}
//         >
//           The All-in-One <br />{" "}
//           <span className="text-brand-orange">
//             Fundraising & Volunteer Platform
//           </span>
//         </h1>

//         {/* Subtext */}
//         <p
//           className={`text-center text-white/80 max-w-2xl mx-auto mb-6 transition-all duration-700 delay-300 ${
//             isLoaded ? "opacity-100" : "opacity-0 translate-y-3"
//           }`}
//         >
//           Built for African causes to raise funds, recruit volunteers, and
//           grow impact — all in one place.
//         </p>

//         {/* Buttons */}
//         {/* <div
//           className={`flex justify-center gap-4 mb-10 transition-all duration-700 delay-400 ${
//             isLoaded ? "opacity-100" : "opacity-0 translate-y-3"
//           }`}
//         >
//           <Link
//             to="/signup"
//             className="px-6 py-3 bg-brand-orange text-white font-semibold rounded-md shadow hover:bg-brand-yellow transition"
//           >
//             Start a Campaign
//           </Link>
//           <Link
//             to="/campaigns"
//             className="px-6 py-3 bg-white text-brand-purple font-semibold rounded-md shadow hover:bg-gray-100 transition"
//           >
//             Find a Cause
//           </Link>
//         </div> */}

//                <div
//             className={`flex flex-col sm:flex-row justify-center gap-4 mb-10 transition-all duration-700 delay-400 ${
//               isLoaded ? "opacity-100" : "opacity-0 translate-y-3"
//             }`}
//           >
//             <Link
//               to="/signup"
//               className="w-full sm:w-auto text-center px-6 py-3 bg-brand-orange text-white font-semibold rounded-md shadow hover:bg-brand-yellow transition"
//             >
//               Start a Campaign
//             </Link>
//             <Link
//               to="/campaigns"
//               className="w-full sm:w-auto text-center px-6 py-3 bg-white text-brand-purple font-semibold rounded-md shadow hover:bg-gray-100 transition"
//             >
//               Find a Cause
//             </Link>
//           </div>

//         {/* Image */}
//         <div
//           className={`flex justify-center transition-all duration-1000 delay-500 ${
//             isLoaded ? "opacity-100" : "opacity-0 translate-y-5"
//           }`}
//         >
//           <img
//             src="/images/dashbordimg.png"
//             alt="Raising Africa Dashboard Preview"
//             className="rounded-lg shadow-2xl border border-white/20 transition-transform duration-700 hover:scale-[1.02]"
//           />
//         </div>
//       </div>

//       {/* Animated wave divider */}
//       <div
//         className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 delay-700 ${
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

import React from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="relative md:min-h-[calc(100vh-92px)] min-h-[calc(100vh-150px)] w-full bg-gray-900 flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: "url('/images/africanbg.jpeg')",
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      {/* Center Card */}
      <div className="relative bg-white rounded-3xl shadow-lg max-w-4xl w-[90%] p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center items-start justify-between gap-2">
          <div className="flex-[0.9] text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              Easier giving. <br /> Greater good.
            </h1>
            <p className="text-lg text-primary font-semibold mt-2">
              Made for Africa — where faith, innovation, and generosity move
              forward together.
            </p>
          </div>
          <div className="flex-[1.1] w-full flex flex-col gap-3 mt-6 sm:mt-0">
            <Link to="/signup">
              <button className="group flex items-center justify-between border-2 border-brand-purple rounded-3xl p-3 transition-all duration-300 ease-in-out">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 sm:w-20 sm:h-20 flex-shrink-0">
                    <svg
                      viewBox="0 0 88 88"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g
                        id="for_donors_advanced"
                        clip-path="url(#clip0_2738_16281)"
                      >
                        <g id="Donor">
                          <g id="Vector">
                            <path
                              d="M44 88C68.3005 88 88 68.3005 88 44C88 19.6995 68.3005 0 44 0C19.6995 0 0 19.6995 0 44C0 68.3005 19.6995 88 44 88Z"
                              fill="white"
                            ></path>
                            <path
                              d="M44 88C68.3005 88 88 68.3005 88 44C88 19.6995 68.3005 0 44 0C19.6995 0 0 19.6995 0 44C0 68.3005 19.6995 88 44 88Z"
                              fill="url(#paint0_radial_2738_16281)"
                              fill-opacity="0.4"
                            >
                              <animate
                                className="forwards"
                                attributeName="fill-opacity"
                                values="0.4;0.6"
                                begin="0s"
                                dur="0.3s"
                                repeatCount="1"
                                fill="freeze"
                                calcMode="linear"
                                keyTimes="0;1"
                              ></animate>
                              <animate
                                className="backwards"
                                attributeName="fill-opacity"
                                values="0.6;0.4"
                                begin="0s"
                                dur="0.3s"
                                repeatCount="1"
                                fill="freeze"
                                calcMode="linear"
                                keyTimes="0;1"
                              ></animate>
                            </path>
                          </g>
                          <g id="Group">
                            <rect
                              id="Rectangle 72"
                              x="27.1336"
                              y="55"
                              width="33.7333"
                              height="16.8667"
                              fill="#074C2D"
                            ></rect>
                            <path
                              id="Rectangle 71"
                              d="M24.2 66.0005C24.2 61.4336 24.2 59.1501 24.8155 57.3064C26.0064 53.7394 28.8056 50.9402 32.3726 49.7493C34.2163 49.1338 36.4998 49.1338 41.0667 49.1338H46.9333C51.5002 49.1338 53.7837 49.1338 55.6273 49.7493C59.1944 50.9402 61.9936 53.7394 63.1845 57.3064C63.8 59.1501 63.8 61.4336 63.8 66.0005V66.0005H24.2V66.0005Z"
                              fill="#074C2D"
                            >
                              <animate
                                className="forwards"
                                attributeName="fill"
                                values="#074C2D;#074C2D"
                                begin="0s"
                                dur="0.3s"
                                repeatCount="1"
                                fill="freeze"
                                calcMode="linear"
                                keyTimes="0;1"
                              ></animate>
                              <animate
                                className="backwards"
                                attributeName="fill"
                                values="#074C2D;#074C2D"
                                begin="0s"
                                dur="0.3s"
                                repeatCount="1"
                                fill="freeze"
                                calcMode="linear"
                                keyTimes="0;1"
                              ></animate>
                            </path>
                          </g>
                          <path
                            id="Vector_2"
                            d="M44 46.9334C40.5191 46.9334 37.1163 45.9012 34.222 43.9673C31.3277 42.0334 29.0718 39.2846 27.7397 36.0686C26.4076 32.8527 26.0591 29.3139 26.7382 25.8998C27.4173 22.4857 29.0935 19.3497 31.5549 16.8883C34.0163 14.4269 37.1524 12.7507 40.5664 12.0716C43.9805 11.3925 47.5193 11.741 50.7352 13.0731C53.9512 14.4052 56.7 16.6611 58.6339 19.5554C60.5678 22.4497 61.6 25.8525 61.6 29.3334C61.5939 33.9993 59.7376 38.4724 56.4383 41.7717C53.139 45.071 48.6659 46.9273 44 46.9334L44 46.9334Z"
                            fill="url(#paint1_linear_2738_16281)"
                          >
                            <animate
                              className="forwards"
                              attributeName="d"
                              values="M44 46.9334C40.5191 46.9334 37.1163 45.9012 34.222 43.9673C31.3277 42.0334 29.0718 39.2846 27.7397 36.0686C26.4076 32.8527 26.0591 29.3139 26.7382 25.8998C27.4173 22.4857 29.0935 19.3497 31.5549 16.8883C34.0163 14.4269 37.1524 12.7507 40.5664 12.0716C43.9805 11.3925 47.5193 11.741 50.7352 13.0731C53.9512 14.4052 56.7 16.6611 58.6339 19.5554C60.5678 22.4497 61.6 25.8525 61.6 29.3334C61.5939 33.9993 59.7376 38.4724 56.4383 41.7717C53.139 45.071 48.6659 46.9273 44 46.9334L44 46.9334Z;M44 46.9334C40.519 46.9334 37.1163 45.9012 34.222 43.9673C31.3277 42.0334 29.0718 39.2846 27.7397 36.0686C26.4076 32.8527 26.0591 29.3139 26.7382 25.8998C27.4173 22.4857 29.0935 19.3497 31.5549 16.8883C34.0163 14.4269 37.1523 12.7507 40.5664 12.0716C43.9805 11.3925 47.5192 11.741 50.7352 13.0731C53.9512 14.4052 56.6999 16.6611 58.6339 19.5554C60.5678 22.4497 61.6 25.8525 61.6 29.3334C61.5939 33.9993 59.7376 38.4724 56.4383 41.7717C53.139 45.071 48.6659 46.9273 44 46.9334L44 46.9334Z"
                              begin="0s"
                              dur="0.3s"
                              repeatCount="1"
                              fill="freeze"
                              calcMode="linear"
                              keyTimes="0;1"
                            ></animate>
                            <animate
                              className="backwards"
                              attributeName="d"
                              values="M44 46.9334C40.519 46.9334 37.1163 45.9012 34.222 43.9673C31.3277 42.0334 29.0718 39.2846 27.7397 36.0686C26.4076 32.8527 26.0591 29.3139 26.7382 25.8998C27.4173 22.4857 29.0935 19.3497 31.5549 16.8883C34.0163 14.4269 37.1523 12.7507 40.5664 12.0716C43.9805 11.3925 47.5192 11.741 50.7352 13.0731C53.9512 14.4052 56.6999 16.6611 58.6339 19.5554C60.5678 22.4497 61.6 25.8525 61.6 29.3334C61.5939 33.9993 59.7376 38.4724 56.4383 41.7717C53.139 45.071 48.6659 46.9273 44 46.9334L44 46.9334Z;M44 46.9334C40.5191 46.9334 37.1163 45.9012 34.222 43.9673C31.3277 42.0334 29.0718 39.2846 27.7397 36.0686C26.4076 32.8527 26.0591 29.3139 26.7382 25.8998C27.4173 22.4857 29.0935 19.3497 31.5549 16.8883C34.0163 14.4269 37.1524 12.7507 40.5664 12.0716C43.9805 11.3925 47.5193 11.741 50.7352 13.0731C53.9512 14.4052 56.7 16.6611 58.6339 19.5554C60.5678 22.4497 61.6 25.8525 61.6 29.3334C61.5939 33.9993 59.7376 38.4724 56.4383 41.7717C53.139 45.071 48.6659 46.9273 44 46.9334L44 46.9334Z"
                              begin="0s"
                              dur="0.3s"
                              repeatCount="1"
                              fill="freeze"
                              calcMode="linear"
                              keyTimes="0;1"
                            ></animate>
                          </path>
                          <path
                            id="Vector_3"
                            d="M43.9962 43.2282C51.4223 43.2282 57.4423 37.2081 57.4423 29.7821C57.4423 22.356 51.4223 16.3359 43.9962 16.3359C36.5701 16.3359 30.5501 22.356 30.5501 29.7821C30.5501 37.2081 36.5701 43.2282 43.9962 43.2282Z"
                            fill="#074C"
                          ></path>
                          <path
                            id="Vector_4"
                            d="M43.9957 40.9863V50.6947"
                            stroke="#074C"
                            stroke-width="5.86667"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                          <path
                            id="Vector_5"
                            d="M48.1185 33.4395C48.1483 34.2616 48.012 35.0813 47.7179 35.8496C47.4238 36.618 46.9779 37.3191 46.4068 37.9113C45.8356 38.5034 45.151 38.9744 44.3939 39.2961C43.6367 39.6178 42.8224 39.7836 41.9997 39.7836C41.177 39.7836 40.3628 39.6178 39.6056 39.2961C38.8484 38.9744 38.1638 38.5034 37.5927 37.9113C37.0216 37.3191 36.5757 36.618 36.2816 35.8496C35.9875 35.0813 35.8512 34.2616 35.881 33.4395L48.1185 33.4395Z"
                            fill="white"
                          >
                            <animate
                              className="forwards"
                              attributeName="d"
                              values="M48.1185 33.4395C48.1483 34.2616 48.012 35.0813 47.7179 35.8496C47.4238 36.618 46.9779 37.3191 46.4068 37.9113C45.8356 38.5034 45.151 38.9744 44.3939 39.2961C43.6367 39.6178 42.8224 39.7836 41.9997 39.7836C41.177 39.7836 40.3628 39.6178 39.6056 39.2961C38.8484 38.9744 38.1638 38.5034 37.5927 37.9113C37.0216 37.3191 36.5757 36.618 36.2816 35.8496C35.9875 35.0813 35.8512 34.2616 35.881 33.4395L48.1185 33.4395Z;M52.1185 33.4395C52.1483 34.2616 52.012 35.0813 51.7179 35.8496C51.4238 36.618 50.9779 37.3191 50.4068 37.9113C49.8356 38.5034 49.151 38.9744 48.3939 39.2961C47.6367 39.6178 46.8224 39.7836 45.9997 39.7836C45.177 39.7836 44.3628 39.6178 43.6056 39.2961C42.8484 38.9744 42.1638 38.5034 41.5927 37.9113C41.0216 37.3191 40.5757 36.618 40.2816 35.8496C39.9875 35.0813 39.8512 34.2616 39.881 33.4395L52.1185 33.4395Z"
                              begin="0s"
                              dur="0.3s"
                              repeatCount="1"
                              fill="freeze"
                              calcMode="linear"
                              keyTimes="0;1"
                            ></animate>
                            <animate
                              className="backwards"
                              attributeName="d"
                              values="M52.1185 33.4395C52.1483 34.2616 52.012 35.0813 51.7179 35.8496C51.4238 36.618 50.9779 37.3191 50.4068 37.9113C49.8356 38.5034 49.151 38.9744 48.3939 39.2961C47.6367 39.6178 46.8224 39.7836 45.9997 39.7836C45.177 39.7836 44.3628 39.6178 43.6056 39.2961C42.8484 38.9744 42.1638 38.5034 41.5927 37.9113C41.0216 37.3191 40.5757 36.618 40.2816 35.8496C39.9875 35.0813 39.8512 34.2616 39.881 33.4395L52.1185 33.4395Z;M48.1185 33.4395C48.1483 34.2616 48.012 35.0813 47.7179 35.8496C47.4238 36.618 46.9779 37.3191 46.4068 37.9113C45.8356 38.5034 45.151 38.9744 44.3939 39.2961C43.6367 39.6178 42.8224 39.7836 41.9997 39.7836C41.177 39.7836 40.3628 39.6178 39.6056 39.2961C38.8484 38.9744 38.1638 38.5034 37.5927 37.9113C37.0216 37.3191 36.5757 36.618 36.2816 35.8496C35.9875 35.0813 35.8512 34.2616 35.881 33.4395L48.1185 33.4395Z"
                              begin="0s"
                              dur="0.3s"
                              repeatCount="1"
                              fill="freeze"
                              calcMode="linear"
                              keyTimes="0;1"
                            ></animate>
                          </path>
                          <path
                            id="Vector_6"
                            d="M57.0335 21.2497C56.9694 21.2497 46.7968 13.9424 46.7968 13.9424L44.0196 15.8072L41.2263 13.9424C41.2263 13.9424 31.0537 21.2817 30.9816 21.2497C30.9096 21.2177 29.4529 29.7816 29.4529 29.7816L31.3738 29.7816C33.3987 29.7836 35.1995 29.0586 37.2207 28.445C40.3329 27.5001 45.1549 25.2979 47.977 23.9351C48.3449 23.7574 48.7483 23.6651 49.1569 23.6651C49.9741 23.6651 50.7737 24.0512 51.2819 24.6913C52.5889 26.349 54.2426 29.7854 56.6653 29.7816L58.5942 29.7816C58.5942 29.7816 57.1055 21.2177 57.0335 21.2497Z"
                            fill="#074C2D"
                          >
                            <animate
                              className="forwards"
                              attributeName="d"
                              values="M57.0335 21.2497C56.9694 21.2497 46.7968 13.9424 46.7968 13.9424L44.0196 15.8072L41.2263 13.9424C41.2263 13.9424 31.0537 21.2817 30.9816 21.2497C30.9096 21.2177 29.4529 29.7816 29.4529 29.7816L31.3738 29.7816C33.3987 29.7836 35.1995 29.0586 37.2207 28.445C40.3329 27.5001 45.1549 25.2979 47.977 23.9351C48.3449 23.7574 48.7483 23.6651 49.1569 23.6651C49.9741 23.6651 50.7737 24.0512 51.2819 24.6913C52.5889 26.349 54.2426 29.7854 56.6653 29.7816L58.5942 29.7816C58.5942 29.7816 57.1055 21.2177 57.0335 21.2497Z;M57.0335 21.2497C56.9694 21.2497 46.7968 13.9424 46.7968 13.9424L44.0196 15.8072L41.2263 13.9424C41.2263 13.9424 31.0537 21.2817 30.9816 21.2497C30.9096 21.2177 29.4529 29.7816 29.4529 29.7816L31.3738 29.7816C33.3987 29.7836 39.1995 29.0586 41.2207 28.445C45.7392 27.0731 47 25.5 51.977 23.9351C52.3449 23.7574 52.7483 23.6651 53.1569 23.6651C53.9741 23.6651 54.7737 24.0512 55.2819 24.6913C56.5889 26.349 55.2426 29.7854 57.6653 29.7816L58.5942 29.7816C58.5942 29.7816 57.1055 21.2177 57.0335 21.2497Z"
                              begin="0s"
                              dur="0.3s"
                              repeatCount="1"
                              fill="freeze"
                              calcMode="linear"
                              keyTimes="0;1"
                            ></animate>
                            <animate
                              className="backwards"
                              attributeName="d"
                              values="M57.0335 21.2497C56.9694 21.2497 46.7968 13.9424 46.7968 13.9424L44.0196 15.8072L41.2263 13.9424C41.2263 13.9424 31.0537 21.2817 30.9816 21.2497C30.9096 21.2177 29.4529 29.7816 29.4529 29.7816L31.3738 29.7816C33.3987 29.7836 39.1995 29.0586 41.2207 28.445C45.7392 27.0731 47 25.5 51.977 23.9351C52.3449 23.7574 52.7483 23.6651 53.1569 23.6651C53.9741 23.6651 54.7737 24.0512 55.2819 24.6913C56.5889 26.349 55.2426 29.7854 57.6653 29.7816L58.5942 29.7816C58.5942 29.7816 57.1055 21.2177 57.0335 21.2497Z;M57.0335 21.2497C56.9694 21.2497 46.7968 13.9424 46.7968 13.9424L44.0196 15.8072L41.2263 13.9424C41.2263 13.9424 31.0537 21.2817 30.9816 21.2497C30.9096 21.2177 29.4529 29.7816 29.4529 29.7816L31.3738 29.7816C33.3987 29.7836 35.1995 29.0586 37.2207 28.445C40.3329 27.5001 45.1549 25.2979 47.977 23.9351C48.3449 23.7574 48.7483 23.6651 49.1569 23.6651C49.9741 23.6651 50.7737 24.0512 51.2819 24.6913C52.5889 26.349 54.2426 29.7854 56.6653 29.7816L58.5942 29.7816C58.5942 29.7816 57.1055 21.2177 57.0335 21.2497Z"
                              begin="0s"
                              dur="0.3s"
                              repeatCount="1"
                              fill="freeze"
                              calcMode="linear"
                              keyTimes="0;1"
                            ></animate>
                          </path>
                        </g>
                      </g>
                      <defs>
                        <radialGradient
                          id="paint0_radial_2738_16281"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientUnits="userSpaceOnUse"
                          gradientTransform="translate(44 44) rotate(-89.9948) scale(44)"
                        >
                          <stop stop-color="#074C2D" stop-opacity="0.2">
                            <animate
                              className="forwards"
                              attributeName="offset"
                              values="0;0.245"
                              begin="0s"
                              dur="0.3s"
                              repeatCount="1"
                              fill="freeze"
                              calcMode="linear"
                              keyTimes="0;1"
                            ></animate>
                            <animate
                              className="backwards"
                              attributeName="offset"
                              values="0.245;0"
                              begin="0s"
                              dur="0.3s"
                              repeatCount="1"
                              fill="freeze"
                              calcMode="linear"
                              keyTimes="0;1"
                            ></animate>
                          </stop>
                          <stop offset="1" stop-color="#074C2D"></stop>
                        </radialGradient>
                        <linearGradient
                          id="paint1_linear_2738_16281"
                          x1="44"
                          y1="32.0001"
                          x2="44"
                          y2="46.9334"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#074C2D"></stop>
                          <stop offset="1" stop-color="#074C2D"></stop>
                        </linearGradient>
                        <clipPath id="clip0_2738_16281">
                          <rect width="88" height="88" fill="white"></rect>
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="text-brand-purple font-semibold text-lg">
                      For donors — Give with purpose.
                    </h3>
                    <p className="text-gray-700 text-xs sm:text-sm">
                      Donate your money, time, and expertise to verified African
                      causes, NGOs, and charities creating lasting change.
                    </p>
                  </div>
                </div>
                <ArrowRight className="text-brand-purple ms-5 text-lg font-bold transform transition-transform duration-300 ease-in-out group-hover:translate-x-2" />
              </button>
            </Link>
            <Link to="/signup">
              <button className="group flex items-center justify-between border-2 border-brand-purple rounded-3xl p-3 transition-all duration-300 ease-in-out">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 sm:w-20 sm:h-20 flex-shrink-0">
                    <svg
                      viewBox="0 0 88 88"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="for_nonprofits_advanced">
                        <g clip-path="url(#clip0_2729_24240)">
                          <rect
                            width="88"
                            height="88"
                            rx="44"
                            fill="white"
                          ></rect>
                          <rect
                            width="88"
                            height="88"
                            rx="44"
                            fill="url(#paint0_radial_2729_24240)"
                            fill-opacity="0.4"
                          >
                            <animate
                              className="forwards"
                              attributeName="fill-opacity"
                              values="0.4;0.8"
                              begin="0s"
                              dur="0.3s"
                              repeatCount="1"
                              fill="freeze"
                              calcMode="linear"
                              keyTimes="0;1"
                            ></animate>
                            <animate
                              className="backwards"
                              attributeName="fill-opacity"
                              values="0.8;0.4"
                              begin="0s"
                              dur="0.3s"
                              repeatCount="1"
                              fill="freeze"
                              calcMode="linear"
                              keyTimes="0;1"
                            ></animate>
                          </rect>
                          <g id="Clouds" opacity="0.4">
                            <path
                              id="Cloud1"
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M-2.47183 19.6364C-2.47222 19.6364 -2.47262 19.6364 -2.47302 19.6364C-6.31182 19.6364 -9.42379 16.8177 -9.42379 13.3407C-9.42379 9.86362 -6.31182 7.04492 -2.47302 7.04492C-2.06948 7.04492 -1.67398 7.07607 -1.28928 7.13585C0.297786 4.57758 3.32203 2.84889 6.79217 2.84766C8.90573 0.299539 12.2704 -1.34863 16.06 -1.34863C21.6656 -1.34863 26.3413 2.2576 27.4135 7.04843C27.4912 7.0461 27.5693 7.04492 27.6476 7.04492C30.6801 7.04492 33.259 8.80383 34.2086 11.2567C34.3367 11.2471 34.4662 11.2422 34.597 11.2422C37.1562 11.2422 39.2308 13.1213 39.2308 15.4393C39.2308 17.5791 37.4631 19.3448 35.1782 19.6038L35.1782 19.6368L16.1563 19.6368C16.1242 19.637 16.0921 19.6371 16.06 19.6371C16.0279 19.6371 15.9958 19.637 15.9637 19.6368L-2.47183 19.6368L-2.47183 19.6364Z"
                              fill="white"
                            >
                              <animate
                                className="forwards"
                                attributeName="d"
                                values="M-2.47183 19.6364C-2.47222 19.6364 -2.47262 19.6364 -2.47302 19.6364C-6.31182 19.6364 -9.42379 16.8177 -9.42379 13.3407C-9.42379 9.86362 -6.31182 7.04492 -2.47302 7.04492C-2.06948 7.04492 -1.67398 7.07607 -1.28928 7.13585C0.297786 4.57758 3.32203 2.84889 6.79217 2.84766C8.90573 0.299539 12.2704 -1.34863 16.06 -1.34863C21.6656 -1.34863 26.3413 2.2576 27.4135 7.04843C27.4912 7.0461 27.5693 7.04492 27.6476 7.04492C30.6801 7.04492 33.259 8.80383 34.2086 11.2567C34.3367 11.2471 34.4662 11.2422 34.597 11.2422C37.1562 11.2422 39.2308 13.1213 39.2308 15.4393C39.2308 17.5791 37.4631 19.3448 35.1782 19.6038L35.1782 19.6368L16.1563 19.6368C16.1242 19.637 16.0921 19.6371 16.06 19.6371C16.0279 19.6371 15.9958 19.637 15.9637 19.6368L-2.47183 19.6368L-2.47183 19.6364Z;M11.528 19.6364C11.5276 19.6364 11.5272 19.6364 11.5268 19.6364C7.68796 19.6364 4.57599 16.8177 4.57599 13.3407C4.57599 9.86362 7.68796 7.04492 11.5268 7.04492C11.9303 7.04492 12.3258 7.07607 12.7105 7.13585C14.2976 4.57758 17.3218 2.84889 20.792 2.84766C22.9055 0.299539 26.2701 -1.34863 30.0598 -1.34863C35.6654 -1.34863 40.3411 2.2576 41.4133 7.04843C41.491 7.0461 41.5691 7.04492 41.6474 7.04492C44.6799 7.04492 47.2588 8.80383 48.2084 11.2567C48.3364 11.2471 48.466 11.2422 48.5967 11.2422C51.1559 11.2422 53.2306 13.1213 53.2306 15.4393C53.2306 17.5791 51.4628 19.3448 49.178 19.6038L49.178 19.6368L30.1561 19.6368C30.124 19.637 30.0919 19.6371 30.0598 19.6371C30.0277 19.6371 29.9956 19.637 29.9635 19.6368L11.528 19.6368L11.528 19.6364Z"
                                begin="0s"
                                dur="0.3s"
                                repeatCount="1"
                                fill="freeze"
                                calcMode="linear"
                                keyTimes="0;1"
                              ></animate>
                              <animate
                                className="backwards"
                                attributeName="d"
                                values="M11.528 19.6364C11.5276 19.6364 11.5272 19.6364 11.5268 19.6364C7.68796 19.6364 4.57599 16.8177 4.57599 13.3407C4.57599 9.86362 7.68796 7.04492 11.5268 7.04492C11.9303 7.04492 12.3258 7.07607 12.7105 7.13585C14.2976 4.57758 17.3218 2.84889 20.792 2.84766C22.9055 0.299539 26.2701 -1.34863 30.0598 -1.34863C35.6654 -1.34863 40.3411 2.2576 41.4133 7.04843C41.491 7.0461 41.5691 7.04492 41.6474 7.04492C44.6799 7.04492 47.2588 8.80383 48.2084 11.2567C48.3364 11.2471 48.466 11.2422 48.5967 11.2422C51.1559 11.2422 53.2306 13.1213 53.2306 15.4393C53.2306 17.5791 51.4628 19.3448 49.178 19.6038L49.178 19.6368L30.1561 19.6368C30.124 19.637 30.0919 19.6371 30.0598 19.6371C30.0277 19.6371 29.9956 19.637 29.9635 19.6368L11.528 19.6368L11.528 19.6364Z;M-2.47183 19.6364C-2.47222 19.6364 -2.47262 19.6364 -2.47302 19.6364C-6.31182 19.6364 -9.42379 16.8177 -9.42379 13.3407C-9.42379 9.86362 -6.31182 7.04492 -2.47302 7.04492C-2.06948 7.04492 -1.67398 7.07607 -1.28928 7.13585C0.297786 4.57758 3.32203 2.84889 6.79217 2.84766C8.90573 0.299539 12.2704 -1.34863 16.06 -1.34863C21.6656 -1.34863 26.3413 2.2576 27.4135 7.04843C27.4912 7.0461 27.5693 7.04492 27.6476 7.04492C30.6801 7.04492 33.259 8.80383 34.2086 11.2567C34.3367 11.2471 34.4662 11.2422 34.597 11.2422C37.1562 11.2422 39.2308 13.1213 39.2308 15.4393C39.2308 17.5791 37.4631 19.3448 35.1782 19.6038L35.1782 19.6368L16.1563 19.6368C16.1242 19.637 16.0921 19.6371 16.06 19.6371C16.0279 19.6371 15.9958 19.637 15.9637 19.6368L-2.47183 19.6368L-2.47183 19.6364Z"
                                begin="0s"
                                dur="0.3s"
                                repeatCount="1"
                                fill="freeze"
                                calcMode="linear"
                                keyTimes="0;1"
                              ></animate>
                            </path>
                            <path
                              id="Cloud2"
                              opacity="0.8"
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M49.8366 35.8997C49.8363 35.8997 49.836 35.8997 49.8358 35.8997C47.4273 35.8997 45.4749 34.1313 45.4749 31.9499C45.4749 29.7684 47.4273 28 49.8358 28C50.0889 28 50.3369 28.0195 50.5782 28.057C51.574 26.4516 53.4717 25.3668 55.6492 25.3662C56.9753 23.7675 59.0862 22.7334 61.4639 22.7334C64.981 22.7334 67.9146 24.9962 68.5871 28.0022C68.6356 28.0007 68.6844 28 68.7334 28C70.6357 28 72.2536 29.1033 72.8495 30.6419C72.9298 30.6359 73.0111 30.6328 73.0931 30.6328C74.6987 30.6328 76.0004 31.8118 76.0004 33.2661C76.0004 34.6085 74.8913 35.7163 73.4578 35.8788L73.4578 35.9001L49.8366 35.9001L49.8366 35.8997Z"
                              fill="white"
                            >
                              <animate
                                className="forwards"
                                attributeName="d"
                                values="M49.8366 35.8997C49.8363 35.8997 49.836 35.8997 49.8358 35.8997C47.4273 35.8997 45.4749 34.1313 45.4749 31.9499C45.4749 29.7684 47.4273 28 49.8358 28C50.0889 28 50.3369 28.0195 50.5782 28.057C51.574 26.4516 53.4717 25.3668 55.6492 25.3662C56.9753 23.7675 59.0862 22.7334 61.4639 22.7334C64.981 22.7334 67.9146 24.9962 68.5871 28.0022C68.6356 28.0007 68.6844 28 68.7334 28C70.6357 28 72.2536 29.1033 72.8495 30.6419C72.9298 30.6359 73.0111 30.6328 73.0931 30.6328C74.6987 30.6328 76.0004 31.8118 76.0004 33.2661C76.0004 34.6085 74.8913 35.7163 73.4578 35.8788L73.4578 35.9001L49.8366 35.9001L49.8366 35.8997Z;M55.8365 35.8997C55.8362 35.8997 55.8359 35.8997 55.8357 35.8997C53.4272 35.8997 51.4748 34.1313 51.4748 31.9499C51.4748 29.7684 53.4272 28 55.8357 28C56.0888 28 56.3368 28.0195 56.5781 28.057C57.5739 26.4516 59.4716 25.3668 61.6491 25.3662C62.9752 23.7675 65.0861 22.7334 67.4638 22.7334C70.9809 22.7334 73.9145 24.9962 74.587 28.0022C74.6355 28.0007 74.6843 28 74.7333 28C76.6356 28 78.2535 29.1033 78.8494 30.6419C78.9297 30.6359 79.011 30.6328 79.093 30.6328C80.6986 30.6328 82.0003 31.8118 82.0003 33.2661C82.0003 34.6085 80.8912 35.7163 79.4577 35.8788L79.4577 35.9001L55.8365 35.9001L55.8365 35.8997Z"
                                begin="0s"
                                dur="0.3s"
                                repeatCount="1"
                                fill="freeze"
                                calcMode="linear"
                                keyTimes="0;1"
                              ></animate>
                              <animate
                                className="backwards"
                                attributeName="d"
                                values="M55.8365 35.8997C55.8362 35.8997 55.8359 35.8997 55.8357 35.8997C53.4272 35.8997 51.4748 34.1313 51.4748 31.9499C51.4748 29.7684 53.4272 28 55.8357 28C56.0888 28 56.3368 28.0195 56.5781 28.057C57.5739 26.4516 59.4716 25.3668 61.6491 25.3662C62.9752 23.7675 65.0861 22.7334 67.4638 22.7334C70.9809 22.7334 73.9145 24.9962 74.587 28.0022C74.6355 28.0007 74.6843 28 74.7333 28C76.6356 28 78.2535 29.1033 78.8494 30.6419C78.9297 30.6359 79.011 30.6328 79.093 30.6328C80.6986 30.6328 82.0003 31.8118 82.0003 33.2661C82.0003 34.6085 80.8912 35.7163 79.4577 35.8788L79.4577 35.9001L55.8365 35.9001L55.8365 35.8997Z;M49.8366 35.8997C49.8363 35.8997 49.836 35.8997 49.8358 35.8997C47.4273 35.8997 45.4749 34.1313 45.4749 31.9499C45.4749 29.7684 47.4273 28 49.8358 28C50.0889 28 50.3369 28.0195 50.5782 28.057C51.574 26.4516 53.4717 25.3668 55.6492 25.3662C56.9753 23.7675 59.0862 22.7334 61.4639 22.7334C64.981 22.7334 67.9146 24.9962 68.5871 28.0022C68.6356 28.0007 68.6844 28 68.7334 28C70.6357 28 72.2536 29.1033 72.8495 30.6419C72.9298 30.6359 73.0111 30.6328 73.0931 30.6328C74.6987 30.6328 76.0004 31.8118 76.0004 33.2661C76.0004 34.6085 74.8913 35.7163 73.4578 35.8788L73.4578 35.9001L49.8366 35.9001L49.8366 35.8997Z"
                                begin="0s"
                                dur="0.3s"
                                repeatCount="1"
                                fill="freeze"
                                calcMode="linear"
                                keyTimes="0;1"
                              ></animate>
                            </path>
                            <path
                              id="Cloud3"
                              opacity="0.6"
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M21.2942 47.155L16.7276 47.155C16.7191 47.1551 16.7106 47.1551 16.7021 47.1551C16.6936 47.1551 16.6851 47.1551 16.6766 47.155L13.0338 47.155C13.0172 47.1552 13.0006 47.1553 12.984 47.1553C12.9673 47.1553 12.9507 47.1552 12.9341 47.155L9.32207 47.155C9.30285 47.1554 9.28357 47.1555 9.26425 47.1555C7.72372 47.1555 6.47487 46.0244 6.47487 44.629C6.47487 43.2337 7.72372 42.1025 9.26425 42.1025C9.42617 42.1025 9.58487 42.115 9.73924 42.139C10.3761 41.1123 11.5898 40.4185 12.9824 40.418C13.8306 39.3951 15.181 38.7334 16.7021 38.7334C18.952 38.7334 20.8285 40.181 21.2585 42.1039C21.2895 42.103 21.3207 42.1025 21.352 42.1025C22.5686 42.1025 23.6033 42.808 23.9847 43.792C24.0361 43.7881 24.0881 43.7861 24.1407 43.7861C25.1677 43.7861 26.0003 44.5402 26.0003 45.4705C26.0003 46.3292 25.2909 47.0378 24.3739 47.1417L24.3739 47.155L21.4098 47.155C21.3906 47.1554 21.3713 47.1555 21.352 47.1555C21.3327 47.1555 21.3134 47.1554 21.2942 47.155Z"
                              fill="white"
                            >
                              <animate
                                className="forwards"
                                attributeName="d"
                                values="M21.2942 47.155L16.7276 47.155C16.7191 47.1551 16.7106 47.1551 16.7021 47.1551C16.6936 47.1551 16.6851 47.1551 16.6766 47.155L13.0338 47.155C13.0172 47.1552 13.0006 47.1553 12.984 47.1553C12.9673 47.1553 12.9507 47.1552 12.9341 47.155L9.32207 47.155C9.30285 47.1554 9.28357 47.1555 9.26425 47.1555C7.72372 47.1555 6.47487 46.0244 6.47487 44.629C6.47487 43.2337 7.72372 42.1025 9.26425 42.1025C9.42617 42.1025 9.58487 42.115 9.73924 42.139C10.3761 41.1123 11.5898 40.4185 12.9824 40.418C13.8306 39.3951 15.181 38.7334 16.7021 38.7334C18.952 38.7334 20.8285 40.181 21.2585 42.1039C21.2895 42.103 21.3207 42.1025 21.352 42.1025C22.5686 42.1025 23.6033 42.808 23.9847 43.792C24.0361 43.7881 24.0881 43.7861 24.1407 43.7861C25.1677 43.7861 26.0003 44.5402 26.0003 45.4705C26.0003 46.3292 25.2909 47.0378 24.3739 47.1417L24.3739 47.155L21.4098 47.155C21.3906 47.1554 21.3713 47.1555 21.352 47.1555C21.3327 47.1555 21.3134 47.1554 21.2942 47.155Z;M25.2941 47.155L20.7275 47.155C20.719 47.1551 20.7105 47.1551 20.702 47.1551C20.6935 47.1551 20.685 47.1551 20.6765 47.155L17.0338 47.155C17.0172 47.1552 17.0005 47.1553 16.9839 47.1553C16.9672 47.1553 16.9506 47.1552 16.934 47.155L13.322 47.155C13.3028 47.1554 13.2835 47.1555 13.2642 47.1555C11.7236 47.1555 10.4748 46.0244 10.4748 44.629C10.4748 43.2337 11.7236 42.1025 13.2642 42.1025C13.4261 42.1025 13.5848 42.115 13.7392 42.139C14.376 41.1123 15.5897 40.4185 16.9823 40.418C17.8305 39.3951 19.181 38.7334 20.702 38.7334C22.9519 38.7334 24.8285 40.181 25.2584 42.1039C25.2895 42.103 25.3206 42.1025 25.3519 42.1025C26.5686 42.1025 27.6033 42.808 27.9846 43.792C28.036 43.7881 28.0881 43.7861 28.1406 43.7861C29.1676 43.7861 30.0002 44.5402 30.0002 45.4705C30.0002 46.3292 29.2908 47.0378 28.3738 47.1417L28.3738 47.155L25.4098 47.155C25.3905 47.1554 25.3713 47.1555 25.3519 47.1555C25.3326 47.1555 25.3133 47.1554 25.2941 47.155Z"
                                begin="0s"
                                dur="0.3s"
                                repeatCount="1"
                                fill="freeze"
                                calcMode="linear"
                                keyTimes="0;1"
                              ></animate>
                              <animate
                                className="backwards"
                                attributeName="d"
                                values="M25.2941 47.155L20.7275 47.155C20.719 47.1551 20.7105 47.1551 20.702 47.1551C20.6935 47.1551 20.685 47.1551 20.6765 47.155L17.0338 47.155C17.0172 47.1552 17.0005 47.1553 16.9839 47.1553C16.9672 47.1553 16.9506 47.1552 16.934 47.155L13.322 47.155C13.3028 47.1554 13.2835 47.1555 13.2642 47.1555C11.7236 47.1555 10.4748 46.0244 10.4748 44.629C10.4748 43.2337 11.7236 42.1025 13.2642 42.1025C13.4261 42.1025 13.5848 42.115 13.7392 42.139C14.376 41.1123 15.5897 40.4185 16.9823 40.418C17.8305 39.3951 19.181 38.7334 20.702 38.7334C22.9519 38.7334 24.8285 40.181 25.2584 42.1039C25.2895 42.103 25.3206 42.1025 25.3519 42.1025C26.5686 42.1025 27.6033 42.808 27.9846 43.792C28.036 43.7881 28.0881 43.7861 28.1406 43.7861C29.1676 43.7861 30.0002 44.5402 30.0002 45.4705C30.0002 46.3292 29.2908 47.0378 28.3738 47.1417L28.3738 47.155L25.4098 47.155C25.3905 47.1554 25.3713 47.1555 25.3519 47.1555C25.3326 47.1555 25.3133 47.1554 25.2941 47.155Z;M21.2942 47.155L16.7276 47.155C16.7191 47.1551 16.7106 47.1551 16.7021 47.1551C16.6936 47.1551 16.6851 47.1551 16.6766 47.155L13.0338 47.155C13.0172 47.1552 13.0006 47.1553 12.984 47.1553C12.9673 47.1553 12.9507 47.1552 12.9341 47.155L9.32207 47.155C9.30285 47.1554 9.28357 47.1555 9.26425 47.1555C7.72372 47.1555 6.47487 46.0244 6.47487 44.629C6.47487 43.2337 7.72372 42.1025 9.26425 42.1025C9.42617 42.1025 9.58487 42.115 9.73924 42.139C10.3761 41.1123 11.5898 40.4185 12.9824 40.418C13.8306 39.3951 15.181 38.7334 16.7021 38.7334C18.952 38.7334 20.8285 40.181 21.2585 42.1039C21.2895 42.103 21.3207 42.1025 21.352 42.1025C22.5686 42.1025 23.6033 42.808 23.9847 43.792C24.0361 43.7881 24.0881 43.7861 24.1407 43.7861C25.1677 43.7861 26.0003 44.5402 26.0003 45.4705C26.0003 46.3292 25.2909 47.0378 24.3739 47.1417L24.3739 47.155L21.4098 47.155C21.3906 47.1554 21.3713 47.1555 21.352 47.1555C21.3327 47.1555 21.3134 47.1554 21.2942 47.155Z"
                                begin="0s"
                                dur="0.3s"
                                repeatCount="1"
                                fill="freeze"
                                calcMode="linear"
                                keyTimes="0;1"
                              ></animate>
                            </path>
                            <animate
                              className="forwards"
                              attributeName="opacity"
                              values="0.4;0.25"
                              begin="0s"
                              dur="0.3s"
                              repeatCount="1"
                              fill="freeze"
                              calcMode="linear"
                              keyTimes="0;1"
                            ></animate>
                            <animate
                              className="backwards"
                              attributeName="opacity"
                              values="0.25;0.4"
                              begin="0s"
                              dur="0.3s"
                              repeatCount="1"
                              fill="freeze"
                              calcMode="linear"
                              keyTimes="0;1"
                            ></animate>
                          </g>
                          <g id="Layer 1">
                            <path
                              id="Bushes"
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M12.8261 60.6813C12.2256 62.3768 11.9475 64.1857 12.0082 66L36.9918 66C37.0525 64.1857 36.7744 62.3768 36.174 60.6813C35.5735 58.9858 34.6631 57.4385 33.4972 56.1317C32.3312 54.825 30.9336 53.7856 29.3877 53.0758C27.8419 52.3659 26.1796 52 24.5 52C22.8204 52 21.1581 52.3659 19.6123 53.0758C18.0664 53.7856 16.6688 54.825 15.5028 56.1317C14.3369 57.4385 13.4265 58.9858 12.8261 60.6813ZM57.5617 62.2009C57.1534 63.412 56.9643 64.7041 57.0056 66L73.9944 66C74.0357 64.7041 73.8466 63.412 73.4383 62.2009C73.03 60.9898 72.4109 59.8846 71.6181 58.9512C70.8252 58.0178 69.8748 57.2755 68.8237 56.7684C67.7725 56.2613 66.6421 56 65.5 56C64.3579 56 63.2275 56.2613 62.1763 56.7684C61.1252 57.2755 60.1748 58.0178 59.3819 58.9512C58.5891 59.8846 57.97 60.9898 57.5617 62.2009Z"
                              fill="#074C"
                            >
                              <animate
                                className="forwards"
                                attributeName="fill"
                                values="#074C;#074C"
                                begin="0s"
                                dur="0.3s"
                                repeatCount="1"
                                fill="freeze"
                                calcMode="linear"
                                keyTimes="0;1"
                              ></animate>
                              <animate
                                className="backwards"
                                attributeName="fill"
                                values="#074C;#074C"
                                begin="0s"
                                dur="0.3s"
                                repeatCount="1"
                                fill="freeze"
                                calcMode="linear"
                                keyTimes="0;1"
                              ></animate>
                            </path>
                            <g id="Building">
                              <g id="Sign_back">
                                <path
                                  id="Union"
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M37 26H34V30H37V26ZM54 26H51V30H54V26Z"
                                  fill="#074C2D"
                                ></path>
                              </g>
                              <path
                                id="Building_light"
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M32 17.9333C32 16.5505 32 15.8592 32.4296 15.4296C32.8592 15 33.5506 15 34.9333 15H53.0667C54.4495 15 55.1409 15 55.5704 15.4296C56 15.8592 56 16.5505 56 17.9333V24.0667C56 25.4495 56 26.1408 55.5704 26.5704C55.1409 27 54.4495 27 53.0667 27H34.9333C33.5506 27 32.8592 27 32.4296 26.5704C32 26.1408 32 25.4495 32 24.0667V17.9333ZM65 33H67V29H21V33H23V59H22V65H0V88H88V65H66V59H65V33Z"
                                fill="#074C2D"
                              >
                                <animate
                                  className="forwards"
                                  attributeName="fill"
                                  values="#074C2D;#074C2D"
                                  begin="0s"
                                  dur="0.3s"
                                  repeatCount="1"
                                  fill="freeze"
                                  calcMode="linear"
                                  keyTimes="0;1"
                                ></animate>
                                <animate
                                  className="backwards"
                                  attributeName="fill"
                                  values="#074C2D;#074C2D"
                                  begin="0s"
                                  dur="0.3s"
                                  repeatCount="1"
                                  fill="freeze"
                                  calcMode="linear"
                                  keyTimes="0;1"
                                ></animate>
                              </path>
                              <g id="Dark">
                                <path
                                  id="Rectangle 74"
                                  d="M22 37H66V33H22V37Z"
                                  fill="#074C2D"
                                ></path>
                              </g>
                            </g>
                            <g id="Windows">
                              <g id="Rectangle 72">
                                <rect
                                  x="26"
                                  y="40"
                                  width="22"
                                  height="16"
                                  fill="white"
                                ></rect>
                                <rect
                                  x="26"
                                  y="40"
                                  width="22"
                                  height="16"
                                  fill="url(#paint1_linear_2729_24240)"
                                  fill-opacity="0.4"
                                ></rect>
                              </g>
                              <path
                                id="Rectangle 81"
                                opacity="0.4"
                                d="M44.8 40H46L41.2 56H40L44.8 40Z"
                                fill="white"
                              ></path>
                              <path
                                id="Rectangle 84"
                                opacity="0.4"
                                d="M42.8 40H44L39.2 56H38L42.8 40Z"
                                fill="white"
                              ></path>
                              <g id="Rectangle 73">
                                <rect
                                  x="51"
                                  y="40"
                                  width="11"
                                  height="19"
                                  fill="white"
                                ></rect>
                                <rect
                                  x="51"
                                  y="40"
                                  width="11"
                                  height="19"
                                  fill="url(#paint2_linear_2729_24240)"
                                  fill-opacity="0.4"
                                ></rect>
                              </g>
                            </g>
                            <rect
                              id="Sign"
                              x="35"
                              y="18"
                              width="18"
                              height="6"
                              fill="white"
                            ></rect>
                          </g>
                        </g>
                      </g>
                      <defs>
                        <radialGradient
                          id="paint0_radial_2729_24240"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientUnits="userSpaceOnUse"
                          gradientTransform="translate(44.004 88.008) rotate(-90) scale(88.008)"
                        >
                          <stop
                            offset="0.25"
                            stop-color="#074C2D"
                            stop-opacity="0.2"
                          >
                            <animate
                              className="forwards"
                              attributeName="offset"
                              values="0.25;0.505"
                              begin="0s"
                              dur="0.3s"
                              repeatCount="1"
                              fill="freeze"
                              calcMode="linear"
                              keyTimes="0;1"
                            ></animate>
                            <animate
                              className="backwards"
                              attributeName="offset"
                              values="0.505;0.25"
                              begin="0s"
                              dur="0.3s"
                              repeatCount="1"
                              fill="freeze"
                              calcMode="linear"
                              keyTimes="0;1"
                            ></animate>
                          </stop>
                          <stop offset="1" stop-color="#074C2D"></stop>
                        </radialGradient>
                        <linearGradient
                          id="paint1_linear_2729_24240"
                          x1="37"
                          y1="40"
                          x2="36.971"
                          y2="56.506"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#074C2D"></stop>
                          <stop
                            offset="1"
                            stop-color="#074C2D"
                            stop-opacity="0.4"
                          ></stop>
                        </linearGradient>
                        <linearGradient
                          id="paint2_linear_2729_24240"
                          x1="56.5"
                          y1="40"
                          x2="56.4181"
                          y2="59.6005"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#074C2D"></stop>
                          <stop
                            offset="1"
                            stop-color="#074C2D"
                            stop-opacity="0.4"
                          ></stop>
                        </linearGradient>
                        <clipPath id="clip0_2729_24240">
                          <rect
                            width="88"
                            height="88"
                            rx="44"
                            fill="white"
                          ></rect>
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="text-brand-purple font-semibold text-lg">
                      For African Causes — Grow your impact.
                    </h3>
                    <p className="text-gray-700 text-xs sm:text-sm">
                      Receive donations, connect with skilled volunteers, and
                      access tools to amplify your mission — all in one
                      trusted platform.
                    </p>
                  </div>
                </div>
                <ArrowRight className="text-brand-purple ms-5 text-lg font-bold transform transition-transform duration-300 ease-in-out group-hover:translate-x-2" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Bar */}
      <div
        className="absolute flex justify-center gap-2 cursor-pointer bottom-0 left-0 right-0 bg-brand-purple hover:bg-brand-purple-light py-5 text-center text-white text-sm font-medium"
        onClick={() => {
          const section = document.getElementById("recent-donations");
          section?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        See Causes <ChevronDown size={20} className="" />
      </div>
    </section>
  );
};
