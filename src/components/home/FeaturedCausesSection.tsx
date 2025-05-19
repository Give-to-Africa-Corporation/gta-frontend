import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export const FeaturedCausesSection = () => {
  const mockCampaigns = [
    {
      media: {
        mainImage: "/images/3.jpg",
        additionalImages: ["/images/5.jpg", "/images/7.jpg"],
      },
      _id: "681a878733acf567e05dab0c",
      title: "Clean Water for Rural Communities",
      description:
        "Providing clean water access to remote villages across Ghana, improving health and quality of life for thousands of families.",
      ngoId: {
        _id: "681a7a3b408008ec6b6c4157",
        name: "Water Access Initiative",
        orgName: "Africa Water Foundation",
      },
      fundingGoal: 25000,
      totalRaised: 18750,
      cause: "water",
      country: "Ghana",
      status: "ongoing",
      deadline: 1719792000000,
      campaignSlug: "clean-water-rural-ghana",
      createdAt: "2024-08-15T10:23:18.129Z",
      updatedAt: "2024-08-15T10:23:18.129Z",
      __v: 0,
    },
    {
      media: {
        mainImage: "/images/2.jpg",
        additionalImages: ["/images/4.jpg", "/images/8.jpg"],
      },
      _id: "681a878733acf567e05dab0d",
      title: "Education for Girls in Rural Kenya",
      description:
        "Supporting education access for girls in underserved communities in Kenya, providing scholarships, supplies, and safe transportation.",
      ngoId: {
        _id: "681a7a3b408008ec6b6c4158",
        name: "Bright Future Initiative",
        orgName: "Pan-African Education Trust",
      },
      fundingGoal: 35000,
      totalRaised: 24500,
      cause: "education",
      country: "Kenya",
      status: "ongoing",
      deadline: 1724976000000,
      campaignSlug: "education-girls-kenya",
      createdAt: "2024-07-20T14:08:45.129Z",
      updatedAt: "2024-07-20T14:08:45.129Z",
      __v: 0,
    },
    {
      media: {
        mainImage: "/images/6.jpg",
        additionalImages: ["/images/1.jpg"],
      },
      _id: "681a878733acf567e05dab0e",
      title: "Healthcare Outreach for Rural Nigeria",
      description:
        "Mobile healthcare clinics bringing essential medical services to isolated communities across rural Nigeria.",
      ngoId: {
        _id: "681a7a3b408008ec6b6c4159",
        name: "Healthcare Access Network",
        orgName: "West African Medical Outreach",
      },
      fundingGoal: 42000,
      totalRaised: 16800,
      cause: "healthcare",
      country: "Nigeria",
      status: "ongoing",
      deadline: 1730160000000,
      campaignSlug: "healthcare-rural-nigeria",
      createdAt: "2024-08-01T09:52:33.129Z",
      updatedAt: "2024-08-01T09:52:33.129Z",
      __v: 0,
    },
  ];

  // Calculate days left for each campaign
  const getDaysLeft = (deadline: number) => {
    // Use future dates for the demo
    const futureDeadlines: Record<string, number> = {
      "681a878733acf567e05dab0c": 30, // Clean Water - 30 days left
      "681a878733acf567e05dab0d": 45, // Education - 45 days left
      "681a878733acf567e05dab0e": 60, // Healthcare - 60 days left
    };

    // Get the campaign ID from the deadline parameter (we'll extract it from the component rendering)
    const campaignId = mockCampaigns.find((c) => c.deadline === deadline)?._id;

    if (campaignId && futureDeadlines[campaignId]) {
      return futureDeadlines[campaignId];
    }

    // Fallback to date calculation if needed
    const today = new Date();
    const endDate = new Date(deadline);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 30; // Default to 30 days if date is in past
  };

  // Get cause label
  const getCauseLabel = (cause: string) => {
    const causeMap: Record<string, string> = {
      education: "Education",
      water: "Clean Water",
      healthcare: "Healthcare",
      environment: "Environment",
      hunger: "Hunger Relief",
      other: "Other",
    };
    return causeMap[cause] || "Other";
  };

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-orange/10 px-4 py-2 rounded-full text-brand-orange font-medium text-sm mb-4">
            Featured Causes
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Support Our Projects
          </h2>
          <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
            These projects are making a real difference in communities across
            Africa. Your contribution, no matter the size, helps transform
            lives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockCampaigns.map((campaign) => (
            <Card
              key={campaign._id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Category badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 bg-white/90 text-brand-purple text-sm font-medium rounded-full backdrop-blur-sm">
                  {getCauseLabel(campaign.cause)}
                </span>
              </div>

              {/* Image */}
              <div className="h-52 overflow-hidden">
                <img
                  src={campaign.media.mainImage}
                  alt={campaign.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">{campaign.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{campaign.country}</span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {campaign.description}
                </p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-brand-purple">
                      ${campaign.totalRaised.toLocaleString()}
                    </span>
                    <span className="text-gray-500">
                      Goal: ${campaign.fundingGoal.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={(campaign.totalRaised / campaign.fundingGoal) * 100}
                    className="h-2 bg-gray-100"
                  />
                  <div className="flex justify-between text-sm mt-2">
                    <span>{Math.floor(Math.random() * 50) + 10} donors</span>
                    <span className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-1" />
                      {getDaysLeft(campaign.deadline)} days left
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/campaigns">
            <Button className="bg-brand-purple hover:bg-brand-purple-dark">
              View All Projects
              <ArrowRight size={18} className="ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
