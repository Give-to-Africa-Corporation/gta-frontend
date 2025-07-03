
export const PartnersSection = () => {
  const partners = [
    { name: "United Nations", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/UN_emblem_blue.svg/1200px-UN_emblem_blue.svg.png" },
    { name: "WHO", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/WHO_logo.svg/1200px-WHO_logo.svg.png" },
    { name: "Bill & Melinda Gates Foundation", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Gates_Foundation_logo.svg/1200px-Gates_Foundation_logo.svg.png" },
    { name: "USAID", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/US_Aid_logo.svg/1200px-US_Aid_logo.svg.png" },
    { name: "African Development Bank", logo: "https://www.afdb.org/sites/default/files/afdb_logo_for_email_signature.png" }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <h2 className="text-2xl font-bold text-center mb-10">Our Partners & Collaborators</h2>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {partners.map((partner, index) => (
            <div key={index} className="flex items-center justify-center h-16 w-[180px]">
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-full max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
