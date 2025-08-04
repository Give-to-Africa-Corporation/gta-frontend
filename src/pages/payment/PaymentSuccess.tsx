import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<
    "success" | "error" | null
  >(null);
  const hasVerified = useRef(false);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (hasVerified.current) {
      return;
    }

    if (!sessionId) {
      setVerificationStatus("error");
      setIsVerifying(false);
      return;
    }

    hasVerified.current = true;

    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/payment/verify-session/${sessionId}`
        );
        const data = await response.json();

        console.log("Payment verification response:", data);

        setVerificationStatus(data.success ? "success" : "error");
      } catch (error) {
        console.error("Payment verification error:", error);
        setVerificationStatus("error");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

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

        <Button onClick={() => navigate(`/campaigns`)} className="w-full">
          {verificationStatus === "success"
            ? "Return to Campaign"
            : "Try Again"}
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
