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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// import { circleQuestionMark } from 'lucide';
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import logoMain from "../../../public/logo.jfif";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ModalInvite";
import InviteUserForm from "@/components/InviteUserForm";
import { useModal } from "@/context/ModalContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Donation } from "@/lib/types";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Download } from "lucide-react";
import { DateRange } from "react-day-picker";
import axios from "axios";

const DonationsTab = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout, profileData } = useAppContext();
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

  const [filter, setFilter] = useState("all");
  const [timeframe, setTimeframe] = useState("month");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const allDonations: Donation[] = [];
        profileData?.campaigns.forEach((campaign) => {
          // Add regular donations
          campaign.donations.forEach((donation) => {
            allDonations.push({
              ...donation,
              campaign: campaign.title,
              status: "completed",
            });
          });
          // Add pending payments
          campaign.pendingPayments?.forEach((payment) => {
            allDonations.push({
              _id: payment.orderId,
              donorName: payment.donorName,
              donorEmail: payment.donorEmail,
              amount: payment.amount,
              timestamp: payment.timestamp,
              campaign: campaign.title,
              status: "pending",
              paymentMethod: payment.paymentMethod,
            });
          });
        });
        setDonations(allDonations);
      } catch (err) {
        setError("Failed to fetch donations");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [profileData]);

  const formatDate = (dateString: string | Date) => {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const getStatusBadge = (status: string, paymentMethod?: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "pending":
        return (
          <Badge
            variant="outline"
            className="border-yellow-500 text-yellow-500"
          >
            Pending ({paymentMethod || "Unknown"})
          </Badge>
        );
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Filter donations based on date range
  const getFilteredDonations = () => {
    let filtered =
      filter === "all"
        ? donations
        : donations.filter((donation) => donation.campaign === filter);

    if (dateRange?.from) {
      filtered = filtered.filter((donation) => {
        const donationDate = new Date(donation.timestamp);
        return (
          donationDate >= dateRange.from! &&
          (!dateRange.to || donationDate <= dateRange.to)
        );
      });
    }

    return filtered;
  };

  const filteredDonations = getFilteredDonations();

  // Export to CSV function
  const exportToCSV = () => {
    const headers = [
      "Donation ID",
      "Donor",
      "Amount",
      "Cause",
      "Date",
      "Status",
    ];
    const csvData = filteredDonations.map((donation) => [
      donation._id,
      donation.donorName,
      donation.amount,
      donation.campaign,
      formatDate(donation.timestamp),
      donation.status || "completed",
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
      `donations-${format(new Date(), "yyyy-MM-dd")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF function
  const exportToPDF = () => {
  try {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text("Donations Report", 14, 15);

    doc.setFontSize(10);
    doc.text(
      `Generated on: ${format(new Date(), "dd MMM yyyy")}`,
      14,
      22
    );

    // Table columns
    const tableColumn = [
      "Donation ID",
      "Donor",
      "Amount",
      "Cause",
      "Date",
      "Status",
    ];

    // Table rows
    const tableRows = filteredDonations.map((donation) => [
      donation._id,
      donation.donorName || "Anonymous",
      `$${donation.amount.toLocaleString()}`,
      donation.campaign,
      formatDate(donation.timestamp),
      donation.status || "Completed",
    ]);

    // AutoTable
    autoTable(doc, {
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      styles: {
        fontSize: 9,
      },
      headStyles: {
        fillColor: [7, 76, 45], // dark green
        textColor: 255,
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    });

    // Save PDF
    doc.save(`donations-${format(new Date(), "yyyy-MM-dd")}.pdf`);
  } catch (error) {
    console.error("Error exporting PDF:", error);
  }
};


  // Get unique campaign names for filter
  const campaignNames = Array.from(new Set(donations.map((d) => d.campaign)));

  if (loading) {
    return <div>Loading donations...</div>;
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
                <CardTitle>Donations</CardTitle>
                <CardDescription>
                  Track and manage donations to your causes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Select value={filter} onValueChange={setFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by causes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Causes</SelectItem>
                        {campaignNames.map((campaign) => (
                          <SelectItem key={campaign} value={campaign}>
                            {campaign}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="quarter">This Quarter</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                        <SelectItem value="all-time">All Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <CalendarIcon className="h-4 w-4" />
                          <span>
                            {dateRange?.from ? (
                              dateRange.to ? (
                                <>
                                  {format(dateRange.from, "LLL dd, y")} -{" "}
                                  {format(dateRange.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(dateRange.from, "LLL dd, y")
                              )
                            ) : (
                              "Date Range"
                            )}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange?.from}
                          selected={dateRange}
                          onSelect={(range: DateRange | undefined) =>
                            setDateRange(range)
                          }
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={exportToCSV}
                    >
                      <Download className="h-4 w-4" />
                      Export CSV
                    </Button>
                    {/* export as pdf */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={exportToPDF}
                    >
                      <Download className="h-4 w-4" />
                      Export PDF
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Donation ID</TableHead>
                        <TableHead>Donor</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Cause</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDonations.length > 0 ? (
                        filteredDonations.map((donation) => (
                          <TableRow key={donation._id}>
                            <TableCell className="font-medium">
                              {donation._id}
                            </TableCell>
                            <TableCell>{donation.donorName}</TableCell>
                            <TableCell>
                              ${donation.amount.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center rounded-full bg-brand-purple-light px-2.5 py-0.5 text-xs font-medium text-white">
                                {donation.campaign}
                              </span>
                            </TableCell>
                            <TableCell>
                              {formatDate(donation.timestamp)}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(
                                donation.status || "completed",
                                donation.paymentMethod
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-6 text-muted-foreground"
                          >
                            No donations found for the selected filter.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center justify-end space-x-2 py-4">
                  <div className="text-sm text-muted-foreground">
                    Showing{" "}
                    <span className="font-medium">
                      {filteredDonations.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {filteredDonations.length}
                    </span>{" "}
                    donations
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

export default DonationsTab;
