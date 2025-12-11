import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Image } from "@/components/ui/Image";
import { Progress } from "@/components/ui/progress";
import { useAppContext } from "@/context/AppContext";
import { Campaign as ApiCampaign } from "@/lib/types";
import { FALLBACK_IMAGE } from "@/lib/utils";
import { campaignApi } from "@/service/apiService";
import {
  CalendarDays,
  Edit,
  Eye,
  Infinity,
  MapPin,
  PlusCircle,
  Tag,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Map of campaign causes with labels
const causeLabels: Record<string, string> = {
  education: "Education",
  health: "Healthcare",
  environment: "Environment",
  hunger: "Hunger",
  water: "Clean Water",
  genderEquality: "Gender Equality",
  infrastructure: "Infrastructure",
  peaceJustice: "Peace and Justice",
  other: "Other",
};

interface CampaignsTabProps {
  ngoCampaigns?: ApiCampaign[];
}

const CampaignsTab = ({ ngoCampaigns }: CampaignsTabProps) => {
  const navigate = useNavigate();
  const { campaigns: allCampaigns, user } = useAppContext();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<ApiCampaign[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);

        // Use provided campaigns prop if available, otherwise fetch from API
        if (ngoCampaigns && ngoCampaigns.length > 0) {
          setCampaigns(ngoCampaigns);
          return;
        }

        // If no prop passed, fallback to context campaigns
        if (allCampaigns && allCampaigns.length > 0) {
          const filtered = allCampaigns.filter((c) => c.ngoId === user?.id);

          if (filtered.length > 0) {
            setCampaigns(filtered);
            return;
          }
        }

        // Only as a last resort, fetch from API
        const response = await campaignApi.getNgoCampaigns();

        if (!response.success) {
          throw new Error(response.error || "Failed to fetch campaigns");
        }

        setCampaigns(response.data || []);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [ngoCampaigns, allCampaigns, user]);

  // Calculate days left for a campaign
  const getDaysLeft = (deadline?: number | null) => {
    if (!deadline) return null; // For perpetual campaigns

    const end = new Date(deadline);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Format date
  const formatDate = (timestamp?: number | null) => {
    if (!timestamp) return "No end date";

    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Get status badge
  const getStatusBadge = (status: string, daysLeft: number | null) => {
    const isPerpetual = daysLeft === null;

    if (isPerpetual && status === "ongoing") {
      return <Badge className="bg-purple-500 shadow-md">Ongoing</Badge>;
    }

    switch (status) {
      case "ongoing":
        return daysLeft !== null && daysLeft < 7 ? (
          <Badge className="bg-yellow-500 shadow-md">Ending Soon</Badge>
        ) : (
          <Badge className="bg-green-500 shadow-md">Ongoing</Badge>
        );
      case "completed":
        return <Badge className="bg-blue-500 shadow-md">Completed</Badge>;
      case "draft":
        return (
          <Badge variant="outline" className="bg-white shadow-md">
            Draft
          </Badge>
        );
      case "paused":
        return <Badge className="bg-orange-500 shadow-md">Paused</Badge>;
      default:
        return (
          <Badge variant="outline" className="bg-white shadow-md">
            Unknown
          </Badge>
        );
    }
  };

  // Get cause badge
  const getCauseBadge = (cause: string) => {
    const badgeColors: Record<string, string> = {
      education: "bg-blue-500",
      health: "bg-red-500",
      environment: "bg-green-500",
      hunger: "bg-yellow-500",
      water: "bg-sky-500",
      genderEquality: "bg-purple-500",
      infrastructure: "bg-orange-500",
      peaceJustice: "bg-teal-500",
      other: "bg-gray-500",
    };

    return (
      <Badge className={`${badgeColors[cause] || "bg-gray-500"} ml-2`}>
        {causeLabels[cause] || "Other"}
      </Badge>
    );
  };

  // Handle campaign deletion
  const handleDeleteCampaign = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await campaignApi.deleteCampaign(id);

      if (!response.success) {
        throw new Error(response.error || "Failed to delete campaign");
      }

      // Remove the deleted campaign from the state
      setCampaigns(campaigns.filter((campaign) => campaign._id !== id));
      toast.success("Campaign deleted successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  // Calculate total metrics
  const totalRaised = campaigns.reduce(
    (total, campaign) => total + (campaign.totalRaised || 0),
    0
  );
  const totalDonors = campaigns.reduce(
    (total, campaign) => total + (campaign.donations?.length || 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Causes</h2>
        <Link to="/dashboard/campaigns/new">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Campaign
          </Button>
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <Card className="py-10">
          <CardContent className="flex flex-col items-center text-center">
            <div className="rounded-full bg-gray-100 p-6 mb-4">
              <PlusCircle className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Causes Yet</h3>
            <p className="text-gray-500 mb-6 max-w-md">
              Start your first fundraising campaign to connect with donors and
              make an impact through your NGO's mission.
            </p>
            <Button onClick={() => navigate("/dashboard/campaigns/new")}>
              Create Your First Campaign
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => {
            const daysLeft = getDaysLeft(campaign.deadline);
            const progressPercent = Math.min(
              Math.round(
                ((campaign.totalRaised || 0) / (campaign.fundingGoal || 1)) *
                  100
              ),
              100
            );
            const isPerpetual = !campaign.deadline;

            return (
              <Card
                key={campaign._id}
                className="overflow-hidden flex flex-col h-full"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={`${import.meta.env.VITE_BE_URL}${
                      campaign.media?.mainImage
                    }`}
                    alt={campaign.title}
                    className="w-full h-full object-cover"
                    fallback={FALLBACK_IMAGE}
                  />
                  <div className="absolute top-3 right-3 z-10 p-0.5 rounded">
                    {getStatusBadge(campaign.status, daysLeft)}
                  </div>
                </div>
                <CardHeader className="p-4 pb-0">
                  <CardTitle className="text-xl">{campaign.title}</CardTitle>
                  <div className="flex flex-wrap items-center text-sm text-gray-500 mt-1">
                    <div className="flex items-center mr-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      {campaign.country}
                    </div>
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      {causeLabels[campaign.cause] || campaign.cause}
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    {isPerpetual ? (
                      <div className="flex items-center">
                        <Infinity className="h-4 w-4 mr-1" />
                        Ongoing Campaign
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-1" />
                        {campaign.status === "completed"
                          ? `Ended: ${formatDate(campaign.deadline)}`
                          : `Ends: ${formatDate(campaign.deadline)}`}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-3 flex-grow flex flex-col justify-between">
                  <CardDescription className="mb-4 line-clamp-2">
                    {campaign.description}
                  </CardDescription>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">
                          ${campaign.totalRaised.toLocaleString()} raised
                        </span>
                        {!isPerpetual && (
                          <span className="text-gray-500">
                            of ${campaign.fundingGoal.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {!isPerpetual && (
                        <Progress value={progressPercent} className="h-2" />
                      )}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{campaign.donations?.length || 0} donors</span>
                      {isPerpetual ? (
                        <span className="text-brand-purple">Ongoing</span>
                      ) : campaign.status === "ongoing" ? (
                        <span>{daysLeft} days left</span>
                      ) : (
                        <span>Campaign ended</span>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 flex items-center justify-center gap-1"
                        onClick={() =>
                          navigate(
                            `/campaigns/${
                              campaign.campaignSlug || campaign._id
                            }`
                          )
                        }
                      >
                        <Eye className="h-4 w-4" /> View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 flex items-center justify-center gap-1"
                        onClick={() =>
                          navigate(`/dashboard/campaigns/edit/${campaign._id}`)
                        }
                      >
                        <Edit className="h-4 w-4" /> Edit
                      </Button>
                      {campaign.status !== "completed" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center justify-center aspect-square p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Campaign?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the campaign "
                                {campaign.title}" and remove it from the
                                platform.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteCampaign(campaign._id)
                                }
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {deletingId === campaign._id
                                  ? "Deleting..."
                                  : "Delete Campaign"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>
            Overview of all your campaign statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">
                Ongoing Causes
              </h3>
              <p className="text-3xl font-bold mt-1">
                {campaigns.filter((c) => c.status === "ongoing").length}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">
                Total Raised
              </h3>
              <p className="text-3xl font-bold mt-1">
                ${totalRaised.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">
                Total Donors
              </h3>
              <p className="text-3xl font-bold mt-1">{totalDonors}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignsTab;
