import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useAppContext } from "@/context/AppContext";
import { Donation } from "@/lib/types";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

const DonationsTab = () => {
  const [filter, setFilter] = useState("all");
  const [timeframe, setTimeframe] = useState("month");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profileData } = useAppContext();

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
      "Campaign",
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

  // Get unique campaign names for filter
  const campaignNames = Array.from(new Set(donations.map((d) => d.campaign)));

  if (loading) {
    return <div>Loading donations...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Donations</CardTitle>
          <CardDescription>
            Track and manage donations to your campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by campaign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Campaigns</SelectItem>
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
                <span>Export</span>
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
                  <TableHead>Campaign</TableHead>
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
                      <TableCell>${donation.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-brand-purple-light px-2.5 py-0.5 text-xs font-medium text-white">
                          {donation.campaign}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(donation.timestamp)}</TableCell>
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
              <span className="font-medium">{filteredDonations.length}</span> of{" "}
              <span className="font-medium">{filteredDonations.length}</span>{" "}
              donations
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationsTab;
