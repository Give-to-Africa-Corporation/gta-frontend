"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppContext } from "@/context/AppContext";
import { NgoProfileDonor } from "@/lib/types";
import { format } from "date-fns";
import { Download, Search } from "lucide-react";
import { useEffect, useState } from "react";

const DonorsTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [donors, setDonors] = useState<NgoProfileDonor[]>([]);
  const { profileData } = useAppContext();

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
      donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
  const getInitials = (name: string) => {
    return name
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Donors</CardTitle>
          <CardDescription>Manage your organization's donors</CardDescription>
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
                {filteredDonors.map((donor) => (
                  <TableRow key={donor.email || donor.name}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {getInitials(donor.name)}
                          </AvatarFallback>
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
                    <TableCell>{formatDate(donor.lastDonation)}</TableCell>
                    <TableCell>{donor.donationCount}</TableCell>
                    {/* <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Send Email</DropdownMenuItem>
                          <DropdownMenuItem>View Donations</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            Remove Donor
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell> */}
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
  );
};

export default DonorsTab;
