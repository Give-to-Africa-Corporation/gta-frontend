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
import { NgoProfileDonor, NgoStats } from "@/lib/types";
import {
  ArrowRightLeft,
  Banknote,
  ChevronDown,
  Download,
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
  // Table,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
// import { circleQuestionMark } from 'lucide';
import { useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import Modal from "@/components/ModalInvite";
import InviteUserForm from "@/components/InviteUserForm";
import { useModal } from "@/context/ModalContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useEffect, useState } from "react";

const DonorsTab = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout, profileData } = useAppContext();
  const ngoId = profileData?.ngo?._id;
  const [activeTab, setActiveTab] = useState("profile");
  const [activeTabCam, setActiveTabCam] = useState("ongoing");
  const [mounted, setMounted] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [donors, setDonors] = useState<NgoProfileDonor[]>([]);
  console.log(donors, "donors");

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

  const handleLogout = () => {
    logout();
    navigate("/");
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

  useEffect(() => {
    if (profileData) {
      // Get all donors including pending ones
      const allDonors = new Map();

      profileData.campaigns.forEach((campaign) => {
        // Process regular donations
        campaign.donations.forEach((donation) => {
          const key = donation.donorEmail || donation.donorName;
          if (!allDonors.has(key)) {
            allDonors.set(key, {
              name: donation.donorName,
              email: donation.donorEmail,
              totalDonated: donation.amount,
              lastDonation: donation.timestamp,
              donationCount: 1,
              status: "completed",
            });
          } else {
            const donor = allDonors.get(key);
            donor.totalDonated += donation.amount;
            donor.donationCount += 1;
            if (new Date(donation.timestamp) > new Date(donor.lastDonation)) {
              donor.lastDonation = donation.timestamp;
            }
          }
        });

        // Process pending payments
        campaign.pendingPayments?.forEach((payment) => {
          const key = payment.donorEmail || payment.donorName;
          if (!allDonors.has(key)) {
            allDonors.set(key, {
              name: payment.donorName,
              email: payment.donorEmail,
              totalDonated: payment.amount,
              lastDonation: payment.timestamp,
              donationCount: 1,
              status: "pending",
              paymentMethod: payment.paymentMethod,
            });
          } else {
            const donor = allDonors.get(key);
            donor.totalDonated += payment.amount;
            donor.donationCount += 1;
            if (new Date(payment.timestamp) > new Date(donor.lastDonation)) {
              donor.lastDonation = payment.timestamp;
              donor.status = "pending";
              donor.paymentMethod = payment.paymentMethod;
            }
          }
        });
      });

      setDonors(Array.from(allDonors.values()));
      setLoading(false);
    }
  }, [profileData]);

  // Get donors from profile data
  // const donors = profileData?.donors || [];

  // Filter donors based on search query
  const filteredDonors = donors.filter(
    (donor) =>
      donor?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // console.log(filteredDonors, "filteredDonors")

  const formatDate = (dateString: string | Date) => {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Get donor initials for avatar
  const getInitials = () => {
    if (!user?.name) return "NG";
    return user.name
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0])
      .join("");
  };

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Total Donated",
      "Last Donation",
      "Number of Donations",
    ];
    const csvData = filteredDonors.map((donor) => [
      donor.name,
      donor.email || "N/A",
      donor.totalDonated,
      formatDate(donor.lastDonation),
      donor.donationCount,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `donors-${format(new Date(), "yyyy-MM-dd")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div>Loading donors...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

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
          <div className="p-4 md:p-6 lg:p-8">
            <Card>
              <CardHeader>
                <CardTitle>Donors</CardTitle>
                <CardDescription>
                  Manage your organization's donors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search donors..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={exportToCSV}
                    >
                      <Download className="h-4 w-4" />
                      <span>Export</span>
                    </Button>
                    {/* <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Mail className="h-4 w-4" />
                <span>Contact All</span>
              </Button> */}
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Total Donated</TableHead>
                        <TableHead>Last Donation</TableHead>
                        <TableHead>Donations</TableHead>
                        {/* <TableHead>Actions</TableHead> */}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDonors?.map((donor) => (
                        <TableRow key={donor.email || donor.name}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{getInitials()}</AvatarFallback>
                              </Avatar>
                              {donor.name}
                              {donor.status === "pending" && (
                                <Badge
                                  variant="outline"
                                  className="ml-2 border-yellow-500 text-yellow-500"
                                >
                                  Pending ({donor.paymentMethod})
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{donor.email || "N/A"}</TableCell>
                          <TableCell>
                            ${donor.totalDonated.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {formatDate(donor.lastDonation)}
                          </TableCell>
                          <TableCell>{donor.donationCount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center justify-center space-x-2 py-4">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-3 hover:bg-brand-purple hover:text-white"
                  >
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="px-3">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
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

export default DonorsTab;
