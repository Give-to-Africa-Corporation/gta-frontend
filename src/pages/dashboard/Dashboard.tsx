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
  Copy,
  Facebook,
  FileText,
  LayoutDashboard,
  LogOut,
  LucideMessageCircleQuestion,
  Mail,
  Pencil,
  PieChart,
  Plus,
  Search,
  Settings,
  Share2,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
// import { circleQuestionMark } from 'lucide';
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import CampaignsTab from "./tabs/CampaignsTab";
import DonationsTab from "./tabs/DonationsTab";
import DonorsTab from "./tabs/DonorsTab";
import ProfileTab from "./tabs/ProfileTab";
import axios from "axios";
import { toast } from "sonner";
import logoMain from "../../../public/logo.jfif";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { campaignApi } from "@/service/apiService";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { useModal } from "@/context/ModalContext";
import Modal from "@/components/ModalInvite";
import InviteUserForm from "@/components/InviteUserForm";
import { FaFacebookMessenger } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
const { openDeactivateModal } = useModal();
  const [searchParams] = useSearchParams();
  const { user, logout, profileData, loadProfileData } = useAppContext();
  // console.log(profileData, "profileData");
  const ngoId = profileData?.ngo?._id;
  const [activeTab, setActiveTab] = useState("profile");
  const [activeTabCam, setActiveTabCam] = useState("ongoing");
  const [mounted, setMounted] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [apiError, setApiError] = useState("");
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
  // console.log(ngoCampaigns, "ngoCampaigns");

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

  const [loading, setLoading] = useState(false);

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

  // paypal onboarding
  const handleConnectPayPal = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/ngos/${ngoId}/paypal-onboarding`,
      );

      const { onboardingLink } = response.data;

      if (onboardingLink) {
        window.location.href = onboardingLink;
      } else {
        toast.error("Failed to get PayPal onboarding link");
      }
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      toast.error(
        error.response?.data || "Error connecting to PayPal. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // connect stripe start onboading
  const [error, setError] = useState<string | null>(null);

  const handleConnectBankStripe = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.post(
        `${API_URL}/ngos/stripe/onboarding/start`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      console.log(res.data, "stripe onboarding response");
      const { success, url } = res.data;

      if (!success || !url) {
        setError("Unable to start Stripe onboarding.");
        setLoading(false);
        return;
      }

      window.location.href = url;
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Failed to start Stripe onboarding. Please try again.",
      );
      setLoading(false);
    }
  };

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
    campaign.title?.toLowerCase().includes(search.toLowerCase()),
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

  const handleDelete = async (id: string) => {
    // e.preventDefault();
    try {
      setDeletingId(id);
      setApiError("");

      const res = await campaignApi.deleteCampaign(id);

      if (!res.success) {
        setApiError(res.message || "Failed to delete campaign");
        return;
      }

      setCampaigns((prev) => prev.filter((c) => c._id !== id));
      await loadProfileData(true);
      // optional: toast.success("Campaign deleted");
    } catch (err: any) {
      console.error(err);
      setApiError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete campaign",
      );
    } finally {
      setDeletingId(null);
    }
  };

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
                    <button
                        onClick={openDeactivateModal}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        DeActivate Account
                      </button>
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

        {/* <SidebarInset>
          <div className="p-4 md:p-6 lg:p-8">
            {!profileData?.ngo?.NGOAccountReady && (
              <div className="text-sm bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md flex flex-col md:flex-row items-center justify-between">
                <p>
                  Complete your onboarding and bank details to activate your
                  Stripe account for payouts.
                </p>
                <div className="mt-2 sm:mt-0">
                  <button
                    onClick={handleConnectBankStripe}
                    disabled={loading}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm disabled:opacity-60"
                  >
                    {loading ? "Redirecting..." : "Connect bank"}
                  </button>

                  {error && (
                    <p className="mt-2 text-xs text-red-600">{error}</p>
                  )}
                </div>
              </div>
            )}
            {profileData?.ngo?.paypalStatus === "pending" && (
              <div className="text-sm bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md flex flex-col md:flex-row items-center justify-between">
                <p>
                  ⚠️ PayPal account not connected! To receive donations, please
                  connect your PayPal account.
                </p>
                <div className="mt-2 sm:mt-0">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                    onClick={handleConnectPayPal}
                    disabled={loading}
                  >
                    {loading ? "Connecting..." : "Connect PayPal"}
                  </button>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">
                  Welcome back, {user?.name || "NGO"}
                </h1>
                <p className="text-gray-600">
                  Manage your NGO profile, causes, and donor relationships.
                </p>
              </div>
              <SidebarTrigger className="md:hidden" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Donations</CardDescription>
                  <CardTitle className="text-2xl">
                    ${stats.totalRaised.toLocaleString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-brand-purple">
                    From {stats.totalDonations || "all"} donations
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Ongoing Causes</CardDescription>
                  <CardTitle className="text-2xl">
                    {stats.activeCampaigns}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {stats.activeCampaigns > 0
                      ? `Out of ${stats.totalCampaigns} total causes`
                      : "No ongoing causes"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Donors</CardDescription>
                  <CardTitle className="text-2xl">
                    {stats.uniqueDonors}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-brand-purple">
                    {stats.uniqueDonors > 0
                      ? `Supporting your cause`
                      : "Start causes to attract donors"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Completion Rate</CardDescription>
                  <CardTitle className="text-2xl">
                    {(stats.completionRate * 100).toFixed(0)}%
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {stats.completedCampaigns} completed causes
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="campaigns">Causes</TabsTrigger>
                <TabsTrigger value="donors">Donors</TabsTrigger>
                <TabsTrigger value="donations">Donations</TabsTrigger>
              </TabsList>
              <TabsContent value="profile" className="space-y-4">
                <ProfileTab />
              </TabsContent>
              <TabsContent value="campaigns" className="space-y-4">
                <CampaignsTab ngoCampaigns={ngoCampaigns} />
              </TabsContent>
              <TabsContent value="donors" className="space-y-4">
                <DonorsTab />
              </TabsContent>
              <TabsContent value="donations" className="space-y-4">
                <DonationsTab />
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset> */}

        <SidebarInset className="bg-[#074C2D11]">
          {/* ===== TOP SECTION ===== */}
          <div className="relative rounded-b-2xl md:px-10 px-4 md:pt-10 pt-5 overflow-hidden">
            <h1 className="text-2xl font-semibold text-[#2E3333] md:mb-6 mb-3">
              Causes
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="flex items-center relative h-[120px] md:h-[280px]">
                <h2 className="text-4xl font-bold text-primary leading-tight hidden md:block">
                  You’re ready to collect <br /> your first donations!
                </h2>
                <h2 className="text-4xl font-bold text-primary leading-tight md:hidden block">
                  You’re ready to collect your first donations!
                </h2>
                <div className="MuiBox-root css-qy1iac hidden md:block">
                  <svg
                    viewBox="0 0 166 226"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.04663 124.641C12.8417 93.7892 30.6463 90.5041 45.6522 92.2886L81.1799 94.7233C112.209 99.5341 114.706 156.089 111.704 183.479C111.661 183.877 112.091 184.138 112.437 183.938L125.224 176.541L132.236 173.568C132.308 173.537 132.386 173.524 132.465 173.53L137.43 173.929L133.357 174.042C133.15 174.048 132.969 174.184 132.907 174.382L130.525 181.884C130.43 182.183 130.64 182.493 130.954 182.516L150.339 183.942L162.064 184.132C162.235 184.135 162.391 184.227 162.477 184.374L163.721 186.514C163.836 186.711 163.798 186.962 163.629 187.117L160.968 189.56C160.913 189.61 160.848 189.647 160.777 189.668L152.411 192.15C152.363 192.164 152.314 192.17 152.264 192.17L143.562 192.016C143.36 192.012 143.177 192.134 143.102 192.321L140.859 197.911C140.846 197.944 140.829 197.976 140.808 198.006L138.593 201.227C138.531 201.318 138.439 201.385 138.333 201.417L133.131 202.983C133.052 203.007 132.969 203.01 132.889 202.993L125.274 201.378C125.241 201.371 125.207 201.368 125.173 201.368H112.084C111.815 201.368 111.597 201.586 111.597 201.854V225.153C111.597 225.422 111.379 225.64 111.111 225.64H8.90793C8.63915 225.64 8.42125 225.422 8.42125 225.153V198.98C8.42125 198.774 8.28508 198.589 8.09376 198.513C-5.77163 193.004 4.772 159.391 9.04663 124.641Z"
                      fill="#074C2D"
                    ></path>
                    <path
                      d="M73.7416 47.3057C74.5188 47.0908 75.3228 47.5466 75.5377 48.3238C76.2134 50.7684 76.7359 54.8003 75.8218 59.4544C75.6664 60.2456 74.899 60.7612 74.1078 60.6059C73.3166 60.4505 72.801 59.6832 72.9563 58.892C73.7718 54.7405 73.2951 51.1701 72.7234 49.1018C72.5086 48.3245 72.9643 47.5205 73.7416 47.3057Z"
                      fill="#074C2D"
                    ></path>
                    <path
                      d="M54.624 68.8109C54.932 72.6063 58.0658 78.7544 68.1365 72.9837"
                      stroke="#074C2D"
                      stroke-width="2.46"
                      stroke-linecap="round"
                    ></path>
                    <path
                      d="M76.8004 1.11158C79.6314 0.172778 82.6605 0.257246 85.7251 1.84494C88.0636 3.05648 89.3464 5.04681 89.8235 7.36624C90.2878 9.62412 89.9916 12.1745 89.2952 14.6887C88.1718 18.744 85.9176 23.0197 83.4781 26.4566C89.0492 24.6459 96.0219 23.1328 102.154 23.3151C105.752 23.422 109.205 24.116 111.92 25.8107C114.701 27.5466 116.602 30.2703 117.115 34.1412C118.159 42.0244 115.338 47.9038 111.473 52.0364C107.648 56.1251 102.81 58.5056 99.6677 59.5729C98.9042 59.8322 98.075 59.4236 97.8156 58.6602C97.5563 57.8967 97.9653 57.0674 98.7288 56.8081L98.9984 56.7141C101.833 55.709 106.042 53.5686 109.341 50.0419C112.705 46.4453 115.131 41.4105 114.219 34.5243C113.82 31.5111 112.409 29.5587 110.374 28.288C108.272 26.9761 105.402 26.3329 102.067 26.2338C95.3974 26.0355 87.4426 28.0254 81.7343 30.1553C80.649 30.5602 79.7601 29.9234 79.3792 29.3703C78.999 28.8179 78.728 27.7819 79.4523 26.9123L79.7206 26.5854C82.4951 23.162 85.2588 18.3213 86.481 13.909C87.1124 11.6295 87.2987 9.5849 86.9635 7.9547C86.6409 6.38613 85.8424 5.19442 84.382 4.4378C82.0554 3.23242 79.8456 3.17823 77.7194 3.88331C75.5423 4.60533 73.3955 6.14678 71.3516 8.22529C67.2587 12.3876 63.8976 18.372 61.8123 22.8161C61.2997 23.9084 59.9807 24.2233 59.0308 23.6454C49.5961 17.9054 42.8572 14.0252 37.622 12.0784C32.4455 10.1534 29.0365 10.2284 26.0443 12.0114C25.5264 12.3201 25.2445 12.8034 25.25 13.7012C25.256 14.6726 25.6182 15.9642 26.3207 17.4752C27.7143 20.4727 30.2034 23.8251 32.4547 26.2253C33.211 27.0316 33.0361 28.0649 32.6765 28.6563C32.316 29.2491 31.4667 29.8892 30.3913 29.5625C27.3844 28.6489 23.4523 27.6983 19.7609 27.5726C16.0123 27.445 12.8905 28.1782 11.059 30.2005C10.2035 31.1451 10.0321 32.2729 10.5185 33.7457C11.0294 35.2927 12.2373 37.068 13.9413 38.9175C17.1183 42.3657 21.663 45.6953 25.1482 47.7882L25.8301 48.1899L25.8943 48.2289C26.543 48.6483 26.7556 49.5075 26.3653 50.1841C25.9749 50.8606 25.1249 51.1065 24.4372 50.7549L24.3711 50.7188L23.6566 50.2985C20.0041 48.1062 15.2144 44.6087 11.7941 40.8964C9.97962 38.9271 8.4476 36.7881 7.74529 34.6614C7.01855 32.4606 7.16107 30.1547 8.89441 28.2407C11.6114 25.2405 15.8542 24.5178 19.8604 24.6542C22.7727 24.7534 25.7618 25.3133 28.3639 25.969C26.5691 23.7568 24.8166 21.166 23.6731 18.7062C22.8977 17.0384 22.3396 15.301 22.3299 13.7192C22.3198 12.0639 22.927 10.4698 24.5495 9.5029C28.6058 7.08576 33.036 7.2578 38.6399 9.34171C44.0042 11.3365 50.7137 15.1828 59.6366 20.5974C61.8007 16.1509 65.142 10.3758 69.27 6.17783C71.4916 3.91865 74.0205 2.03347 76.8004 1.11158Z"
                      fill="#074C2D"
                    ></path>
                    <path
                      d="M60.9973 47.1496C61.7937 47.0233 62.5417 47.5666 62.668 48.363C62.8671 49.6184 63.117 51.6596 63.227 53.747C63.3345 55.7863 63.3207 58.0536 62.904 59.6616C62.7017 60.4422 61.9048 60.911 61.1242 60.7087C60.3436 60.5064 59.8748 59.7095 60.0771 58.929C60.3714 57.7932 60.4177 55.9209 60.3113 53.9004C60.2073 51.9282 59.9694 49.9894 59.784 48.8203C59.6577 48.0239 60.2009 47.2759 60.9973 47.1496Z"
                      fill="#074C2D"
                    ></path>
                    <path
                      d="M65.9342 124.086C67.5324 123.814 69.1366 124.296 70.7549 125.453C72.0629 126.387 72.5673 127.753 72.522 129.123C72.4788 130.427 71.9493 131.731 71.2402 132.841C70.5224 133.965 69.551 135.002 68.4741 135.769C67.4155 136.524 66.1291 137.105 64.796 137.105C63.422 137.105 62.2868 136.579 61.4809 135.68C60.7086 134.819 60.3214 133.712 60.1844 132.634C59.9162 130.524 60.5465 128.011 62.0094 126.391L62.0342 126.363L62.0603 126.337C63.1239 125.274 64.3908 124.349 65.9342 124.086ZM69.0573 127.829C67.8755 126.984 67.0461 126.859 66.4243 126.965C65.7551 127.079 65.0237 127.51 64.1534 128.374C63.3593 129.274 62.9051 130.881 63.0812 132.266C63.1672 132.943 63.388 133.433 63.6548 133.731C63.8882 133.991 64.2233 134.185 64.796 134.185C65.3041 134.185 66.0028 133.945 66.7798 133.391C67.5385 132.851 68.2535 132.092 68.7788 131.27C69.3126 130.433 69.5831 129.638 69.6034 129.026C69.6214 128.479 69.4524 128.111 69.0573 127.829Z"
                      fill="#074C2D"
                    ></path>
                    <path
                      d="M60.5951 147.966C61.1953 146.46 62.4432 145.342 64.2731 144.563C65.7522 143.933 67.1811 144.214 68.3264 144.966C69.417 145.683 70.2542 146.814 70.8328 147.998C71.4185 149.196 71.7974 150.565 71.8914 151.884C71.9837 153.181 71.8097 154.582 71.1153 155.719C70.3995 156.892 69.3589 157.587 68.1721 157.807C67.0347 158.018 65.8881 157.771 64.8967 157.327C62.9557 156.457 61.1387 154.609 60.5182 152.517L60.5075 152.481L60.4988 152.445C60.1453 150.984 60.0155 149.42 60.5951 147.966ZM65.4168 147.25C64.0806 147.819 63.5412 148.461 63.3077 149.047C63.0564 149.678 63.0438 150.527 63.3276 151.72C63.6821 152.866 64.8172 154.091 66.0917 154.663C66.7139 154.942 67.2475 155.008 67.6404 154.936C67.9841 154.872 68.3244 154.687 68.6227 154.198C68.8874 153.765 69.0465 153.043 68.9786 152.092C68.9124 151.162 68.6376 150.157 68.209 149.28C67.7734 148.389 67.2354 147.744 66.7232 147.407C66.2658 147.107 65.8637 147.059 65.4168 147.25Z"
                      fill="#087343ff"
                    ></path>
                    <path
                      d="M83.256 95.8298C83.9882 95.5574 84.8003 95.9101 85.1059 96.6196L85.1337 96.6893L85.3158 97.198C86.2228 99.8244 87.0275 103.64 86.6053 107.126C86.3782 109.001 85.7844 110.877 84.564 112.408C83.3213 113.967 81.5164 115.058 79.0938 115.478C74.8581 116.212 71.6251 113.735 69.3586 110.548C67.4886 107.919 66.1003 104.589 65.1283 101.447C63.3587 106.745 59.5371 112.808 52.1087 114.095C46.3724 115.088 41.9 111.519 38.7945 107.269C35.759 103.115 33.7293 97.9401 32.738 94.3038L32.6452 93.957L32.6277 93.8839C32.4704 93.1277 32.9325 92.3727 33.6882 92.175C34.4682 91.971 35.266 92.438 35.4701 93.218C36.3633 96.6336 38.2987 101.641 41.1524 105.546C44.0341 109.49 47.539 111.923 51.6105 111.217C58.2202 110.073 61.5272 104.08 62.878 98.7572L62.9156 98.6274C63.1244 97.9962 63.6121 97.6467 63.9567 97.4793C64.3375 97.2943 64.7445 97.2232 65.0961 97.2153C65.4466 97.2073 65.8605 97.2596 66.2536 97.4327C66.6134 97.5913 67.1212 97.9347 67.3411 98.5768L67.3811 98.7091L67.5612 99.3727C68.4918 102.706 69.8827 106.247 71.7382 108.856C73.7237 111.647 75.9817 113.054 78.5955 112.601C80.3763 112.293 81.5212 111.54 82.2803 110.588C83.0616 109.608 83.5217 108.302 83.7067 106.775C84.0572 103.882 83.3778 100.537 82.5614 98.1679L82.3969 97.7074L82.3722 97.6361C82.14 96.8995 82.524 96.1021 83.256 95.8298Z"
                      fill="#074C2D40"
                    ></path>
                    <path
                      d="M50.4536 126.865C50.9858 126.91 51.3767 127.362 51.3445 127.896C51.1807 130.851 50.6398 139.751 49.8363 140.548C48.857 141.504 24.3706 141.523 23.1859 137.494C22.0007 133.465 24.9346 125.342 26.252 125.086C27.4074 124.854 46.0226 126.47 50.4661 126.865L50.4536 126.865Z"
                      fill="white"
                    ></path>
                    <path
                      d="M38.9617 129.468C39.3037 129.429 39.5993 129.566 39.7772 129.664C40.1584 129.874 40.6574 130.286 41.3008 130.856C42.8732 132.248 44.4844 133.641 45.5373 134.543L46.3818 135.263L46.4419 135.319C46.7237 135.613 46.7433 136.077 46.4746 136.394C46.188 136.732 45.6817 136.774 45.3437 136.487C44.5182 135.787 42.3436 133.923 40.2366 132.057C39.9436 131.798 39.7085 131.598 39.5205 131.445C39.4787 131.876 39.4132 132.442 39.2396 133.076C39.0868 133.633 38.9595 134.091 38.8247 134.395C38.7588 134.543 38.6495 134.756 38.4579 134.921C38.215 135.131 37.908 135.208 37.605 135.152C37.3685 135.108 37.1781 134.989 37.0677 134.914C36.9453 134.832 36.8132 134.727 36.6931 134.632C36.4403 134.432 36.1366 134.19 35.7197 133.925C35.258 133.633 35.027 133.515 34.8925 133.473C34.8299 133.453 34.8556 133.462 34.8485 133.465C34.7436 133.514 34.6301 133.605 34.2722 133.863C33.9522 134.094 33.5257 134.386 32.9172 134.711C31.7482 135.335 30.6667 135.193 29.8299 134.739C29.0864 134.335 28.552 133.7 28.2552 133.197L28.199 133.099L28.1634 133.025C28.0049 132.65 28.1526 132.209 28.5169 132.009C28.8812 131.81 29.3326 131.922 29.5631 132.257L29.6063 132.327L29.68 132.451C29.8712 132.751 30.1945 133.111 30.595 133.328C31.0091 133.553 31.5175 133.639 32.1615 133.295C32.6861 133.015 33.0493 132.766 33.3335 132.561C33.5797 132.384 33.885 132.144 34.1711 132.011C34.5551 131.832 34.9443 131.806 35.3755 131.943C35.7348 132.056 36.1283 132.284 36.579 132.57C36.9755 132.821 37.2866 133.057 37.5247 133.244C37.571 133.086 37.626 132.892 37.6917 132.652C37.8326 132.138 37.8872 131.668 37.9266 131.257C37.9453 131.062 37.9635 130.849 37.9872 130.674C38.0092 130.511 38.0471 130.278 38.147 130.069C38.2654 129.82 38.5188 129.519 38.9617 129.468Z"
                      fill="#074C2D"
                    ></path>
                    <path
                      d="M107.595 183.881L105.339 200.52L132.346 204.181L136.678 203.019L142.181 200.467L143.228 192.751L154.87 192.01L160.886 191.107L163.918 186.852L161.736 184.837L131.606 182.471L134.488 181.143L138.497 178.74L137.43 173.929L132.849 173.308L124.511 176.843L115.07 184.895L107.595 183.881Z"
                      fill="#074C2D33"
                    ></path>
                    <path
                      d="M30.8217 161.628C31.0944 160.905 31.8893 160.515 32.6332 160.754C33.401 161 33.8238 161.823 33.5776 162.591L33.518 162.786C32.9155 164.839 32.8689 167.906 34.5971 170.631C36.3506 173.395 40.1331 176.119 47.8832 176.904C63.7321 178.508 98.6854 181.628 114.837 183.045C118.251 179.863 123.326 175.748 127.97 173.341C130.337 172.114 132.793 171.223 134.942 171.293C136.051 171.329 137.136 171.623 138.064 172.313C138.981 172.996 139.628 173.978 140.026 175.192C140.307 175.917 140.474 177.019 140.09 178.144C139.668 179.382 138.653 180.431 136.952 180.994C136.458 181.157 135.751 181.354 134.922 181.57L160.833 182.614L160.886 182.62C161.832 182.727 163.337 183.073 164.377 183.944C164.938 184.413 165.453 185.115 165.533 186.064C165.606 186.934 165.292 187.766 164.764 188.528L164.656 188.679C163.824 189.805 162.359 190.593 160.834 191.17C159.25 191.769 157.343 192.232 155.351 192.57C151.719 193.186 147.639 193.409 144.419 193.204C144.156 194.728 143.881 196.25 143.434 197.614C142.888 199.277 142.052 200.832 140.565 202.049C137.646 204.436 132.696 205.137 124.157 204.169L106.023 202.112C106.023 202.112 106.015 202.11 105.997 202.109C105.98 202.108 105.957 202.107 105.928 202.105C105.868 202.102 105.79 202.097 105.692 202.093C105.496 202.086 105.235 202.078 104.912 202.071C104.266 202.057 103.386 202.044 102.299 202.033C100.126 202.01 97.139 201.993 93.559 201.979C86.3987 201.952 76.8825 201.935 66.7895 201.908C46.6185 201.854 24.1268 201.756 13.6479 201.427L13.5883 201.425L13.5287 201.418C10.103 201.029 7.36712 200.094 5.29533 198.407C3.20511 196.705 1.94543 194.364 1.24064 191.469C0.542791 188.604 0.370795 185.123 0.491615 181.029C0.597624 177.437 0.932771 173.298 1.37247 168.589L1.56681 166.536L1.5756 166.461C1.68828 165.697 2.38218 165.147 3.15958 165.221C3.93714 165.296 4.51369 165.968 4.47892 166.74L4.47404 166.814L4.2797 168.866C3.84146 173.561 3.51375 177.619 3.41056 181.115C3.29234 185.121 3.47332 188.292 4.07853 190.778C4.67698 193.236 5.67035 194.947 7.13908 196.143C8.6174 197.347 10.7307 198.154 13.8031 198.51C24.257 198.835 46.6468 198.935 66.7973 198.989C76.8853 199.016 86.4084 199.032 93.5707 199.059C97.1515 199.073 100.146 199.089 102.33 199.112C103.112 199.12 103.807 199.131 104.393 199.141L106.017 185.196C88.2131 183.618 61.0409 181.171 47.5893 179.809C39.2631 178.966 34.513 175.947 32.1322 172.194C29.7824 168.489 29.9386 164.374 30.7963 161.699L30.8217 161.628ZM134.847 174.212C133.469 174.167 131.565 174.766 129.314 175.933C124.87 178.237 119.847 182.329 116.519 185.47C116.123 185.845 115.586 186.042 115.021 185.993C113.22 185.835 111.17 185.651 108.927 185.453L107.312 199.319L124.486 201.267C133.011 202.234 136.82 201.339 138.716 199.788C139.637 199.035 140.223 198.033 140.66 196.704C141.109 195.334 141.361 193.749 141.693 191.838L141.712 191.744C141.927 190.787 142.821 190.136 143.8 190.228L144.384 190.277C147.372 190.49 151.333 190.29 154.864 189.691C156.744 189.372 158.453 188.949 159.802 188.439C161.21 187.907 161.997 187.363 162.307 186.944L162.417 186.785C162.513 186.638 162.565 186.525 162.593 186.446C162.611 186.395 162.619 186.359 162.621 186.339C162.623 186.328 162.623 186.321 162.623 186.316C162.623 186.315 162.623 186.313 162.623 186.312C162.623 186.311 162.622 186.31 162.621 186.309C162.612 186.293 162.58 186.249 162.503 186.184C162.338 186.046 162.056 185.894 161.669 185.764C161.309 185.644 160.925 185.566 160.597 185.526L129.483 184.274C128.754 184.245 128.254 183.82 127.985 183.426C127.728 183.049 127.616 182.629 127.584 182.271C127.553 181.914 127.591 181.482 127.777 181.068C127.971 180.636 128.384 180.129 129.093 179.968L130.138 179.728C132.576 179.164 134.959 178.578 136.035 178.222C136.979 177.91 137.235 177.469 137.327 177.202C137.447 176.85 137.388 176.456 137.299 176.238L137.279 176.186L137.262 176.134C137.012 175.353 136.667 174.914 136.321 174.657C135.972 174.398 135.501 174.233 134.847 174.212Z"
                      fill="#087343ff"
                    ></path>
                  </svg>
                </div>
              </div>

              {/* Right Steps */}
              <div className="space-y-3 mb-3 sm:mb-0">
                {[
                  "Create your first causes",
                  "Preview your first causes",
                  "Link your bank",
                ].map((step) => (
                  <div
                    key={step}
                    className="flex items-center gap-3 bg-[#ecf8f7] text-[#6a9c99] px-4 py-3 rounded-xl border"
                  >
                    <span className="w-5 h-5 rounded-full border-2 border-[#6a9c99]" />
                    {step}
                  </div>
                ))}

                {/* FINAL ACTION STEP */}
                <div
                  className={`flex items-center justify-between ${
                    !profileData?.ngo?.NGOAccountReady
                      ? "bg-red-100 border-red-800"
                      : "bg-[#074C2D33] border-primary"
                  } px-4 py-3 rounded-xl border `}
                >
                  <div
                    className={`flex items-center gap-3 ${
                      !profileData?.ngo?.NGOAccountReady
                        ? "text-red-800"
                        : "text-primary"
                    } font-medium`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border-2 ${
                        !profileData?.ngo?.NGOAccountReady
                          ? "border-red-800"
                          : "border-primary"
                      }`}
                    />
                    {!profileData?.ngo?.NGOAccountReady ? (
                      <p>Please connect your Stripe account!</p>
                    ) : (
                      <p>Raise your first dollar</p>
                    )}
                  </div>

                  {/* CONDITIONAL BUTTON */}
                  {!profileData?.ngo?.NGOAccountReady ? (
                    <Button
                      className={`${
                        !profileData?.ngo?.NGOAccountReady
                          ? "bg-red-700 hover:bg-red-400"
                          : "bg-primary hover:bg-primary/90"
                      }`}
                      onClick={handleConnectBankStripe}
                    >
                      Connect account
                    </Button>
                  ) : (
                    <Button>Get Started</Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ===== SEARCH & BUTTON ===== */}
          <div className="p-4 shadow-md bg-white px-4 my-2 rounded-xl ">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search"
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <Button
                variant="outline"
                disabled={!profileData?.ngo?.NGOAccountReady}
                className="border-primary text-primary"
                onClick={() => navigate("/dashboard/campaigns/new")}
              >
                <Plus className="h-4 w-4" />
                New causes
              </Button>
            </div>

            {/* ===== TABS ===== */}
            <Tabs value={activeTabCam} onValueChange={setActiveTabCam}>
              <TabsList className="bg-gray-100 my-2 w-full flex justify-start text-left gap-5 text-gray-900">
                <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* ===== CAMPAIGN LIST ===== */}
            <div className="space-y-4">
              {filteredCampaigns.map((campaign) => (
                <div key={campaign._id} className="">
                  <div
                    onClick={() =>
                      navigate(`/campaigns/${campaign?.campaignSlug}`)
                    }
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition">
                      {/* LEFT SIDE */}
                      <div className="flex gap-4 items-center">
                        {/* Phone Preview */}
                        <div className="relative w-[150px] h-[160px] rounded-2xl border bg-gray-100 overflow-hidden">
                          <img
                            src={`${import.meta.env.VITE_BE_URL}${campaign?.media?.mainImage || "/placeholder.png"}`}
                            alt=""
                            className="w-full h-full object-cover"
                          />

                          {/* Phone Border */}
                          <div
                            className={`absolute inset-0 border-[4px] rounded-2xl pointer-events-none`}
                            style={{ borderColor: campaign?.color }}
                          />
                        </div>

                        {/* Campaign Info */}
                        <div className="flex flex-col justify-center gap-1">
                          <div className="flex items-center gap-2">
                            <Badge
                              className="w-fit bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                              style={{ borderRadius: "5px" }}
                            >
                              {campaign?.campaignType || "Donation"}
                            </Badge>
                            <Badge
                              className="w-fit bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                              style={{ borderRadius: "5px" }}
                            >
                              {campaign?.status || "Donation"}
                            </Badge>
                          </div>

                          <h3 className="text-lg font-semibold text-[#1f2a5a]">
                            {campaign?.title}
                          </h3>

                          <p className="text-sm text-gray-600">
                            <span className="font-semibold text-[#1f2a5a]">
                              ${campaign?.totalRaised}
                            </span>{" "}
                            raised
                          </p>
                        </div>
                      </div>

                      {/* RIGHT ACTIONS */}
                      <div className="flex items-center gap-2 self-end md:self-auto">
                        {/* <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => handleShare(e, campaign)}
                        >
                          <Share2 className="w-4 h-4 mr-1" />
                          Share
                        </Button> */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Share2 className="w-4 h-4 mr-1" />
                              Share
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent
                            className="max-w-xl p-0 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Header */}
                            <div className="relative bg-primary text-white px-6 py-8">
                              <AlertDialogCancel asChild>
                                <button className="absolute top-4 right-4 text-white/80 hover:text-white bg-transparent border-none hover:bg-transparent hover:border-none rounded-full p-1">
                                  <X className="w-5 h-5" />
                                </button>
                              </AlertDialogCancel>

                              <h2 className="text-2xl font-semibold text-center mt-4">
                                Send your cause link to collect donations
                              </h2>

                              <p className="text-sm text-center mt-2 text-white/90">
                                Copy and send this link by email, Facebook,
                                text, or on your nonprofit’s website.
                              </p>

                              {/* Link box */}
                              <div className="mt-6 flex gap-2">
                                <input
                                  readOnly
                                  value={`${window.location.origin}/campaigns/${campaign.campaignSlug}`}
                                  className="flex-1 rounded-lg px-4 py-2 text-sm text-gray-800"
                                />

                                <Button
                                  className="bg-teal-400 hover:bg-teal-500 text-black"
                                  onClick={() =>
                                    navigator.clipboard
                                      .writeText(
                                        `${window.location.origin}/campaigns/${campaign.campaignSlug}`,
                                      )
                                      .then(() => toast.success("Copied!"))
                                  }
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy link
                                </Button>
                              </div>

                              {/* Social Icons */}
                              <div className="flex justify-center gap-4 mt-6">
                                <button className="bg-white text-primary w-12 h-12 rounded-full flex items-center justify-center">
                                  <Facebook />
                                </button>

                                <button className="bg-white text-primary w-12 h-12 rounded-full flex items-center justify-center">
                                  <FaFacebookMessenger size={20} />
                                </button>

                                <button
                                  className="bg-white text-primary w-12 h-12 rounded-full flex items-center justify-center"
                                  onClick={() =>
                                    window.open(
                                      `mailto:?body=${window.location.origin}/campaigns/${campaign.campaignSlug}`,
                                      "_blank",
                                    )
                                  }
                                >
                                  <Mail />
                                </button>
                              </div>
                            </div>

                            {/* Footer
                            <div className="py-4 text-center text-sm font-medium text-indigo-700 cursor-pointer flex items-center justify-center gap-1">
                              More ways to share{" "}
                              <ChevronDown className="w-4 h-4" />
                            </div> */}
                          </AlertDialogContent>
                        </AlertDialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                              `/dashboard/campaigns/edit/${campaign._id}`,
                            );
                          }}
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              // row click (navigate) ko rokne ke liye:
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent
                            // dialog pe click se bhi parent row ka onClick na chale:
                            onClick={(e) => e.stopPropagation()}
                          >
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Cause?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete this campaign and remove all
                                its data from your dashboard.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDelete(campaign._id)}
                                disabled={deletingId === campaign._id}
                              >
                                {deletingId === campaign._id ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : null}
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredCampaigns?.length == 0 && (
                <div className="flex justify-center items-center py-12 flex-col">
                  <svg fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M8.72847 61.2625C-12.2239 55.5483 12.6967 84.6752 27.7761 99.953H83.133V51.1427C76.5854 55.3085 70.633 57.0959 59.3235 46.9769C48.014 36.8578 46.2283 38.6435 35.514 57.0959C24.7997 75.5483 34.9189 68.4054 8.72847 61.2625Z"
                      fill="#DEF7F3"
                    ></path>
                    <path
                      d="M80.1553 16.4221V100.477H183.727V15.4094C183.727 9.73818 179.781 8.65796 177.808 8.82674H87.8492C81.694 8.82674 80.1553 13.8903 80.1553 16.4221Z"
                      fill="#EEF3F1"
                    ></path>
                    <path
                      d="M232.538 19.5948C219.681 10.5471 194.641 28.5233 183.729 38.6424V99.9514H232.538C232.538 87.4514 230.157 82.6895 211.109 77.3324C192.062 71.9753 248.609 30.9043 232.538 19.5948Z"
                      fill="#DEF7F3"
                    ></path>
                    <path
                      d="M184.024 23.6914L183.429 100.477"
                      stroke="#074C2D"
                      stroke-width="2.14286"
                      stroke-linecap="round"
                    ></path>
                    <path
                      d="M57.5381 84.4753C60.3952 85.4277 56.3476 95.5864 53.9666 100.547H46.8238C46.2284 98.7609 44.9186 94.5941 44.4424 92.2132C43.9662 89.8322 47.022 92.0148 48.6095 93.4036C51.5857 91.0227 42.0619 79.1177 46.8238 77.9272C51.5857 76.7368 50.9905 88.642 52.7762 90.4277C54.5619 92.2134 53.9666 83.2848 57.5381 84.4753Z"
                      fill="#aafada"
                    ></path>
                    <path
                      d="M136.396 41.3819C136.396 38.8443 138.453 36.7871 140.99 36.7871H165.134C167.672 36.7871 169.729 38.8443 169.729 41.3819V101.073H136.396V41.3819Z"
                      fill="#6dbb9c"
                    ></path>
                    <path
                      d="M196.824 92.8078C194.919 94.2363 196.824 98.1649 198.014 99.9506C198.609 100.546 199.919 101.38 200.395 99.9506C200.99 98.1638 207.538 91.6182 204.562 89.8325C202.181 88.4039 199.998 93.2049 199.205 95.7839C199.205 94.1966 198.728 91.3792 196.824 92.8078Z"
                      fill="#6dbb9c"
                    ></path>
                    <path
                      d="M235.071 100.547H1.07129"
                      stroke="#074C2D"
                      stroke-width="2.14286"
                      stroke-linecap="round"
                    ></path>
                    <path
                      d="M47.9384 100.547C46.6348 97.9678 44.2883 92.571 45.3312 91.6186C46.6348 90.4282 49.2419 95.1901 49.2419 93.4043C49.2419 91.6186 43.3756 75.5466 46.6346 77.9276C49.2419 79.8323 50.3282 81.8954 50.5455 82.6889"
                      stroke="#074C2D"
                      stroke-width="2.14286"
                      stroke-linecap="round"
                    ></path>
                    <path
                      d="M79.8586 99.8815L79.8584 17.7387C79.8584 14.564 81.406 8.21484 87.5965 8.21484H120.335"
                      stroke="#074C2D"
                      stroke-width="2.14286"
                      stroke-linecap="round"
                    ></path>
                    <path
                      d="M131.644 8.21484H174.501"
                      stroke="#074C2D"
                      stroke-width="2.14286"
                      stroke-linecap="round"
                    ></path>
                    <circle
                      cx="100.692"
                      cy="16.548"
                      r="3.57143"
                      fill="#EEF3F1"
                    ></circle>
                    <circle
                      cx="89.9767"
                      cy="16.548"
                      r="3.57143"
                      fill="#EEF3F1"
                    ></circle>
                    <path
                      d="M92.3577 17.1442C92.3577 15.5005 91.0252 14.168 89.3815 14.168C87.7378 14.168 86.4053 15.5005 86.4053 17.1442C86.4053 18.7879 87.7378 20.1203 89.3815 20.1203"
                      stroke="#074C2D"
                      stroke-width="2.14286"
                      stroke-linecap="round"
                    ></path>
                    <path
                      d="M100.883 14.2725C99.2983 13.8374 97.6606 14.7696 97.2254 16.3546C96.7903 17.9397 97.7224 19.5774 99.3075 20.0125C100.893 20.4477 102.53 19.5155 102.965 17.9305"
                      stroke="#074C2D"
                      stroke-width="2.14286"
                      stroke-linecap="round"
                    ></path>
                    <rect
                      x="92.3584"
                      y="36.7871"
                      width="33.3124"
                      height="33.3124"
                      rx="4.59482"
                      fill="#6dbb9c"
                    ></rect>
                    <rect
                      x="92.3584"
                      y="77.2637"
                      width="33.3333"
                      height="11.9048"
                      rx="4.59482"
                      fill="#6dbb9c"
                    ></rect>
                    <path
                      d="M195.832 3.00505C202.256 7.82986 192.41 31.1467 188.395 37.1777C183.786 44.3435 181.779 40.3228 173.747 32.2813C169.256 27.7839 156.276 9.03606 166.314 3.00505C174.343 -1.81976 181.11 5.47778 183.786 14.1882C183.786 8.82731 189.408 -1.81976 195.832 3.00505Z"
                      fill="#6dbb9c"
                    ></path>
                    <path
                      d="M183.674 13.7059C181.635 7.58662 175.651 -3.15605 168.036 2.82721C158.518 10.3063 165.317 21.1856 170.756 27.3048"
                      stroke="#074C2D"
                      stroke-width="2.14286"
                      stroke-linecap="round"
                    ></path>
                    <path
                      d="M188.434 3.50632C191.834 -0.570548 200.129 0.378108 197.953 12.3446C195.777 24.3112 186.518 38.5178 184.025 42.1442"
                      stroke="#074C2D"
                      stroke-width="2.14286"
                      stroke-linecap="round"
                    ></path>
                    <circle
                      cx="82.0836"
                      cy="57.5021"
                      r="24.6114"
                      transform="rotate(17.1817 82.0836 57.5021)"
                      fill="#09CFAF"
                    ></circle>
                    <path
                      d="M105.536 65.6096C101.457 78.8005 87.4574 86.1875 74.2665 82.1088C61.0755 78.0301 53.6886 64.0303 57.7673 50.8394C61.8459 37.6484 75.8457 30.2615 89.0367 34.3402"
                      stroke="#074C2D"
                      stroke-width="2.14286"
                      stroke-linecap="round"
                    ></path>
                    <path
                      d="M90.6167 51.4662C94.1753 54.3923 95.8743 59.1864 95.1435 64.2927C94.9849 65.3853 94.0203 66.2771 92.973 66.2856C91.9257 66.2942 91.2038 65.4288 91.3486 64.3249C91.8965 60.4814 90.6256 56.8818 87.9498 54.6816C83.6325 51.1317 76.8879 52.1085 72.4215 56.725L73.5336 56.5252C74.5915 56.3352 75.4738 57.0335 75.4785 58.1243C75.4964 59.199 74.6703 60.2319 73.5986 60.4106L67.8218 61.5037C67.3064 61.5963 66.8011 61.4798 66.4425 61.1849C66.0839 60.89 65.8719 60.4168 65.8632 59.8932L65.834 54.0805C65.8252 53.557 66.034 53.022 66.3673 52.6166C66.7006 52.2112 67.1985 51.8868 67.7277 51.8056C68.7856 51.6155 69.655 52.3576 69.6458 53.4372L69.6633 54.4843C75.6101 48.0955 84.7689 46.685 90.6034 51.4824L90.6167 51.4662Z"
                      fill="white"
                    ></path>
                  </svg>
                  <p>You have no causes at this time.</p>
                </div>
              )}
            </div>
          </div>
        </SidebarInset>
        <Modal isOpen={isOpen} onClose={closeModal}>
          <InviteUserForm onClose={closeModal} />
        </Modal>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
