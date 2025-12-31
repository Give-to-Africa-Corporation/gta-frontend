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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import { MapPin, Search } from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Show 9 campaigns per page (3x3 grid)

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
        <h1 className="text-3xl font-bold">African Causes</h1>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              placeholder="Search causes..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
        >
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

        <Select
          value={countryFilter}
          onValueChange={(value) => {
            setCountryFilter(value);
            setCurrentPage(1);
          }}
        >
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

        <Select
          value={causeFilter}
          onValueChange={(value) => {
            setCauseFilter(value);
            setCurrentPage(1);
          }}
        >
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
            setCurrentPage(1);
          }}
          className="h-10"
        >
          Reset Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 h-full">
        {filteredCampaigns
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((campaign, index) => {
            const imageUrl =
              campaign.media?.mainImage || campaign.image || FALLBACK_IMAGE;
            const resolvedImage = imageUrl.startsWith("http")
              ? imageUrl
              : `${import.meta.env.VITE_BE_URL}${imageUrl}`;

            const staggerClass =
              index > 0
                ? index % 4 === 1 || index % 4 === 3
                  ? "mt-0 sm:mt-8" // mobile pe 0, sm+ pe stagger
                  : ""
                : "";

            return (
              <div key={campaign._id || campaign.id} className={staggerClass}>
                <Card
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 rounded-2xl bg-white border border-gray-100 overflow-hidden group"
                  onClick={() =>
                    navigate(`/campaigns/${campaign.campaignSlug || campaign._id}`)
                  }
                >
                  {/* Image Section with overlay */}
                  <div className="h-48 w-full relative overflow-hidden">
                    <img
                      src={resolvedImage}
                      alt={campaign.title}
                      className="h-full w-full object-cover rounded-t-2xl transform group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* subtle overlay badge */}
                    <div className="absolute bg-black text-white text-xs font-semibold px-3 py-1 rounded-full shadow top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {campaign.cause}
                    </div>
                  </div>

                  {/* Card Content */}
                  <CardHeader className="p-4">
                    <CardDescription className="line-clamp-2 text-gray-400">
                      {campaign.cause}
                    </CardDescription>
                    <CardTitle className="line-clamp-1 text-lg font-semibold text-gray-800 transition-colors">
                      {campaign.title}
                    </CardTitle>

                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{campaign.country}</span>
                    </div>

                    <CardDescription className="line-clamp-2 text-gray-600 mt-2">
                      {campaign.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-4 pt-0">
                    <Button
                      variant="default"
                      className="mt-4 rounded-xl transition-colors shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/campaigns/${campaign.campaignSlug || campaign._id}/donate`
                        );
                      }}
                    >
                      Donate Now
                    </Button>
                  </CardContent>
                </Card>
              </div>

            );
          })}
      </div>

      {filteredCampaigns.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {Array.from({
                length: Math.ceil(filteredCampaigns.length / itemsPerPage),
              }).map((_, index) => {
                const pageNumber = index + 1;
                // Show first page, last page, current page, and pages around current page
                if (
                  pageNumber === 1 ||
                  pageNumber ===
                  Math.ceil(filteredCampaigns.length / itemsPerPage) ||
                  (pageNumber >= currentPage - 1 &&
                    pageNumber <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNumber)}
                        isActive={currentPage === pageNumber}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(
                        prev + 1,
                        Math.ceil(filteredCampaigns.length / itemsPerPage)
                      )
                    )
                  }
                  className={
                    currentPage ===
                      Math.ceil(filteredCampaigns.length / itemsPerPage)
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
