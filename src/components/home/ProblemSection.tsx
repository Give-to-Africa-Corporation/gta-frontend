// import { DollarSign, Lock, User } from "lucide-react"; // icons example

// export const ProblemSection = () => {
//   return (
//     <section className="relative bg-gradient-to-r from-brand-purple to-brand-orange text-white py-20">
//       <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
//         {/* Left Side */}
//         <div>
//           <h2 className="text-sm font-bold tracking-widest text-brand-yellow uppercase mb-4">
//             The Problem
//           </h2>
//           <p className="text-3xl md:text-4xl font-light leading-snug text-white/90">
//             Connecting with new individual donors is too difficult, costly, and
//             time-consuming.
//           </p>
//         </div>

//         {/* Right Side */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//           {/* Card 1 */}
//           <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-md text-center">
//             <DollarSign className="w-10 h-10 text-brand-yellow mx-auto mb-4" />
//             <p className="text-sm text-white/90">
//               Underfunding prevents causes from achieving their missions
//             </p>
//           </div>

//           {/* Card 2 */}
//           <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-md text-center">
//             <Lock className="w-10 h-10 text-brand-yellow mx-auto mb-4" />
//             <p className="text-sm text-white/90">
//               Existing solutions are overly complicated and outdated
//             </p>
//           </div>

//           {/* Card 3 */}
//           <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-md text-center">
//             <User className="w-10 h-10 text-brand-yellow mx-auto mb-4" />
//             <p className="text-sm text-white/90">
//               Development teams are overworked and understaffed
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };





export const ProblemSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-brand-purple to-brand-orange text-white py-20">
      <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Side */}
        <div>
          <h2 className="text-sm font-bold tracking-widest text-brand-yellow uppercase mb-4">
            The Problem
          </h2>
          <p className="text-3xl md:text-4xl font-light leading-snug text-white/90">
            African causes are underfunded, overlooked, and face challenges
            in attracting donors and volunteers.
          </p>
        </div>

        {/* Right Side */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-md text-center">
            <img
              src="/images/icon1.png"
              alt="Underfunded"
              className="w-12 h-12 mx-auto mb-4"
            />
            <p className="text-sm text-white/90">
               African causes are underfunded and overlooked
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-md text-center">
            <img
              src="/images/icon2.png"
              alt="Recruiting Issues"
              className="w-12 h-12 mx-auto mb-4"
            />
            <p className="text-sm text-white/90">
               Recruiting donors and volunteers is difficult and costly
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-md text-center">
            <img
              src="/images/icon3.png"
              alt="Not Africa-centered"
              className="w-12 h-12 mx-auto mb-4"
            />
            <p className="text-sm text-white/90">
               Most platforms aren’t built for African communities
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
