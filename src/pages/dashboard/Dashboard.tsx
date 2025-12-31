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
  Banknote,
  FileText,
  LayoutDashboard,
  LogOut,
  PieChart,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import CampaignsTab from "./tabs/CampaignsTab";
import DonationsTab from "./tabs/DonationsTab";
import DonorsTab from "./tabs/DonorsTab";
import ProfileTab from "./tabs/ProfileTab";
import axios from "axios";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout, profileData } = useAppContext();
  // console.log(profileData?.ngo?._id, "ngo id");
  const ngoId = profileData?.ngo?._id;
  const [activeTab, setActiveTab] = useState("profile");
  const [mounted, setMounted] = useState(false);

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

  return (
    <SidebarProvider
      className={`${
        mounted ? "opacity-100" : "opacity-0"
      } transition-opacity duration-500`}
    >
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex items-center space-x-2 py-4 px-2 mt-20">
              <Avatar>
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
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-sm ">
                  {user?.name || "NGO User"}
                </h2>
                <p className="text-sm text-gray-500">
                  <Badge variant="outline" className="mr-1">
                    NGO
                  </Badge>
                  NGO
                </p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem className="mt-4">
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <Link to="/dashboard">
                    <LayoutDashboard className="mr-3 h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Complete Bank Details"
                >
                  <Link to="/dashboard/profile/complete">
                    <Banknote className="mr-3 h-5 w-5" />
                    <span>Complete Bank Details</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem> */}

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
                    className={
                      !profileData?.ngo?.NGOAccountReady
                        ? "pointer-events-none"
                        : ""
                    }
                  >
                    <FileText className="mr-3 h-5 w-5" />
                    <span>Create Causes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="View Causes">
                  <Link to="/campaigns">
                    <PieChart className="mr-3 h-5 w-5" />
                    <span>View Causes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600"
                  tooltip="Logout"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <div className="p-4 md:p-6 lg:p-8">
            {!profileData?.ngo?.NGOAccountReady && (
              <div className="text-sm bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md flex flex-col md:flex-row items-center justify-between">
                <p>
                  Complete your onboarding and bank details to activate your Stripe account for payouts.
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

            {/* Dashboard Overview */}
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

            {/* Tabs */}
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
    </SidebarProvider>
  );
};

export default Dashboard;
