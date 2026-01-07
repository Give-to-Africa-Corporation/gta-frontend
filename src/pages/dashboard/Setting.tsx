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
import Modal from "@/components/ModalInvite";
import InviteUserForm from "@/components/InviteUserForm";
import { useModal } from "@/context/ModalContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout, profileData } = useAppContext();
  console.log(profileData, "profileData");
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
        `${import.meta.env.VITE_API_URL}/ngos/${ngoId}/paypal-onboarding`
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
        error.response?.data || "Error connecting to PayPal. Please try again."
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
        }
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
          "Failed to start Stripe onboarding. Please try again."
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

  return (
    <SidebarProvider
      className={`${
        mounted ? "opacity-100" : "opacity-0"
      } transition-opacity duration-500`}
    >
      <div className="flex min-h-screen w-full">
        <Sidebar className="w-64 pt-12 border-none h-screen flex flex-col justify-between">
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
              <img src={logoMain} width={80} height={50} alt="" />
            </div>
          </SidebarHeader>

          {/* Sidebar Content */}
          <SidebarContent className="flex-1">
            <SidebarMenu className="px-2 mt-4">
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <Link
                    to="/dashboard"
                    className="flex items-center py-2 px-3 rounded hover:bg-gray-100 transition"
                  >
                    <LayoutDashboard className="mr-3 h-5 w-5 text-gray-700" />
                    <span className="text-sm font-medium text-gray-800">
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
                    <span className="text-sm font-medium text-gray-800">
                      Create Causes
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="View Causes">
                  <Link
                    to="/campaigns"
                    className="flex items-center py-2 px-3 rounded hover:bg-gray-100 transition"
                  >
                    <PieChart className="mr-3 h-5 w-5 text-gray-700" />
                    <span className="text-sm font-medium text-gray-800">
                      View Causes
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
                  <div>
                    <span className="text-sm font-medium">
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
                      onClick={() => navigate("/settings")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </button>
                    <button
                      onClick={openModal}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Invite a user
                    </button>
                    <button
                      // onClick={() => handleSwitchProfile()}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <ArrowRightLeft className="mr-2 h-4 w-4" />
                      Switch profile
                    </button>
                    <hr className="pt-3" />
                    <button
                      onClick={() => navigate("/invite")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LucideMessageCircleQuestion className="mr-2 h-4 w-4" />
                      Help Center
                    </button>
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

        <SidebarInset>
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
              {/* <div>
                <h1 className="text-3xl font-bold">
                  Welcome back, {user?.name || "NGO"}
                </h1>
                <p className="text-gray-600">
                  Manage your NGO profile, causes, and donor relationships.
                </p>
              </div> */}
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
        </SidebarInset>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <InviteUserForm onClose={closeModal} />
      </Modal>
    </SidebarProvider>
  );
};

export default Dashboard;
