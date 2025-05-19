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
import { FileText, LayoutDashboard, LogOut, PieChart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import CampaignsTab from "./tabs/CampaignsTab";
import DonationsTab from "./tabs/DonationsTab";
import DonorsTab from "./tabs/DonorsTab";
import ProfileTab from "./tabs/ProfileTab";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout, profileData } = useAppContext();
  const [activeTab, setActiveTab] = useState("profile");
  const [mounted, setMounted] = useState(false);

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

  // Calculate stats if not available from profileData
  const stats: NgoStats = profileData?.stats || {
    totalCampaigns: ngoCampaigns.length,
    activeCampaigns: ngoCampaigns.filter((c) => c.status === "ongoing").length,
    totalRaised: ngoCampaigns.reduce((sum, c) => sum + (c.totalRaised || 0), 0),
    totalDonations: 0,
    completedCampaigns: 0,
    completionRate: 0,
    uniqueDonors: 0,
  };

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
    // Debug authentication at Dashboard load
    const token = localStorage.getItem("token");
    // If no token or no user, redirect to login
    if (!token) {
      console.error("No token found when accessing Dashboard");
      navigate("/login");
    }
  }, []);

  return (
    <SidebarProvider
      className={`${
        mounted ? "opacity-100" : "opacity-0"
      } transition-opacity duration-500`}
    >
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex items-center space-x-2 p-4">
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
                <h2 className="font-semibold">{user?.name || "NGO User"}</h2>
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
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <Link to="/dashboard">
                    <LayoutDashboard className="mr-3 h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Create Campaign">
                  <Link to="/dashboard/campaigns/new">
                    <FileText className="mr-3 h-5 w-5" />
                    <span>Create Campaign</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="View Campaigns">
                  <Link to="/campaigns">
                    <PieChart className="mr-3 h-5 w-5" />
                    <span>View Campaigns</span>
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
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">
                  Welcome back, {user?.name || "NGO"}
                </h1>
                <p className="text-gray-600">
                  Manage your NGO profile, campaigns, and donor relationships.
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
                  <p className="text-sm text-green-600">
                    From {stats.totalDonations || "all"} donations
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Ongoing Campaigns</CardDescription>
                  <CardTitle className="text-2xl">
                    {stats.activeCampaigns}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {stats.activeCampaigns > 0
                      ? `Out of ${stats.totalCampaigns} total campaigns`
                      : "No ongoing campaigns"}
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
                  <p className="text-sm text-green-600">
                    {stats.uniqueDonors > 0
                      ? `Supporting your cause`
                      : "Start campaigns to attract donors"}
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
                    {stats.completedCampaigns} completed campaigns
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
                <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
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
