import PaymentForm from "@/components/payments/PaymentForm";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { Campaign } from "@/lib/types";
import { campaignApi } from "@/service/apiService";
import { loadStripe } from "@stripe/stripe-js";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentPage = () => {
  const { id } = useParams<{ id: string }>();
  const { campaigns } = useAppContext();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDonationProcessing, setIsDonationProcessing] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) {
        navigate("/campaigns");
        return;
      }

      setIsLoading(true);

      try {
        // Try to fetch from API first
        const response = await campaignApi.getCampaign(id);

        if (response.success && response.data) {
          setCampaign(response.data);
        } else {
          // Fallback to context if API fails
          const foundCampaign = campaigns.find(
            (c) => c._id === id || c.campaignSlug === id
          );

          if (foundCampaign) {
            setCampaign(foundCampaign);
          } else {
            throw new Error("Campaign not found");
          }
        }
      } catch (error) {
        console.error("Error fetching campaign:", error);
        toast.error("Campaign not found");
        navigate("/campaigns");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaign();
  }, [id, campaigns, navigate]);

  const handleDonationSubmit = async (
    amount: string,
    paymentMethod: string,
    frequency: string,
    campaignId: string,
    donorName: string,
    donorEmail: string
  ) => {
    try {
      setIsDonationProcessing(true);

      const successUrl = new URL(
        `/campaigns/${
          campaign?.campaignSlug || campaign?._id
        }/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        window.location.origin
      ).toString();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/payment/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: [
              {
                name: campaign?.title || "Donation",
                description: `Donation to ${campaign?.title}`,
                amount: Math.round(parseFloat(amount) * 100),
                quantity: 1,
              },
            ],
            paymentMethod,
            frequency,
            successUrl,
            campaignId,
            donorName,
            donorEmail,
          }),
        }
      );

      const { sessionId } = await response.json();

      if (!sessionId) {
        throw new Error("Failed to create checkout session");
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to initialize");
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to process payment"
      );
      setIsDonationProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-brand-purple" />
        <p className="ml-2">Loading campaign details...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl mb-4">Campaign not found</p>
        <Button onClick={() => navigate("/campaigns")}>
          Back to Campaigns
        </Button>
      </div>
    );
  }

  return (
    <div className="container-custom max-w-7xl py-8">
      <Button
        variant="outline"
        onClick={() =>
          navigate(`/campaigns/${campaign.campaignSlug || campaign._id}`)
        }
        className="mb-6 flex items-center"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Campaign
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">{campaign.title}</h1>
        <p className="text-gray-600 mt-2">
          Make a donation to support this cause
        </p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
        <PaymentForm
          onSubmit={handleDonationSubmit}
          isProcessing={isDonationProcessing}
          campaignId={campaign._id || ""}
          campaignTitle={campaign.title}
        />
      </div>
    </div>
  );
};

export default PaymentPage;
