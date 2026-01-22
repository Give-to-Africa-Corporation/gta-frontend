// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { useAppContext } from "@/context/AppContext";
// import { useIsMobile } from "@/hooks/use-mobile";
// import { campaignApi } from "@/service/apiService";
// import axios from "axios";
// import {
//   Banknote,
//   Bitcoin,
//   CircleCheck,
//   CircleDollarSign,
//   CreditCard,
//   DollarSign,
// } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { toast } from "sonner";
// import { Campaign as ApiCampaign } from "@/lib/types";

// interface PaymentFormProps {
//   onSubmit: (
//     amount: string,
//     paymentMethod: string,
//     frequency: string,
//     campaignId: string,
//     donorName: string,
//     donorEmail: string
//   ) => void;
//   isProcessing: boolean;
//   campaignId: string;
//   campaignTitle: string;
//   isFrontline?: boolean;
// }

// interface PayPalApproveData {
//   orderID?: string;
//   vaultSetupToken?: string;
// }

// type ExtendedCampaign = ApiCampaign & {
//   id?: string;
//   image?: string;
//   raised?: number;
//   donors?: number;
//   isPerpetual?: boolean;
//   endDate?: string;
// };

// interface FAQItem {
//   _id?: string;
//   question: string;
//   answer: string;
// }

// interface CampaignResponse {
//   title: string;
//   description: string;
//   fundingGoal: number | string;
//   deadline?: number | null;
//   cause: string;
//   country: string;
//   campaignSlug?: string;
//   status: "draft" | "ongoing";
//   media?: {
//     mainImage?: string;
//     additionalImages?: string[];
//   };
//   faqs?: FAQItem[] | string;
// }

// const PaymentForm = ({
//   onSubmit,
//   isProcessing,
//   campaignId,
//   campaignTitle,
//   isFrontline = false,
// }: PaymentFormProps) => {
//   const { id } = useParams<{ id: string }>();
//   const [paymentMethod, setPaymentMethod] = useState("card");
//   const [frequency, setFrequency] = useState("once");
//   const [amount, setAmount] = useState("10");
//   const [donorName, setDonorName] = useState("");
//   const [donorEmail, setDonorEmail] = useState("");
//   const [showNote, setShowNote] = useState(false);
//   const [note, setNote] = useState("");
//   const [message, setMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [campaign, setCampaign] = useState<CampaignResponse | null>(null);

//   const isMobile = useIsMobile();

//   useEffect(() => {
//     const fetchCampaign = async () => {
//       if (!id) return;

//       setIsLoading(true);

//       try {
//         // Try to fetch from API first
//         const response = await campaignApi.getCampaign(id);

//         if (response.success && response.data) {
//           // Add id field (create alias for _id) for consistency
//           const apiCampaign = response.data;
//           const extendedCampaign: ExtendedCampaign = {
//             ...apiCampaign,
//             id: apiCampaign._id,
//             isPerpetual: !apiCampaign.deadline,
//           };

//           setCampaign(extendedCampaign as CampaignResponse);

//           // Update the URL if loaded with ID and there's a slug available
//           if (
//             apiCampaign.campaignSlug &&
//             id !== apiCampaign.campaignSlug &&
//             !id.includes("-")
//           ) {
//             // Only update if the current URL uses ID format instead of slug
//             window.history.replaceState(
//               null,
//               "",
//               `/campaigns/${apiCampaign.campaignSlug}`
//             );
//           }
//         } else {
//         }
//       } catch (error) {
//         console.error("Error fetching campaign:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchCampaign();
//   }, [id]);

//   // PayPal related functions
//   const createPayPalOrder = async () => {
//     try {
//       const { data } = await axios.post(
//         `${import.meta.env.VITE_API_URL}/paypal/orders`,
//         {
//           amount,
//           campaignId,
//           donorName,
//           donorEmail,
//           isRecurring: frequency === "monthly",
//         }
//       );

//       if (data.id) {
//         return data.id;
//       } else {
//         const errorDetail = data?.details?.[0];
//         const errorMessage = errorDetail
//           ? `${errorDetail.issue} ${errorDetail.description} (${data.debug_id})`
//           : JSON.stringify(data);

//         throw new Error(errorMessage);
//       }
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.error(
//           "PayPal API Error:",
//           error.response?.data || error.message
//         );
//         toast.error(
//           `Could not initiate PayPal Checkout: ${error.response?.data?.error || error.message
//           }`
//         );
//       } else {
//         console.error("PayPal API Error:", error);
//         toast.error(`Could not initiate PayPal Checkout: ${error}`);
//       }
//       return "";
//     }
//   };

//   const createVaultSetupToken = async () => {
//     try {
//       const { data } = await axios.post(
//         `${import.meta.env.VITE_API_URL}/paypal/vault`,
//         {
//           amount,
//           payment_source: {
//             paypal: {
//               usage_type: "MERCHANT",
//               experience_context: {
//                 return_url: `${window.location.origin}/campaigns/${campaignId}/payment/success`,
//                 cancel_url: `${window.location.origin}/campaigns/${campaignId}/payment`,
//               },
//             },
//           },
//           campaignId,
//           donorName,
//           donorEmail,
//         }
//       );

//       if (data.id) {
//         return data.id;
//       }

//       // Handle PayPal contingency errors
//       if (data.ack === "contingency") {
//         console.error("PayPal Contingency Error:", data);
//         toast.error(
//           "PayPal service is temporarily unavailable. Please try again in a few minutes."
//         );
//         return "";
//       }

//       // Handle other error cases
//       const errorDetail = data?.details?.[0] || data?.error;
//       const errorMessage = errorDetail
//         ? `${errorDetail.issue || errorDetail.message} ${errorDetail.description || ""
//         }`
//         : "Failed to set up recurring payment. Please try again.";

//       throw new Error(errorMessage);
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.error(
//           "Vault Setup Token Error:",
//           error.response?.data || error.message
//         );
//         toast.error(
//           error.response?.data?.error ||
//           "Could not set up recurring payment. Please try again."
//         );
//       } else {
//         console.error("Vault Setup Token Error:", error);
//         toast.error(
//           error instanceof Error
//             ? error.message
//             : "Could not set up recurring payment. Please try again."
//         );
//       }
//       return "";
//     }
//   };

//   const handlePayPalApprove = async (data: PayPalApproveData) => {
//     try {
//       if (frequency === "monthly") {
//         // Handle recurring payment approval
//         const { data: paymentTokenData } = await axios.post(
//           `${import.meta.env.VITE_API_URL}/paypal/vault/payment-tokens`,
//           {
//             payment_source: {
//               token: {
//                 id: data.vaultSetupToken,
//                 type: "SETUP_TOKEN",
//               },
//             },
//             campaignId,
//             amount,
//             donorName,
//             donorEmail,
//           }
//         );

//         if (paymentTokenData.id) {
//           toast.success(
//             "Recurring payment setup successful! Thank you for your donation."
//           );
//           window.location.href = `/campaigns/${campaignId}/payment/success`;
//         } else {
//           throw new Error("Failed to create payment token");
//         }
//       } else {
//         // Handle one-time payment approval
//         const { data: captureData } = await axios.post(
//           `${import.meta.env.VITE_API_URL}/paypal/orders/${data.orderID
//           }/capture`,
//           {
//             isRecurring: frequency === "monthly",
//           }
//         );

//         if (captureData.status === "COMPLETED") {
//           toast.success("Payment successful! Thank you for your donation.");
//           window.location.href = `/campaigns/${campaignId}/payment/success`;
//         } else {
//           throw new Error("Payment not completed");
//         }
//       }
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.error("Payment Error:", error.response?.data || error.message);
//         toast.error(
//           `Sorry, your transaction could not be processed: ${error.response?.data?.error || error.message
//           }`
//         );
//       } else {
//         console.error("Payment Error:", error);
//         toast.error(`Sorry, your transaction could not be processed: ${error}`);
//       }
//     }
//   };

//   const handlePayPalError = (err: Record<string, unknown>) => {
//     console.error("PayPal error:", err);
//     toast.error("An error occurred with PayPal. Please try again.");
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validate amount
//     const numAmount = parseFloat(amount);
//     if (isNaN(numAmount) || numAmount <= 0) {
//       toast.error("Please enter a valid amount");
//       return;
//     }

//     // Validate name and email
//     if (!donorName.trim()) {
//       toast.error("Please enter your name");
//       return;
//     }

//     if (!donorEmail.trim()) {
//       toast.error("Please enter your email");
//       return;
//     }

//     // Basic email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(donorEmail)) {
//       toast.error("Please enter a valid email address");
//       return;
//     }

//     // Handle external payment methods
//     if (
//       ["stocks", "daf", "crypto", "paypal", "venmo"].includes(paymentMethod)
//     ) {
//       // Create a pending payment
//       axios
//         .post(
//           `${import.meta.env.VITE_API_URL
//           }/campaigns/${campaignId}/pending-payment`,
//           {
//             amount,
//             donorName,
//             donorEmail,
//             paymentMethod,
//             message: note,
//             isRecurring: frequency === "monthly",
//           }
//         )
//         .then((response) => {
//           toast.success("Payment request submitted successfully!");
//           // Redirect to external payment URL if provided
//           if (response.data.redirectUrl) {
//             // Open in new tab
//             window.open(response.data.redirectUrl, "_blank");
//           }
//         })
//         .catch((error) => {
//           toast.error(
//             error.response?.data?.message || "Error submitting payment request"
//           );
//         });
//       return;
//     }

//     // Handle regular payment methods
//     onSubmit(
//       amount,
//       paymentMethod,
//       frequency,
//       campaignId,
//       donorName,
//       donorEmail
//     );
//   };

//   // Payment methods configuration
//   const allPaymentMethods = [
//     {
//       id: "card",
//       name: "Card",
//       icon: <CreditCard className="h-5 w-5 text-primary" />,
//     },

//     // {
//     //   id: "bank_transfer",
//     //   name: "Bank",
//     //   icon: <Banknote className="h-5 w-5 text-primary" />,
//     // },
//     // {
//     //   id: "google_pay",
//     //   name: "Google Pay",
//     //   icon: <CircleDollarSign className="h-5 w-5 text-primary" />,
//     // },
//     // {
//     //   id: "crypto",
//     //   name: "Crypto",
//     //   icon: <Bitcoin className="h-5 w-5 text-primary" />,
//     // },
//     // {
//     //   id: "stocks",
//     //   name: "Stocks",
//     //   icon: <CircleCheck className="h-5 w-5 text-primary" />,
//     // },
//     // {
//     //   id: "daf",
//     //   name: "DAF",
//     //   icon: <CircleDollarSign className="h-5 w-5 text-primary" />,
//     // },

//     {
//       id: "paypal",
//       name: "PayPal",
//       icon: <DollarSign className="h-5 w-5 text-primary" />,
//     },
//     // {
//     //   id: "venmo",
//     //   name: "Venmo",
//     //   icon: <CircleDollarSign className="h-5 w-5 text-primary" />,
//     // },
//   ];

//   // Filter payment methods based on whether it's the Frontline page
//   const paymentMethods = isFrontline
//     ? allPaymentMethods.filter((method) => method.id === "card")
//     : allPaymentMethods;

//   // Default donation amounts
//   const defaultAmounts = [20, 60, 100, 200];

//   // faqs
//   const [openIndex, setOpenIndex] = useState<number | null>(null);

//   const toggleFAQ = (index: number) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   return (
//     <div
//       className={`flex ${isMobile ? "flex-col" : "flex-row"
//         } gap-4 w-full max-w-7xl mx-auto`}
//     >
//       {/* Payment Methods Column */}
//       {!isFrontline && (
//         <div className={`${isMobile ? "w-full" : "w-1/3"}`}>
//           <h3 className="text-lg font-medium mb-2">Payment Method</h3>
//           <div className="space-y-2 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
//             {paymentMethods.map((method) => {
//               // Define colors for each payment method
//               const getMethodStyles = (id: string) => {
//                 switch (id) {
//                   case "card":
//                     return {
//                       selected:
//                         "bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100/50 border-blue-500 text-blue-700 shadow-sm",
//                       icon: "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white shadow-md",
//                       hover: "hover:bg-blue-50/50 hover:shadow-sm",
//                       border: "border-l-4",
//                     };
//                   case "bank_transfer":
//                     return {
//                       selected:
//                         "bg-gradient-to-r from-emerald-100 via-emerald-50 to-emerald-100/50 border-emerald-500 text-emerald-700 shadow-sm",
//                       icon: "bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white shadow-md",
//                       hover: "hover:bg-emerald-50/50 hover:shadow-sm",
//                       border: "border-l-4",
//                     };
//                   case "google_pay":
//                     return {
//                       selected:
//                         "bg-gradient-to-r from-indigo-100 via-indigo-50 to-indigo-100/50 border-indigo-500 text-indigo-700 shadow-sm",
//                       icon: "bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 text-white shadow-md",
//                       hover: "hover:bg-indigo-50/50 hover:shadow-sm",
//                       border: "border-l-4",
//                     };
//                   case "crypto":
//                     return {
//                       selected:
//                         "bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100/50 border-amber-500 text-amber-700 shadow-sm",
//                       icon: "bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white shadow-md",
//                       hover: "hover:bg-amber-50/50 hover:shadow-sm",
//                       border: "border-l-4",
//                     };
//                   case "stocks":
//                     return {
//                       selected:
//                         "bg-gradient-to-r from-violet-100 via-violet-50 to-violet-100/50 border-violet-500 text-violet-700 shadow-sm",
//                       icon: "bg-gradient-to-br from-violet-500 via-violet-600 to-violet-700 text-white shadow-md",
//                       hover: "hover:bg-violet-50/50 hover:shadow-sm",
//                       border: "border-l-4",
//                     };
//                   case "daf":
//                     return {
//                       selected:
//                         "bg-gradient-to-r from-cyan-100 via-cyan-50 to-cyan-100/50 border-cyan-500 text-cyan-700 shadow-sm",
//                       icon: "bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700 text-white shadow-md",
//                       hover: "hover:bg-cyan-50/50 hover:shadow-sm",
//                       border: "border-l-4",
//                     };
//                   case "paypal":
//                     return {
//                       selected:
//                         "bg-gradient-to-r from-sky-100 via-sky-50 to-sky-100/50 border-sky-500 text-sky-700 shadow-sm",
//                       icon: "bg-gradient-to-br from-sky-500 via-sky-600 to-sky-700 text-white shadow-md",
//                       hover: "hover:bg-sky-50/50 hover:shadow-sm",
//                       border: "border-l-4",
//                     };
//                   case "venmo":
//                     return {
//                       selected:
//                         "bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100/50 border-blue-500 text-blue-700 shadow-sm",
//                       icon: "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white shadow-md",
//                       hover: "hover:bg-blue-50/50 hover:shadow-sm",
//                       border: "border-l-4",
//                     };
//                   default:
//                     return {
//                       selected:
//                         "bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 border-primary text-primary shadow-sm",
//                       icon: "bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white shadow-md",
//                       hover: "hover:bg-gray-50/50 hover:shadow-sm",
//                       border: "border-l-4",
//                     };
//                 }
//               };

//               const styles = getMethodStyles(method.id);

//               return (
//                 <button
//                   key={method.name}
//                   type="button"
//                   className={`flex items-center w-full p-4 text-left gap-3 transition-all duration-200 ${paymentMethod === method.id
//                     ? `${styles.selected} ${styles.border}`
//                     : styles.hover
//                     }`}
//                   onClick={() => setPaymentMethod(method.id)}
//                 >
//                   <div
//                     className={`flex items-center justify-center w-10 h-10 rounded-full ${paymentMethod === method.id
//                       ? `${styles.icon} ring-2 ring-offset-2 ring-white`
//                       : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                       } transition-all duration-200`}
//                   >
//                     {React.cloneElement(method.icon, {
//                       className: `h-5 w-5 ${paymentMethod === method.id ? "text-white" : ""
//                         }`,
//                     })}
//                   </div>
//                   <div className="flex flex-col">
//                     <span
//                       className={`font-medium ${paymentMethod === method.id
//                         ? styles.selected.split(" ")[3]
//                         : "text-gray-700"
//                         }`}
//                     >
//                       {method.name}
//                     </span>
//                     <span
//                       className={`text-xs ${paymentMethod === method.id
//                         ? styles.selected.split(" ")[3]
//                         : "text-gray-500"
//                         }`}
//                     >
//                       {method.id === "card"
//                         ? "Credit/Debit Card"
//                         : method.id === "bank_transfer"
//                           ? "Direct Bank Transfer"
//                           : method.id === "google_pay"
//                             ? "Google Pay"
//                             : method.id === "crypto"
//                               ? "Cryptocurrency"
//                               : method.id === "stocks"
//                                 ? "Stock Donation"
//                                 : method.id === "daf"
//                                   ? "Donor Advised Fund"
//                                   : method.id === "paypal"
//                                     ? "PayPal"
//                                     : method.id === "venmo"
//                                       ? "Venmo"
//                                       : method.name}
//                     </span>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>

//           {/* faq */}
//           {Array.isArray(campaign?.faqs) && campaign.faqs.length > 0 && (
//             <div className="mt-2 space-y-2 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
//               <h1 className="text-lg font-semibold px-4 py-2 border-b">FAQs</h1>
//               <div className="divide-y">
//                 {Array.isArray(campaign?.faqs) &&
//                   campaign?.faqs.map((faq, index) => (
//                     <div key={faq._id || index} className="px-4 py-2">
//                       <button
//                         onClick={() => toggleFAQ(index)}
//                         className="w-full flex justify-between items-center text-left py-2"
//                       >
//                         {faq.question}
//                         <span>{openIndex === index ? "−" : "+"}</span>
//                       </button>
//                       {openIndex === index && (
//                         <p className="mt-3">{faq.answer}</p>
//                       )}
//                     </div>
//                   ))}
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Form Column */}
//       <div
//         className={`${isMobile ? "w-full" : isFrontline ? "w-full" : "w-2/3"
//           } space-y-4`}
//       >
//         <form onSubmit={handleSubmit}>
//           {/* Frequency Section */}
//           <div className="space-y-2">
//             <h3 className="text-lg font-medium">Frequency</h3>
//             <div className="grid grid-cols-2 gap-2 rounded-md overflow-hidden">
//               <button
//                 type="button"
//                 className={`py-3 px-6 text-center ${frequency === "monthly"
//                   ? "bg-primary text-white"
//                   : "bg-gray-100 text-gray-700"
//                   } rounded-md shadow-sm`}
//                 onClick={() => setFrequency("monthly")}
//               >
//                 Give Monthly
//               </button>
//               <button
//                 type="button"
//                 className={`py-3 px-6 text-center ${frequency === "once"
//                   ? "bg-primary text-white"
//                   : "bg-gray-100 text-gray-700"
//                   } rounded-md shadow-sm`}
//                 onClick={() => setFrequency("once")}
//               >
//                 Once
//               </button>
//             </div>
//             {frequency === "once" ? (
//               <p className="text-lg text-gray-700">
//                 Make a one-time difference today!
//               </p>
//             ) : (
//               <p className="text-lg text-gray-700">
//                 Make a monthly difference today!
//               </p>
//             )}
//           </div>

//           {/* Donation Amount Section */}
//           <div className="space-y-2 mt-4">
//             <h3 className="text-lg font-medium">Donation amount</h3>
//             <div className="bg-gray-50 flex items-center p-4 rounded-md shadow-sm">
//               <div className="text-2xl font-bold">$</div>
//               <Input
//                 type="number"
//                 inputMode="numeric"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 className="text-2xl border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
//                 placeholder="10"
//               />
//               <div className="text-xl font-medium text-primary ml-auto">
//                 USD
//               </div>
//             </div>

//             {/* Default Amount Options */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
//               {defaultAmounts.map((amt) => (
//                 <button
//                   key={amt}
//                   type="button"
//                   className="py-3 px-4 border border-gray-200 rounded-md hover:border-primary transition-colors text-center bg-white shadow-sm"
//                   onClick={() => setAmount(String(amt))}
//                 >
//                   <span className="text-lg font-medium">${amt}</span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Donor Information - Improved layout */}
//           <div className="space-y-3 mt-4 bg-white p-4 rounded-md border border-gray-100 shadow-sm">
//             <h3 className="text-lg font-medium">Your Information</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="donorName" className="block text-gray-700 mb-2">
//                   Your Name
//                 </Label>
//                 <Input
//                   id="donorName"
//                   placeholder="John Doe"
//                   value={donorName}
//                   onChange={(e) => setDonorName(e.target.value)}
//                   className="w-full bg-gray-50"
//                   required
//                 />
//               </div>

//               <div>
//                 <Label
//                   htmlFor="donorEmail"
//                   className="block text-gray-700 mb-2"
//                 >
//                   Email Address
//                 </Label>
//                 <Input
//                   id="donorEmail"
//                   type="email"
//                   placeholder="john@example.com"
//                   value={donorEmail}
//                   onChange={(e) => setDonorEmail(e.target.value)}
//                   className="w-full bg-gray-50"
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Add Note Toggle - Fixed checkbox styling */}
//           <div className="flex items-center space-x-2 mt-6 bg-gray-50 p-4 rounded-md shadow-sm">
//             <Checkbox
//               id="show-note"
//               checked={showNote}
//               onCheckedChange={() => setShowNote(!showNote)}
//               className="bg-white border-gray-300 data-[state=checked]:bg-primary"
//             />
//             <label
//               htmlFor="show-note"
//               className="text-base leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//             >
//               Add a note for {campaignTitle}
//             </label>
//           </div>

//           {/* Note Section (conditionally shown) */}
//           {showNote && (
//             <div className="mt-4 space-y-2 bg-white p-4 rounded-md border border-gray-100 shadow-sm">
//               <h3 className="text-xl font-medium">Private note</h3>
//               <Textarea
//                 placeholder="Enter your note here..."
//                 value={note}
//                 onChange={(e) => setNote(e.target.value)}
//                 className="bg-gray-50 resize-none h-24 border-gray-200"
//               />
//             </div>
//           )}

//           {/* Submit Button - Keep the same functionality for different payment methods */}
//           {paymentMethod === "stocks" ||
//             paymentMethod === "daf" ||
//             paymentMethod === "crypto" ||
//             paymentMethod === "paypal" ||
//             paymentMethod === "venmo" ? (
//             <Button
//               type="button"
//               className="w-full mt-4 py-2.5 h-auto text-base shadow-md"
//               disabled={isProcessing}
//               onClick={handleSubmit}
//             >
//               {isProcessing
//                 ? "Processing..."
//                 : `Donate using ${paymentMethods.find((method) => method.id === paymentMethod)
//                   ?.name
//                 }`}
//             </Button>
//           ) : (
//             <Button
//               type="submit"
//               className="w-full mt-4 py-2.5 h-auto text-base shadow-md"
//               disabled={isProcessing}
//               onClick={handleSubmit}
//             >
//               {isProcessing
//                 ? "Processing..."
//                 : `Donate using ${paymentMethods.find((method) => method.id === paymentMethod)
//                   ?.name
//                 }`}
//             </Button>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PaymentForm;

// // @ts-nocheck
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { useAppContext } from "@/context/AppContext";
// import { useIsMobile } from "@/hooks/use-mobile";
// import { campaignApi } from "@/service/apiService";
// import axios from "axios";
// import { ArrowLeft } from "lucide-react";
// import {
//   Banknote,
//   Bitcoin,
//   CircleCheck,
//   CircleDollarSign,
//   CreditCard,
//   DollarSign,
// } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { toast } from "sonner";
// import { Campaign as ApiCampaign } from "@/lib/types";
// import {
//   CardElement,
//   Elements,
//   CardNumberElement,
//   CardCvcElement,
//   CardExpiryElement,
//   useElements,
//   useStripe,
// } from "@stripe/react-stripe-js";
// import {
//   PayPalScriptProvider,
//   PayPalButtons,
//   PayPalHostedField,
//   PayPalHostedFieldsProvider,
// } from "@paypal/react-paypal-js";
// import { loadStripe } from "@stripe/stripe-js";
// import { FaChevronDown, FaChevronUp } from "react-icons/fa";
// import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
// import { Title } from "@radix-ui/react-dialog";

// interface PaymentFormProps {
//   onSubmit: (
//     amount: string,
//     paymentMethod: string,
//     frequency: string,
//     campaignId: string,
//     donorName: string,
//     donorEmail: string,
//   ) => void;
//   isProcessing: boolean;
//   campaignId: string;
//   campaignTitle: string;
//   isFrontline?: boolean;
// }

// interface PayPalApproveData {
//   orderID?: string;
//   vaultSetupToken?: string;
// }

// type ExtendedCampaign = ApiCampaign & {
//   id?: string;
//   image?: string;
//   raised?: number;
//   donors?: number;
//   isPerpetual?: boolean;
//   endDate?: string;
// };

// interface FAQItem {
//   _id?: string;
//   question: string;
//   answer: string;
// }

// interface CampaignResponse {
//   title: string;
//   description: string;
//   fundingGoal: number | string;
//   deadline?: number | null;
//   cause: string;
//   country: string;
//   campaignSlug?: string;
//   status: "draft" | "ongoing";
//   media?: {
//     mainImage?: string;
//     additionalImages?: string[];
//   };
//   faqs?: FAQItem[] | string;
// }

// interface PaymentFormProps {
//   isProcessing: boolean;
//   setIsProcessing: (val: boolean) => void;
//   campaignId: string;
//   campaignTitle: string;
// }

// // const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// const PaymentForm = ({
//   onSubmit,
//   isProcessing,
//   setIsProcessing,
//   campaignId,
//   campaignTitle,
//   isFrontline = false,
// }: PaymentFormProps) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const { id } = useParams<{ id: string }>();
//   const [step, setStep] = useState<number>(1);
//   const [paymentMethod, setPaymentMethod] = useState("card");
//   const [frequency, setFrequency] = useState("once");
//   const [amount, setAmount] = useState("10");
//   const [tipAmount, setTipAmount] = useState("6");
//   const [isEditing, setIsEditing] = useState(false);
//   const [donorName, setDonorName] = useState("");
//   const [donorEmail, setDonorEmail] = useState("");
//   const [showNote, setShowNote] = useState(false);
//   const [note, setNote] = useState("");
//   const [message, setMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [campaign, setCampaign] = useState<CampaignResponse | null>(null);
//   console.log("campaign in PaymentForm:", campaign);

//   const [additionalField1, setAdditionalField1] = useState<string>("");
//   const [additionalField2, setAdditionalField2] = useState<string>("");

//   const handleNext = () => {
//     setStep((prev) => prev + 1);
//   };

//   const handleBack = () => {
//     setStep((prev) => prev - 1);
//   };

//   const isMobile = useIsMobile();

//   useEffect(() => {
//     const fetchCampaign = async () => {
//       if (!id) return;

//       setIsLoading(true);

//       try {
//         // Try to fetch from API first
//         const response = await campaignApi.getCampaign(id);

//         if (response.success && response.data) {
//           // Add id field (create alias for _id) for consistency
//           const apiCampaign = response.data;
//           const extendedCampaign: ExtendedCampaign = {
//             ...apiCampaign,
//             id: apiCampaign._id,
//             isPerpetual: !apiCampaign.deadline,
//           };

//           setCampaign(extendedCampaign as CampaignResponse);

//           // Update the URL if loaded with ID and there's a slug available
//           if (
//             apiCampaign.campaignSlug &&
//             id !== apiCampaign.campaignSlug &&
//             !id.includes("-")
//           ) {
//             // Only update if the current URL uses ID format instead of slug
//             window.history.replaceState(
//               null,
//               "",
//               `/campaigns/${apiCampaign.campaignSlug}`,
//             );
//           }
//         } else {
//         }
//       } catch (error) {
//         console.error("Error fetching campaign:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchCampaign();
//   }, [id]);

//   // stripe card
//   // const handleSubmitCard = async (e: React.FormEvent) => {
//   //   e.preventDefault();

//   //   if (!stripe || !elements) {
//   //     toast.error("stripe is not loaded yet!");
//   //     return;
//   //   };

//   //   if (!amount) {
//   //     toast.error("Please enter donation amount");
//   //     return;
//   //   }

//   //   // 1️⃣ Create PaymentMethod
//   //   // const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
//   //   //   type: "card",
//   //   //   card: elements.getElement(CardNumberElement),
//   //   //   billing_details: { name: donorName, email: donorEmail },
//   //   // });

//   //   // if (pmError) throw new Error(pmError.message);

//   //   try {
//   //     setIsProcessing(true);

//   //     // 1. Create PaymentIntent from backend
//   //     const res = await fetch(`${import.meta.env.VITE_API_URL}/payment/create-payment-intent`, {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify({
//   //         amount: parseFloat(amount),
//   //         tipAmount: tipAmount,
//   //         campaignId,
//   //         donorName: donorName,
//   //         donorEmail: donorEmail,
//   //         // paymentMethod: paymentMethod.id,
//   //         paymentMethod: paymentMethod,
//   //         frequency: frequency,
//   //       }),
//   //     });

//   //     const { clientSecret } = await res.json();

//   //     if (!clientSecret) {
//   //       throw new Error("Failed to create payment intent");
//   //     }

//   //     // 2. Confirm card payment
//   //     const card = elements.getElement(CardNumberElement);
//   //     if (!card) throw new Error("CardElement not found");

//   //     const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
//   //       payment_method: { card },
//   //     });

//   //     if (error) {
//   //       toast.error(error.message || "Payment failed");
//   //       return;
//   //     }

//   //     if (paymentIntent?.status === "succeeded") {
//   //       toast.success("Payment succeeded on Stripe 🎉");

//   //       // 3️⃣ Call backend to confirm payment and save donation
//   //       const confirmRes = await fetch(`${import.meta.env.VITE_API_URL}/payment/confirm-payment`, {
//   //         method: "POST",
//   //         headers: { "Content-Type": "application/json" },
//   //         body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
//   //       });

//   //       const confirmData = await confirmRes.json();

//   //       if (confirmData.success) {
//   //         toast.success("Donation recorded successfully ✅");
//   //       } else {
//   //         toast.error(confirmData.message || "Payment succeeded but donation not saved");
//   //       }
//   //     }
//   //   } catch (err: any) {
//   //     console.error(err);
//   //     toast.error(err.message || "Something went wrong");
//   //   } finally {
//   //     setIsProcessing(false);
//   //   }
//   // };
//   const handleSubmitCard = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!stripe || !elements) {
//       toast.error("Stripe is not loaded yet!");
//       return;
//     }

//     if (!amount) {
//       toast.error("Please enter donation amount");
//       return;
//     }

//     try {
//       setIsProcessing(true);

//       // 1️⃣ Get Card Element and create PaymentMethod
//       const card = elements.getElement(CardNumberElement);
//       if (!card) throw new Error("CardElement not found");

//       const { error: pmError, paymentMethod } =
//         await stripe.createPaymentMethod({
//           type: "card",
//           card,
//           billing_details: {
//             name: donorName,
//             email: donorEmail,
//           },
//         });

//       if (pmError) throw new Error(pmError.message);
//       if (!paymentMethod?.id) throw new Error("PaymentMethod creation failed");

//       // 2️⃣ Send PaymentMethod ID to backend
//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL}/payment/create-payment-intent`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             amount: parseFloat(amount),
//             tipAmount,
//             campaignId,
//             donorName,
//             donorEmail,
//             paymentMethod: paymentMethod?.id, // ✅ send real PaymentMethod ID
//             frequency, // "once" or "monthly"
//           }),
//         },
//       );

//       const data = await res.json();
//       if (!data.clientSecret)
//         throw new Error(data.error || "Failed to create payment");

//       // 3️⃣ Confirm payment (works for both one-time and first monthly payment)
//       const { error, paymentIntent } = await stripe.confirmCardPayment(
//         data.clientSecret,
//       );
//       if (error) throw new Error(error.message);

//       if (paymentIntent?.status === "succeeded") {
//         toast.success(`Payment succeeded (${frequency}) 🎉`);

//         // 4️⃣ Notify backend to save donation record
//         const confirmRes = await fetch(
//           `${import.meta.env.VITE_API_URL}/payment/confirm-payment`,
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               paymentIntentId: paymentIntent.id,
//               type: frequency,
//               subscriptionId: data.subscriptionId || null,
//             }),
//           },
//         );

//         const confirmData = await confirmRes.json();
//         if (confirmData.success) {
//           toast.success("Donation recorded successfully ✅");
//         } else {
//           // toast.error(confirmData.message || "Payment succeeded but donation not saved");
//         }
//       }
//     } catch (err: any) {
//       console.error(err);
//       // toast.error(err.message || "Something went wrong");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // PayPal related functions
//   const createPayPalOrder = async () => {
//     try {
//       const { data } = await axios.post(
//         `${import.meta.env.VITE_API_URL}/paypal/orders`,
//         {
//           amount,
//           campaignId,
//           donorName,
//           donorEmail,
//           isRecurring: frequency === "monthly",
//         },
//       );

//       if (data.id) {
//         return data.id;
//       } else {
//         const errorDetail = data?.details?.[0];
//         const errorMessage = errorDetail
//           ? `${errorDetail.issue} ${errorDetail.description} (${data.debug_id})`
//           : JSON.stringify(data);

//         throw new Error(errorMessage);
//       }
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.error(
//           "PayPal API Error:",
//           error.response?.data || error.message,
//         );
//         toast.error(
//           `Could not initiate PayPal Checkout: ${
//             error.response?.data?.error || error.message
//           }`,
//         );
//       } else {
//         console.error("PayPal API Error:", error);
//         toast.error(`Could not initiate PayPal Checkout: ${error}`);
//       }
//       return "";
//     }
//   };

//   const createVaultSetupToken = async () => {
//     try {
//       const { data } = await axios.post(
//         `${import.meta.env.VITE_API_URL}/paypal/vault`,
//         {
//           amount,
//           payment_source: {
//             paypal: {
//               usage_type: "MERCHANT",
//               experience_context: {
//                 return_url: `${window.location.origin}/campaigns/${campaignId}/payment/success`,
//                 cancel_url: `${window.location.origin}/campaigns/${campaignId}/payment`,
//               },
//             },
//           },
//           campaignId,
//           donorName,
//           donorEmail,
//         },
//       );

//       if (data.id) {
//         return data.id;
//       }

//       // Handle PayPal contingency errors
//       if (data.ack === "contingency") {
//         console.error("PayPal Contingency Error:", data);
//         toast.error(
//           "PayPal service is temporarily unavailable. Please try again in a few minutes.",
//         );
//         return "";
//       }

//       // Handle other error cases
//       const errorDetail = data?.details?.[0] || data?.error;
//       const errorMessage = errorDetail
//         ? `${errorDetail.issue || errorDetail.message} ${
//             errorDetail.description || ""
//           }`
//         : "Failed to set up recurring payment. Please try again.";

//       throw new Error(errorMessage);
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.error(
//           "Vault Setup Token Error:",
//           error.response?.data || error.message,
//         );
//         toast.error(
//           error.response?.data?.error ||
//             "Could not set up recurring payment. Please try again.",
//         );
//       } else {
//         console.error("Vault Setup Token Error:", error);
//         toast.error(
//           error instanceof Error
//             ? error.message
//             : "Could not set up recurring payment. Please try again.",
//         );
//       }
//       return "";
//     }
//   };

//   const handlePayPalApprove = async (data: PayPalApproveData) => {
//     try {
//       if (frequency === "monthly") {
//         // Handle recurring payment approval
//         const { data: paymentTokenData } = await axios.post(
//           `${import.meta.env.VITE_API_URL}/paypal/vault/payment-tokens`,
//           {
//             payment_source: {
//               token: {
//                 id: data.vaultSetupToken,
//                 type: "SETUP_TOKEN",
//               },
//             },
//             campaignId,
//             amount,
//             donorName,
//             donorEmail,
//           },
//         );

//         if (paymentTokenData.id) {
//           toast.success(
//             "Recurring payment setup successful! Thank you for your donation.",
//           );
//           window.location.href = `/campaigns/${campaignId}/payment/success`;
//         } else {
//           throw new Error("Failed to create payment token");
//         }
//       } else {
//         // Handle one-time payment approval
//         const { data: captureData } = await axios.post(
//           `${import.meta.env.VITE_API_URL}/paypal/orders/${
//             data.orderID
//           }/capture`,
//           {
//             isRecurring: frequency === "monthly",
//           },
//         );

//         if (captureData.status === "COMPLETED") {
//           toast.success("Payment successful! Thank you for your donation.");
//           window.location.href = `/campaigns/${campaignId}/payment/success`;
//         } else {
//           throw new Error("Payment not completed");
//         }
//       }
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.error("Payment Error:", error.response?.data || error.message);
//         toast.error(
//           `Sorry, your transaction could not be processed: ${
//             error.response?.data?.error || error.message
//           }`,
//         );
//       } else {
//         console.error("Payment Error:", error);
//         toast.error(`Sorry, your transaction could not be processed: ${error}`);
//       }
//     }
//   };

//   const handlePayPalError = (err: Record<string, unknown>) => {
//     console.error("PayPal error:", err);
//     toast.error("An error occurred with PayPal. Please try again.");
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validate amount
//     const numAmount = parseFloat(amount);
//     if (isNaN(numAmount) || numAmount <= 0) {
//       toast.error("Please enter a valid amount");
//       return;
//     }

//     // Validate name and email
//     if (!donorName.trim()) {
//       toast.error("Please enter your name");
//       return;
//     }

//     if (!donorEmail.trim()) {
//       toast.error("Please enter your email");
//       return;
//     }

//     // Basic email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(donorEmail)) {
//       toast.error("Please enter a valid email address");
//       return;
//     }

//     // Handle external payment methods
//     if (
//       ["stocks", "daf", "crypto", "paypal", "venmo"].includes(paymentMethod)
//     ) {
//       // Create a pending payment
//       axios
//         .post(
//           `${
//             import.meta.env.VITE_API_URL
//           }/campaigns/${campaignId}/pending-payment`,
//           {
//             amount,
//             donorName,
//             donorEmail,
//             paymentMethod,
//             message: note,
//             isRecurring: frequency === "monthly",
//           },
//         )
//         .then((response) => {
//           toast.success("Payment request submitted successfully!");
//           // Redirect to external payment URL if provided
//           if (response.data.redirectUrl) {
//             // Open in new tab
//             window.open(response.data.redirectUrl, "_blank");
//           }
//         })
//         .catch((error) => {
//           toast.error(
//             error.response?.data?.message || "Error submitting payment request",
//           );
//         });
//       return;
//     }

//     // Handle regular payment methods
//     onSubmit(
//       amount,
//       paymentMethod,
//       frequency,
//       campaignId,
//       donorName,
//       donorEmail,
//     );
//   };

//   // Payment methods configuration
//   const allPaymentMethods = [
//     {
//       id: "card",
//       name: "Card",
//       icon: <CreditCard className="h-5 w-5 text-primary" />,
//     },

//     // {
//     //   id: "bank_transfer",
//     //   name: "Bank",
//     //   icon: <Banknote className="h-5 w-5 text-primary" />,
//     // },
//     // {
//     //   id: "google_pay",
//     //   name: "Google Pay",
//     //   icon: <CircleDollarSign className="h-5 w-5 text-primary" />,
//     // },
//     // {
//     //   id: "crypto",
//     //   name: "Crypto",
//     //   icon: <Bitcoin className="h-5 w-5 text-primary" />,
//     // },
//     // {
//     //   id: "stocks",
//     //   name: "Stocks",
//     //   icon: <CircleCheck className="h-5 w-5 text-primary" />,
//     // },
//     // {
//     //   id: "daf",
//     //   name: "DAF",
//     //   icon: <CircleDollarSign className="h-5 w-5 text-primary" />,
//     // },

//     // {
//     //   id: "paypal",
//     //   name: "PayPal",
//     //   icon: <DollarSign className="h-5 w-5 text-primary" />,
//     // },
//     // {
//     //   id: "venmo",
//     //   name: "Venmo",
//     //   icon: <CircleDollarSign className="h-5 w-5 text-primary" />,
//     // },
//   ];

//   // Filter payment methods based on whether it's the Frontline page
//   const paymentMethods = isFrontline
//     ? allPaymentMethods.filter((method) => method.id === "card")
//     : allPaymentMethods;

//   // Default donation amounts
//   const defaultAmounts = [20, 60, 100, 200];

//   // faqs
//   const [openIndex, setOpenIndex] = useState<number | null>(null);

//   const toggleFAQ = (index: number) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   const faqs = [
//     {
//       question: "How does Yendaa accept my donation?",
//       answer:
//         "Your donation is made to Give to Africa, a U.S. 501(c)(3) public charity. Give to Africa will immediately send you a receipt by email.We then securely transfer your donation to the specific African nonprofit or project you selected.",
//     },
//     {
//       question: "Are there any fees?",
//       answer:
//         "Visa and Mastercard charge 2.2% + $0.30 per transaction. Amex charges 3.5%. There is an additional 1% fee for non-US cards. Don’t like fees? Neither do we! Donate via bank (ACH) and Give to Africa will cover the small ACH fee, so bank donations are free. Yendaa does not charge any platform fees, because we are a nonprofit dedicated to expanding generosity across Africa. Instead, we rely on optional donor tips to help fund our mission and keep the platform free for causes.",
//     },
//     {
//       question: "Will I receive a tax-deductible receipt for my donation?",
//       answer:
//         "Yes. After your donation payment is confirmed, you will immediately receive a tax-deductible receipt by email. Your donation is 100% tax-deductible to the extent allowed by U.S. law. Your donation is made to Give to Africa, a tax-exempt U.S. 501(c)(3) charity. If you have a Yendaa account, you can also access a single itemized annual receipt showing all your donations for the year.",
//     },
//   ];

//   const availableTypes = Array.from(
//     new Set(campaign?.suggestedAmounts?.map((item) => item.type)),
//   );

//   const labelMap = {
//     oneTime: "Once",
//     monthly: "Monthly",
//     yearly: "Yearly",
//   };

//   return (
//     <div
//       className={`flex ${
//         isMobile ? "flex-col-reverse" : "flex-row"
//       } gap-4 w-full max-w-7xl mx-auto`}
//     >
//       <div className={`${isMobile ? "w-full" : "w-1/3"}`}>
//         <Card
//           className={`group rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col`}
//         >
//           {/* Image Section with overlay */}
//           <div className="relative h-48 overflow-hidden">
//             <img
//               src={`${import.meta.env.VITE_BE_URL}${campaign?.media?.mainImage || "/placeholder-image.png"}`}
//               alt={campaign?.title}
//               className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
//             />
//             {/* Overlay badge */}
//             {/* <div className="absolute bg-black text-white text-xs font-semibold px-3 py-1 rounded-full shadow top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
//                                             {item.cause}
//                                         </div> */}
//           </div>

//           {/* Card Content */}
//           <CardHeader
//             className="px-4 py-6"
//             style={{ backgroundColor: `${campaign?.color}` }}
//           >
//             <CardTitle className="text-gray-900 text-lg font-semibold line-clamp-1">
//               {campaign?.title}
//             </CardTitle>
//             <div className="flex items-center text-sm text-gray-700 mt-1">
//               {/* <MapPin className="h-4 w-4 mr-1" />
//                                             <span>{item.country || "Unknown"}</span> */}
//               {campaign?.cause}
//             </div>
//             <CardDescription
//               className="text-gray-700 text-sm mt-2 line-clamp-2"
//               dangerouslySetInnerHTML={{
//                 __html: campaign?.short_description || campaign?.description,
//               }}
//             >
//               {/* {item.short_description || item.description} */}
//             </CardDescription>
//           </CardHeader>
//         </Card>

//         <Card className="mt-4 rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col p-4">
//           {/* according to my website write two line. */}
//           <p>
//             <span className="font-semibold text-primary underline">
//               Start a fundraiser
//             </span>{" "}
//             to rally your friends and family
//           </p>
//         </Card>
//       </div>

//       <div
//         className={`bg-white shadow-md overflow-hidden pl-0 pr-0 sm:pr-4 pt-0 pb-0 rounded-2xl ${isMobile ? "w-full" : "w-2/3"} bg-gray-100 p-2 flex md:flex-row flex-col gap-3`}
//       >
//         {/* Payment Methods Column */}
//         {!isFrontline && (
//           <div className={`${isMobile ? "w-full" : "w-2/7"} bg-gray-100 p-2`}>
//             <h3 className="text-sm font-medium mb-2">Payment Method</h3>
//             <div className="bg-gray-200 rounded-lg overflow-hidden shadow-sm border border-gray-100">
//               {paymentMethods.map((method) => {
//                 // Define colors for each payment method
//                 const getMethodStyles = (id: string) => {
//                   switch (id) {
//                     case "card":
//                       return {
//                         selected: "bg-white text-gray-800 shadow-sm",
//                         icon: "text-primary",
//                       };
//                     case "bank_transfer":
//                       return {
//                         selected:
//                           "bg-gradient-to-r from-emerald-100 via-emerald-50 to-emerald-100/50 border-emerald-500 text-emerald-700 shadow-sm",
//                         icon: "bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white shadow-md",
//                         hover: "hover:bg-emerald-50/50 hover:shadow-sm",
//                         border: "border-l-4",
//                       };
//                     case "google_pay":
//                       return {
//                         selected:
//                           "bg-gradient-to-r from-indigo-100 via-indigo-50 to-indigo-100/50 border-indigo-500 text-indigo-700 shadow-sm",
//                         icon: "bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 text-white shadow-md",
//                         hover: "hover:bg-indigo-50/50 hover:shadow-sm",
//                         border: "border-l-4",
//                       };
//                     case "crypto":
//                       return {
//                         selected:
//                           "bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100/50 border-amber-500 text-amber-700 shadow-sm",
//                         icon: "bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white shadow-md",
//                         hover: "hover:bg-amber-50/50 hover:shadow-sm",
//                         border: "border-l-4",
//                       };
//                     case "stocks":
//                       return {
//                         selected:
//                           "bg-gradient-to-r from-violet-100 via-violet-50 to-violet-100/50 border-violet-500 text-violet-700 shadow-sm",
//                         icon: "bg-gradient-to-br from-violet-500 via-violet-600 to-violet-700 text-white shadow-md",
//                         hover: "hover:bg-violet-50/50 hover:shadow-sm",
//                         border: "border-l-4",
//                       };
//                     case "daf":
//                       return {
//                         selected:
//                           "bg-gradient-to-r from-cyan-100 via-cyan-50 to-cyan-100/50 border-cyan-500 text-cyan-700 shadow-sm",
//                         icon: "bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700 text-white shadow-md",
//                         hover: "hover:bg-cyan-50/50 hover:shadow-sm",
//                         border: "border-l-4",
//                       };
//                     case "paypal":
//                       return {
//                         selected:
//                           "bg-gradient-to-r from-sky-100 via-sky-50 to-sky-100/50 border-sky-500 text-sky-700 shadow-sm",
//                         icon: "bg-gradient-to-br from-sky-500 via-sky-600 to-sky-700 text-white shadow-md",
//                         hover: "hover:bg-sky-50/50 hover:shadow-sm",
//                         border: "border-l-4",
//                       };
//                     case "venmo":
//                       return {
//                         selected:
//                           "bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100/50 border-blue-500 text-blue-700 shadow-sm",
//                         icon: "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white shadow-md",
//                         hover: "hover:bg-blue-50/50 hover:shadow-sm",
//                         border: "border-l-4",
//                       };
//                     default:
//                       return {
//                         selected:
//                           "bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 border-primary text-primary shadow-sm",
//                         icon: "bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white shadow-md",
//                         hover: "hover:bg-gray-50/50 hover:shadow-sm",
//                         border: "border-l-4",
//                       };
//                   }
//                 };

//                 const styles = getMethodStyles(method.id);

//                 return (
//                   <button
//                     key={method.name}
//                     type="button"
//                     className={`flex items-center w-full p-4 text-left gap-3 transition-all duration-200 ${
//                       paymentMethod === method.id
//                         ? `${styles.selected} ${styles.border}`
//                         : styles.hover
//                     }`}
//                     onClick={() => setPaymentMethod(method.id)}
//                   >
//                     <div
//                       className={`flex items-center justify-center w-full rounded-full ${
//                         paymentMethod === method.id
//                           ? `${styles.icon} ring-2 ring-offset-2 ring-white`
//                           : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                       } transition-all duration-200`}
//                     >
//                       {React.cloneElement(method.icon, {
//                         className: `h-5 w-5 ${
//                           paymentMethod === method.id ? "text-primary" : ""
//                         }`,
//                       })}
//                     </div>
//                     <div className="flex flex-col">
//                       <span
//                         className={`text-sm font-medium ${
//                           paymentMethod === method.id
//                             ? styles.selected.split(" ")[3]
//                             : "text-gray-700"
//                         }`}
//                       >
//                         {method.name}
//                       </span>
//                       <span
//                         className={`text-xs ${
//                           paymentMethod === method.id
//                             ? styles.selected.split(" ")[3]
//                             : "text-gray-500"
//                         }`}
//                       >
//                         {method.id === "card"
//                           ? "Credit/Debit Card"
//                           : method.id === "bank_transfer"
//                             ? "Direct Bank Transfer"
//                             : method.id === "google_pay"
//                               ? "Google Pay"
//                               : method.id === "crypto"
//                                 ? "Cryptocurrency"
//                                 : method.id === "stocks"
//                                   ? "Stock Donation"
//                                   : method.id === "daf"
//                                     ? "Donor Advised Fund"
//                                     : method.id === "paypal"
//                                       ? "PayPal"
//                                       : method.id === "venmo"
//                                         ? "Venmo"
//                                         : method.name}
//                       </span>
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* Form Column */}
//         <div
//           className={`${
//             isMobile ? "w-full" : isFrontline ? "w-full" : "w-full"
//           } space-y-4 sm:p-0 p-2`}
//         >
//           <form onSubmit={handleSubmitCard} className="space-y-6 py-2">
//             {step === 1 && (
//               <>
//                 {/* Step 1: Frequency */}
//                 <div className="space-y-2">
//                   <h3 className="text-md font-medium">Frequency</h3>
//                   <div
//                     className={`grid grid-cols-2 gap-2 rounded-md overflow-hidden`}
//                   >
//                      {/* <button
//                     type="button"
//                     className={`py-3 px-6 text-center ${frequency === "yearly" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"} rounded-md shadow-sm`}
//                     onClick={() => setFrequency("yearly")}
//                   >
//                     Yearly
//                   </button> */}
//                   <button
//                     type="button"
//                     className={`py-3 px-6 text-center ${frequency === "monthly" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"} rounded-md shadow-sm`}
//                     onClick={() => setFrequency("monthly")}
//                   >
//                     Monthly
//                   </button>
//                   <button
//                     type="button"
//                     className={`py-3 px-6 text-center ${frequency === "once" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"} rounded-md shadow-sm`}
//                     onClick={() => setFrequency("once")}
//                   >
//                     Once
//                   </button>

//                     {/* {availableTypes.map((type) => (
//                       <button
//                         key={type}
//                         type="button"
//                         className={`py-3 px-6 text-center rounded-md shadow-sm ${
//                           frequency === (type === "oneTime" ? "once" : type)
//                             ? "bg-primary text-white"
//                             : "bg-gray-100 text-gray-700"
//                         }`}
//                         onClick={() =>
//                           setFrequency(type === "oneTime" ? "once" : type)
//                         }
//                       >
//                         {labelMap[type]}
//                       </button>
//                     ))} */}
//                   </div>
//                   <p className="text-sm text-gray-700">
//                     {frequency === "once"
//                       ? "Make a one-time difference today!"
//                       : frequency === "monthly"
//                         ? "Join us in making a lasting impact every month!"
//                         : "Support us with an annual donation to create meaningful change!"}
//                   </p>
//                 </div>

//                 {/* Donation Amount */}
//                 <div className="space-y-2 mt-4">
//                   <h3 className="text-md font-medium">Donation amount</h3>
//                   <div className="bg-gray-50 flex items-center p-4 rounded-md shadow-sm">
//                     <div className="text-2xl font-bold">$</div>
//                     <Input
//                       type="number"
//                       inputMode="numeric"
//                       value={amount}
//                       onChange={(e) => setAmount(e.target.value)}
//                       className="text-2xl border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
//                       placeholder="10"
//                     />
//                     <div className="text-xl font-medium text-primary ml-auto">
//                       USD
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
//                     {defaultAmounts.map((amt) => (
//                       <button
//                         key={amt}
//                         type="button"
//                         className="py-3 px-4 border border-gray-200 rounded-md hover:border-primary transition-colors text-center bg-white shadow-sm"
//                         onClick={() => setAmount(String(amt))}
//                       >
//                         <span className="text-lg font-medium">${amt}</span>
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="flex w-full">
//                   <Button
//                     type="button"
//                     onClick={handleNext}
//                     className="py-2 px-6 bg-primary text-white rounded-md w-full"
//                   >
//                     Continue With Card
//                   </Button>
//                 </div>
//               </>
//             )}

//             {step === 2 && (
//               <>
//                 {/* Step 2: Additional fields */}
//                 <div className="space-y-3 bg-white p-4 rounded-md border border-gray-100 shadow-sm">
//                   <Button
//                     type="button"
//                     onClick={handleBack}
//                     className="py-2 text-[#235E4F] bg-light hover:bg-light"
//                   >
//                     <ArrowLeft className="mr-1 h-4 w-4" /> Back
//                   </Button>
//                   <h3>Choose a donation for YENDAA (optional)</h3>
//                   <p>
//                     We are a nonprofit, so instead of charging fees we rely on
//                     the generosity of donors like you.
//                   </p>
//                   <div
//                     className={`bg-gray-50 flex items-center p-4 rounded-md shadow-sm ${isEditing ? "border border-primary" : "border border-transparent"}`}
//                   >
//                     <div className="text-2xl font-bold">$</div>
//                     {isEditing ? (
//                       <Input
//                         type="number"
//                         inputMode="numeric"
//                         value={tipAmount}
//                         onChange={(e) => setTipAmount(e.target.value)}
//                         onBlur={() => setIsEditing(false)}
//                         className="text-2xl border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
//                         autoFocus
//                       />
//                     ) : (
//                       <Input
//                         type="number"
//                         inputMode="numeric"
//                         value={tipAmount}
//                         onChange={(e) => setTipAmount(e.target.value)}
//                         onBlur={() => setIsEditing(false)}
//                         className="text-2xl border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
//                       />
//                     )}
//                     <div className="text-xl font-medium text-primary ml-auto">
//                       USD
//                     </div>
//                   </div>
//                   <h3>Your donation</h3>
//                   <div>
//                     <div className="flex justify-between py-3">
//                       <p>Frequency</p>
//                       <p>{frequency}</p>
//                     </div>
//                     <hr />
//                     <div className="flex justify-between py-3">
//                       {/* <p>Donation for Equal Justice Initiative</p> */}
//                       <p>Donation for {campaign.title}</p>
//                       <p>${amount}</p>
//                     </div>
//                     <hr />
//                     <div className="flex justify-between py-3">
//                       <p>
//                         Donation for YENDAA |{" "}
//                         <span
//                           onClick={() => setIsEditing(true)}
//                           className="text-gray-500 cursor-pointer"
//                         >
//                           Edit
//                         </span>
//                       </p>
//                       <p>${tipAmount}</p>
//                     </div>
//                     <hr />
//                     <div className="flex justify-between py-3">
//                       <p>Total charge</p>
//                       <p>${Number(amount) + Number(tipAmount)}</p>
//                     </div>
//                     <hr />
//                   </div>
//                   {/* Donor Info */}
//                   <div className="space-y-3 mt-4 bg-white p-4 rounded-md border border-gray-100 shadow-sm">
//                     <h3 className="text-lg font-medium">Your Information</h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <Label
//                           htmlFor="donorName"
//                           className="block text-gray-700 mb-2"
//                         >
//                           Your Name
//                         </Label>
//                         <Input
//                           id="donorName"
//                           placeholder="John Doe"
//                           value={donorName}
//                           onChange={(e) => setDonorName(e.target.value)}
//                           className="w-full bg-gray-50"
//                           required
//                         />
//                       </div>
//                       <div>
//                         <Label
//                           htmlFor="donorEmail"
//                           className="block text-gray-700 mb-2"
//                         >
//                           Email Address
//                         </Label>
//                         <Input
//                           id="donorEmail"
//                           type="email"
//                           placeholder="john@example.com"
//                           value={donorEmail}
//                           onChange={(e) => setDonorEmail(e.target.value)}
//                           className="w-full bg-gray-50"
//                           required
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Add Note Toggle - Fixed checkbox styling */}
//                   <div className="flex items-center space-x-2 mt-6 bg-gray-50 p-4 rounded-md shadow-sm">
//                     <Checkbox
//                       id="show-note"
//                       checked={showNote}
//                       onCheckedChange={() => setShowNote(!showNote)}
//                       className="bg-white border-gray-300 data-[state=checked]:bg-primary"
//                     />
//                     <label
//                       htmlFor="show-note"
//                       className="text-base leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                     >
//                       {" "}
//                       Add a note for {campaignTitle}
//                     </label>
//                   </div>

//                   {/* Note Section (conditionally shown) */}
//                   {showNote && (
//                     <div className="mt-4 space-y-2 bg-white p-4 rounded-md border border-gray-100 shadow-sm">
//                       <h3 className="text-xl font-medium">Private note</h3>
//                       <Textarea
//                         placeholder="Enter your note here..."
//                         value={note}
//                         onChange={(e) => setNote(e.target.value)}
//                         className="bg-gray-50 resize-none h-24 border-gray-200"
//                       />
//                     </div>
//                   )}

//                   {paymentMethod === "card" && (
//                     <div className="p-4 border rounded-md">
//                       <h3 className="font-medium mb-2">Pay with Card</h3>
//                       <CardNumberElement className="text-2xl bg-gray-50 p-3 border focus-visible:ring-0 focus-visible:ring-offset-0 rounded-md w-full" />
//                       <div className="flex gap-3 mt-3">
//                         <CardExpiryElement className="text-2xl bg-gray-50 p-3 border focus-visible:ring-0 focus-visible:ring-offset-0 rounded-md w-full" />
//                         <CardCvcElement className="text-2xl bg-gray-50 p-3 border focus-visible:ring-0 focus-visible:ring-offset-0 rounded-md w-full" />
//                       </div>
//                     </div>
//                   )}

//                   {paymentMethod === "paypal" && (
//                     <div className="p-4 border rounded-md">
//                       <h3 className="font-medium mb-3">Pay with PayPal</h3>
//                       <PayPalScriptProvider
//                         options={{
//                           clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
//                           currency: "USD",
//                         }}
//                       >
//                         <PayPalButtons
//                           style={{
//                             layout: "vertical",
//                             color: "gold",
//                             shape: "rect",
//                             label: "paypal",
//                           }}
//                           createOrder={(data, actions) => {
//                             return actions.order.create({
//                               purchase_units: [
//                                 {
//                                   amount: { value: amount },
//                                 },
//                               ],
//                             });
//                           }}
//                           onApprove={(data, actions) => {
//                             return actions.order.capture().then((details) => {
//                               console.log("Payment successful:", details);
//                               alert(
//                                 "Transaction completed by " +
//                                   details.payer.name.given_name,
//                               );
//                             });
//                           }}
//                         />
//                       </PayPalScriptProvider>
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex justify-end mt-4">
//                   <Button
//                     type="submit"
//                     className="py-2 px-6 bg-primary text-white rounded-md w-full"
//                     disabled={isProcessing}
//                   >
//                     {isProcessing
//                       ? "Processing..."
//                       : `Donate using ${
//                           paymentMethods.find(
//                             (method) => method.id === paymentMethod,
//                           )?.name
//                         }`}
//                   </Button>
//                 </div>
//               </>
//             )}
//           </form>
//         </div>
//       </div>

//       <div
//         className={`${isMobile ? "w-full" : campaign?.customQuestions?.length > 0 ? "w-3/12" : "w-0"}`}
//       >
//         {/* faq */}
//         {Array.isArray(campaign?.customQuestions) &&
//           campaign?.customQuestions?.length > 0 && (
//             <div
//               className={`mt-2 space-y-2 bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100`}
//             >
//               <h1 className="text-lg font-semibold px-4 py-2 border-b">FAQs</h1>
//               <div className="divide-y divide-gray-200 bg-white rounded-xl shadow-md">
//                 {Array.isArray(campaign?.customQuestions) &&
//                   campaign?.customQuestions?.map((faq, index) => (
//                     <div
//                       key={index}
//                       className="px-5 py-4 hover:bg-gray-50 transition-colors duration-300"
//                     >
//                       <button
//                         onClick={() => toggleFAQ(index)}
//                         className="w-full flex justify-between items-center text-left"
//                       >
//                         <span className="text-base font-semibold text-gray-800">
//                           {faq.question}
//                         </span>
//                         <span className="text-gray-600 transition-transform duration-300">
//                           {openIndex === index ? (
//                             <FaChevronUp className="text-[#0B4D3C]" />
//                           ) : (
//                             <FaChevronDown className="text-gray-500" />
//                           )}
//                         </span>
//                       </button>

//                       {openIndex === index && (
//                         <p className="mt-3 text-gray-600 leading-relaxed animate-fadeIn">
//                           {faq.answer}
//                         </p>
//                       )}
//                     </div>
//                   ))}
//               </div>
//             </div>
//           )}
//       </div>
//     </div>
//   );
// };

// export default PaymentForm;

// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import { campaignApi } from "@/service/apiService";
import axios from "axios";
import {
  ArrowLeft,
  Banknote,
  Bitcoin,
  CircleCheck,
  CircleDollarSign,
  CreditCard,
  DollarSign,
  Gift,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Campaign as ApiCampaign } from "@/lib/types";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";

interface PaymentFormProps {
  onSubmit?: (
    amount: string,
    paymentMethod: string,
    frequency: string,
    campaignId: string,
    donorName: string,
    donorEmail: string,
  ) => void;
  isProcessing: boolean;
  setIsProcessing: (val: boolean) => void;
  campaignId: string;
  campaignTitle: string;
  isFrontline?: boolean;
}

interface PayPalApproveData {
  orderID?: string;
  vaultSetupToken?: string;
}

type ExtendedCampaign = ApiCampaign & {
  id?: string;
  image?: string;
  raised?: number;
  donors?: number;
  isPerpetual?: boolean;
  endDate?: string;
};

interface FAQItem {
  _id?: string;
  question: string;
  answer: string;
}

interface CampaignResponse {
  title: string;
  description: string;
  short_description?: string;
  fundingGoal: number | string;
  deadline?: number | null;
  cause: string;
  country: string;
  campaignSlug?: string;
  status: "draft" | "ongoing";
  color?: string;
  media?: {
    mainImage?: string;
    additionalImages?: string[];
  };
  faqs?: FAQItem[] | string;
  customQuestions?: FAQItem[];
  suggestedAmounts?: { amount: number; type: string }[];
}

const PaymentForm = ({
  onSubmit,
  isProcessing,
  setIsProcessing,
  campaignId,
  campaignTitle,
  isFrontline = false,
}: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { id } = useParams<{ id: string }>();
  const [step, setStep] = useState<number>(1);

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [frequency, setFrequency] = useState<"yearly" | "monthly" | "once">(
    "once",
  );
  const [amount, setAmount] = useState("10");
  const [tipAmount, setTipAmount] = useState("6");
  const [isEditingTip, setIsEditingTip] = useState(false);

  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");
  const [addPublicTestimony, setAddPublicTestimony] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [campaign, setCampaign] = useState<CampaignResponse | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successDetails, setSuccessDetails] = useState<{
    amount: string;
    frequency: string;
    method: string;
  } | null>(null);
  // console.log("Campaign data:", campaign);

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const isMobile = useIsMobile();

  // Default FAQs (fallback)
  const defaultFaqs: FAQItem[] = [
    {
      question: "How does Yendaa accept my donation?",
      answer:
        "Your donation is made to Give to Africa, a U.S. 501(c)(3) public charity. Give to Africa will immediately send you a receipt by email. We then securely transfer your donation to the specific African nonprofit or project you selected.",
    },
    {
      question: "Are there any fees?",
      answer:
        "Visa and Mastercard charge 2.2% + $0.30 per transaction. Amex charges 3.5%. There is an additional 1% fee for non-US cards. Yendaa does not charge any platform fees. Instead, we rely on optional donor tips to help fund our mission and keep the platform free for causes.",
    },
    {
      question: "Will I receive a tax-deductible receipt for my donation?",
      answer:
        "Yes. After your donation payment is confirmed, you will immediately receive a tax-deductible receipt by email. Your donation is 100% tax-deductible to the extent allowed by U.S. law.",
    },
  ];

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const response = await campaignApi.getCampaign(id);
        if (response.success && response.data) {
          const apiCampaign = response.data;
          const extendedCampaign: ExtendedCampaign = {
            ...apiCampaign,
            id: apiCampaign._id,
            isPerpetual: !apiCampaign.deadline,
          };

          setCampaign(extendedCampaign as CampaignResponse);

          if (
            apiCampaign.campaignSlug &&
            id !== apiCampaign.campaignSlug &&
            !id.includes("-")
          ) {
            window.history.replaceState(
              null,
              "",
              `/campaigns/${apiCampaign.campaignSlug}`,
            );
          }
        }
      } catch (error) {
        console.error("Error fetching campaign:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  // Payment methods (for left sidebar)
  const allPaymentMethods = [
    {
      id: "card",
      name: "Card",
      description: "Credit or debit card",
      icon: <CreditCard className="h-4 w-4" />,
    },
    // {
    //   id: "bank",
    //   name: "Bank",
    //   description: "Direct bank transfer",
    //   icon: <Banknote className="h-4 w-4" />,
    // },
    // {
    //   id: "paypal",
    //   name: "PayPal",
    //   description: "Checkout with PayPal",
    //   icon: <DollarSign className="h-4 w-4" />,
    // },
    // {
    //   id: "crypto",
    //   name: "Crypto",
    //   description: "Donate cryptocurrency",
    //   icon: <Bitcoin className="h-4 w-4" />,
    // },
    // {
    //   id: "stocks",
    //   name: "Stocks",
    //   description: "Donate stock",
    //   icon: <CircleCheck className="h-4 w-4" />,
    // },
    // {
    //   id: "daf",
    //   name: "DAF",
    //   description: "Donor Advised Fund",
    //   icon: <CircleDollarSign className="h-4 w-4" />,
    // },
    // {
    //   id: "venmo",
    //   name: "Venmo",
    //   description: "Pay with Venmo",
    //   icon: <CircleDollarSign className="h-4 w-4" />,
    // },
    // {
    //   id: "gift_card",
    //   name: "Gift card",
    //   description: "Redeem a gift card",
    //   icon: <Gift className="h-4 w-4" />,
    // },
  ];

  const paymentMethods = isFrontline
    ? allPaymentMethods.filter((m) => m.id === "card")
    : allPaymentMethods;

  // Default quick amounts (similar to screenshot)
  const defaultAmounts = [40, 100, 250];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const campaignFaqs: FAQItem[] =
    Array.isArray(campaign?.customQuestions) && campaign?.customQuestions.length
      ? (campaign.customQuestions as FAQItem[])
      : defaultFaqs;

  // ---------- Validation ----------
  const validateDonationDetails = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid donation amount.");
      return false;
    }

    if (!donorName.trim()) {
      toast.error("Please enter your name.");
      return false;
    }

    if (!donorEmail.trim()) {
      toast.error("Please enter your email.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(donorEmail)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    return true;
  };

  // ---------- Stripe Card Payment ----------
  const handleCardPayment = async () => {
    if (!stripe || !elements) {
      toast.error("Stripe is not loaded yet!");
      return;
    }

    if (!amount) {
      toast.error("Please enter donation amount");
      return;
    }

    try {
      setIsProcessing(true);

      const card = elements.getElement(CardNumberElement);
      if (!card) throw new Error("Card element not found");

      // 1️⃣ Create PaymentMethod
      const { error: pmError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card,
          billing_details: {
            name: donorName,
            email: donorEmail,
          },
        });

      if (pmError) throw new Error(pmError.message);
      if (!paymentMethod?.id) throw new Error("PaymentMethod creation failed");

      // 2️⃣ Call backend
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/payment/create-payment-intent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: parseFloat(amount),
            tipAmount,
            campaignId,
            donorName,
            donorEmail,
            paymentMethod: paymentMethod.id,
            frequency, // once | monthly
          }),
        },
      );

      const data = await res.json();

      // ============================
      // 🔁 MONTHLY / YEARLY SUBSCRIPTION
      // ============================
      if (frequency === "monthly" || frequency === "yearly") {
        if (!data.subscriptionId) {
          throw new Error("Subscription creation failed");
        }

        const label = frequency === "monthly" ? "Monthly" : "Yearly";

        toast.success(`${label} subscription created successfully`);

        // Save transaction in DB
        const confirmRes = await fetch(
          `${import.meta.env.VITE_API_URL}/payment/confirm-payment`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              subscriptionId: data.subscriptionId,
              // ❗ yahan "monthly" hard-code nahi, actual frequency bhejo
              type: frequency, // "monthly" | "yearly"
            }),
          },
        );

        const confirmData = await confirmRes.json();
        if (confirmData.success) {
          toast.success(`${label} donation recorded successfully.`);
        }

        // ✅ Success popup open karo
        setSuccessDetails({
          amount,
          frequency,
          method: "Card",
        });
        setSuccessModalOpen(true);

        onSubmit &&
          onSubmit(
            amount,
            "card",
            frequency,
            campaignId,
            donorName,
            donorEmail,
          );

        return;
      }

      // ============================
      // 💳 ONE-TIME PAYMENT
      // ============================
      if (!data.clientSecret) {
        throw new Error("Payment intent not created");
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
      );

      if (error) throw new Error(error.message);

      if (paymentIntent?.status === "succeeded") {
        toast.success("Payment successful");

        const confirmRes = await fetch(
          `${import.meta.env.VITE_API_URL}/payment/confirm-payment`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentIntentId: paymentIntent.id,
              type: "once",
            }),
          },
        );

        const confirmData = await confirmRes.json();
        if (confirmData.success) {
          toast.success("Donation recorded successfully.");
        }

        onSubmit &&
          onSubmit(amount, "card", "once", campaignId, donorName, donorEmail);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Card payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  // ---------- External / offline methods (bank, crypto, etc) ----------
  const handlePendingPayment = async () => {
    try {
      setIsProcessing(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/campaigns/${campaignId}/pending-payment`,
        {
          amount,
          donorName,
          donorEmail,
          paymentMethod,
          message: note,
          isRecurring: frequency === "monthly" || frequency === "yearly",
        },
      );

      toast.success("Payment request submitted successfully!");
      if (res.data.redirectUrl) {
        window.open(res.data.redirectUrl, "_blank");
      }

      onSubmit &&
        onSubmit(
          amount,
          paymentMethod,
          frequency,
          campaignId,
          donorName,
          donorEmail,
        );
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Error submitting payment request. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // ---------- Main Continue Button handler (step 2) ----------
  const handlePrimaryAction = async () => {
    if (!validateDonationDetails()) return;

    if (paymentMethod === "card") {
      await handleCardPayment();
      return;
    }

    if (paymentMethod === "paypal") {
      toast.message("Use the PayPal button below to complete your donation.");
      return;
    }

    // Other external methods -> pending payment
    await handlePendingPayment();
  };

  const availableTypes = Array.from(
    new Set(campaign?.suggestedAmounts?.map((item) => item.type)),
  );

  console.log(availableTypes, "availableTypes");

  const labelMap = {
    oneTime: "Once",
    monthly: "Monthly",
    yearly: "Yearly",
  };

  return (
    <div
      className={`w-full max-w-7xl mx-auto flex ${
        isMobile ? "flex-col gap-4" : "flex-row gap-6"
      }`}
    >
      {/* LEFT COLUMN - Campaign Card + CTAs */}
      <div className={`${isMobile ? "w-full" : "w-[26%]"} space-y-4`}>
        {/* Campaign card (image + title) */}
        <Card className="rounded-3xl overflow-hidden bg-[#FFEFD5] border-0 shadow-sm">
          <div className="relative h-40 md:h-44 overflow-hidden">
            <img
              src={`${
                import.meta.env.VITE_BE_URL
              }${campaign?.media?.mainImage || "/placeholder-image.png"}`}
              alt={campaign?.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="px-5 py-4">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 line-clamp-2">
              {campaign?.title || campaignTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {campaign?.cause || "African Cause"}
            </p>
            <CardDescription
              className="mt-2 text-sm text-slate-700 line-clamp-3"
              dangerouslySetInnerHTML={{
                __html: campaign?.short_description || campaign?.description,
              }}
            >
              {/* {campaign?.short_description || campaign?.description} */}
            </CardDescription>
          </div>
        </Card>

        {/* Start fundraiser */}
        <Card className="rounded-2xl bg-white border border-slate-200 shadow-sm px-4 py-3">
          <p className="text-sm text-slate-800">
            <span className="font-semibold text-[#137D60] underline">
              Start a fundraiser
            </span>{" "}
            to rally your friends and family
          </p>
        </Card>

        {/* Gift card CTA */}
        <Card className="rounded-2xl bg-white border border-slate-200 shadow-sm px-4 py-3 flex gap-3">
          <div className="mt-1 h-9 w-9 rounded-full bg-[#E6F4EA] flex items-center justify-center">
            <Gift className="h-5 w-5 text-[#137D60]" />
          </div>
          <p className="text-sm text-slate-800">
            Give the gift of giving with a{" "}
            <span className="font-semibold text-[#137D60] underline">
              Yendaa charity gift card
            </span>
            .
          </p>
        </Card>
      </div>

      {/* MIDDLE COLUMN - Methods sidebar + main form */}
      <div
        className={`${
          isMobile ? "w-full" : "w-[46%]"
        } bg-[#F4F6F5] rounded-3xl shadow-sm overflow-hidden flex`}
      >
        {/* Form area */}
        <div className="flex-1 bg-white px-5 md:px-7 py-5">
          {/* We don't really need <form> submit here, we use buttons */}
          {step === 1 && (
            <div className="flex gap-4 ">
              {/* Payment methods sidebar */}
              {!isFrontline && (
                <div className="w-40 md:w-52 bg-[#F0F2F1] border-r border-slate-200 flex flex-col">
                  {paymentMethods.map((method, idx) => {
                    const selected = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                          selected
                            ? "bg-white text-[#137D60] border-l-4 border-[#137D60] font-semibold"
                            : "text-slate-700 hover:bg-slate-100"
                        } ${idx === 0 ? "mt-2" : ""}`}
                      >
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-full ${
                            selected ? "bg-[#E6F4EA]" : "bg-white"
                          }`}
                        >
                          {method.icon}
                        </span>
                        <span>{method.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              <div className="space-y-6">
                {/* Frequency */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Frequency
                  </h3>
                  <div className="mt-3 inline-flex rounded-full border border-[#137D60] bg-white p-1 text-sm">
                    {/* {["yearly", "monthly", "once"].map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() =>
                        setFrequency(freq as "yearly" | "monthly" | "once")
                      }
                      className={`px-4 py-1.5 rounded-full transition-colors ${
                        frequency === freq
                          ? "bg-[#137D60] text-white"
                          : "text-slate-800 hover:bg-slate-50"
                      }`}
                    >
                      {freq === "yearly"
                        ? "Yearly"
                        : freq === "monthly"
                        ? "Monthly"
                        : "Once"}
                    </button>
                  ))} */}

                    {availableTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`px-4 py-1.5 rounded-full transition-colors ${
                          frequency === (type === "oneTime" ? "once" : type)
                            ? "bg-primary text-white"
                            : "text-slate-800 hover:bg-slate-50"
                        }`}
                        onClick={() =>
                          setFrequency(type === "oneTime" ? "once" : type)
                        }
                      >
                        {labelMap[type]}
                      </button>
                    ))}

                    {!availableTypes.length && (
                      <div className="flex flex-wrap gap-2">
                        {["yearly", "monthly", "once"].map((freq) => (
                          <button
                            key={freq}
                            type="button"
                            onClick={() =>
                              setFrequency(
                                freq as "yearly" | "monthly" | "once",
                              )
                            }
                            className={`px-4 py-1.5 rounded-full transition-colors ${
                              frequency === freq
                                ? "bg-primary text-white"
                                : "text-slate-800 hover:bg-slate-50"
                            }`}
                          >
                            {freq === "yearly"
                              ? "Yearly"
                              : freq === "monthly"
                                ? "Monthly"
                                : "Once"}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-slate-600">
                    Recurring donations help nonprofits focus on mission and
                    long-term impact, not fundraising. Cancel anytime.
                  </p>
                </div>

                {/* Donation amount */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Donation amount
                  </h3>
                  <div className="flex items-center gap-3 rounded-2xl bg-[#F4F6F5] px-4 py-3">
                    <span className="text-xl font-semibold text-slate-900">
                      $
                    </span>
                    <Input
                      type="number"
                      inputMode="numeric"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="border-0 bg-transparent px-0 text-xl font-semibold text-slate-900 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <span className="ml-auto text-sm font-semibold text-[#137D60]">
                      USD
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {defaultAmounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setAmount(String(amt))}
                        className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-800 hover:border-[#137D60]"
                      >
                        +{amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Note + public testimony checkboxes (like screenshot) */}
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-sm text-slate-800">
                    <Checkbox
                      id="add-note"
                      checked={showNote}
                      onCheckedChange={() => setShowNote((prev) => !prev)}
                    />
                    <span>Add a note for {campaignTitle}</span>
                  </label>

                  <label className="flex items-center gap-3 text-sm text-slate-800">
                    <Checkbox
                      id="public-testimony"
                      checked={addPublicTestimony}
                      onCheckedChange={() =>
                        setAddPublicTestimony((prev) => !prev)
                      }
                    />
                    <span>Add public testimony</span>
                  </label>

                  {showNote && (
                    <Textarea
                      placeholder="Write a private note to the nonprofit..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="mt-2 h-24 resize-none bg-[#F8FAF9] text-sm"
                    />
                  )}
                </div>

                {/* Continue button */}
                <div className="pt-2">
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="h-11 w-full rounded-full bg-[#137D60] text-sm font-semibold text-white hover:bg-[#0f5f4c]"
                  >
                    {paymentMethod === "card"
                      ? "Continue with credit or debit"
                      : `Continue with ${
                          paymentMethods.find((m) => m.id === paymentMethod)
                            ?.name ?? "selected method"
                        }`}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* Back */}
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center text-sm font-medium text-[#137D60] hover:text-[#0f5f4c]"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </button>

              {/* Summary + Yendaa tip */}
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-[#F8FAF9] p-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Yendaa optional tip
                  </h3>
                  <p className="mt-1 text-xs text-slate-600">
                    We are a nonprofit. Instead of charging fees, we rely on
                    optional tips from generous donors like you.
                  </p>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3">
                  <span className="text-xl font-semibold text-slate-900">
                    $
                  </span>
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={tipAmount}
                    onChange={(e) => setTipAmount(e.target.value)}
                    className="border-0 bg-transparent px-0 text-xl font-semibold text-slate-900 focus-visible:ring-0 focus-visible:ring-offset-0"
                    onFocus={() => setIsEditingTip(true)}
                    onBlur={() => setIsEditingTip(false)}
                  />
                  <span className="ml-auto text-sm font-semibold text-[#137D60]">
                    USD
                  </span>
                </div>

                {/* Donation summary */}
                <div className="space-y-1 text-sm text-slate-800">
                  <div className="flex justify-between py-1">
                    <span>Frequency</span>
                    <span className="capitalize">
                      {frequency === "once" ? "One-time" : frequency}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Donation for {campaign?.title || campaignTitle}</span>
                    <span>${amount}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Tip for Yendaa</span>
                    <span>${tipAmount || "0"}</span>
                  </div>
                  <div className="mt-1 border-t border-slate-200 pt-2 font-semibold">
                    <div className="flex justify-between">
                      <span>Total charge</span>
                      <span>
                        $
                        {(Number(amount || 0) + Number(tipAmount || 0)).toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Donor info */}
              <div className="space-y-3 rounded-2xl border border-slate-200 bg-[#F8FAF9] p-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Your information
                </h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <Label
                      htmlFor="donorName"
                      className="mb-1 block text-xs font-medium text-slate-700"
                    >
                      Full name
                    </Label>
                    <Input
                      id="donorName"
                      placeholder="John Doe"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="h-9 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="donorEmail"
                      className="mb-1 block text-xs font-medium text-slate-700"
                    >
                      Email address
                    </Label>
                    <Input
                      id="donorEmail"
                      type="email"
                      placeholder="john@example.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="h-9 bg-white text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Payment method specific UI */}
              {paymentMethod === "card" && (
                <div className="space-y-3 rounded-2xl border border-slate-200 bg-[#F8FAF9] p-4">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Card details
                  </h3>
                  <div className="space-y-3">
                    <div className="rounded-md border bg-white px-3 py-2">
                      <CardNumberElement className="text-sm" />
                    </div>
                    <div className="flex gap-3">
                      <div className="w-1/2 rounded-md border bg-white px-3 py-2">
                        <CardExpiryElement className="text-sm" />
                      </div>
                      <div className="w-1/2 rounded-md border bg-white px-3 py-2">
                        <CardCvcElement className="text-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "paypal" && (
                <div className="space-y-3 rounded-2xl border border-slate-200 bg-[#F8FAF9] p-4">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Pay with PayPal
                  </h3>
                  <p className="text-xs text-slate-600">
                    You&apos;ll be redirected to PayPal to complete your
                    donation securely.
                  </p>
                  <PayPalScriptProvider
                    options={{
                      clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
                      currency: "USD",
                    }}
                  >
                    <PayPalButtons
                      style={{
                        layout: "vertical",
                        color: "gold",
                        shape: "rect",
                        label: "paypal",
                      }}
                      createOrder={(_, actions) =>
                        actions.order.create({
                          purchase_units: [
                            {
                              amount: { value: amount || "10" },
                            },
                          ],
                        })
                      }
                      onApprove={(_, actions) =>
                        actions.order.capture().then((details: any) => {
                          toast.success(
                            `Thanks, ${
                              details?.payer?.name?.given_name || "donor"
                            }! Your PayPal donation was successful.`,
                          );
                        })
                      }
                    />
                  </PayPalScriptProvider>
                </div>
              )}

              {/* Submit / Donate button */}
              <div className="pt-1">
                <Button
                  type="button"
                  onClick={handlePrimaryAction}
                  disabled={isProcessing}
                  className="h-11 w-full rounded-full bg-[#137D60] text-sm font-semibold text-white hover:bg-[#0f5f4c]"
                >
                  {isProcessing
                    ? "Processing..."
                    : paymentMethod === "card"
                      ? "Donate with credit or debit"
                      : paymentMethod === "paypal"
                        ? "Review details (then use PayPal button)"
                        : `Submit ${
                            paymentMethods.find((m) => m.id === paymentMethod)
                              ?.name ?? "donation"
                          }`}
                </Button>
              </div>
            </div>
          )}
          <p className="mt-5 text-sm text-slate-600">
            Have ideas for how we can build a better donation experience? Send
            us{" "}
            <a
              href="https://forms.monday.com/forms/98d7e5c33bc97773bc07f7d1a1e86568?r=use1"
              className="text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              feedback
            </a>
            .
          </p>
          <p className="mt-2 text-sm text-slate-600">
            We respect your privacy. To learn more, check out our{" "}
            <a
              href="/privacypolicy"
              target="_blank"
              className="text-primary"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN - FAQs */}
      <div className={`${isMobile ? "w-full mt-4" : "w-[28%]"}`}>
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <h2 className="border-b border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900">
            FAQs
          </h2>
          <div className="divide-y divide-slate-200">
            {campaignFaqs.map((faq, index) => (
              <div key={index} className="px-5 py-3">
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <span className="text-sm font-medium text-slate-900">
                    {faq.question}
                  </span>
                  <span className="text-slate-500">
                    {openIndex === index ? (
                      <FaChevronUp className="h-3 w-3" />
                    ) : (
                      <FaChevronDown className="h-3 w-3" />
                    )}
                  </span>
                </button>
                {openIndex === index && (
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
            {/* SUCCESS POPUP */}
      <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6">
          <DialogHeader className="items-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <DialogTitle className="text-center text-xl font-semibold text-slate-900">
              Thank you for your donation!
            </DialogTitle>
            <DialogDescription className="mt-2 text-center text-sm text-slate-600">
              {successDetails ? (
                <>
                  Your{" "}
                  <span className="font-medium">
                    {successDetails.frequency === "once"
                      ? "one-time"
                      : successDetails.frequency}
                  </span>{" "}
                  {successDetails.method.toLowerCase()} donation of{" "}
                  <span className="font-semibold">
                    ${Number(successDetails.amount).toFixed(2)}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold">
                    {campaign?.title || campaignTitle}
                  </span>{" "}
                  has been successfully processed.
                </>
              ) : (
                "Your donation has been successfully processed."
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-1 text-center text-xs text-slate-500">
            {donorEmail && (
              <p>A receipt has been sent to {donorEmail}.</p>
            )}
            <p>
              Your support helps us empower more African causes through
              Yendaa. We truly appreciate your generosity.
            </p>
          </div>

          <DialogFooter className="mt-6 flex justify-center">
            <Button
              className="rounded-full px-6"
              onClick={() => setSuccessModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentForm;
