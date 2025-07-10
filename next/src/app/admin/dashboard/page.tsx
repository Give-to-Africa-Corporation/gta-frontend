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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/context/AppContext";
import { FALLBACK_IMAGE } from "@/lib/utils";
import {
  CheckCircle,
  Eye,
  File,
  FileCheck,
  FileX,
  LogOut,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AdminDashboard = () => {
  const router = useRouter();
  const {
    user,
    logout,
    ngos,
    campaigns,
    approveNGO,
    rejectNGO,
    isLoading,
    loadAdminData,
  } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNGO, setSelectedNGO] = useState<string | null>(null);

  // Load admin data when component mounts
  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  // Filter NGOs based on search query
  const filteredNGOs = ngos.filter(
    (ngo) =>
      ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ngo.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Count NGOs by status
  const pendingCount = ngos.filter((ngo) => ngo.status === "pending").length;
  const approvedCount = ngos.filter((ngo) => ngo.status === "approved").length;
  const rejectedCount = ngos.filter((ngo) => ngo.status === "rejected").length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl">Admin Dashboard</span>
            <Badge variant="outline" className="ml-2 bg-gray-100">
              {user?.email}
            </Badge>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Dashboard content */}
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, Admin</h1>
          <p className="text-gray-600">
            Manage NGO verification requests and monitor platform activity.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending Verifications</CardDescription>
              <CardTitle className="text-2xl">{pendingCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-yellow-600 flex items-center">
                <File className="h-4 w-4 mr-1" />
                Requires review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Verified NGOs</CardDescription>
              <CardTitle className="text-2xl">{approvedCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-600 flex items-center">
                <FileCheck className="h-4 w-4 mr-1" />
                Active on platform
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Rejected Applications</CardDescription>
              <CardTitle className="text-2xl">{rejectedCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-600 flex items-center">
                <FileX className="h-4 w-4 mr-1" />
                Did not meet criteria
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="verification" className="space-y-6">
          <TabsList className="mb-4">
            <TabsTrigger value="verification">NGO Verification</TabsTrigger>
            <TabsTrigger value="ngos">Verified NGOs</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            {/* <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger> */}
          </TabsList>

          {/* Verification Tab */}
          <TabsContent value="verification" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Pending NGO Verification</CardTitle>
                  <Input
                    className="max-w-xs"
                    placeholder="Search NGOs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">NGO</th>
                        <th className="text-left py-3 px-4 font-medium">
                          Country
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredNGOs.map((ngo) => (
                        <tr
                          key={ngo._id || ngo.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-3">
                                <AvatarFallback>
                                  {ngo.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{ngo.name}</p>
                                <p className="text-gray-500 text-xs">
                                  {ngo.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">{ngo.country}</td>
                          <td className="py-3 px-4">{ngo.registrationDate}</td>
                          <td className="py-3 px-4">
                            {ngo.status === "pending" && (
                              <Badge
                                variant="outline"
                                className="bg-yellow-100 text-yellow-800 border-yellow-400"
                              >
                                Pending
                              </Badge>
                            )}
                            {ngo.status === "approved" && (
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800 border-green-400"
                              >
                                Approved
                              </Badge>
                            )}
                            {ngo.status === "rejected" && (
                              <Badge
                                variant="outline"
                                className="bg-red-100 text-red-800 border-red-400"
                              >
                                Rejected
                              </Badge>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      setSelectedNGO(ngo._id ?? ngo.id ?? "")
                                    }
                                  >
                                    <Eye className="h-4 w-4 mr-1" /> View
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>
                                      NGO Verification Details
                                    </DialogTitle>
                                    <DialogDescription>
                                      Review the NGO documentation before
                                      approval.
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedNGO === ngo._id ||
                                  selectedNGO === ngo.id ? (
                                    <div className="py-4 space-y-4">
                                      <div>
                                        <h3 className="font-medium">
                                          NGO Information
                                        </h3>
                                        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                          <p className="text-gray-500">Name:</p>
                                          <p>{ngo.name}</p>
                                          <p className="text-gray-500">
                                            Email:
                                          </p>
                                          <p>{ngo.email}</p>
                                          <p className="text-gray-500">
                                            Country:
                                          </p>
                                          <p>{ngo.country}</p>
                                          <p className="text-gray-500">
                                            Registration Date:
                                          </p>
                                          <p>{ngo.registrationDate}</p>
                                        </div>
                                      </div>

                                      <Separator />

                                      <div>
                                        <h3 className="font-medium">
                                          Documents
                                        </h3>
                                        <div className="space-y-3 mt-2">
                                          <Card>
                                            <CardHeader className="py-3">
                                              <CardTitle className="text-sm">
                                                Registration Certificate
                                              </CardTitle>
                                            </CardHeader>
                                            <CardContent className="py-2">
                                              <div className="bg-gray-100 p-4 rounded flex items-center justify-center">
                                                <File className="h-12 w-12 text-gray-400" />
                                              </div>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                className="mt-3 w-full"
                                                onClick={() =>
                                                  window.open(
                                                    `${
                                                      process.env
                                                        .NEXT_PUBLIC_BE_URL
                                                    }${
                                                      ngo.documents
                                                        ?.registrationCertificate
                                                    }`,
                                                    "_blank"
                                                  )
                                                }
                                                disabled={
                                                  !ngo.documents
                                                    ?.registrationCertificate
                                                }
                                              >
                                                {ngo.documents
                                                  ?.registrationCertificate
                                                  ? "View Document"
                                                  : "No Document"}
                                              </Button>
                                            </CardContent>
                                          </Card>

                                          <Card>
                                            <CardHeader className="py-3">
                                              <CardTitle className="text-sm">
                                                Proof of Leadership
                                              </CardTitle>
                                            </CardHeader>
                                            <CardContent className="py-2">
                                              <div className="bg-gray-100 p-4 rounded flex items-center justify-center">
                                                <File className="h-12 w-12 text-gray-400" />
                                              </div>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                className="mt-3 w-full"
                                                onClick={() =>
                                                  window.open(
                                                    `${
                                                      process.env
                                                        .NEXT_PUBLIC_BE_URL
                                                    }${
                                                      ngo.documents
                                                        ?.leadershipProof
                                                    }`,
                                                    "_blank"
                                                  )
                                                }
                                                disabled={
                                                  !ngo.documents
                                                    ?.leadershipProof
                                                }
                                              >
                                                {ngo.documents?.leadershipProof
                                                  ? "View Document"
                                                  : "No Document"}
                                              </Button>
                                            </CardContent>
                                          </Card>

                                          <Card>
                                            <CardHeader className="py-3">
                                              <CardTitle className="text-sm">
                                                Additional Document
                                              </CardTitle>
                                            </CardHeader>
                                            <CardContent className="py-2">
                                              <div className="bg-gray-100 p-4 rounded flex items-center justify-center">
                                                <File className="h-12 w-12 text-gray-400" />
                                              </div>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                className="mt-3 w-full"
                                                onClick={() =>
                                                  window.open(
                                                    `${
                                                      process.env
                                                        .NEXT_PUBLIC_BE_URL
                                                    }${
                                                      ngo.documents
                                                        ?.additionalDocument
                                                    }`,
                                                    "_blank"
                                                  )
                                                }
                                                disabled={
                                                  !ngo.documents
                                                    ?.additionalDocument
                                                }
                                              >
                                                {ngo.documents
                                                  ?.additionalDocument
                                                  ? "View Document"
                                                  : "No Document"}
                                              </Button>
                                            </CardContent>
                                          </Card>
                                        </div>
                                      </div>

                                      <Separator />

                                      <div className="flex justify-between">
                                        <Button
                                          variant="destructive"
                                          onClick={() => {
                                            rejectNGO(ngo._id ?? ngo.id ?? "");
                                            setSelectedNGO(null);
                                          }}
                                          disabled={
                                            ngo.status !== "pending" ||
                                            isLoading
                                          }
                                        >
                                          <XCircle className="h-4 w-4 mr-2" />
                                          Reject Application
                                        </Button>
                                        <Button
                                          onClick={() => {
                                            approveNGO(ngo._id ?? ngo.id ?? "");
                                            setSelectedNGO(null);
                                          }}
                                          disabled={
                                            ngo.status !== "pending" ||
                                            isLoading
                                          }
                                        >
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                          Approve NGO
                                        </Button>
                                      </div>
                                    </div>
                                  ) : null}
                                </DialogContent>
                              </Dialog>

                              {ngo.status === "pending" && (
                                <>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() =>
                                      approveNGO(ngo._id ?? ngo.id ?? "")
                                    }
                                    disabled={isLoading}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />{" "}
                                    Approve
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                      rejectNGO(ngo._id ?? ngo.id ?? "")
                                    }
                                    disabled={isLoading}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" /> Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NGOs Tab */}
          <TabsContent value="ngos">
            <Card>
              <CardHeader>
                <CardTitle>Verified NGOs</CardTitle>
                <CardDescription>
                  All NGOs that have been approved
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">NGO</th>
                        <th className="text-left py-3 px-4 font-medium">
                          Country
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Campaigns
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Raised
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {ngos
                        .filter((ngo) => ngo.status === "approved")
                        .map((ngo) => {
                          const ngoCampaigns = campaigns.filter(
                            (c) => c.ngoId === ngo.id
                          );
                          const totalRaised = ngoCampaigns.reduce(
                            (sum, c) => sum + (c.raised || 0),
                            0
                          );

                          return (
                            <tr
                              key={ngo.id}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 mr-3">
                                    <AvatarFallback>
                                      {ngo.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{ngo.name}</p>
                                    <p className="text-gray-500 text-xs">
                                      {ngo.email}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">{ngo.country}</td>
                              <td className="py-3 px-4">
                                {ngoCampaigns.length}
                              </td>
                              <td className="py-3 px-4">
                                ${totalRaised.toLocaleString()}
                              </td>
                              <td className="py-3 px-4">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" /> View Details
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns">
            <Card>
              <CardHeader>
                <CardTitle>All Campaigns</CardTitle>
                <CardDescription>
                  Monitor all active fundraising campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {campaigns.map((campaign) => {
                    const ngo = ngos.find(
                      (n) => n._id === campaign.ngoId || n.id === campaign.ngoId
                    );
                    const raised = campaign.totalRaised || campaign.raised || 0;
                    const goal = campaign.fundingGoal || campaign.goal || 0;
                    const progressPercent = Math.min(
                      Math.round((raised / (goal || 1)) * 100),
                      100
                    );

                    return (
                      <Card
                        key={campaign._id || campaign.id}
                        className="overflow-hidden"
                      >
                        <div className="h-40 overflow-hidden">
                          <img
                            src={
                              campaign.media?.mainImage ||
                              campaign.image ||
                              FALLBACK_IMAGE
                            }
                            alt={campaign.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardHeader className="p-4 pb-0">
                          <CardTitle className="text-lg">
                            {campaign.title}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            by {ngo?.name || "Unknown NGO"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">
                                ${raised.toLocaleString()}
                              </span>
                              <span className="text-gray-500">
                                of ${goal.toLocaleString()}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-brand-purple h-2 rounded-full"
                                style={{ width: `${progressPercent}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{campaign.donors || 0} donors</span>
                              <span>
                                {campaign.status === "ongoing"
                                  ? "Ongoing"
                                  : campaign.status === "completed"
                                  ? "Completed"
                                  : campaign.status === "paused"
                                  ? "Paused"
                                  : "Draft"}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-4"
                            onClick={() =>
                              router.push(
                                `/campaigns/${campaign._id || campaign.id}`
                              )
                            }
                          >
                            <Eye className="h-4 w-4 mr-1" /> View Campaign
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          {/* <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
                <CardDescription>
                  Overview of platform performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        NGO Registration
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center bg-gray-50">
                        <BarChart3 className="h-24 w-24 text-gray-300" />
                        <p className="text-gray-400">
                          Statistics visualization would appear here
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Donation Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center bg-gray-50">
                        <BarChart3 className="h-24 w-24 text-gray-300" />
                        <p className="text-gray-400">
                          Statistics visualization would appear here
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}

          {/* Settings Tab */}
          {/* <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
                <CardDescription>
                  Configure admin account and platform settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Account</h3>
                    <p className="text-sm text-gray-500">
                      Manage your admin account settings
                    </p>
                    <div className="mt-4 grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="admin-name">Admin Name</Label>
                          <Input
                            id="admin-name"
                            value=""
                            placeholder="Admin User"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="admin-email">Email</Label>
                          <Input
                            id="admin-email"
                            value=""
                            placeholder="admin@fundraiserconnect.org"
                            disabled
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium">Platform Settings</h3>
                    <p className="text-sm text-gray-500">
                      Configure global platform settings
                    </p>
                    <div className="mt-4 grid gap-4">
                      <Button variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Platform Configuration
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
