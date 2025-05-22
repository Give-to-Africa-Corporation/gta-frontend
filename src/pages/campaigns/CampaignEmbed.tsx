import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Image } from "@/components/ui/Image";
import { Progress } from "@/components/ui/progress";
import { Campaign as ApiCampaign } from "@/lib/types";
import { FALLBACK_IMAGE } from "@/lib/utils";
import { campaignApi } from "@/service/apiService";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CampaignEmbed = () => {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<ApiCampaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;
      try {
        const response = await campaignApi.getCampaign(id);
        if (response.success && response.data) {
          setCampaign(response.data);
        }
      } catch (error) {
        console.error("Error fetching campaign:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
      </div>
    );
  }

  if (!campaign) {
    return <div>Campaign not found</div>;
  }

  const progressPercent = Math.min(
    Math.round((campaign.totalRaised / campaign.fundingGoal) * 100),
    100
  );

  const isPerpetual = !campaign.deadline;

  return (
    <Card className="w-full h-full shadow-none border-0">
      <CardContent className="p-4">
        <div className="aspect-video mb-4 rounded-lg overflow-hidden">
          <Image
            src={`${import.meta.env.VITE_BE_URL}${campaign.media?.mainImage}`}
            alt={campaign.title}
            className="w-full h-full object-cover"
            fallback={FALLBACK_IMAGE}
          />
        </div>

        <h2 className="text-xl font-semibold mb-2">{campaign.title}</h2>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {campaign.description}
        </p>

        <div className="space-y-3">
          <h3 className="font-semibold">
            ${campaign.totalRaised.toLocaleString()}
            {isPerpetual ? " raised so far" : ""}
          </h3>

          {!isPerpetual && (
            <>
              <Progress value={progressPercent} className="h-2" />
              <div className="flex justify-between text-sm">
                <span>
                  <span className="font-medium">{progressPercent}%</span> of $
                  {campaign.fundingGoal.toLocaleString()}
                </span>
              </div>
            </>
          )}

          <Button
            className="w-full"
            onClick={() => {
              window.open(
                `${window.location.origin}/campaigns/${
                  campaign.campaignSlug || campaign._id
                }`,
                "_blank"
              );
            }}
          >
            Donate Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignEmbed;
