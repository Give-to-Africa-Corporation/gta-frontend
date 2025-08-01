import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { toast } from "sonner";
import PaymentForm from "./PaymentForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface DonationDialogProps {
  trigger?: React.ReactNode;
  campaignId?: string;
  campaignTitle?: string;
}

export function DonationDialog({
  trigger,
  campaignId = "frontline-fund",
  campaignTitle = "The Frontline Fund",
}: DonationDialogProps) {
  const [isDonationProcessing, setIsDonationProcessing] = useState(false);
  const [open, setOpen] = useState(false);

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
                name: campaignTitle,
                description: `Donation to ${campaignTitle}`,
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="lg" className="font-semibold">
            Donate Now
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-5xl h-fit">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-bold">
            {campaignTitle}
          </DialogTitle>
          <DialogDescription className="text-base">
            Support Africa's grassroots leaders making a difference
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2">
          <PaymentForm
            onSubmit={handleDonationSubmit}
            isProcessing={isDonationProcessing}
            campaignId={campaignId}
            campaignTitle={campaignTitle}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
