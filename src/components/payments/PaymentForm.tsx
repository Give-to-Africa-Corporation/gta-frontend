import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import axios from "axios";
import {
  Banknote,
  Bitcoin,
  CircleCheck,
  CircleDollarSign,
  CreditCard,
  DollarSign,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface PaymentFormProps {
  onSubmit: (
    amount: string,
    paymentMethod: string,
    frequency: string,
    campaignId: string,
    donorName: string,
    donorEmail: string
  ) => void;
  isProcessing: boolean;
  campaignId: string;
  campaignTitle: string;
  isFrontline?: boolean;
}

interface PayPalApproveData {
  orderID?: string;
  vaultSetupToken?: string;
}

const PaymentForm = ({
  onSubmit,
  isProcessing,
  campaignId,
  campaignTitle,
  isFrontline = false,
}: PaymentFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [frequency, setFrequency] = useState("once");
  const [amount, setAmount] = useState("10");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  const isMobile = useIsMobile();

  // PayPal related functions
  const createPayPalOrder = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/paypal/orders`,
        {
          amount,
          campaignId,
          donorName,
          donorEmail,
          isRecurring: frequency === "monthly",
        }
      );

      if (data.id) {
        return data.id;
      } else {
        const errorDetail = data?.details?.[0];
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${data.debug_id})`
          : JSON.stringify(data);

        throw new Error(errorMessage);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "PayPal API Error:",
          error.response?.data || error.message
        );
        toast.error(
          `Could not initiate PayPal Checkout: ${
            error.response?.data?.error || error.message
          }`
        );
      } else {
        console.error("PayPal API Error:", error);
        toast.error(`Could not initiate PayPal Checkout: ${error}`);
      }
      return "";
    }
  };

  const createVaultSetupToken = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/paypal/vault`,
        {
          amount,
          payment_source: {
            paypal: {
              usage_type: "MERCHANT",
              experience_context: {
                return_url: `${window.location.origin}/campaigns/${campaignId}/payment/success`,
                cancel_url: `${window.location.origin}/campaigns/${campaignId}/payment`,
              },
            },
          },
          campaignId,
          donorName,
          donorEmail,
        }
      );

      if (data.id) {
        return data.id;
      }

      // Handle PayPal contingency errors
      if (data.ack === "contingency") {
        console.error("PayPal Contingency Error:", data);
        toast.error(
          "PayPal service is temporarily unavailable. Please try again in a few minutes."
        );
        return "";
      }

      // Handle other error cases
      const errorDetail = data?.details?.[0] || data?.error;
      const errorMessage = errorDetail
        ? `${errorDetail.issue || errorDetail.message} ${
            errorDetail.description || ""
          }`
        : "Failed to set up recurring payment. Please try again.";

      throw new Error(errorMessage);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Vault Setup Token Error:",
          error.response?.data || error.message
        );
        toast.error(
          error.response?.data?.error ||
            "Could not set up recurring payment. Please try again."
        );
      } else {
        console.error("Vault Setup Token Error:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Could not set up recurring payment. Please try again."
        );
      }
      return "";
    }
  };

  const handlePayPalApprove = async (data: PayPalApproveData) => {
    try {
      if (frequency === "monthly") {
        // Handle recurring payment approval
        const { data: paymentTokenData } = await axios.post(
          `${import.meta.env.VITE_API_URL}/paypal/vault/payment-tokens`,
          {
            payment_source: {
              token: {
                id: data.vaultSetupToken,
                type: "SETUP_TOKEN",
              },
            },
            campaignId,
            amount,
            donorName,
            donorEmail,
          }
        );

        if (paymentTokenData.id) {
          toast.success(
            "Recurring payment setup successful! Thank you for your donation."
          );
          window.location.href = `/campaigns/${campaignId}/payment/success`;
        } else {
          throw new Error("Failed to create payment token");
        }
      } else {
        // Handle one-time payment approval
        const { data: captureData } = await axios.post(
          `${import.meta.env.VITE_API_URL}/paypal/orders/${
            data.orderID
          }/capture`,
          {
            isRecurring: frequency === "monthly",
          }
        );

        if (captureData.status === "COMPLETED") {
          toast.success("Payment successful! Thank you for your donation.");
          window.location.href = `/campaigns/${campaignId}/payment/success`;
        } else {
          throw new Error("Payment not completed");
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Payment Error:", error.response?.data || error.message);
        toast.error(
          `Sorry, your transaction could not be processed: ${
            error.response?.data?.error || error.message
          }`
        );
      } else {
        console.error("Payment Error:", error);
        toast.error(`Sorry, your transaction could not be processed: ${error}`);
      }
    }
  };

  const handlePayPalError = (err: Record<string, unknown>) => {
    console.error("PayPal error:", err);
    toast.error("An error occurred with PayPal. Please try again.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate amount
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Validate name and email
    if (!donorName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!donorEmail.trim()) {
      toast.error("Please enter your email");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(donorEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Handle external payment methods
    if (
      ["stocks", "daf", "crypto", "paypal", "venmo"].includes(paymentMethod)
    ) {
      // Create a pending payment
      axios
        .post(
          `${
            import.meta.env.VITE_API_URL
          }/campaigns/${campaignId}/pending-payment`,
          {
            amount,
            donorName,
            donorEmail,
            paymentMethod,
            message: note,
            isRecurring: frequency === "monthly",
          }
        )
        .then((response) => {
          toast.success("Payment request submitted successfully!");
          // Redirect to external payment URL if provided
          if (response.data.redirectUrl) {
            // Open in new tab
            window.open(response.data.redirectUrl, "_blank");
          }
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.message || "Error submitting payment request"
          );
        });
      return;
    }

    // Handle regular payment methods
    onSubmit(
      amount,
      paymentMethod,
      frequency,
      campaignId,
      donorName,
      donorEmail
    );
  };

  // Payment methods configuration
  const allPaymentMethods = [
    {
      id: "card",
      name: "Card",
      icon: <CreditCard className="h-5 w-5 text-primary" />,
    },
    {
      id: "bank_transfer",
      name: "Bank",
      icon: <Banknote className="h-5 w-5 text-primary" />,
    },
    {
      id: "google_pay",
      name: "Google Pay",
      icon: <CircleDollarSign className="h-5 w-5 text-primary" />,
    },
    {
      id: "crypto",
      name: "Crypto",
      icon: <Bitcoin className="h-5 w-5 text-primary" />,
    },
    {
      id: "stocks",
      name: "Stocks",
      icon: <CircleCheck className="h-5 w-5 text-primary" />,
    },
    {
      id: "daf",
      name: "DAF",
      icon: <CircleDollarSign className="h-5 w-5 text-primary" />,
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: <DollarSign className="h-5 w-5 text-primary" />,
    },
    {
      id: "venmo",
      name: "Venmo",
      icon: <CircleDollarSign className="h-5 w-5 text-primary" />,
    },
  ];

  // Filter payment methods based on whether it's the Frontline page
  const paymentMethods = isFrontline
    ? allPaymentMethods.filter((method) => method.id === "card")
    : allPaymentMethods;

  // Default donation amounts
  const defaultAmounts = [20, 60, 100, 200];

  return (
    <div
      className={`flex ${
        isMobile ? "flex-col" : "flex-row"
      } gap-4 w-full max-w-7xl mx-auto`}
    >
      {/* Payment Methods Column */}
      {!isFrontline && (
        <div className={`${isMobile ? "w-full" : "w-1/3"}`}>
          <h3 className="text-lg font-medium mb-2">Payment Method</h3>
          <div className="space-y-2 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
            {paymentMethods.map((method) => {
              // Define colors for each payment method
              const getMethodStyles = (id: string) => {
                switch (id) {
                  case "card":
                    return {
                      selected:
                        "bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100/50 border-blue-500 text-blue-700 shadow-sm",
                      icon: "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white shadow-md",
                      hover: "hover:bg-blue-50/50 hover:shadow-sm",
                      border: "border-l-4",
                    };
                  case "bank_transfer":
                    return {
                      selected:
                        "bg-gradient-to-r from-emerald-100 via-emerald-50 to-emerald-100/50 border-emerald-500 text-emerald-700 shadow-sm",
                      icon: "bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white shadow-md",
                      hover: "hover:bg-emerald-50/50 hover:shadow-sm",
                      border: "border-l-4",
                    };
                  case "google_pay":
                    return {
                      selected:
                        "bg-gradient-to-r from-indigo-100 via-indigo-50 to-indigo-100/50 border-indigo-500 text-indigo-700 shadow-sm",
                      icon: "bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 text-white shadow-md",
                      hover: "hover:bg-indigo-50/50 hover:shadow-sm",
                      border: "border-l-4",
                    };
                  case "crypto":
                    return {
                      selected:
                        "bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100/50 border-amber-500 text-amber-700 shadow-sm",
                      icon: "bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white shadow-md",
                      hover: "hover:bg-amber-50/50 hover:shadow-sm",
                      border: "border-l-4",
                    };
                  case "stocks":
                    return {
                      selected:
                        "bg-gradient-to-r from-violet-100 via-violet-50 to-violet-100/50 border-violet-500 text-violet-700 shadow-sm",
                      icon: "bg-gradient-to-br from-violet-500 via-violet-600 to-violet-700 text-white shadow-md",
                      hover: "hover:bg-violet-50/50 hover:shadow-sm",
                      border: "border-l-4",
                    };
                  case "daf":
                    return {
                      selected:
                        "bg-gradient-to-r from-cyan-100 via-cyan-50 to-cyan-100/50 border-cyan-500 text-cyan-700 shadow-sm",
                      icon: "bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700 text-white shadow-md",
                      hover: "hover:bg-cyan-50/50 hover:shadow-sm",
                      border: "border-l-4",
                    };
                  case "paypal":
                    return {
                      selected:
                        "bg-gradient-to-r from-sky-100 via-sky-50 to-sky-100/50 border-sky-500 text-sky-700 shadow-sm",
                      icon: "bg-gradient-to-br from-sky-500 via-sky-600 to-sky-700 text-white shadow-md",
                      hover: "hover:bg-sky-50/50 hover:shadow-sm",
                      border: "border-l-4",
                    };
                  case "venmo":
                    return {
                      selected:
                        "bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100/50 border-blue-500 text-blue-700 shadow-sm",
                      icon: "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white shadow-md",
                      hover: "hover:bg-blue-50/50 hover:shadow-sm",
                      border: "border-l-4",
                    };
                  default:
                    return {
                      selected:
                        "bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 border-primary text-primary shadow-sm",
                      icon: "bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white shadow-md",
                      hover: "hover:bg-gray-50/50 hover:shadow-sm",
                      border: "border-l-4",
                    };
                }
              };

              const styles = getMethodStyles(method.id);

              return (
                <button
                  key={method.name}
                  type="button"
                  className={`flex items-center w-full p-4 text-left gap-3 transition-all duration-200 ${
                    paymentMethod === method.id
                      ? `${styles.selected} ${styles.border}`
                      : styles.hover
                  }`}
                  onClick={() => setPaymentMethod(method.id)}
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      paymentMethod === method.id
                        ? `${styles.icon} ring-2 ring-offset-2 ring-white`
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } transition-all duration-200`}
                  >
                    {React.cloneElement(method.icon, {
                      className: `h-5 w-5 ${
                        paymentMethod === method.id ? "text-white" : ""
                      }`,
                    })}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`font-medium ${
                        paymentMethod === method.id
                          ? styles.selected.split(" ")[3]
                          : "text-gray-700"
                      }`}
                    >
                      {method.name}
                    </span>
                    <span
                      className={`text-xs ${
                        paymentMethod === method.id
                          ? styles.selected.split(" ")[3]
                          : "text-gray-500"
                      }`}
                    >
                      {method.id === "card"
                        ? "Credit/Debit Card"
                        : method.id === "bank_transfer"
                        ? "Direct Bank Transfer"
                        : method.id === "google_pay"
                        ? "Google Pay"
                        : method.id === "crypto"
                        ? "Cryptocurrency"
                        : method.id === "stocks"
                        ? "Stock Donation"
                        : method.id === "daf"
                        ? "Donor Advised Fund"
                        : method.id === "paypal"
                        ? "PayPal"
                        : method.id === "venmo"
                        ? "Venmo"
                        : method.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Form Column */}
      <div
        className={`${
          isMobile ? "w-full" : isFrontline ? "w-full" : "w-2/3"
        } space-y-4`}
      >
        <form onSubmit={handleSubmit}>
          {/* Frequency Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Frequency</h3>
            <div className="grid grid-cols-2 gap-2 rounded-md overflow-hidden">
              <button
                type="button"
                className={`py-3 px-6 text-center ${
                  frequency === "monthly"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700"
                } rounded-md shadow-sm`}
                onClick={() => setFrequency("monthly")}
              >
                Give Monthly
              </button>
              <button
                type="button"
                className={`py-3 px-6 text-center ${
                  frequency === "once"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700"
                } rounded-md shadow-sm`}
                onClick={() => setFrequency("once")}
              >
                Once
              </button>
            </div>
            {frequency === "once" ? (
              <p className="text-lg text-gray-700">
                Make a one-time difference today!
              </p>
            ) : (
              <p className="text-lg text-gray-700">
                Make a monthly difference today!
              </p>
            )}
          </div>

          {/* Donation Amount Section */}
          <div className="space-y-2 mt-4">
            <h3 className="text-lg font-medium">Donation amount</h3>
            <div className="bg-gray-50 flex items-center p-4 rounded-md shadow-sm">
              <div className="text-2xl font-bold">$</div>
              <Input
                type="number"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-2xl border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="10"
              />
              <div className="text-xl font-medium text-primary ml-auto">
                USD
              </div>
            </div>

            {/* Default Amount Options */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {defaultAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  className="py-3 px-4 border border-gray-200 rounded-md hover:border-primary transition-colors text-center bg-white shadow-sm"
                  onClick={() => setAmount(String(amt))}
                >
                  <span className="text-lg font-medium">${amt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Donor Information - Improved layout */}
          <div className="space-y-3 mt-4 bg-white p-4 rounded-md border border-gray-100 shadow-sm">
            <h3 className="text-lg font-medium">Your Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="donorName" className="block text-gray-700 mb-2">
                  Your Name
                </Label>
                <Input
                  id="donorName"
                  placeholder="John Doe"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full bg-gray-50"
                  required
                />
              </div>

              <div>
                <Label
                  htmlFor="donorEmail"
                  className="block text-gray-700 mb-2"
                >
                  Email Address
                </Label>
                <Input
                  id="donorEmail"
                  type="email"
                  placeholder="john@example.com"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full bg-gray-50"
                  required
                />
              </div>
            </div>
          </div>

          {/* Add Note Toggle - Fixed checkbox styling */}
          <div className="flex items-center space-x-2 mt-6 bg-gray-50 p-4 rounded-md shadow-sm">
            <Checkbox
              id="show-note"
              checked={showNote}
              onCheckedChange={() => setShowNote(!showNote)}
              className="bg-white border-gray-300 data-[state=checked]:bg-primary"
            />
            <label
              htmlFor="show-note"
              className="text-base leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Add a note for {campaignTitle}
            </label>
          </div>

          {/* Note Section (conditionally shown) */}
          {showNote && (
            <div className="mt-4 space-y-2 bg-white p-4 rounded-md border border-gray-100 shadow-sm">
              <h3 className="text-xl font-medium">Private note</h3>
              <Textarea
                placeholder="Enter your note here..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="bg-gray-50 resize-none h-24 border-gray-200"
              />
            </div>
          )}

          {/* Submit Button - Keep the same functionality for different payment methods */}
          {paymentMethod === "stocks" ||
          paymentMethod === "daf" ||
          paymentMethod === "crypto" ||
          paymentMethod === "paypal" ||
          paymentMethod === "venmo" ? (
            <Button
              type="button"
              className="w-full mt-4 py-2.5 h-auto text-base shadow-md"
              disabled={isProcessing}
              onClick={handleSubmit}
            >
              {isProcessing
                ? "Processing..."
                : `Donate using ${
                    paymentMethods.find((method) => method.id === paymentMethod)
                      ?.name
                  }`}
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full mt-4 py-2.5 h-auto text-base shadow-md"
              disabled={isProcessing}
              onClick={handleSubmit}
            >
              {isProcessing
                ? "Processing..."
                : `Donate using ${
                    paymentMethods.find((method) => method.id === paymentMethod)
                      ?.name
                  }`}
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
