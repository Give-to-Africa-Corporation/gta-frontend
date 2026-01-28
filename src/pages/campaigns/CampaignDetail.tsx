import { Footer } from "@/components/shared/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Image } from "@/components/ui/Image";
import { useAppContext } from "@/context/AppContext";
import { Campaign as ApiCampaign } from "@/lib/types";
import { FALLBACK_IMAGE } from "@/lib/utils";
import { campaignApi } from "@/service/apiService";
import { CalendarDays, Infinity, Loader2, MapPin, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import bgFlag5 from "../../../public/images/flag5.webp";

// Extended campaign type to handle both frontend and backend models
type ExtendedCampaign = ApiCampaign & {
  id?: string;
  image?: string;
  raised?: number;
  donors?: number;
  isPerpetual?: boolean;
  endDate?: string;
};

const CampaignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { campaigns, ngos, user, isLoading: contextLoading } = useAppContext();
  console.log(campaigns, "campaigns????")
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState<ExtendedCampaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch campaign data
  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;

      setIsLoading(true);

      try {
        // Try to fetch from API first
        const response = await campaignApi.getCampaign(id); 

        if (response.success && response.data) {
          // Add id field (create alias for _id) for consistency
          const apiCampaign = response.data;
          const extendedCampaign: ExtendedCampaign = {
            ...apiCampaign,
            id: apiCampaign._id,
            isPerpetual: !apiCampaign.deadline,
          };

          setCampaign(extendedCampaign);

          // Update the URL if loaded with ID and there's a slug available
          if (
            apiCampaign.campaignSlug &&
            id !== apiCampaign.campaignSlug &&
            !id.includes("-")
          ) {
            // Only update if the current URL uses ID format instead of slug
            window.history.replaceState(
              null,
              "",
              `/campaigns/${apiCampaign.campaignSlug}`
            );
          }
        } else {
          // Fallback to context if API fails
          fallbackToContextData();
        }
      } catch (error) {
        console.error("Error fetching campaign:", error);
        fallbackToContextData();
      } finally {
        setIsLoading(false);
      }
    };

    // Fallback function to use context data if API fails
    const fallbackToContextData = () => {
      // First try to find by ID
      let foundCampaign = campaigns.find((c) => c._id === id);

      // If not found by ID, try to find by slug
      if (!foundCampaign && id) {
        foundCampaign = campaigns.find((c) => c.campaignSlug === id);
      }

      if (foundCampaign) {
        setCampaign(foundCampaign as ExtendedCampaign);

        // Update URL if we found by ID but campaign has a slug
        if (
          foundCampaign.campaignSlug &&
          id !== foundCampaign.campaignSlug &&
          !id.includes("-")
        ) {
          window.history.replaceState(
            null,
            "",
            `/campaigns/${foundCampaign.campaignSlug}`
          );
        }
      } else {
        setError("Campaign not found");
        toast.error("Campaign not found");
      }
    };

    fetchCampaign();
  }, [id, campaigns]);

  // Calculate days left for a campaign
  const getDaysLeft = (deadline?: number, endDate?: string) => {
    if (!deadline && !endDate) return null; // For perpetual campaigns

    const end = deadline
      ? new Date(deadline)
      : endDate
      ? new Date(endDate)
      : null;
    if (!end) return null;

    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Function to check if a campaign is perpetual/ongoing
  const isPerpetualCampaign = (campaign: ExtendedCampaign): boolean => {
    // Check explicit perpetual flag
    if (campaign.isPerpetual) return true;

    // Check if no deadline or endDate
    if (!campaign.deadline && !campaign.endDate) return true;

    return false;
  };

  // Get cause badge
  const getCauseBadge = (cause: string) => {
    const badgeColors: Record<string, string> = {
      education: "bg-blue-500",
      health: "bg-red-500",
      environment: "bg-green-500",
      hunger: "bg-yellow-500",
      water: "bg-sky-500",
      other: "bg-gray-500",
    };

    return (
      <Badge className={`${badgeColors[cause] || "bg-gray-500"}`}>
        {cause}
      </Badge>
    );
  };

  if (isLoading || contextLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-brand-purple mx-auto" />
            <p className="mt-4 text-lg">Loading Causes details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Causes not found</h2>
            <p className="mt-2 text-gray-600">
              The Causes you're looking for doesn't exist
            </p>
            <Button className="mt-6" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const progressPercent = Math.min(
    Math.round(
      ((campaign.totalRaised || campaign.raised || 0) /
        (campaign.fundingGoal || 1)) * // Add fallback to 1 to avoid division by zero
        100
    ),
    100
  );

  const daysLeft = getDaysLeft(campaign.deadline, campaign.endDate);
  const isPerpetual = isPerpetualCampaign(campaign);

  const ngoInfo = ngos.find(
    (n) => n.id === campaign.ngoId || n._id === campaign.ngoId
  );

  // Get image URL from either backend or frontend model
  const imageUrl = campaign.media?.mainImage || campaign.image;

  const handleDonateClick = () => {
    navigate(
      `/campaigns/${campaign.campaignSlug || campaign._id || id}/donate`
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        {/* Campaign Header */}
        <div className="w-full h-64 md:h-96 bg-gray-200 relative">
          <Image
            src={`${import.meta.env.VITE_BE_URL}${imageUrl}`}
            alt={campaign.title}
            className="w-full h-full object-cover"
            fallback={FALLBACK_IMAGE}
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
            <div className="container-custom">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {campaign.title}
              </h1>
              <div className="flex items-center space-x-2">
                <span className="bg-brand-purple text-white text-xs px-2 py-1 rounded-full">
                  {campaign.status === "ongoing"
                    ? "Ongoing Causes"
                    : campaign.status}
                </span>
                {isPerpetual ? (
                  <span className="text-sm flex items-center">
                    <Infinity className="inline-block h-4 w-4 mr-1" /> Ongoing
                    Causes
                  </span>
                ) : (
                  <span className="text-sm">
                    <CalendarDays className="inline-block h-4 w-4 mr-1" />
                    {campaign.status === "ongoing"
                      ? daysLeft > 0
                        ? `${daysLeft} days left`
                        : "Ending today"
                      : "Causes ended"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

              <div
  className="relative min-h-[80vh] bg-fixed bg-center bg-cover"
  style={{
    backgroundImage:
      `url(${bgFlag5})`,
  }}
>
  {/* Blur & Dark Overlay */}
  <div className="absolute inset-0 bg-gray-900/60"></div>
        {/* Campaign Content */}
        <div className="relative container-custom py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {getCauseBadge(campaign.cause)}
                  <div className="flex items-center text-sm px-2 py-1 bg-gray-100 rounded-full">
                    <MapPin className="h-4 w-4 mr-1" />
                    {campaign.country}
                  </div>
                </div>

                <div className="prose max-w-none">
                  <p className="text-white"
                    style={{
                      whiteSpace: "pre-line",
                    }}
                    dangerouslySetInnerHTML={{
                                    __html: campaign.description,
                                }}
                  >
                    {/* {campaign.description} */}
                  </p>
                </div>

                {/* Campaign NGO Info */}
                {/* <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      {ngoInfo?.profileImage ? (
                        <AvatarImage
                          src={
                            ngoInfo.profileImage.startsWith("http")
                              ? ngoInfo.profileImage
                              : `${import.meta.env.VITE_BE_URL}${
                                  ngoInfo.profileImage
                                }`
                          }
                          alt={ngoInfo.name}
                        />
                      ) : (
                        <AvatarFallback>
                          {ngoInfo?.name?.charAt(0) || "N"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h3 className="font-medium">
                        {ngoInfo?.name || "Anonymous NGO"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Campaign Organizer
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div> */}

                {/* Campaign Media Gallery */}
                {campaign.media?.additionalImages?.length ? (
                  <div>
                    <h3 className="text-lg font-medium mb-3">
                      Causes Logo
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {campaign.media.additionalImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg overflow-hidden h-48"
                        >
                          <Image
                            src={`${import.meta.env.VITE_BE_URL}${img}`}
                            alt={`${campaign.title} - image ${idx + 1}`}
                            className="w-full h-full object-cover"
                            fallback={FALLBACK_IMAGE}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">
                    Share this Causes
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full flex items-center justify-center gap-2 hover:bg-gray-50"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Link copied to clipboard!");
                      }}
                    >
                      <Share2 className="h-5 w-5" />
                      <span>Copy Link</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full flex items-center justify-center gap-2 hover:bg-[#1DA1F2]/10"
                      onClick={() => {
                        const text = `Check out this Causes: ${campaign.title}`;
                        const url = `https://x.com/intent/tweet?text=${encodeURIComponent(
                          text
                        )}&url=${encodeURIComponent(window.location.href)}`;
                        window.open(url, "_blank");
                      }}
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      <span>X (Twitter)</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full flex items-center justify-center gap-2 hover:bg-[#0077B5]/10"
                      onClick={() => {
                        const shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                          window.location.href
                        )}`;
                        window.open(shareUrl, "_blank", "noopener,noreferrer");
                      }}
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      <span>LinkedIn</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full flex items-center justify-center gap-2 hover:bg-[#229ED9]/10"
                      onClick={() => {
                        const text = `Check out this Causes: ${campaign.title}`;
                        const url = `https://t.me/share/url?url=${encodeURIComponent(
                          window.location.href
                        )}&text=${encodeURIComponent(text)}`;
                        window.open(url, "_blank");
                      }}
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.29-.49.8-.75 3.12-1.36 5.2-2.26 6.24-2.7 2.98-1.24 3.6-1.45 4.01-1.45.09 0 .28.02.4.09.11.06.18.14.21.24.02.1.01.21 0 .23z" />
                      </svg>
                      <span>Telegram</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full flex items-center justify-center gap-2 hover:bg-[#25D366]/10"
                      onClick={() => {
                        const text = `Check out this Causes: ${campaign.title} ${window.location.href}`;
                        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
                          text
                        )}`;
                        window.open(url, "_blank");
                      }}
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      <span>WhatsApp</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full flex items-center justify-center gap-2 hover:bg-gray-50"
                      onClick={() => {
                        const embedCode = `<iframe src="${
                          window.location.origin
                        }/campaigns/${
                          campaign.campaignSlug || campaign._id
                        }/embed" width="100%" height="500" frameborder="0" style="border: none; max-width: 100%; border-radius: 8px;"></iframe>`;
                        navigator.clipboard.writeText(embedCode);
                        toast.success("Embed code copied to clipboard!");
                      }}
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M16 18L22 12L16 6" />
                        <path d="M8 6L2 12L8 18" />
                      </svg>
                      <span>Embed</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Campaign Info Card */}
            <div>
              <div className="sticky top-24">
                <Card className="shadow-lg border-2">
                  <CardContent className="pt-6 space-y-6">
                    {/* Donation Amount Section */}
                    <div className="space-y-4">
                      {/* <div className="flex items-baseline justify-between">
                        <h3 className="font-bold text-2xl text-brand-purple">
                          $
                          {(
                            campaign.totalRaised ||
                            campaign.raised ||
                            0
                          ).toLocaleString()}
                        </h3>
                        <span className="text-sm text-gray-600">
                          {isPerpetual
                            ? "raised so far"
                            : `of $${campaign.fundingGoal?.toLocaleString()}`}
                        </span>
                      </div> */}

                      {/* Progress Section */}
                      {/* {!isPerpetual && (
                        <div className="space-y-2">
                          <Progress
                            value={progressPercent}
                            className="h-3 rounded-full bg-gray-100"
                          />
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-brand-purple">
                              {progressPercent}% Complete
                            </span>
                            <span className="text-gray-600">
                              {campaign.status === "ongoing"
                                ? daysLeft > 0
                                  ? `${daysLeft} days left`
                                  : "Ending today"
                                : "Campaign ended"}
                            </span>
                          </div>
                        </div>
                      )} */}

                      {/* Donors Count */}
                      {/* <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <span className="font-bold text-xl text-brand-purple">
                          {campaign.donations?.length || campaign.donors || 0}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">
                          Generous Donors
                        </p>
                      </div> */}
                    </div>

                    {/* Campaign Status Badge */}
                    {isPerpetual ? (
                      <div className="flex items-center justify-center gap-2 bg-brand-purple/10 text-brand-purple rounded-full py-2">
                        <Infinity className="h-5 w-5" />
                        <span className="font-medium">Ongoing Causes</span>
                      </div>
                    ) : campaign.status === "ongoing" ? (
                      <div className="flex items-center justify-center gap-2 bg-green-50 text-green-600 rounded-full py-2">
                        <span className="font-medium">Active Causes</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 bg-gray-50 text-gray-600 rounded-full py-2">
                        <span className="font-medium">Causes Ended</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-4">
                      <Button
                        className="w-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                        size="lg"
                        onClick={handleDonateClick}
                      >
                        Donate Now
                      </Button>

                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-center gap-2"
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success("Link copied to clipboard!");
                          }}
                        >
                          <Share2 className="h-4 w-4" />
                          Share
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-center gap-2"
                          onClick={() => {
                            const embedCode = `<iframe src="${
                              window.location.origin
                            }/campaigns/${
                              campaign.campaignSlug || campaign._id
                            }/embed" width="100%" height="500" frameborder="0" style="border: none; max-width: 100%; border-radius: 8px;"></iframe>`;
                            navigator.clipboard.writeText(embedCode);
                            toast.success("Embed code copied to clipboard!");
                          }}
                        >
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M16 18L22 12L16 6" />
                            <path d="M8 6L2 12L8 18" />
                          </svg>
                          Embed
                        </Button>
                      </div>
                    </div>

                    {/* Security Notice */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        Secure & Encrypted Transaction
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CampaignDetail;
