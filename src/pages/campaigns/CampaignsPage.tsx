// @ts-nocheck
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
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { toast } from "sonner";
import { MdEmail, MdFacebook, MdWhatsapp } from "react-icons/md";
import { FaLinkedinIn, FaReddit, FaXTwitter } from "react-icons/fa6";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { IoMdCopy } from "react-icons/io";
import { campaignApi } from "@/service/apiService";
import bgFlag1 from "../../../public/images/flag1.webp";

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
      campaigns.map((campaign) => campaign.country),
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

  const ShareButton = ({ item }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const dropdownRef = useRef(null);
    const [pos, setPos] = useState({ top: 0, left: 0 });

    const shareUrl = `${window.location.origin}/campaigns/${item.campaignSlug || item._id}`;
    const shareText = encodeURIComponent(item.title || "");

    const handleCopy = (shareUrl) => {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => toast.success("Copied to clipboard!"))
        .catch(() => toast.error("Failed to copy!"));
    };

    // 👉 CLICK TO OPEN / CLOSE
    const handleToggle = (e) => {
      e.stopPropagation();
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      setPos({
        top: rect.top,
        left: rect.left + rect.width / 0.2,
      });

      setOpen((prev) => !prev);
    };

    // 👉 CLICK OUTSIDE TO CLOSE
    useEffect(() => {
      const handleOutside = (e) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(e.target) &&
          !ref.current.contains(e.target)
        ) {
          setOpen(false);
        }
      };

      document.addEventListener("click", handleOutside);
      return () => document.removeEventListener("click", handleOutside);
    }, []);

    return (
      <>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <div
          ref={ref}
          onClick={handleToggle}
          className="cursor-pointer relative"
        >
          {/* Share Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"></path>
          </svg>

          {open &&
            createPortal(
              <div
                ref={dropdownRef}
                style={{
                  position: "fixed",
                  top: pos.top - 5,
                  left: pos.left,
                  transform: "translate(-50%, -100%)",
                }}
                className="absolute 
                left-1/2 
                -translate-x-1/2 
                -top-2 
                -translate-y-full 
                w-64 
                bg-white 
                rounded-2xl 
                shadow-xl 
                p-4 
                z-50"
              >
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <button
                    className="flex gap-2 items-center"
                    onClick={() => window.open(`mailto:?body=${shareUrl}`)}
                  >
                    <MdEmail className="w-6 h-6 bg-gray-300 text-white p-1 rounded-full" />{" "}
                    Email
                  </button>
                  <button
                    className="flex gap-2 items-center"
                    onClick={() =>
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
                      )
                    }
                  >
                    <MdFacebook className="w-7 h-7 text-blue-700 rounded-full" />{" "}
                    Facebook
                  </button>
                  <button
                    className="flex gap-2 items-center"
                    onClick={() =>
                      window.open(
                        `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`,
                      )
                    }
                  >
                    <FaXTwitter className="w-6 h-6 bg-black text-white p-1 rounded-full" />{" "}
                    X
                  </button>
                  <button
                    className="flex gap-2 items-center"
                    onClick={() =>
                      window.open(`https://wa.me/?text=${shareUrl}`)
                    }
                  >
                    <MdWhatsapp className="w-6 h-6 bg-green-500 text-white p-1 rounded-full" />{" "}
                    WhatsApp
                  </button>
                  <button
                    className="flex gap-2 items-center"
                    onClick={() =>
                      window.open(
                        `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
                      )
                    }
                  >
                    <FaLinkedinIn className="w-6 h-6 bg-blue-500 text-white p-1 rounded-full" />{" "}
                    LinkedIn
                  </button>
                  <button
                    className="flex gap-2 items-center"
                    onClick={() =>
                      window.open(
                        `https://www.reddit.com/submit?url=${shareUrl}`,
                      )
                    }
                  >
                    <FaReddit className="w-6 h-6 bg-red-500 text-white p-1 rounded-full" />{" "}
                    Reddit
                  </button>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(shareUrl);
                  }}
                  className="mt-4 flex items-center gap-3 justify-center w-full border border-emerald-500 text-primary py-2 rounded-full"
                >
                  <IoMdCopy className="w-5 h-5" /> Copy link
                </button>
              </div>,
              document.body,
            )}
        </div>
      </>
    );
  };

  const getResolvedImage = (item) => {
    const imageUrl = item.media?.mainImage || item.image || "/placeholder.jpg";
    return imageUrl.startsWith("http")
      ? imageUrl
      : `${import.meta.env.VITE_BE_URL}${imageUrl}`;
  };

  const getResolvedprofileImage = (item) => {
    const imageUrl = item?.ngoId?.profileImage || "/placeholder.jpg";
    return imageUrl.startsWith("http")
      ? imageUrl
      : `${import.meta.env.VITE_BE_URL}${imageUrl}`;
  };

  const LikeButton = ({ item, campaignId }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(item?.likes || 0);
    const [isLoading, setIsLoading] = useState(false);
    const [userIP, setUserIP] = useState(null);

    // Get user IP on component mount
    React.useEffect(() => {
      const fetchUserIP = async () => {
        try {
          const response = await fetch("https://api.ipify.org?format=json");
          const data = await response.json();
          setUserIP(data.ip);
          // console.log("User IP fetched:", data.ip);

          // Check if this IP has already liked this campaign (from localStorage)
          const likedCampaigns = JSON.parse(
            localStorage.getItem(`likedCampaigns_${data.ip}`) || "[]",
          );
          const hasLiked = likedCampaigns.includes(campaignId);
          setIsLiked(hasLiked);
          // console.log("Has liked this campaign:", hasLiked);
        } catch (error) {
          console.error("Failed to fetch user IP:", error);
          setUserIP("unknown");
        }
      };

      fetchUserIP();
    }, [campaignId]);

    const handleLike = async (e) => {
      e.stopPropagation();
      e.preventDefault();

      // console.log("❤️ Like/Unlike button clicked!");
      // console.log("campaignId:", campaignId);
      // console.log("userIP:", userIP);
      // console.log("isLiked:", isLiked);

      if (isLoading) {
        console.log("Already loading, skipping...");
        return;
      }

      try {
        setIsLoading(true);

        if (isLiked) {
          // Unlike
          // console.log("Making API call to unlikeCampaign...");
          const response = await campaignApi.unlikeCampaign(
            campaignId,
            userIP || "unknown",
          );

          // console.log("✅ Unlike response:", response);

          if (response.success && response.data) {
            setIsLiked(false);
            setLikeCount(response.data.likes);

            // Remove from localStorage
            const likedCampaigns = JSON.parse(
              localStorage.getItem(`likedCampaigns_${userIP}`) || "[]",
            );
            const updated = likedCampaigns.filter((id) => id !== campaignId);
            localStorage.setItem(
              `likedCampaigns_${userIP}`,
              JSON.stringify(updated),
            );

            toast.success("You unliked this campaign!");
          } else {
            console.log("❌ API error:", response.error);
            toast.error(response.error || "Failed to unlike campaign");
          }
        } else {
          // Like
          console.log("Making API call to likeCampaign...");
          const response = await campaignApi.likeCampaign(
            campaignId,
            userIP || "unknown",
          );

          // console.log("✅ Like response:", response);

          if (response.success && response.data) {
            setIsLiked(true);
            setLikeCount(response.data.likes);

            // Add to localStorage
            const likedCampaigns = JSON.parse(
              localStorage.getItem(`likedCampaigns_${userIP}`) || "[]",
            );
            if (!likedCampaigns.includes(campaignId)) {
              likedCampaigns.push(campaignId);
            }
            localStorage.setItem(
              `likedCampaigns_${userIP}`,
              JSON.stringify(likedCampaigns),
            );

            toast.success("You liked this campaign!");
          } else {
            console.log("❌ API error:", response.error);
            toast.error(response.error || "Failed to like campaign");
          }
        }
      } catch (error) {
        console.error("❌ Error:", error);
        toast.error("Failed to process your request");
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <button
        onClick={handleLike}
        disabled={isLoading}
        className="cursor-pointer transition-all duration-200 hover:scale-110 flex items-center gap-1"
        title="Like this campaign"
      >
        {isLiked ? (
          <FaHeart className="w-6 h-6 text-primary" />
        ) : (
          <FaRegHeart className="w-6 h-6 text-primary hover:text-primary" />
        )}
        {likeCount > 0 && (
          <span className="text-xs text-gray-600">{likeCount}</span>
        )}
      </button>
    );
  };

  return (
    <div
  className="relative min-h-[80vh] bg-fixed bg-center bg-cover"
  style={{
    backgroundImage:`url(${bgFlag1})`,
  }}
>
  {/* Blur & Dark Overlay */}
  <div className="absolute inset-0 bg-gray-900/60 "></div>
      <div className="container mx-auto py-8 px-4">
        <div className="relative flex flex-col">
        <div className="z-10 bg-white p-5 rounded-lg mb-6 shadow-sm">
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 h-full z-10">
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
                    ? "mt-0 sm:mt-2" // mobile pe 0, sm+ pe stagger
                    : ""
                  : "";

              return (
                <div key={campaign._id || campaign.id} className={staggerClass}>
                  <Card
                    key={campaign._id || campaign.id}
                    className={`group rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col
                                ${index % 2 === 0 ? "mt-0" : "mt-8"} cursor-pointer`}
                    onClick={() =>
                      navigate(
                        `/campaigns/${campaign.campaignSlug || campaign._id}`,
                      )
                    }
                  >
                    <div className="px-4 py-3">
                      {/* Top Row */}
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        {campaign?.ngoId?.profileImage ? (
                          <img
                            src={getResolvedprofileImage(campaign)}
                            alt={campaign?.ngoId?.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-700 font-semibold text-md uppercase">
                              {campaign?.ngoId?.name?.charAt(0)}
                            </span>
                          </div>
                        )}

                        {/* Name + Donation */}
                        <div className="flex flex-col">
                          <p className="text-gray-800 font-medium text-sm">
                            {campaign?.ngoId?.name}
                          </p>
                          {/* <span className="text-gray-500 text-xs">
                                                              donated • {item?.pendingPayments?.length}
                                                          </span> */}
                        </div>
                      </div>

                      {/* Description */}
                      <CardDescription
                        className="text-gray-700 text-sm mt-2 line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html:
                            campaign.short_description || campaign.description,
                        }}
                      >
                        {/* {item.short_description || item.description} */}
                      </CardDescription>
                    </div>

                    {/* Image Section with overlay */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={getResolvedImage(campaign)}
                        alt={campaign.title}
                        className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Overlay badge */}
                      {/* <div className="absolute bg-black text-white text-xs font-semibold px-3 py-1 rounded-full shadow top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                                      {item.cause}
                                                  </div> */}
                    </div>

                    {/* Card Content */}
                    <CardHeader className="p-4">
                      <CardTitle className="text-gray-900 text-lg font-semibold line-clamp-1">
                        {campaign.title}
                      </CardTitle>
                      <div className="flex items-center text-sm text-gray-800 mt-1">
                        {/* <MapPin className="h-4 w-4 mr-1" />
                                                      <span>{item.country || "Unknown"}</span> */}
                        {campaign.cause}
                      </div>
                      <CardDescription
                        className="text-gray-700 text-sm mt-2 line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html:
                            campaign.short_description || campaign.description,
                        }}
                      >
                        {/* {campaign.short_description || campaign.description} */}
                      </CardDescription>
                    </CardHeader>

                    {/* Footer */}
                    <CardContent className="relative overflow-visible mt-auto border-t border-gray-100 p-4 flex items-center justify-between">
                      <div className="flex gap-3">
                        <ShareButton item={campaign} />
                        <LikeButton
                          item={campaign}
                          campaignId={campaign._id || campaign.id}
                        />
                      </div>
                      <Button
                        className="bg-brand-purple hover:bg-brand-purple-light text-white rounded-full px-5 py-1 text-sm shadow"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(
                            `/campaigns/${campaign.campaignSlug || campaign._id}/donate`,
                          );
                        }}
                      >
                        Donate
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
                        ? "pointer-events-none opacity-50  text-white"
                        : "cursor-pointer  text-white"
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
                          className="cursor-pointer "
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
                        <PaginationEllipsis className=" text-white" />
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
                          Math.ceil(filteredCampaigns.length / itemsPerPage),
                        ),
                      )
                    }
                    className={
                      currentPage ===
                      Math.ceil(filteredCampaigns.length / itemsPerPage)
                        ? "pointer-events-none opacity-50  text-white"
                        : "cursor-pointer  text-white"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
        <img
          src="https://cdn.prod.website-files.com/5f6b00b40c0b1e4bf53c7d60/66703674a5a268dcdbfaccbb_bg-4.png"
          loading="lazy"
          width="206"
          height="304"
          alt=""
          className="bg-4"
        />
        </div>
      </div>
    </div>
  );
}
