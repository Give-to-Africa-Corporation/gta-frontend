// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { useAppContext } from "@/context/AppContext";
import { useModal } from "@/context/ModalContext";

import Modal from "@/components/ModalInvite";
import InviteUserForm from "@/components/InviteUserForm";

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
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

import {
  LayoutDashboard,
  FileText,
  PieChart,
  Users,
  ChevronDown,
  Settings,
  UserPlus,
  LogOut,
  Calendar as CalendarIcon,
  Download,
  Banknote,
  WalletCards,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"; // agar aap use karte ho

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api/v1";

// -------- Types --------
type StripeBalanceEntry = {
  currency: string;
  amount: number; // already /100 on backend
};

type StripeBalance = {
  available: StripeBalanceEntry[];
  pending: StripeBalanceEntry[];
};

type StripePayout = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  arrivalDate: string; // ISO string from backend
  method: string | null;
};

type StripeTransaction = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description?: string | null;
  created: string; // ISO string
  applicationFee: number;
};

const PayoutsTab = () => {
  const navigate = useNavigate();
  const { user, logout, profileData } = useAppContext();
  const { isOpen, openModal, closeModal } = useModal();
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [creatingPayout, setCreatingPayout] = useState(false);

  const [mounted, setMounted] = useState(false);

  // Sidebar dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Stripe data
  const [balance, setBalance] = useState<StripeBalance | null>(null);
  const [payouts, setPayouts] = useState<StripePayout[]>([]);
  const [transactions, setTransactions] = useState<StripeTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [activeInnerTab, setActiveInnerTab] = useState<
    "payouts" | "transactions"
  >("payouts");

  // Mount animation
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found when accessing Payouts");
      navigate("/login");
    }
  }, [navigate]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Stripe data (balance, payouts, transactions)
  useEffect(() => {
    const fetchStripeData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [balanceRes, payoutsRes, transactionsRes] = await Promise.all([
          axios.get(`${API_URL}/ngos/stripe/balance`, { headers }),
          axios.get(`${API_URL}/ngos/stripe/payouts`, { headers }),
          axios.get(`${API_URL}/ngos/stripe/transactions`, { headers }),
        ]);

        setBalance({
          available: balanceRes.data.available || [],
          pending: balanceRes.data.pending || [],
        });

        setPayouts(payoutsRes.data.payouts || []);
        setTransactions(transactionsRes.data.transactions || []);
      } catch (err: any) {
        console.error("Error fetching Stripe data:", err);
        setError(
          err?.response?.data?.message || "Failed to load payout information",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStripeData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = () => {
    if (!user?.name) return "NG";
    return user.name
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0])
      .join("");
  };

  const formatCurrency = (amount: number, currency: string) => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency.toUpperCase(),
      }).format(amount);
    } catch {
      // fallback if currency code invalid
      return `${amount.toFixed(2)} ${currency.toUpperCase()}`;
    }
  };

  const formatDate = (dateInput: string | Date) => {
    const date =
      typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    return format(date, "LLL dd, yyyy");
  };

  const formatDateTime = (dateInput: string | Date) => {
    const date =
      typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    return format(date, "LLL dd, yyyy HH:mm");
  };

  const isWithinRange = (date: Date) => {
    if (!dateRange?.from) return true;
    if (dateRange.to) {
      return date >= dateRange.from && date <= dateRange.to;
    }
    return date >= dateRange.from;
  };

  // ---- Derived values ----
  const primaryCurrency =
    balance?.available[0]?.currency || balance?.pending[0]?.currency || "usd";

  const totalAvailable =
    balance?.available.reduce((sum, b) => sum + b.amount, 0) || 0;

  const totalPending =
    balance?.pending.reduce((sum, b) => sum + b.amount, 0) || 0;

  const totalPayoutsSent = payouts?.reduce((sum, p) => sum + p.amount, 0) || 0;

  // Filters for payouts
  const filteredPayouts = payouts.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;

    const arrival = new Date(p.arrivalDate);
    if (!isWithinRange(arrival)) return false;

    return true;
  });

  const handleCreatePayout = async () => {
    const amountNumber = Number(withdrawAmount);

    if (!amountNumber || amountNumber <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amountNumber > totalAvailable) {
      toast.error("Amount cannot be greater than available balance");
      return;
    }

    try {
      setCreatingPayout(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/ngos/stripe/payout`,
        {
          amount: amountNumber,
          currency: primaryCurrency,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Payout created successfully");

      setWithdrawOpen(false);
      setWithdrawAmount("");
      // Refresh payouts list
      const payoutsRes = await axios.get(`${API_URL}/ngos/stripe/payouts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPayouts(payoutsRes.data.payouts || []);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to create payout");
    } finally {
      setCreatingPayout(false);
    }
  };

  // Filters for transactions (only date range, no status filter for now)
  const filteredTransactions = transactions.filter((t) => {
    const created = new Date(t.created);
    if (!isWithinRange(created)) return false;
    return true;
  });

  const getPayoutStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>;
      case "pending":
        return (
          <Badge
            variant="outline"
            className="border-yellow-500 text-yellow-500"
          >
            Pending
          </Badge>
        );
      case "in_transit":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            In transit
          </Badge>
        );
      case "canceled":
      case "failed":
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTransactionStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
      case "succeeded":
        return <Badge className="bg-green-500">Succeeded</Badge>;
      case "pending":
        return (
          <Badge
            variant="outline"
            className="border-yellow-500 text-yellow-500"
          >
            Pending
          </Badge>
        );
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const exportPayoutsToCSV = () => {
    if (!filteredPayouts.length) return;

    const headers = [
      "Payout ID",
      "Amount",
      "Currency",
      "Status",
      "Arrival Date",
      "Method",
    ];

    const rows = filteredPayouts.map((p) => [
      p.id,
      p.amount.toString(),
      p.currency,
      p.status,
      formatDate(p.arrivalDate),
      p.method || "",
    ]);

    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `payouts-${format(new Date(), "yyyy-MM-dd")}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportTransactionsToCSV = () => {
    if (!filteredTransactions.length) return;

    const headers = [
      "Transaction ID",
      "Amount",
      "Currency",
      "Status",
      "Created",
      "Description",
      "Application Fee",
    ];

    const rows = filteredTransactions.map((t) => [
      t.id,
      t.amount.toString(),
      t.currency,
      t.status,
      formatDateTime(t.created),
      t.description || "",
      t.applicationFee.toString(),
    ]);

    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `transactions-${format(new Date(), "yyyy-MM-dd")}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ---- Render ----
  if (loading && !balance && !payouts.length && !transactions.length) {
    return (
      <SidebarProvider
        className={`${
          mounted ? "opacity-100" : "opacity-0"
        } transition-opacity duration-500`}
      >
        <div className="flex min-h-screen w-full">
          <Sidebar className="w-64 border-none h-screen flex flex-col justify-between pt-12" />
          <SidebarInset className="bg-[#074C2D11]">
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider
      className={`${
        mounted ? "opacity-100" : "opacity-0"
      } transition-opacity duration-500`}
    >
      <div className="flex min-h-screen w-full">
        {/* SIDEBAR */}
        <Sidebar className="w-64 border-none h-screen flex flex-col justify-between pt-12">
          <SidebarHeader>
            <div className="flex items-center space-x-3 py-2 px-4 mt-6"></div>
          </SidebarHeader>

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
                <SidebarMenuButton asChild tooltip="Donors">
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
                <SidebarMenuButton asChild tooltip="Donations">
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

              {/* NEW: Payouts menu item */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Payouts & Balance">
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

          {/* SIDEBAR FOOTER (User dropdown) */}
          <SidebarFooter className="px-4 py-4">
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center w-full justify-between text-gray-800 hover:text-gray-900 focus:outline-none"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    {profileData?.ngo?.profileImage ? (
                      <AvatarImage
                        src={
                          profileData.ngo.profileImage.startsWith("http")
                            ? profileData.ngo.profileImage
                            : `${import.meta.env.VITE_BE_URL}${profileData.ngo.profileImage}`
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
                {dropdownOpen && (
                  <div className="absolute text-left right-[-160px] bottom-[10px] mt-2 py-3 w-[190px] bg-white shadow-lg rounded-xl border border-gray-100 z-50">
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
                    <button
                      onClick={openModal}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Invite a user
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

        {/* MAIN CONTENT */}
        <SidebarInset className="bg-[#074C2D11]">
          <div className="p-4 md:p-6 lg:p-8">
            <Card>
              <div className="flex items-center justify-between p-6 pb-0">
                <CardHeader>
                  <CardTitle>Payouts & Balance</CardTitle>
                  <CardDescription>
                    Manage your balance and view payout history.
                  </CardDescription>
                </CardHeader>
                <Button
                  className="mt-2 w-fit"
                  size="sm"
                  disabled={totalAvailable <= 0}
                  onClick={() => setWithdrawOpen(true)}
                >
                  Payout Funds
                </Button>
                <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Payout Funds</DialogTitle>
                      <DialogDescription>
                        Enter the amount you wish to withdraw to your bank
                        account.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 mt-2">
                      <div className="text-sm text-muted-foreground">
                        Available:{" "}
                        <span className="font-medium">
                          {formatCurrency(totalAvailable, primaryCurrency)}
                        </span>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Amount to Payout
                        </label>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          placeholder="e.g. 200"
                        />
                      </div>
                    </div>

                    <DialogFooter className="mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setWithdrawOpen(false)}
                        disabled={creatingPayout}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreatePayout}
                        disabled={creatingPayout}
                      >
                        {creatingPayout ? "Processing..." : "Confirm payout"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <CardContent>
                {error && (
                  <div className="mb-4 text-sm text-red-500">{error}</div>
                )}

                {/* Top stats */}
                <div className="grid gap-4 sm:grid-cols-3 mb-6">
                  <div className="rounded-lg border bg-white p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm flex gap-2 items-center font-bold text-muted-foreground">
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                        Ready for payout.
                      </span>
                      <WalletCards className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-xl font-semibold">
                      {formatCurrency(totalAvailable, primaryCurrency)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your available balance ready for payout.
                    </p>
                  </div>

                  <div className="rounded-lg border bg-white p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm flex gap-2 items-center font-bold text-muted-foreground">
                        <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                        Pending balance
                      </span>
                      <Banknote className="h-6 w-6 text-amber-500" />
                    </div>
                    <div className="text-xl font-semibold">
                      {formatCurrency(totalPending, primaryCurrency)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Funds that are pending and will be available soon.
                    </p>
                  </div>

                  <div className="rounded-lg border bg-white p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm flex gap-2 items-center font-bold text-muted-foreground">
                        <div className="h-3 w-3 rounded-full bg-emerald-700"></div>
                        Total payouts sent
                      </span>
                      <Banknote className="h-6 w-6 text-emerald-700" />
                    </div>
                    <div className="text-xl font-semibold">
                      {formatCurrency(totalPayoutsSent, primaryCurrency)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total amount sent to your bank account.
                    </p>
                  </div>
                </div>

                {/* Filters + Tabs header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                  <Tabs
                    value={activeInnerTab}
                    onValueChange={(val) =>
                      setActiveInnerTab(val as "payouts" | "transactions")
                    }
                    className="w-full sm:w-auto"
                  >
                    <TabsList>
                      <TabsTrigger value="payouts">Payouts</TabsTrigger>
                      <TabsTrigger value="transactions">
                        Transactions
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    {activeInnerTab === "payouts" && (
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Status filter" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All statuses</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_transit">In transit</SelectItem>
                          <SelectItem value="canceled">Canceled</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    )}

                    <div className="flex gap-2 justify-end">
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
                                "Date range"
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
                        onClick={
                          activeInnerTab === "payouts"
                            ? exportPayoutsToCSV
                            : exportTransactionsToCSV
                        }
                      >
                        <Download className="h-4 w-4" />
                        <span>Export</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* TABS CONTENT */}
                <Tabs value={activeInnerTab} className="w-full">
                  {/* Payouts Table */}
                  <TabsContent value="payouts" className="mt-0">
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Payout ID</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Currency</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Arrival date</TableHead>
                            <TableHead>Method</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPayouts.length > 0 ? (
                            filteredPayouts.map((p) => (
                              <TableRow key={p.id}>
                                <TableCell className="font-medium">
                                  {p.id}
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(p.amount, p.currency)}
                                </TableCell>
                                <TableCell>
                                  {p.currency.toUpperCase()}
                                </TableCell>
                                <TableCell>
                                  {getPayoutStatusBadge(p.status)}
                                </TableCell>
                                <TableCell>
                                  {formatDate(p.arrivalDate)}
                                </TableCell>
                                <TableCell>
                                  {p.method ? p.method : "-"}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                className="text-center py-6 text-muted-foreground"
                              >
                                No payouts found for the selected filters.
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
                          {filteredPayouts.length}
                        </span>{" "}
                        of <span className="font-medium">{payouts.length}</span>{" "}
                        payouts
                      </div>
                    </div>
                  </TabsContent>

                  {/* Transactions Table */}
                  <TabsContent value="transactions" className="mt-0">
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Transaction ID</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Currency</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Application Fee</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredTransactions.length > 0 ? (
                            filteredTransactions.map((t) => (
                              <TableRow key={t.id}>
                                <TableCell className="font-medium">
                                  {t.id}
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(t.amount, t.currency)}
                                </TableCell>
                                <TableCell>
                                  {t.currency.toUpperCase()}
                                </TableCell>
                                <TableCell>
                                  {getTransactionStatusBadge(t.status)}
                                </TableCell>
                                <TableCell>
                                  {formatDateTime(t.created)}
                                </TableCell>
                                <TableCell>{t.description || "-"}</TableCell>
                                <TableCell>
                                  {t.applicationFee
                                    ? formatCurrency(t.applicationFee)
                                    : "-"}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={7}
                                className="text-center py-6 text-muted-foreground"
                              >
                                No transactions found for the selected date
                                range.
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
                          {filteredTransactions.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                          {transactions.length}
                        </span>{" "}
                        transactions
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>

      {/* Invite user modal */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <InviteUserForm onClose={closeModal} />
      </Modal>
    </SidebarProvider>
  );
};

export default PayoutsTab;
