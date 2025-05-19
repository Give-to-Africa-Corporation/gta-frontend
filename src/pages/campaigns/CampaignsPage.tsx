import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Image } from "@/components/ui/Image";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { campaignCauses } from "@/lib/types";
import { FALLBACK_IMAGE } from "@/lib/utils";
import { CalendarDays, Infinity, MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// Local Campaign interface that accommodates both backend and frontend models
interface ExtendedCampaign {
  id: string;
  _id?: string;
  ngoId: string;
  title: string;
  description: string;
  goal?: number;
  fundingGoal?: number;
  raised?: number;
  totalRaised?: number;
  endDate?: string;
  deadline?: number;
  isPerpetual?: boolean;
  status: "ongoing" | "completed" | "paused";
  image?: string;
  media?: {
    mainImage: string;
    additionalImages?: string[];
  };
  donors?: number;
  country: string;
  cause: string;
  campaignSlug?: string;
}

// Function to check if a campaign is perpetual
const isCampaignPerpetual = (campaign: ExtendedCampaign): boolean => {
  // Check explicit perpetual flag
  if (campaign.isPerpetual) return true;

  // Check if no deadline or endDate
  if (!campaign.deadline && !campaign.endDate) return true;

  return false;
};

export default function CampaignsPage() {
  const navigate = useNavigate();
  const { campaigns: contextCampaigns } = useAppContext();
  // Treat the campaigns as our extended type
  const campaigns = contextCampaigns as unknown as ExtendedCampaign[];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [countryFilter, setCountryFilter] = useState<string>("");
  const [causeFilter, setCauseFilter] = useState<string>("");

  // Get unique countries from campaigns
  const countries = useMemo(() => {
    const uniqueCountries = new Set(
      campaigns.map((campaign) => campaign.country)
    );
    return Array.from(uniqueCountries).sort();
  }, [campaigns]);

  // Filter campaigns based on search, status, country and cause
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(search.toLowerCase()) ||
      campaign.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      !statusFilter ||
      statusFilter === "all" ||
      campaign.status === statusFilter;

    const matchesCountry =
      !countryFilter ||
      countryFilter === "all" ||
      campaign.country === countryFilter;

    const matchesCause =
      !causeFilter || causeFilter === "all" || campaign.cause === causeFilter;

    return matchesSearch && matchesStatus && matchesCountry && matchesCause;
  });

  // Helper function to calculate days left - handles both deadline and endDate formats
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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Give to Africa Campaigns</h1>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
          </SelectContent>
        </Select>

        <Select value={countryFilter} onValueChange={setCountryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {countries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={causeFilter} onValueChange={setCauseFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Keyword" />
          </SelectTrigger>
          <SelectContent>
            {campaignCauses.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => {
            setSearch("");
            setStatusFilter("");
            setCountryFilter("");
            setCauseFilter("");
          }}
          className="h-10"
        >
          Reset Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => {
          const progressPercent = Math.min(
            Math.round(
              ((campaign.totalRaised || campaign.raised || 0) /
                (campaign.fundingGoal || campaign.goal || 1)) *
                100
            ),
            100
          );

          const daysLeft = getDaysLeft(campaign.deadline, campaign.endDate);
          const isPerpetual = isCampaignPerpetual(campaign);

          // Handle image from both models
          const imageUrl = campaign.media?.mainImage || campaign.image;

          return (
            <Card
              key={campaign._id || campaign.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() =>
                navigate(
                  `/campaigns/${
                    campaign.campaignSlug || campaign._id || campaign.id
                  }`
                )
              }
            >
              <div className="h-48 w-full relative">
                <Image
                  src={
                    imageUrl.startsWith("http")
                      ? imageUrl
                      : `${import.meta.env.VITE_BE_URL}${imageUrl}`
                  }
                  alt={campaign.title}
                  className="h-full w-full object-cover rounded-t-lg"
                  fallback={FALLBACK_IMAGE}
                />
                <div className="absolute top-2 right-2">
                  {getCauseBadge(campaign.cause)}
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="line-clamp-1">{campaign.title}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{campaign.country}</span>
                </div>
                <CardDescription className="line-clamp-2">
                  {campaign.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">
                        $
                        {(
                          campaign.totalRaised ||
                          campaign.raised ||
                          0
                        ).toLocaleString()}{" "}
                        raised
                      </span>
                      {!isPerpetual && (
                        <span className="text-gray-500">
                          of $
                          {(
                            campaign.fundingGoal ||
                            campaign.goal ||
                            0
                          ).toLocaleString()}
                        </span>
                      )}
                    </div>
                    {!isPerpetual && (
                      <Progress value={progressPercent} className="h-2" />
                    )}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{campaign.donors || 0} donors</span>
                    {isPerpetual ? (
                      <span className="flex items-center text-brand-purple">
                        <Infinity className="h-4 w-4 mr-1" /> Ongoing
                      </span>
                    ) : campaign.status === "ongoing" ? (
                      <span className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-1" />
                        {daysLeft > 0
                          ? `${daysLeft} days left`
                          : "Ending today"}
                      </span>
                    ) : (
                      <span>
                        {campaign.status === "completed"
                          ? "Ended"
                          : campaign.status}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredCampaigns.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">
              No campaigns found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
