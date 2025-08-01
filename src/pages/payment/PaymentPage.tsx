import PaymentForm from "@/components/payments/PaymentForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

const faqItems = [
  {
    id: "item-1",
    question: "Is my donation tax-deductible?",
    answer:
      "Yes. Give to Africa is a registered 501(c)(3) nonprofit organization. Your donation is tax-deductible to the extent allowed by law. You will receive an email receipt for your records.",
  },
  {
    id: "item-2",
    question: "How will my donation be used?",
    answer:
      "Your donation supports trusted, African-led nonprofits doing critical work in their communities. Funds are used for programs, operations, and regranting to vetted grassroots organizations across Africa.",
  },
  {
    id: "item-3",
    question: "Can I choose which country or project to support?",
    answer:
      "Yes. You can direct your donation to a specific NGO, country, or cause on our donation form. If you don't select a preference, your donation will support the highest priority needs across our network.",
  },
  {
    id: "item-4",
    question: "Is this a secure donation?",
    answer:
      "Absolutely. All donations are processed through a secure, encrypted system. Your personal and financial information is protected and never shared.",
  },
  {
    id: "item-5",
    question: "Can I make a recurring donation?",
    answer:
      "Yes! You can choose to make a monthly gift to provide ongoing support. Recurring donations help sustain long-term impact in communities.",
  },
  {
    id: "item-6",
    question: "Can I donate in someone's honor or memory?",
    answer:
      "Yes. On our donation form, you can dedicate your gift and choose to notify the recipient with a personalized message.",
  },
  {
    id: "item-7",
    question: "Do you accept international donations?",
    answer:
      "Yes, we welcome donations from around the world. Our platform supports multiple currencies and payment methods.",
  },
  {
    id: "item-8",
    question: "What other ways can I give?",
    answer:
      "In addition to one-time and monthly donations, you can support us through donor-advised funds (DAFs), stock gifts, cryptocurrency, corporate matching, and legacy giving. Contact us at info@2africa.org for details.",
  },
  {
    id: "item-9",
    question: "How can I update or cancel my monthly donation?",
    answer:
      "You can manage your donation preferences anytime. Just email us at info@2africa.org and we'll be happy to assist.",
  },
  {
    id: "item-10",
    question: "Will I receive a receipt?",
    answer:
      "Yes. A donation receipt will be emailed to you immediately after your donation is processed. Year-end summaries are also available upon request.",
  },
];

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

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default PaymentPage;
