
import {
  UserPlus,
  CheckCircle,
  FileCheck,
  PenLine,
  DollarSign,
  BarChart3,
} from "lucide-react";

export const ProcessSection = () => {
  const steps = [
    {
      icon: <UserPlus className="text-brand-purple" size={32} />,
      title: "Sign Up",
      description:
        "Create an account using your official NGO email and start your verification journey.",
    },
    {
      icon: <FileCheck className="text-brand-purple" size={32} />,
      title: "Submit Documents",
      description:
        "Upload your NGO registration certificate, leadership proof, and impact summary.",
    },
    {
      icon: <CheckCircle className="text-brand-purple" size={32} />,
      title: "Get Verified",
      description:
        "Our team reviews your documents and approves your organization as a verified NGO.",
    },
    {
      icon: <PenLine className="text-brand-purple" size={32} />,
      title: "Create Causes",
      description:
        "Set up compelling fundraising Causes with goals, stories, and media.",
    },
    {
      icon: <DollarSign className="text-brand-purple" size={32} />,
      title: "Receive Donations",
      description:
        "Collect funds from donors worldwide who connect with your cause.",
    },
    {
      icon: <BarChart3 className="text-brand-purple" size={32} />,
      title: "Track Progress",
      description:
        "Monitor donations, engage with donors, and share your impact.",
    },
  ];

  return (
    <section className="py-20 bg-white" id="how-it-works">
      <div className="container-custom">
        <h2 className="section-title">How It Works</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16">
          Our streamlined process makes it easy for verified NGOs to create
          fundraising Causes and connect with donors who care about their
          cause.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 card-hover"
            >
              <div className="h-14 w-14 mb-4 rounded-full bg-brand-purple-light flex items-center justify-center">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
