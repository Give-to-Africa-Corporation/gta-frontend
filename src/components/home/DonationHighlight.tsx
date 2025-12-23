export const DonationHighlight = () => {
  return (
    <section className="relative bg-brand-purple text-white py-16">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-purple-darker opacity-30"></div>

      <div className="container-custom relative z-10 text-center max-w-6xl mx-auto px-4">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-brand-yellow">
          Together, we are YENDAA.
        </h2>

        {/* Text */}
      <ul className="text-lg md:text-xl text-white/90 flex flex-col md:flex-row items-center md:justify-center md:space-x-6 space-y-2 md:space-y-0 list-none">
        <li className="before:content-['•'] before:mr-2">
          128 projects funded
        </li>
        <li className="before:content-['•'] before:mr-2">
          940 volunteers recruited
        </li>
        <li className="before:content-['•'] before:mr-2">
          12,300+ donors worldwide
        </li>
      </ul>


      </div>
    </section>
  );
};
