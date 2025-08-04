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
  campaignId = "688d5445cea70a7c2c17cc22",
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
        `/campaigns/${campaignId}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2 sticky top-0 bg-background z-10 pb-4">
          <DialogTitle className="text-2xl font-bold">
            {campaignTitle}
          </DialogTitle>
          <DialogDescription className="text-base">
            Support Africa's grassroots leaders making a difference
          </DialogDescription>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            </svg>
            You'll be securely redirected to Stripe to complete your donation
          </div>
        </DialogHeader>
        <div className="mt-2">
          <PaymentForm
            onSubmit={handleDonationSubmit}
            isProcessing={isDonationProcessing}
            campaignId={campaignId}
            campaignTitle={campaignTitle}
            isFrontline={campaignId === "frontline-fund"}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
