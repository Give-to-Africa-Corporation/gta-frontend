// @ts-nocheck
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/context/AppContext";
import { NgoStats } from "@/lib/types";
import {
  ArrowRightLeft,
  Banknote,
  ChevronDown,
  FileText,
  LayoutDashboard,
  LogOut,
  LucideMessageCircleQuestion,
  Pencil,
  PieChart,
  Plus,
  Search,
  Settings,
  Share2,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
// import { circleQuestionMark } from 'lucide';
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
// import CampaignsTab from "./tabs/CampaignsTab";
import axios from "axios";
import { toast } from "sonner";
// import logoMain from "../../../public/logo.jfif";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ModalInvite";
import InviteUserForm from "@/components/InviteUserForm";
import { useModal } from "@/context/ModalContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Image } from "@/components/ui/Image";
import { Progress } from "@/components/ui/progress";
import { Campaign as ApiCampaign } from "@/lib/types";
import { FALLBACK_IMAGE } from "@/lib/utils";
import { campaignApi } from "@/service/apiService";
import {
  CalendarDays,
  Edit,
  Eye,
  Infinity,
  MapPin,
  PlusCircle,
  Tag,
  Trash,
} from "lucide-react";

// Map of campaign causes with labels
const causeLabels: Record<string, string> = {
  education: "Education",
  health: "Healthcare",
  environment: "Environment",
  hunger: "Hunger",
  water: "Clean Water",
  genderEquality: "Gender Equality",
  infrastructure: "Infrastructure",
  peaceJustice: "Peace and Justice",
  other: "Other",
};

interface CampaignsTabProps {
  ngoCampaigns?: ApiCampaign[];
}

const CampaignsTab = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout, profileData } = useAppContext();
  // console.log(profileData, "profileData");
  const ngoId = profileData?.ngo?._id;
  const [activeTab, setActiveTab] = useState("profile");
  const [activeTabCam, setActiveTabCam] = useState("ongoing");
  const [mounted, setMounted] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5001/api/v1";

  // Get tab from URL or use default
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["profile", "donors", "donations", "campaigns"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Add animation effect
  useEffect(() => {
    setMounted(true);
  }, []);

  // Transform API campaigns to dashboard format if available
  const ngoCampaigns = profileData?.campaigns || [];
  console.log(ngoCampaigns, "ngoCampaigns");

  const donorSet = new Set<string>();

  ngoCampaigns.forEach((c) => {
    c.pendingPayments?.forEach((p) => {
      if (p.donorEmail) donorSet.add(p.donorEmail);
    });
  });

  // Calculate stats if not available from profileData
  const stats: NgoStats = {
    ...profileData?.stats, // existing stats fields
    totalCampaigns: profileData?.stats?.totalCampaigns ?? ngoCampaigns.length,
    activeCampaigns:
      profileData?.stats?.activeCampaigns ??
      ngoCampaigns.filter((c) => c.status === "ongoing").length,
    totalRaised:
      profileData?.stats?.totalRaised ??
      ngoCampaigns.reduce((sum, c) => sum + (c.totalRaised || 0), 0),
    totalDonations: profileData?.stats?.totalDonations ?? 0,
    completedCampaigns: profileData?.stats?.completedCampaigns ?? 0,
    completionRate: profileData?.stats?.completionRate ?? 0,
    uniqueDonors: donorSet.size, // ✅ override always with correct calculation
  };

  // const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Get NGO initials for avatar
  const getInitials = () => {
    if (!user?.name) return "NG";
    return user.name
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0])
      .join("");
  };

  // Add near the top of your component
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found when accessing Dashboard");
      navigate("/login");
    }
  }, []);

  const [search, setSearch] = useState("");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const ongoingCampaigns = ngoCampaigns; // ALL campaigns
  const pastCampaigns = []; // EMPTY (length 0)

  const campaignsToShow =
    activeTabCam === "ongoing" ? ongoingCampaigns : pastCampaigns;

  const filteredCampaigns = campaignsToShow.filter((campaign) =>
    campaign.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleShare = (e, campaign) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = `${window.location.origin}/campaigns/${campaign.campaignSlug}`;

    // Mobile + supported browsers
    if (navigator.share) {
      navigator
        .share({
          title: campaign.title,
          text: "Support this campaign",
          url: shareUrl,
        })
        .catch(() => {});
    } else {
      // Desktop fallback
      navigator.clipboard.writeText(shareUrl);
      alert("Campaign link copied!");
    }
  };

  const { campaigns: allCampaigns } = useAppContext();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<ApiCampaign[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);

        // Use provided campaigns prop if available, otherwise fetch from API
        if (ngoCampaigns && ngoCampaigns.length > 0) {
          setCampaigns(ngoCampaigns);
          return;
        }

        // If no prop passed, fallback to context campaigns
        if (allCampaigns && allCampaigns.length > 0) {
          const filtered = allCampaigns.filter((c) => c.ngoId === user?.id);

          if (filtered.length > 0) {
            setCampaigns(filtered);
            return;
          }
        }

        // Only as a last resort, fetch from API
        const response = await campaignApi.getNgoCampaigns();

        if (!response.success) {
          throw new Error(response.error || "Failed to fetch campaigns");
        }

        setCampaigns(response.data || []);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [ngoCampaigns, allCampaigns, user]);

  // Calculate days left for a campaign
  const getDaysLeft = (deadline?: number | null) => {
    if (!deadline) return null; // For perpetual campaigns

    const end = new Date(deadline);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Format date
  const formatDate = (timestamp?: number | null) => {
    if (!timestamp) return "No end date";

    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Get status badge
  const getStatusBadge = (status: string, daysLeft: number | null) => {
    const isPerpetual = daysLeft === null;

    if (isPerpetual && status === "ongoing") {
      return <Badge className="bg-purple-500 shadow-md">Ongoing</Badge>;
    }

    switch (status) {
      case "ongoing":
        return daysLeft !== null && daysLeft < 7 ? (
          <Badge className="bg-yellow-500 shadow-md">Ending Soon</Badge>
        ) : (
          <Badge className="bg-green-500 shadow-md">Ongoing</Badge>
        );
      case "completed":
        return <Badge className="bg-blue-500 shadow-md">Completed</Badge>;
      case "draft":
        return (
          <Badge variant="outline" className="bg-white shadow-md">
            Draft
          </Badge>
        );
      case "paused":
        return <Badge className="bg-orange-500 shadow-md">Paused</Badge>;
      default:
        return (
          <Badge variant="outline" className="bg-white shadow-md">
            Unknown
          </Badge>
        );
    }
  };

  // Get cause badge
  const getCauseBadge = (cause: string) => {
    const badgeColors: Record<string, string> = {
      education: "bg-blue-500",
      health: "bg-red-500",
      environment: "bg-green-500",
      hunger: "bg-yellow-500",
      water: "bg-sky-500",
      genderEquality: "bg-purple-500",
      infrastructure: "bg-orange-500",
      peaceJustice: "bg-teal-500",
      other: "bg-gray-500",
    };

    return (
      <Badge className={`${badgeColors[cause] || "bg-gray-500"} ml-2`}>
        {causeLabels[cause] || "Other"}
      </Badge>
    );
  };

  // Handle campaign deletion
  const handleDeleteCampaign = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await campaignApi.deleteCampaign(id);

      if (!response.success) {
        throw new Error(response.error || "Failed to delete campaign");
      }

      // Remove the deleted campaign from the state
      setCampaigns(campaigns.filter((campaign) => campaign._id !== id));
      toast.success("Causes deleted successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  // Calculate total metrics
  const totalRaised = campaigns.reduce(
    (total, campaign) => total + (campaign.totalRaised || 0),
    0
  );
  const totalDonors = campaigns.reduce(
    (total, campaign) => total + (campaign.pendingPayments?.length || 0),
    0
  );

  return (
    <SidebarProvider
      className={`${
        mounted ? "opacity-100" : "opacity-0"
      } transition-opacity duration-500`}
    >
      <div className="flex min-h-screen w-full">
        <Sidebar className="w-64 border-none h-screen flex flex-col justify-between pt-12">
          {/* Sidebar Header */}
          <SidebarHeader className="">
            <div className="flex items-center space-x-3 py-2 px-4 mt-6">
              {/* <Avatar className="w-12 h-12">
                {profileData?.ngo.profileImage ? (
                  <AvatarImage
                    src={
                      profileData.ngo.profileImage.startsWith("http")
                        ? profileData.ngo.profileImage
                        : `${import.meta.env.VITE_BE_URL}${
                            profileData.ngo.profileImage
                          }`
                    }
                    alt="Profile"
                  />
                ) : null}
                <AvatarFallback className="text-lg font-semibold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h2 className="font-semibold text-sm text-gray-900">
                  {user?.name || "NGO User"}
                </h2>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Badge variant="outline" className="h-4 px-1.5 text-xs">
                    NGO
                  </Badge>
                  NGO
                </p>
              </div> */}
            </div>
          </SidebarHeader>

          {/* Sidebar Content */}
          <SidebarContent className="flex-1">
            <SidebarMenu className="px-2 mt-4 gap-3">
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <Link
                    to="/dashboard"
                    className="flex items-center py-2 px-3 rounded hover:bg-gray-100 transition"
                  >
                    <LayoutDashboard className="mr-3 h-5 w-5 text-gray-700" />
                    <span className="text-[16px] font-medium text-gray-800">
                      Dashboard
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Create Causes"
                  disabled={!profileData?.ngo?.NGOAccountReady}
                  className={
                    !profileData?.ngo?.NGOAccountReady
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }
                >
                  <Link
                    to="/dashboard/campaigns/new"
                    className="flex items-center py-2 px-3 rounded hover:bg-gray-100 transition"
                  >
                    <FileText className="mr-3 h-5 w-5 text-gray-700" />
                    <span className="text-[16px] font-medium text-gray-800">
                      Create Causes
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="View Causes">
                  <Link
                    to="/dashboard/ngo-campaigns"
                    className="flex items-center py-2 px-3 rounded hover:bg-gray-100 transition"
                  >
                    <PieChart className="mr-3 h-5 w-5 text-gray-700" />
                    <span className="text-[16px] font-medium text-gray-800">
                      View Causes
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="View Causes">
                  <Link
                    to="/dashboard/donors"
                    className="flex items-center py-2 px-3 rounded hover:bg-gray-100 transition"
                  >
                    <Users className="mr-3 h-5 w-5 text-gray-700" />
                    <span className="text-[16px] font-medium text-gray-800">
                      Donors
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="View Donations">
                  <Link
                    to="/dashboard/donations"
                    className="flex items-center py-2 px-3 rounded hover:bg-gray-100 transition"
                  >
                    <Users className="mr-3 h-5 w-5 text-gray-700" />
                    <span className="text-[16px] font-medium text-gray-800">
                      Donations
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="View Payouts">
                  <Link
                    to="/dashboard/payouts"
                    className="flex items-center py-2 px-3 rounded hover:bg-gray-100 transition"
                  >
                    <Banknote className="mr-3 h-5 w-5 text-gray-700" />
                    <span className="text-[16px] font-medium text-gray-800">
                      Payouts
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          {/* Sidebar Footer */}
          <SidebarFooter className="px-4 py-4">
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center w-full justify-between text-gray-800 hover:text-gray-900 focus:outline-none"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    {profileData?.ngo.profileImage ? (
                      <AvatarImage
                        src={
                          profileData.ngo.profileImage.startsWith("http")
                            ? profileData.ngo.profileImage
                            : `${import.meta.env.VITE_BE_URL}${
                                profileData.ngo.profileImage
                              }`
                        }
                        alt="Profile"
                      />
                    ) : null}
                    <AvatarFallback className="text-sm font-semibold">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-start">
                    <span className="text-sm font-smibold block">
                      {user?.name || "NGO User"}
                    </span>
                    <p className="text-sm text-start">Give to Africa</p>
                  </div>
                </div>
                <ChevronDown
                  className={`relative h-6 w-6 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute text-left right-[-160px] bottom-[10px] mt-2 py-3 w-[190px] w-auto bg-white shadow-lg rounded-xl border border-gray-100 z-50">
                    <span className="text-sm font-bold px-4 py-2 text-start">
                      {user?.name || "NGO User"}
                    </span>
                    <p className="text-sm text-start px-4">Give to Africa</p>
                    <hr className="my-3" />
                    <button
                      onClick={() => navigate("/dashboard/setting")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </button>
                    {profileData?.loggedInUser?.role !== "member" && (
                      <button
                        onClick={openModal}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Invite a user
                      </button>
                    )}
                    {/* <button
                      // onClick={() => handleSwitchProfile()}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <ArrowRightLeft className="mr-2 h-4 w-4" />
                      Switch profile
                    </button> */}
                    {/* <hr className="pt-3" /> */}
                    {/* <button
                      onClick={() => navigate("/invite")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LucideMessageCircleQuestion className="mr-2 h-4 w-4" />
                      Help Center
                    </button> */}
                    <hr className="pt-3" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="bg-[#074C2D11]">
          <div className="space-y-6 p-4 md:p-6 lg:p-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Causes</h2>
              <Link to="/dashboard/campaigns/new">
                <Button
                  disabled={!profileData?.ngo?.NGOAccountReady}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Create Causes
                </Button>
              </Link>
            </div>

            {campaigns.length === 0 ? (
              <Card className="py-10">
                <CardContent className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-gray-100 p-6 mb-4">
                    <PlusCircle className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Causes Yet</h3>
                  <p className="text-gray-500 mb-6 max-w-md">
                    Start your first fundraising causes to connect with donors
                    and make an impact through your NGO's mission.
                  </p>
                  <Button
                    disabled={!profileData?.ngo?.NGOAccountReady}
                    onClick={() => navigate("/dashboard/campaigns/new")}
                  >
                    Create Your First causes
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign) => {
                  const daysLeft = getDaysLeft(campaign.deadline);
                  const progressPercent = Math.min(
                    Math.round(
                      ((campaign.totalRaised || 0) /
                        (campaign.fundingGoal || 1)) *
                        100
                    ),
                    100
                  );
                  const isPerpetual = !campaign.deadline;

                  return (
                    <Card
                      key={campaign._id}
                      className="overflow-hidden flex flex-col h-full"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={`${import.meta.env.VITE_BE_URL}${
                            campaign.media?.mainImage
                          }`}
                          alt={campaign.title}
                          className="w-full h-full object-cover"
                          fallback={FALLBACK_IMAGE}
                        />
                        <div className="absolute top-3 right-3 z-10 p-0.5 rounded">
                          {getStatusBadge(campaign.status, daysLeft)}
                        </div>
                      </div>
                      <CardHeader className="p-4 pb-0">
                        <CardTitle className="text-xl">
                          {campaign.title}
                        </CardTitle>
                        <div className="flex flex-wrap items-center text-sm text-gray-500 mt-1">
                          <div className="flex items-center mr-3">
                            <MapPin className="h-4 w-4 mr-1" />
                            {campaign.country}
                          </div>
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 mr-1" />
                            {causeLabels[campaign.cause] || campaign.cause}
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          {isPerpetual ? (
                            <div className="flex items-center">
                              <Infinity className="h-4 w-4 mr-1" />
                              Ongoing Causes
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <CalendarDays className="h-4 w-4 mr-1" />
                              {campaign.status === "completed"
                                ? `Ended: ${formatDate(campaign.deadline)}`
                                : `Ends: ${formatDate(campaign.deadline)}`}
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-3 flex-grow flex flex-col justify-between">
                        <CardDescription
                          className="mb-4 line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html: campaign.description,
                          }}
                        >
                          {/* {campaign.description} */}
                        </CardDescription>

                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium">
                                ${campaign.totalRaised.toLocaleString()} raised
                              </span>
                              {!isPerpetual && (
                                <span className="text-gray-500">
                                  of ${campaign.fundingGoal.toLocaleString()}
                                </span>
                              )}
                            </div>
                            {!isPerpetual && (
                              <Progress
                                value={progressPercent}
                                className="h-2"
                              />
                            )}
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>
                              {campaign.pendingPayments?.length || 0} donors
                            </span>
                            {isPerpetual ? (
                              <span className="text-brand-purple">Ongoing</span>
                            ) : campaign.status === "ongoing" ? (
                              <span>{daysLeft} days left</span>
                            ) : (
                              <span>Causes ended</span>
                            )}
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 flex items-center justify-center gap-1"
                              onClick={() =>
                                navigate(
                                  `/campaigns/${
                                    campaign.campaignSlug || campaign._id
                                  }`
                                )
                              }
                            >
                              <Eye className="h-4 w-4" /> View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 flex items-center justify-center gap-1"
                              onClick={() =>
                                navigate(
                                  `/dashboard/campaigns/edit/${campaign._id}`
                                )
                              }
                            >
                              <Edit className="h-4 w-4" /> Edit
                            </Button>
                            {campaign.status !== "completed" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center justify-center aspect-square p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Causes?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will
                                      permanently delete the cause "
                                      {campaign.title}" and remove it from the
                                      platform.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDeleteCampaign(campaign._id)
                                      }
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      {deletingId === campaign._id
                                        ? "Deleting..."
                                        : "Delete Cause"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Causes Performance</CardTitle>
                <CardDescription>
                  Overview of all your causes statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">
                      Ongoing Causes
                    </h3>
                    <p className="text-3xl font-bold mt-1">
                      {campaigns.filter((c) => c.status === "ongoing").length}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">
                      Total Raised
                    </h3>
                    <p className="text-3xl font-bold mt-1">
                      ${totalRaised.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">
                      Total Donors
                    </h3>
                    <p className="text-3xl font-bold mt-1">{totalDonors}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <InviteUserForm onClose={closeModal} />
      </Modal>
    </SidebarProvider>
  );
};

export default CampaignsTab;
