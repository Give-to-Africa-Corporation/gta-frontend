
import Image from "@/components/ui/Image";
import { ArrowRight, Building, Compass, Heart, Users } from "lucide-react";
import { Link } from "react-router-dom";

export const CTAGridSection = () => {
  const ctaItems = [
    {
      title: "Grassroot Champion",
      subtitle: "NGOs / Nonprofits / Charities",
      description:
        "Get verified, receive online donations, and become a recognized Grassroots Champion on Give to Africa. Register now to connect with global donors who believe in local, community-led impact.",
      icon: <Building className="w-8 h-8 text-white" />,
      bgColor: "bg-brand-purple",
      link: "/",
      image: "/images/4.jpg",
      linkText: "Register now",
    },
    {
      title: "Fiscal Sponsors",
      subtitle: "Government Agencies, Civil Society, CBOs, and Movements",
      description:
        "Need a trusted way to receive tax-deductible international donations for your work in Africa? Register now to unlock global giving—without the burden of registering abroad.",
      icon: <Users className="w-8 h-8 text-white" />,
      bgColor: "bg-brand-orange",
      link: "https://forms.monday.com/forms/4b2a4909ec7fa99814a6dec876201cc6?r=use1&text_mkp2hsst=",
      image: "/images/6.jpg",
      linkText: "Register now",
      external: true,
    },
    {
      title: "Donors",
      subtitle: "",
      description:
        "Give to vetted grassroots organizations creating real, measurable impact across Africa. Support with confidence and help fuel lasting change where it matters most.",
      icon: <Heart className="w-8 h-8 text-white" />,
      bgColor: "bg-brand-green",
      link: "/campaigns",
      image: "/images/7.jpg",
      linkText: "Explore",
    },
    {
      title: "Advisory Services",
      subtitle: "DAFs/ Corporate Giving/ Foundations",
      description:
        "Our advisory services connect global philanthropy with high-impact charitable programs across Africa. We build strategic partnerships between donors and trusted grassroots organizations to address urgent local challenges.",
      icon: <Compass className="w-8 h-8 text-white" />,
      bgColor: "bg-[#6b46c1]",
      link: "https://2africa.org/advisory-services/",
      image: "/images/8.jpg",
      linkText: "Learn More",
      external: true,
    },
  ];

  return (
    <section className="py-20 bg-white relative">
      {/* Background collage effect - semi-transparent */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-5 z-0"
        style={{
          backgroundImage: `url(${"/public/lovable-uploads/252613b5-bd0f-41be-a3c9-641487db3307.png"})`,
        }}
      ></div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Easier giving. Greater good.
          </h2>
          <p className="text-xl text-brand-orange font-medium">
            Built by a nonprofit for nonprofits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ctaItems.map((item, index) => (
            <LinkWrapper key={index} to={item.link} external={item.external}>
              <div
                className={`${item.bgColor} rounded-xl overflow-hidden shadow-xl 
                  hover:shadow-2xl transition-all duration-300 hover:-translate-y-1
                  group relative h-64 md:h-80 cursor-pointer`}
              >
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute inset-0 ${item.bgColor} opacity-80 group-hover:opacity-90 transition-opacity`}
                  ></div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full w-full p-8 flex flex-col justify-between">
                  {/* Top Section with Icon and Titles */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/20 rounded-full">
                        {item.icon}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white">
                        {item.title}
                      </h3>
                    </div>
                    {item.subtitle && (
                      <p className="text-white/90 font-medium text-sm">
                        {item.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Bottom Section with Description and Arrow */}
                  <div className="space-y-4">
                    <p className="text-white text-lg leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex items-center text-white/90 group-hover:text-white">
                      <span className="mr-2 font-medium">{item.linkText}</span>
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </LinkWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};

// Helper component to handle both internal and external links
const LinkWrapper = ({ children, to, external = false }) => {
  if (external) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return <Link to={to}>{children}</Link>;
};
