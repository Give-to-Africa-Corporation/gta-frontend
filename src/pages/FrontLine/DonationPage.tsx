import PaymentForm from "@/components/payments/PaymentForm";
import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const FrontLineDonationPage = () => {
  const navigate = useNavigate();
  const [isDonationProcessing, setIsDonationProcessing] = useState(false);

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
        `/frontline/payment/success?session_id={CHECKOUT_SESSION_ID}`,
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
                name: "The Frontline Fund",
                description: "Donation to The Frontline Fund",
                amount: Math.round(parseFloat(amount) * 100),
                quantity: 1,
              },
            ],
            paymentMethod,
            frequency,
            successUrl,
            campaignId: "frontline-fund",
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

  return (
    <div className="container-custom max-w-7xl py-8">
      <Button
        variant="outline"
        onClick={() => navigate("/frontline")}
        className="mb-6 flex items-center"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Frontline Fund
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">The Frontline Fund</h1>
        <p className="text-gray-600 mt-2">
          Support Africa's grassroots leaders making a difference
        </p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
        <PaymentForm
          onSubmit={handleDonationSubmit}
          isProcessing={isDonationProcessing}
          campaignId="frontline-fund"
          campaignTitle="The Frontline Fund"
        />
      </div>
    </div>
  );
};

export default FrontLineDonationPage;
