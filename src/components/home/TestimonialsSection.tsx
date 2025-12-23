import { Separator } from "@/components/ui/separator";
import { Quote } from "lucide-react";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      quote:
        "Campaign to YENDAA made it easy for us to get verified and start fundraising for our clean water projects. The platform's credibility helped us gain donor trust.",
      name: "Sarah Johnson",
      organization: "WaterAid Foundation",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    },
    {
      quote:
        "The verification process was thorough but straightforward. Now our education initiatives have a global platform to connect with donors who share our vision.",
      name: "Michael Chen",
      organization: "Global Education Trust",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    },
    {
      quote:
        "The dashboard analytics have transformed how we track donations and engage with supporters. It's been invaluable for our wildlife conservation work.",
      name: "Priya Nair",
      organization: "Wildlife Protection Network",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <h2 className="section-title">Success Stories</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16">
          See how verified organizations are making an impact with Give to
          Africa
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col card-hover"
            >
              <Quote className="text-brand-purple mb-4" size={32} />
              <p className="text-gray-700 flex-grow">"{testimonial.quote}"</p>
              <Separator className="my-6" />
              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">
                    {testimonial.organization}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
