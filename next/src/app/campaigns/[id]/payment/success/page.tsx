"use client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const PaymentSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session_id = searchParams?.get('session_id');
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<
    "success" | "error" | null
  >(null);
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) {
      return;
    }

    if (!session_id) {
      setVerificationStatus("error");
      setIsVerifying(false);
      return;
    }

    hasVerified.current = true;

    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payment/verify-session/${session_id}`
        );
        const data = await response.json();

        setVerificationStatus(data.success ? "success" : "error");
      } catch (error) {
        setVerificationStatus("error");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [session_id]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        {verificationStatus === "success" ? (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your donation. Your contribution will make a
              difference.
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
            <p className="text-gray-600 mb-6">
              We couldn't verify your payment. Please try again or contact
              support.
            </p>
          </>
        )}

        <Button onClick={() => router.push(`/campaigns`)} className="w-full">
          {verificationStatus === "success"
            ? "Return to Campaign"
            : "Try Again"}
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
