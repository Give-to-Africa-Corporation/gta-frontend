import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/Image";
import { Campaign } from "@/lib/types";
import { FALLBACK_IMAGE } from "@/lib/utils";
import { campaignApi } from "@/service/apiService";
import { ArrowRight, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const FeaturedCausesSection = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await campaignApi.getAllCampaigns();
        // Sort by creation date (newest first) and take top 3
        const sortedCampaigns = response.data
          .sort((a: Campaign, b: Campaign) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, 3);
        setCampaigns(sortedCampaigns);
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Calculate days left for each campaign
  const getDaysLeft = (deadline: number) => {
    const today = new Date();
    const endDate = new Date(deadline);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
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

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center">Loading campaigns...</div>
        </div>
      </section>
    );
  }

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
          {campaigns.map((campaign) => (
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
                <Image
                  src={
                    campaign.media.mainImage.startsWith("http")
                      ? campaign.media.mainImage
                      : `${import.meta.env.VITE_BE_URL}${
                          campaign.media.mainImage
                        }`
                  }
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                  fallback={FALLBACK_IMAGE}
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">
                  {campaign.title.slice(0, 20)}...
                </h3>
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{campaign.country}</span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {campaign.description}
                </p>

                {/* Donate Now Button */}
                <Button
                  variant="default"
                  className="w-full bg-brand-purple hover:bg-brand-purple-dark"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(
                      `/campaigns/${
                        campaign.campaignSlug || campaign._id
                      }/donate`
                    );
                  }}
                >
                  Donate Now
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/campaigns">
            <Button className="bg-brand-purple hover:bg-brand-purple-dark">
              View All Grassroot Champions
              <ArrowRight size={18} className="ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
