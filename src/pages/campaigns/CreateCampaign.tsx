// import { Footer } from "@/components/shared/Footer";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Image } from "@/components/ui/Image";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Separator } from "@/components/ui/separator";
// import { Switch } from "@/components/ui/switch";
// import { Textarea } from "@/components/ui/textarea";
// import { africanCountries } from "@/lib/countries";
// import { campaignCauses } from "@/lib/types";
// import { FALLBACK_IMAGE } from "@/lib/utils";
// import { campaignApi } from "@/service/apiService";
// import {
//   ArrowLeft,
//   Calendar,
//   Image as ImageIcon,
//   MapPin,
//   Upload,
//   X,
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "sonner";

// // interface FAQItem {
// //   question: string;
// //   answer: string;
// // }

// const CreateCampaign = () => {
//   const navigate = useNavigate();
//   const { campaignId } = useParams();
//   const isEditMode = !!campaignId;
//   const [isLoading, setIsLoading] = useState(false);
//   const [isPerpetual, setIsPerpetual] = useState(false);
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     fundingGoal: "",
//     endDate: "",
//     cause: "",
//     country: "",
//     campaignSlug: "",
//     status: "draft",
//   });
//   const [mediaFiles, setMediaFiles] = useState<File[]>([]);
//   const [coverImage, setCoverImage] = useState<File | null>(null);
//   const [currentCoverImageUrl, setCurrentCoverImageUrl] = useState<
//     string | null
//   >(null);
//   const [currentAdditionalImages, setCurrentAdditionalImages] = useState<
//     string[]
//   >([]);
//   const [error, setError] = useState<string | null>(null);
//   // faqs
//   // const [faqs, setFaqs] = useState<FAQItem[]>([]);
//   // const [newQuestion, setNewQuestion] = useState("");
//   // const [newAnswer, setNewAnswer] = useState("");

//   // Fetch campaign data if in edit mode
//   useEffect(() => {
//     const fetchCampaignData = async () => {
//       if (!isEditMode) return;

//       setIsLoading(true);
//       try {
//         const response = await campaignApi.getCampaign(campaignId!);

//         if (!response.success) {
//           throw new Error(response.error || "Failed to fetch cause data");
//         }

//         const campaign = response.data;

//         // Set form data from campaign
//         setFormData({
//           title: campaign.title,
//           description: campaign.description,
//           fundingGoal: campaign.fundingGoal.toString(),
//           endDate: campaign.deadline
//             ? new Date(campaign.deadline).toISOString().split("T")[0]
//             : "",
//           cause: campaign.cause,
//           country: campaign.country,
//           campaignSlug: campaign.campaignSlug || "",
//           status: campaign.status,
//         });

//         // Set perpetual status based on deadline
//         setIsPerpetual(!campaign.deadline);

//         // Set current images
//         if (campaign.media?.mainImage) {
//           setCurrentCoverImageUrl(campaign.media.mainImage);
//         }

//         if (campaign.media?.additionalImages?.length) {
//           setCurrentAdditionalImages(campaign.media.additionalImages);
//         }

//         // if (campaign.faqs && Array.isArray(campaign.faqs)) {
//         //   setFaqs(campaign.faqs);
//         // } else if (typeof campaign.faqs === "string") {
//         //   try {
//         //     const parsedFaqs = JSON.parse(campaign.faqs);
//         //     if (Array.isArray(parsedFaqs)) {
//         //       setFaqs(parsedFaqs);
//         //     }
//         //   } catch (err) {
//         //     console.error("Failed to parse faqs", err);
//         //   }
//         // }

//       } catch (error) {
//         const errorMessage =
//           error instanceof Error
//             ? error.message
//             : "An unexpected error occurred";
//         setError(errorMessage);
//         toast.error(errorMessage);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchCampaignData();
//   }, [campaignId, isEditMode]);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (value: string, name: string) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       if (file.size > 500 * 1024) {
//         // 500KB in bytes
//         toast.error("Cover image must be under 500KB");
//         return;
//       }
//       setCoverImage(file);
//       setCurrentCoverImageUrl(null); // Clear the current URL since we're uploading a new image
//     }
//   };

//   const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const newFiles = Array.from(e.target.files).filter((file) => {
//         if (file.size > 500 * 1024) {
//           // 500KB in bytes
//           toast.error(`${file.name} is too large. Images must be under 500KB`);
//           return false;
//         }
//         return true;
//       });
//       setMediaFiles((prev) => [...prev, ...newFiles].slice(0, 2)); // Limit to 2 additional images as per API
//       setCurrentAdditionalImages([]); // Clear current additional images
//     }
//   };

//   const removeMediaFile = (index: number) => {
//     setMediaFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   const removeCurrentAdditionalImage = (index: number) => {
//     setCurrentAdditionalImages((prev) => prev.filter((_, i) => i !== index));
//   };

//   const removeCoverImage = () => {
//     setCoverImage(null);
//     setCurrentCoverImageUrl(null);
//   };

//   // faq
//   // const addFAQ = () => {
//   //   if (newQuestion.trim() === "" || newAnswer.trim() === "") return;
//   //   setFaqs([...faqs, { question: newQuestion, answer: newAnswer }]);
//   //   setNewQuestion("");
//   //   setNewAnswer("");
//   // };

//   // const removeFAQ = (index: number) => {
//   //   setFaqs(faqs.filter((_, i) => i !== index));
//   // };

//   const handleSubmit = async (
//     e: React.FormEvent,
//     submitStatus: "draft" | "ongoing"
//   ) => {
//     e.preventDefault();
//     setError(null);
//     setIsLoading(true);

//     try {
//       // Basic validation
//       if (
//         !formData.title ||
//         !formData.description ||
//         !formData.fundingGoal ||
//         (!isPerpetual && !formData.endDate) ||
//         !formData.cause ||
//         !formData.country
//       ) {
//         throw new Error("Please fill in all required fields");
//       }

//       if (!coverImage && !currentCoverImageUrl) {
//         throw new Error("Please upload a cover image for your cause");
//       }

//       // if (!faqs || faqs.length === 0) {
//       //   throw new Error("Please add at least one FAQ for your campaign");
//       // }
//       // for (const faq of faqs) {
//       //   if (!faq.question.trim() || !faq.answer.trim()) {
//       //     throw new Error("Each FAQ must have a question and an answer");
//       //   }
//       // }

//       // Prepare campaign data
//       const campaignData = {
//         title: formData.title,
//         description: formData.description,
//         fundingGoal: Number(formData.fundingGoal),
//         cause: formData.cause,
//         country: formData.country,
//         campaignSlug: formData.campaignSlug || undefined,
//         status: submitStatus, // Set status based on which button was clicked
//         deadline:
//           !isPerpetual && formData.endDate
//             ? new Date(formData.endDate).getTime()
//             : undefined,
//         // faqs: JSON.stringify(faqs),
//       };

//       // Prepare media files
//       const files: {
//         mainImage?: File;
//         additionalImages?: File[];
//       } = {};

//       if (coverImage) {
//         files.mainImage = coverImage;
//       }

//       if (mediaFiles.length > 0) {
//         files.additionalImages = mediaFiles;
//       }

//       let response;

//       if (isEditMode) {
//         // Update existing campaign
//         response = await campaignApi.updateCampaign(
//           campaignId!,
//           campaignData,
//           Object.keys(files).length > 0 ? files : undefined
//         );
//       } else {
//         // Create new campaign
//         response = await campaignApi.createCampaign(campaignData, {
//           mainImage: coverImage!,
//           additionalImages: mediaFiles.length > 0 ? mediaFiles : undefined,
//         });
//       }

//       if (!response.success) {
//         throw new Error(
//           response.error ||
//           `Failed to ${isEditMode ? "update" : "create"} cause`
//         );
//       }

//       toast.success(
//         `cause ${isEditMode ? "updated" : "created"} successfully!`
//       );
//       navigate("/dashboard?tab=campaigns");
//     } catch (error: unknown) {
//       const errorMessage =
//         error instanceof Error ? error.message : "An unexpected error occurred";
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
//         <div className="container-custom">
//           <div className="max-w-4xl mx-auto">
//             <div className="mb-8 flex items-center">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="mr-4"
//                 onClick={() => navigate("/dashboard")}
//               >
//                 <ArrowLeft className="h-4 w-4 mr-1" /> Back
//               </Button>
//               <h1 className="text-3xl font-bold">
//                 {isEditMode ? "Edit Causes" : "Create Causes"}
//               </h1>
//             </div>

//             <form onSubmit={(e) => e.preventDefault()}>
//               {error && (
//                 <Alert variant="destructive" className="mb-6">
//                   <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//               )}

//               {/* Basic Information Card */}
//               <Card className="mb-8">
//                 <CardHeader>
//                   <CardTitle>causes Information</CardTitle>
//                   <CardDescription>
//                     Basic details about your fundraising causes
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div>
//                     <Label htmlFor="title">cause Title</Label>
//                     <Input
//                       id="title"
//                       name="title"
//                       value={formData.title}
//                       onChange={handleInputChange}
//                       placeholder="Give your cause a clear, attention-grabbing title"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <Label htmlFor="description">cause Description</Label>
//                     <Textarea
//                       id="description"
//                       name="description"
//                       rows={5}
//                       value={formData.description}
//                       onChange={handleInputChange}
//                       placeholder="Describe your cause, its purpose, and how the funds will be used"
//                       required
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <Label htmlFor="fundingGoal">Funding Goal</Label>
//                       <div className="relative">
//                         <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
//                           $
//                         </span>
//                         <Input
//                           id="fundingGoal"
//                           name="fundingGoal"
//                           type="number"
//                           min="1"
//                           value={formData.fundingGoal}
//                           onChange={handleInputChange}
//                           className="pl-7"
//                           placeholder="10000"
//                           required
//                         />
//                       </div>
//                     </div>

//                     {/* <div>
//                       <Label htmlFor="campaignSlug">
//                         Custom URL (Optional)
//                       </Label>
//                       <Input
//                         id="campaignSlug"
//                         name="campaignSlug"
//                         value={formData.campaignSlug}
//                         onChange={handleInputChange}
//                         placeholder="your-campaign-name"
//                         className="pl-3"
//                       />
//                       <p className="text-xs text-gray-500 mt-1">
//                         Leave blank to generate automatically from title
//                       </p>
//                     </div> */}
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <Label htmlFor="country">Country</Label>
//                       <Select
//                         value={formData.country}
//                         onValueChange={(value) =>
//                           handleSelectChange(value, "country")
//                         }
//                       >
//                         <SelectTrigger className="pl-9">
//                           <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
//                           <SelectValue placeholder="Select African country" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {africanCountries.map((country) => (
//                             <SelectItem key={country.code} value={country.name}>
//                               {country.name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div>
//                       <Label htmlFor="cause">Cause Category</Label>
//                       <Select
//                         value={formData.cause}
//                         onValueChange={(value) =>
//                           handleSelectChange(value, "cause")
//                         }
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select cause category" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {campaignCauses.map((cause) => (
//                             <SelectItem key={cause} value={cause}>
//                               {cause}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>

//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <div className="space-y-0.5">
//                         <Label>cause Duration</Label>
//                         <p className="text-sm text-muted-foreground">
//                           Set if your cause has an end date
//                         </p>
//                       </div>
//                       <Switch
//                         checked={!isPerpetual}
//                         onCheckedChange={(checked) => setIsPerpetual(!checked)}
//                       />
//                     </div>

//                     {!isPerpetual && (
//                       <div className="relative">
//                         <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
//                         <Input
//                           id="endDate"
//                           name="endDate"
//                           type="date"
//                           value={formData.endDate}
//                           onChange={handleInputChange}
//                           className="pl-9"
//                           required={!isPerpetual}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Media Uploads Card */}
//               <Card className="mb-8">
//                 <CardHeader>
//                   <CardTitle>cause Media</CardTitle>
//                   <CardDescription>
//                     Add visual content to make your cause more compelling
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   {/* Cover Image Upload */}
//                   <div>
//                     <Label className="block mb-2">Cover Image (Required)</Label>
//                     {!coverImage && !currentCoverImageUrl ? (
//                       <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
//                         <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//                         <div className="text-sm text-gray-600">
//                           <label
//                             htmlFor="cover-image"
//                             className="cursor-pointer text-brand-purple hover:underline"
//                           >
//                             Click to upload
//                           </label>{" "}
//                           or drag and drop
//                           <p className="text-xs text-gray-500">
//                             Recommended size: 1200 × 630 pixels
//                           </p>
//                           <p className="text-xs text-gray-500 mt-1">
//                             Maximum file size: 500KB
//                           </p>
//                         </div>
//                         <input
//                           id="cover-image"
//                           type="file"
//                           className="hidden"
//                           accept="image/*"
//                           onChange={handleCoverImageChange}
//                         />
//                       </div>
//                     ) : (
//                       <div className="relative">
//                         <Image
//                           src={
//                             coverImage
//                               ? URL.createObjectURL(coverImage)
//                               : currentCoverImageUrl!
//                           }
//                           alt="Cover preview"
//                           className="w-full h-64 object-cover rounded-lg"
//                           fallback={FALLBACK_IMAGE}
//                         />
//                         <Button
//                           variant="destructive"
//                           size="icon"
//                           className="absolute top-3 right-3"
//                           onClick={removeCoverImage}
//                         >
//                           <X className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     )}
//                   </div>

//                   <Separator />

//                   {/* Additional Media Upload */}
//                   <div>
//                     <Label className="block mb-2">
//                       Additional Images (Optional, max 2)
//                     </Label>
//                     <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
//                       <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//                       <div className="text-sm text-gray-600">
//                         <label
//                           htmlFor="media-files"
//                           className="cursor-pointer text-brand-purple hover:underline"
//                         >
//                           Click to upload
//                         </label>{" "}
//                         or drag and drop
//                         <p className="text-xs text-gray-500">
//                           Images only (max. 2 files, 500KB per image)
//                         </p>
//                       </div>
//                       <input
//                         id="media-files"
//                         type="file"
//                         multiple
//                         className="hidden"
//                         accept="image/*"
//                         onChange={handleMediaUpload}
//                         disabled={
//                           mediaFiles.length + currentAdditionalImages.length >=
//                           2
//                         }
//                       />
//                     </div>
//                   </div>

//                   {/* Preview Existing Additional Images */}
//                   {currentAdditionalImages.length > 0 && (
//                     <div className="mt-4">
//                       <h4 className="font-medium mb-3">Existing Images</h4>
//                       <div className="grid grid-cols-2 gap-4">
//                         {currentAdditionalImages.map((imageUrl, index) => (
//                           <div
//                             key={`existing-${index}`}
//                             className="relative group rounded-lg overflow-hidden bg-gray-100 aspect-square"
//                           >
//                             <img
//                               src={
//                                 imageUrl.startsWith("http")
//                                   ? imageUrl
//                                   : `${import.meta.env.VITE_BE_URL}${imageUrl}`
//                               }
//                               alt={`Media ${index + 1}`}
//                               className="w-full h-full object-cover"
//                             />
//                             <Button
//                               variant="destructive"
//                               size="icon"
//                               className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                               onClick={() =>
//                                 removeCurrentAdditionalImage(index)
//                               }
//                             >
//                               <X className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Preview Uploaded Media */}
//                   {mediaFiles.length > 0 && (
//                     <div className="mt-4">
//                       <h4 className="font-medium mb-3">Uploaded Images</h4>
//                       <div className="grid grid-cols-2 gap-4">
//                         {mediaFiles.map((file, index) => (
//                           <div
//                             key={`new-${index}`}
//                             className="relative group rounded-lg overflow-hidden bg-gray-100 aspect-square"
//                           >
//                             <img
//                               src={URL.createObjectURL(file)}
//                               alt={`Media ${index + 1}`}
//                               className="w-full h-full object-cover"
//                             />
//                             <Button
//                               variant="destructive"
//                               size="icon"
//                               className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                               onClick={() => removeMediaFile(index)}
//                             >
//                               <X className="h-4 w-4" />
//                             </Button>
//                             <div className="absolute bottom-1 left-1 right-1 text-xs bg-black bg-opacity-50 text-white p-1 truncate rounded">
//                               {file.name}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                 </CardContent>
//               </Card>

//               {/* FAQ */}
//               {/* <Card className="mb-8">
//                 <CardHeader>
//                   <CardTitle>FAQ</CardTitle>
//                 </CardHeader>

//                 <CardContent className="space-y-6">
//                   <div>
//                     <Input
//                       type="text"
//                       placeholder="Enter Question"
//                       value={newQuestion}
//                       onChange={(e) => setNewQuestion(e.target.value)}
//                       className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <Textarea
//                       placeholder="Enter Answer"
//                       value={newAnswer}
//                       onChange={(e) => setNewAnswer(e.target.value)}
//                       className="w-full mt-2 border rounded px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <Button
//                       onClick={addFAQ}
//                       type="button"
//                       className="px-4 py-2 border mt-2 rounded transition"
//                     >
//                       Add FAQ
//                     </Button>
//                   </div>
//                   <div>
//                     {faqs.map((faq, index) => (
//                       <div key={index} className="border mb-2 rounded p-3 bg-gray-50">
//                         <p className="font-medium mb-2">{faq.question}</p>
//                         <hr />
//                         <p className="mt-2 whitespace-pre-wrap">{faq.answer}</p>
//                         <button
//                           onClick={() => removeFAQ(index)}
//                           className="my-3 text-[#fff] bg-red-500 hover:bg-red-400 py-1 px-2 rounded"
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card> */}

//               {/* Submit Buttons */}
//               <CardFooter className="flex justify-between px-0">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => navigate("/dashboard")}
//                 >
//                   Cancel
//                 </Button>
//                 <div className="space-x-4">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={(e) => handleSubmit(e, "draft")}
//                     disabled={isLoading}
//                   >
//                     Save as Draft
//                   </Button>
//                   <Button
//                     type="button"
//                     onClick={(e) => handleSubmit(e, "ongoing")}
//                     disabled={isLoading}
//                   >
//                     {isLoading
//                       ? isEditMode
//                         ? "Updating..."
//                         : "Creating..."
//                       : isEditMode
//                         ? "Update cause"
//                         : "Publish cause"}
//                   </Button>
//                 </div>
//               </CardFooter>
//             </form>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default CreateCampaign;

// // @ts-nocheck
// import { campaignApi } from "@/service/apiService";
// import { LucideDelete, Plus } from "lucide-react";
// import { useEffect, useState } from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { Link } from "react-router-dom";
// import { useParams } from "react-router-dom";

// const quillModules = {
//   toolbar: [
//     [{ header: [1, 2, 3, false] }],
//     ["bold", "italic", "underline", "strike"],
//     [{ list: "ordered" }, { list: "bullet" }],
//     ["link", "image"],
//     ["clean"],
//   ],
// };

// const quillFormats = [
//   "header",
//   "bold",
//   "italic",
//   "underline",
//   "strike",
//   "list",
//   "bullet",
//   "link",
//   "image",
// ];

// const colors = [
//   "#f87878",
//   "#f7bd7a",
//   "#f6e186",
//   "#a4eb99",
//   "#76e0cf",
//   "#a1cffb",
//   "#e4aefb",
//   "#fa85b0",
//   "#14b8a6",
//   "linear-gradient(135deg, #76e0cf, #14b8a6)",
// ];

// const steps = [
//   "Campaign Type",
//   "Title",
//   "Fundraising Goal",
//   "Description",
//   "Color",
//   "Banner",
//   "Logo",
//   "Common Donation",
//   // "Suggested Amounts",
//   "Tax Receipts",
//   "Custom Questions",
//   "Thank You Email",
//   "Advanced Settings",
//   "Success",
// ];

// function CreateCampaign() {
//   const [step, setStep] = useState(0);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [showInputSteps, setShowInputSteps] = useState({});
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [apiError, setApiError] = useState("");

//   const { campaignId } = useParams();
//   const isEditMode = Boolean(campaignId);

//   const [isLoading, setIsLoading] = useState(false);

//   const isSuccessStep = step === steps.length - 1;
//   const isLastInputStep = step === steps.length - 2;
//   const progress = ((step + 1) / steps.length) * 100;

//   const toggleInput = (stepNum) => {
//     setShowInputSteps((prev) => ({ ...prev, [stepNum]: true }));
//   };

//   const hideInput = (stepNum) => {
//     setShowInputSteps((prev) => ({ ...prev, [stepNum]: false }));
//   };

//   const [campaignData, setCampaignData] = useState({
//     causeType: "",
//     title: "",
//     goalAmount: 1000,
//     description:
//       "Your gift fuels practical, local solutions across Africa 🌍When you donate, you help provide classroom supplies, teacher support, basic medical care, and training that strengthens community income. Give To Africa invests in community-led projects—from schools and clinics to small business support—so families can build lasting stability. ❤️Choose an amount that works for you; every contribution helps communities move toward long-term self‑sufficiency.",
//     fundraiserOptions: {
//       team: true,
//       solo: true,
//       paid: false,
//     },
//     color: "#f87878",

//     banner: null,
//     bannerFile: null,
//     logo: null,
//     logoFile: null,

//     commonDonation: "",
//     suggestedAmounts: [],
//     taxReceipt: true,
//     customQuestions: [],
//     thankYouEmail: {
//       subject: "",
//       body: "",
//     },
//     fundraiserEmail: "",
//     advanced: {
//       honor: false,
//       cheque: false,
//       notificationEmails: "",
//     },
//   });

//   const buildCampaignPayload = (campaignData) => {
//     return {
//       causeType: campaignData.causeType,
//       title: campaignData.title,
//       goalAmount: campaignData.goalAmount,
//       description: campaignData.description,

//       fundraiserOptions: campaignData.fundraiserOptions,
//       color: campaignData.color,

//       commonDonation: campaignData.commonDonation,
//       suggestedAmounts: campaignData.suggestedAmounts,

//       taxReceipt: campaignData.taxReceipt,
//       customQuestions: campaignData.customQuestions,

//       thankYouEmail: {
//         subject: campaignData.thankYouEmail.subject,
//         body: campaignData.thankYouEmail.body,
//       },

//       fundraiserEmail: campaignData.fundraiserEmail,

//       advanced: {
//         honor: campaignData.advanced.honor,
//         cheque: campaignData.advanced.cheque,
//         notificationEmails: campaignData.advanced.notificationEmails,
//       },
//     };
//   };

//   useEffect(() => {
//     if (!isEditMode || !campaignId) return;

//     const fetchCampaign = async () => {
//       try {
//         setIsLoading(true);
//         setApiError("");

//         const res = await campaignApi.getCampaign(campaignId as string);
//         console.log("res from getCampaign", res);

//         if (!res.success) {
//           console.log("getCampaign error response", res);
//           setApiError(res.message || "Failed to load campaign");
//           return;
//         }

//         const c = res.data;
//         console.log(c, "c ka redldkdkdjdjdjdjdjdjdjd");

//         setCampaignData((prev) => ({
//           ...prev,
//           causeType: c.causeType ?? "",
//           title: c.title ?? "",
//           goalAmount: typeof c.goalAmount === "number" ? c.goalAmount : 1000,
//           description: c.description ?? "",

//           fundraiserOptions: c.fundraiserOptions ?? {
//             team: true,
//             solo: true,
//             paid: false,
//           },

//           color: c.color ?? "#f87878",

//           banner: c.bannerUrl ?? null,
//           bannerFile: null,
//           logo: c.logoUrl ?? null,
//           logoFile: null,

//           commonDonation: c.commonDonation ?? "",
//           suggestedAmounts: c.suggestedAmounts ?? [],

//           taxReceipt:
//             typeof c.taxReceipt === "boolean" ? c.taxReceipt : prev.taxReceipt,

//           customQuestions: c.customQuestions ?? [],

//           thankYouEmail: {
//             subject: c.thankYouEmail?.subject ?? "",
//             body: c.thankYouEmail?.body ?? "",
//           },

//           fundraiserEmail: c.fundraiserEmail ?? "",

//           advanced: {
//             honor: c.advanced?.honor ?? false,
//             cheque: c.advanced?.cheque ?? false,
//             notificationEmails: c.advanced?.notificationEmails ?? "",
//           },
//         }));

//         const openSteps: Record<number, boolean> = {};
//         if (c.goalAmount) openSteps[2] = true;
//         if (c.description) openSteps[3] = true;
//         if (c.customQuestions?.length) openSteps[10] = true;

//         setShowInputSteps((prev) => ({ ...prev, ...openSteps }));
//       } catch (err: any) {
//         console.error(err);
//         setApiError(
//           err?.response?.data?.message ||
//             err?.message ||
//             "Failed to load campaign"
//         );
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchCampaign();
//   }, [campaignId, isEditMode]);

//   if (isEditMode && isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>Loading campaign...</p>
//       </div>
//     );
//   }

//   const submitCampaign = async () => {
//     setIsSubmitting(true);
//     setApiError("");

//     try {
//       const payload = buildCampaignPayload(campaignData);

//       const files = {
//         banner: campaignData.bannerFile || undefined,
//         logo: campaignData.logoFile || undefined,
//       };

//       // 🔥 CREATE
//       if (!isEditMode) {
//         if (!campaignData.bannerFile) {
//           setApiError("Banner file is missing");
//           return false;
//         }

//         await campaignApi.createCampaign(payload, {
//           banner: campaignData.bannerFile,
//           logo: campaignData.logoFile || undefined,
//         });
//       }

//       // 🔥 UPDATE
//       else {
//         await campaignApi.updateCampaign(campaignId, payload, files);
//       }

//       console.log(isEditMode ? "Campaign Updated" : "Campaign Created");
//       return true;
//     } catch (error) {
//       console.error("Campaign error", error);
//       setApiError(
//         error?.response?.data?.message ||
//           error?.message ||
//           "Failed to save campaign"
//       );
//       return false;
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = (stepNum) => {
//     if (stepNum === 2) {
//       setCampaignData((prev) => ({ ...prev, goalAmount: 1000 }));
//     }
//     hideInput(stepNum);
//   };

//   const validateStep = () => {
//     const newErrors = {};

//     switch (step) {
//       case 0:
//         if (!campaignData.causeType) {
//           newErrors.causeType = "Please select a campaign type.";
//         }
//         break;

//       case 1:
//         if (!campaignData.title.trim()) {
//           newErrors.title = "Title is required.";
//         }
//         break;

//       case 2:
//         if (!campaignData.goalAmount || campaignData.goalAmount <= 0) {
//           newErrors.goalAmount = "Please enter a goal greater than 0.";
//         }
//         break;

//       case 3: {
//         const text = campaignData.description
//           ? campaignData.description.replace(/<[^>]*>/g, "").trim()
//           : "";
//         if (!text) {
//           newErrors.description = "Description is required.";
//         }
//         break;
//       }

//       case 5:
//         if (!isEditMode && !campaignData.bannerFile) {
//           newErrors.banner = "Please upload a banner image.";
//         }
//         break;

//       case 6:
//         if (!campaignData.logoFile) {
//           newErrors.logo = "Please upload a logo image.";
//         }
//         break;

//       case 7:
//         if (!campaignData.commonDonation) {
//           newErrors.commonDonation = "Please select a common donation range.";
//         }
//         break;

//       case 9:
//         campaignData.customQuestions.forEach((q, index) => {
//           if (!q.question?.trim()) {
//             newErrors[`customQuestions.${index}.question`] =
//               "Question is required.";
//           }
//         });
//         break;

//       case 10:
//         if (!campaignData.thankYouEmail.subject.trim()) {
//           newErrors.thankYouSubject = "Subject is required.";
//         }
//         {
//           const bodyText = campaignData.thankYouEmail.body
//             ? campaignData.thankYouEmail.body.replace(/<[^>]*>/g, "").trim()
//             : "";
//           if (!bodyText) {
//             newErrors.thankYouBody = "Email body is required.";
//           }
//         }
//         break;

//       default:
//         break;
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleNext = async () => {
//     if (isSuccessStep) {
//       setStep(0);
//       setErrors({});
//       setApiError("");
//       return;
//     }

//     const isValid = validateStep();
//     if (!isValid) return;

//     if (isLastInputStep) {
//       const ok = await submitCampaign();
//       if (ok) {
//         setStep(steps.length - 1);
//         setErrors({});
//       }
//     } else {
//       setStep((prev) => prev + 1);
//       setErrors({});
//       setApiError("");
//     }
//   };

//   const handleBack = () => {
//     if (step === 0) return;
//     setStep((prev) => prev - 1);
//     setErrors({});
//     setApiError("");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Sidebar */}
//       {!isSuccessStep && sidebarOpen && (
//         <div className="fixed inset-0 z-50 flex">
//           <div className="w-72 bg-white border-r p-4 overflow-y-auto">
//             <h2 className="font-semibold mb-4">Jump to edit…</h2>
//             {steps.map((s, i) => (
//               <button
//                 key={i}
//                 onClick={() => {
//                   setStep(i);
//                   setSidebarOpen(false);
//                   setErrors({});
//                   setApiError("");
//                 }}
//                 className="w-full text-left px-3 py-2 rounded mb-1 text-sm border border-gray-200"
//               >
//                 {s}
//               </button>
//             ))}
//           </div>
//           <div
//             className="flex-1 bg-black/40"
//             onClick={() => setSidebarOpen(false)}
//           />
//         </div>
//       )}

//       {/* Main */}
//       <main className="flex-1 px-3 ms:px-8">
//         <div className="flex justify-end my-4">
//           <button
//             onClick={() => setSidebarOpen(true)}
//             className="px-4 py-2 border rounded text-sm"
//           >
//             Edit Cause steps
//           </button>
//         </div>

//         {!isSuccessStep && (
//           <div className="mb-6">
//             <div className="h-3 bg-gray-200 rounded-lg">
//               <div
//                 className="h-3 bg-primary rounded-lg"
//                 style={{ width: `${progress}%` }}
//               />
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="min-h-[75vh] p-4 md:p-8 flex justify-between flex-col">
//             {/* API error show */}
//             {apiError && (
//               <p className="text-red-500 text-sm mb-3">{apiError}</p>
//             )}

//             {renderStep(
//               step,
//               campaignData,
//               setCampaignData,
//               handleDelete,
//               showInputSteps,
//               toggleInput,
//               errors
//             )}

//             <div>
//               <hr />
//               <div className="flex justify-between mt-8">
//                 <button
//                   disabled={step === 0 || isSubmitting}
//                   onClick={handleBack}
//                   className="px-4 py-2 rounded border disabled:opacity-50"
//                 >
//                   Back
//                 </button>
//                 <button
//                   onClick={handleNext}
//                   disabled={isSubmitting}
//                   className="px-6 py-2 rounded bg-primary text-white disabled:opacity-50"
//                 >
//                   {isSubmitting
//                     ? isEditMode
//                       ? "Updating..."
//                       : "Creating..."
//                     : isSuccessStep
//                     ? "Edit Cause"
//                     : isLastInputStep
//                     ? isEditMode
//                       ? "Update Cause"
//                       : "Create Cause"
//                     : "Next"}
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gray-100 h-full flex items-center justify-center text-gray-400">
//             Causes preview
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// const EventIcon = () => (
//   <svg
//     className="w-6 h-6 mx-auto svg-safari-fix"
//     viewBox="0 0 192 192"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path
//       d="M102.7 76.2998H69.5C64.3 76.2998 60 80.5998 60 85.7998V126.5C60 131.7 64.3 136 69.5 136H102.8C108 136 112.3 131.7 112.3 126.5V85.7998C112.3 80.5998 108 76.2998 102.7 76.2998Z"
//       fill="#074C2D"
//     ></path>
//     <path
//       fill-rule="evenodd"
//       clip-rule="evenodd"
//       d="M177.6 86.9996C177.6 89.8996 175.3 92.2996 172.5 92.4996C165.4 92.9996 159.9 99.0996 159.8 106.4C159.8 113.7 165.4 119.8 172.5 120.3C175.4 120.5 177.6 122.9 177.6 125.8V145.2C177.6 153.4 171 160.1 162.8 160.1H28.4C20.3 160.1 13.6 153.4 13.6 145.2V125.8C13.6 122.9 15.9 120.5 18.7 120.3C25.8 119.7 31.4 113.7 31.4 106.4C31.4 99.0996 25.8 92.9996 18.7 92.4996C15.8 92.2996 13.6 89.8996 13.6 86.9996V67.5996C13.6 59.3996 20.2 52.6996 28.4 52.6996L30 52.5L151.9 32.1996C155.7 31.4996 159.6 32.3996 162.7 34.6996C165.9 36.9996 168 40.3996 168.6 44.2996L170.3 54.6996C174.6 57.2996 177.6 62.0996 177.6 67.5996V86.9996ZM158 41.0996C156.6 39.9996 154.8 39.5996 153.1 39.8996L75.5 52.5996H161.9L160.7 45.4996C160.4 43.6996 159.5 42.1996 158 41.0996ZM169.6 145.1V127.9C159.5 126 151.9 116.9 151.9 106.4C151.9 95.7996 159.5 86.7996 169.6 84.8996V67.5996C169.6 63.7996 166.6 60.6996 162.8 60.6996H28.4C24.7 60.6996 21.6 63.7996 21.6 67.5996V84.8996C31.7 86.7996 39.3 95.7996 39.3 106.4C39.3 117 31.7 126 21.6 127.9V145.1C21.6 148.9 24.6 152 28.4 152H162.8C166.5 152 169.6 148.9 169.6 145.1ZM95 94.0996H128.6C130.8 94.0996 132.6 92.2996 132.6 90.0996C132.6 87.8996 130.8 86.0996 128.6 86.0996H95C92.8 86.0996 91 87.8996 91 90.0996C91 92.2996 92.8 94.0996 95 94.0996ZM95 126.5H120.1C122.3 126.5 124 124.7 124 122.5C124 120.3 122.2 118.5 120 118.5H95C92.8 118.5 91 120.3 91 122.5C91 124.7 92.8 126.5 95 126.5ZM128.6 110.3H95C92.8 110.3 91 108.5 91 106.3C91 104.1 92.8 102.3 95 102.3H128.6C130.8 102.3 132.6 104.1 132.6 106.3C132.6 108.5 130.8 110.3 128.6 110.3Z"
//       fill="#0F0E5B"
//     ></path>
//   </svg>
// );

// const DonationIcon = () => (
//   <svg
//     className="w-6 h-6 mx-auto svg-safari-fix"
//     viewBox="0 0 192 192"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path
//       d="M97.36 32.1504C91.48 32.1504 86.67 35.5204 83.37 39.5404C80.07 35.5104 75.26 32.1504 69.38 32.1504C58.74 32.1504 50.08 40.8104 50.08 51.4504C50.08 54.5504 50.83 57.6304 52.26 60.3704C53.09 62.1904 58.1 71.6004 78.94 88.0404C80.19 89.0304 81.68 89.5204 83.18 89.5204C84.68 89.5204 86.17 89.0304 87.42 88.0404C101.81 76.6804 108.75 68.6604 112.02 63.9604C114.01 61.1604 116.65 56.8204 116.65 51.4504C116.65 40.8104 107.99 32.1504 97.35 32.1504H97.36Z"
//       fill="#074C2D"
//     ></path>
//     <path
//       d="M171.91 109.63C171.62 107.39 170.41 104.14 166.35 101.37C158.16 95.7904 151.85 99.2604 149.52 102.01L134.59 117.54C133.94 115.14 132.74 113.06 130.99 111.39C126.1 106.73 118.91 106.93 118.1 106.96L115.95 107.06C114.09 107.08 110.35 107.08 102.88 106.95C96.51 106.84 94.44 105.09 91.81 102.87C88.66 100.21 84.75 96.9004 75.02 96.9004C63.71 96.9004 56.4 100.61 52.45 103.47C49.14 100.2 44.6 98.1804 39.6 98.1804H31.12C25.19 98.1804 20.36 103.01 20.36 108.94V148.61C20.36 154.59 25.65 160.03 31.47 160.03H39.95C44.54 160.03 48.71 158.19 51.89 155.19C56.52 157.1 65.89 159.81 81.74 159.81H126.75C127.25 159.81 139.11 159.63 151.13 143.66L169.13 118.75C169.84 117.87 172.5 114.21 171.9 109.61L171.91 109.63ZM39.96 152.05H31.48C30.03 152.05 28.37 150.23 28.37 148.63V108.96C28.37 107.44 29.61 106.2 31.13 106.2H39.61C45.28 106.2 49.9 110.82 49.9 116.49V141.1C49.9 147.04 45.35 152.05 39.96 152.05ZM162.94 113.71L144.7 138.93C135.32 151.38 127.03 151.82 126.75 151.83H81.74C68.71 151.83 60.73 149.89 56.5 148.41C57.39 146.16 57.89 143.69 57.89 141.1V116.49C57.89 114.29 57.48 112.18 56.76 110.23C59.41 108.19 65.19 104.93 75.02 104.93C81.82 104.93 83.95 106.73 86.65 109.01C89.72 111.6 93.53 114.83 102.75 114.98C109.08 115.09 113.61 115.12 116.23 115.08C116.99 115.08 117.75 115.06 118.45 114.97C119.72 114.93 123.44 115.24 125.48 117.22C126.59 118.29 127.13 119.8 127.13 121.84C127.13 124.25 126.64 125.68 125.95 126.54L125.58 126.92C124.8 127.6 123.86 127.74 123.04 127.74H91.53C89.32 127.74 87.53 129.53 87.53 131.74C87.53 133.95 89.32 135.74 91.53 135.74H123.04C125.58 135.74 128.31 134.97 130.54 133.18C130.77 133.03 130.98 132.85 131.18 132.64L155.38 107.46L155.59 107.23C156.13 106.68 158 105.38 161.84 107.99C163.12 108.87 163.84 109.76 163.97 110.65C164.15 111.9 163.24 113.35 162.94 113.72V113.71Z"
//       fill="#0F0E5B"
//     ></path>
//     <path
//       d="M102.33 87.7605C103.54 88.7105 104.98 89.1905 106.42 89.1905C107.86 89.1905 109.31 88.7105 110.52 87.7605C124.99 76.3405 131.96 68.2805 135.23 63.5705C137.21 60.7805 139.85 56.4605 139.85 51.1305C139.85 40.5705 131.26 31.9805 120.7 31.9805C114.75 31.9805 109.89 35.4705 106.61 39.5905C103.33 35.4705 98.48 31.9805 92.53 31.9805C81.97 31.9805 73.38 40.5705 73.38 51.1305C73.38 54.2105 74.13 57.2605 75.55 59.9805C76.36 61.7605 81.34 71.1805 102.34 87.7505L102.33 87.7605ZM92.52 39.9805C96.76 39.9805 100.66 44.1205 102.49 47.9805C103.24 49.5605 104.86 50.5805 106.61 50.5805C108.36 50.5805 109.98 49.5605 110.73 47.9705C112.56 44.1205 116.46 39.9805 120.69 39.9805C126.84 39.9805 131.84 44.9805 131.84 51.1305C131.84 53.4705 130.87 55.8805 128.68 58.9705C126.28 62.4205 120.23 69.8005 106.42 80.8005C86.78 65.1505 82.85 56.7505 82.84 56.7205L82.67 56.3705C81.81 54.7505 81.37 52.9905 81.37 51.1405C81.37 44.9905 86.37 39.9905 92.52 39.9905V39.9805Z"
//       fill="#0F0E5B"
//     ></path>
//   </svg>
// );

// const PeerIcon = () => (
//   <svg
//     className="w-6 h-6 mx-auto svg-safari-fix"
//     viewBox="0 0 192 192"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path
//       fill-rule="evenodd"
//       clip-rule="evenodd"
//       d="M156.9 127.8L110.8 111.6C106.4 110 103.4 105.8 103.4 101.2V79.0998C103.4 74.3998 106.4 70.2998 110.8 68.6998L156.9 52.4998C164.1 49.9998 171.6 55.2998 171.6 62.8998V117.4C171.6 125 164.1 130.3 156.9 127.8Z"
//       fill="#074C2D"
//     ></path>
//     <path
//       d="M152.3 34.7C148.8 32.2 144.2 31.5 140.1 32.9L47.5 65H21.1C13.7 65 7.69995 71 7.69995 78.4V101.7C7.69995 108.7 13 114.4 19.9 115.1L26 149C27.2 155.3 32.8 159.9 39.2 159.9H45C49 159.9 52.8 158.1 55.4 155C58 151.9 59 147.9 58.2 144L53.2999 117.2L140.1 147.3C141.5 147.8 143 148 144.5 148C147.3 148 150 147.2 152.3 145.5C155.8 143 157.9 138.9 157.9 134.6V45.6C157.9 41.3 155.8 37.2 152.3 34.7ZM52.0999 71.9L129.3 45.1V135L52.0999 108.2V71.9ZM15.6 101.7V78.4C15.6 75.4 18 73 21 73H44.0999V107.1H21.1C18.1 107.1 15.6 104.7 15.6 101.7ZM49.0999 149.9C48.0999 151.2 46.5 151.9 44.9 151.9H39.0999C36.4999 151.9 34.2999 150 33.7999 147.5L27.9 115.1H44.7999L50.2999 145.4C50.5999 147 50.1999 148.7 49.0999 149.9ZM149.9 134.5C149.9 136.3 149.1 137.9 147.6 138.9C146.1 139.9 144.3 140.2 142.7 139.6L137.4 137.7V42.3L142.7 40.5C144.4 39.9 146.2 40.2 147.6 41.2C149.1 42.2 149.9 43.8 149.9 45.6V134.5Z"
//       fill="#0F0E5B"
//     ></path>
//   </svg>
// );

// const ShopIcon = () => (
//   <svg
//     className="w-6 h-6 mx-auto svg-safari-fix"
//     viewBox="0 0 192 192"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path
//       fill-rule="evenodd"
//       clip-rule="evenodd"
//       d="M14.2 123.5H76.3C81.7 123.5 86.1 119.1 86.1 113.7V90.3C86.1 84.9 81.7 80.5 76.3 80.5H14.2C8.80002 80.5 4.40002 84.9 4.40002 90.3V113.7C4.40002 119.1 8.80002 123.5 14.2 123.5Z"
//       fill="#074C2D"
//     ></path>
//     <path
//       d="M169.9 55.3002L157.6 34.1002C154.8 29.2002 149.5 26.2002 143.8 26.2002H53.5C47.9 26.2002 42.6 29.2002 39.8 34.1002L27.3 55.3002C25.9 57.7002 25.1 60.5002 25.1 63.4002V150.3C25.1 159.1 32.2 166.2 41 166.2H156.1C164.9 166.2 172 159.1 172 150.3V63.3002C172 60.5002 171.3 57.7002 169.9 55.3002ZM150.7 38.1002L162 57.5002H136L131 34.1002H143.9C146.6 34.2002 149.2 35.7002 150.7 38.1002ZM127.8 57.5002H103V34.2002H122.8L127.8 57.5002ZM75.1 34.2002H95V57.6002H69.2L75.1 34.2002ZM46.7 38.1002C48.1 35.7002 50.7 34.2002 53.5 34.2002H66.9L61 57.5002H35.2L46.7 38.1002ZM144.3 158.1H115.4V116.1C115.4 112 118.7 108.7 122.8 108.7H136.9C141 108.7 144.3 112 144.3 116.1V158.1ZM156.1 158.1H152.3V116.2C152.3 107.7 145.4 100.8 136.9 100.8H122.8C114.3 100.8 107.4 107.7 107.4 116.2V158.2H41C36.6 158.2 33.1 154.7 33.1 150.3V65.5002H164V150.1C164 154.5 160.5 158.1 156.1 158.1Z"
//       fill="#0F0E5B"
//     ></path>
//   </svg>
// );

// const RaffleIcon = () => (
//   <svg
//     className="w-6 h-6 mx-auto svg-safari-fix"
//     viewBox="0 0 192 192"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path
//       d="M93 76.7007L31.6 49.8007C26.1 47.2007 19.7 51.2007 19.6 57.3007V111.901C19.6 118.001 26.1 122.101 31.6 119.301L93.1 91.6007C99.3 88.5007 99.2 79.7007 93 76.7007Z"
//       fill="#074C2D"
//     ></path>
//     <path
//       fill-rule="evenodd"
//       clip-rule="evenodd"
//       d="M171.6 83.9004C171.6 105.8 160.5 125.2 143.7 136.7L157.4 150.7C161 154.3 162.1 159.6 160.1 164.3C158.2 169 153.7 172 148.6 172L66.4 172.1C61.3 172.1 56.9 169.1 54.9 164.4C52.9 159.7 54 154.4 57.6 150.8L71.5 136.9C61.5 130 53.4 120.3 48.6 108.9C48.55 108.85 48.525 108.775 48.5 108.7C48.475 108.625 48.45 108.55 48.4 108.5C48.4 108.45 48.375 108.375 48.35 108.3C48.325 108.225 48.3 108.15 48.3 108.1C45.3 100.7 43.6 92.5004 43.6 84.0004C43.6 75.6004 45.3 67.6004 48.2 60.3004C48.2 60.0004 48.3 59.7004 48.4 59.5004L48.7 58.9004C58.5 36.0004 81.2 19.9004 107.6 19.9004C142.9 19.9004 171.6 48.6004 171.6 83.9004ZM127.3 121.1L132.7 134C143.4 128.6 152.2 119.8 157.6 109.1L144.7 103.7C140.8 111.1 134.7 117.2 127.3 121.1ZM54.5 66.3004C52.6 71.8004 51.6 77.7004 51.6 83.9004C51.6 90.1004 52.7 96.0004 54.6 101.7L67.5 96.4004C66.3 92.4004 65.6 88.3004 65.6 84.0004C65.6 79.7004 66.2 75.6004 67.4 71.7004L54.5 66.3004ZM94.3 52.6004C82.2 57.7004 73.6 69.8004 73.6 83.9004C73.6 102.7 88.8 118 107.8 118C121.8 118 133.9 109.5 139.1 97.4004C139.1 97.3004 139.1 97.1004 139.2 97.0004C139.2 96.9004 139.3 96.7004 139.4 96.6004C140.9 92.6004 141.8 88.4004 141.8 83.9004C141.8 79.4004 140.9 75.1004 139.3 71.2004C139.3 71.2004 139.2 71.1004 139.2 71.0004C139.1 70.9004 139.1 70.8004 139.1 70.7004C135.6 62.7004 129.2 56.2004 121.1 52.7004C120.983 52.7004 120.9 52.6661 120.831 52.6376C120.783 52.6175 120.741 52.6004 120.7 52.6004C120.65 52.5504 120.6 52.5254 120.55 52.5004C120.5 52.4754 120.45 52.4504 120.4 52.4004C116.5 50.8004 112.2 49.9004 107.7 49.9004C103.1 49.9004 98.8 50.8004 94.8 52.4004C94.75 52.4004 94.725 52.4254 94.7 52.4504C94.675 52.4754 94.65 52.5004 94.6 52.5004C94.5 52.6004 94.4 52.6004 94.3 52.6004ZM160.7 101.6C162.6 96.0004 163.6 90.1004 163.6 83.9004C163.6 77.7004 162.6 71.8004 160.8 66.2004L147.9 71.6004C149.1 75.5004 149.7 79.6004 149.7 83.9004C149.7 88.2004 149 92.4004 147.8 96.3004L160.7 101.6ZM119.9 124.2C116 125.4 111.9 126 107.6 126C103.3 126 99.2 125.3 95.3 124.2L90 137.1C95.6 139 101.5 140 107.7 140C113.8 140 119.7 138.9 125.3 137.1L119.9 124.2ZM144.8 64.3004L157.7 58.9004C152.3 48.1004 143.5 39.3004 132.8 33.9004L127.4 46.8004C134.8 50.8004 140.9 56.9004 144.8 64.3004ZM120 43.7004L125.3 30.8004C119.7 28.9004 113.8 27.9004 107.7 28.0004C101.5 28.0004 95.6 29.0004 90 30.9004L95.3 43.8004C99.3 42.6004 103.4 41.9004 107.7 41.9004C112 41.9004 116.1 42.5004 120 43.7004ZM87.9 46.8004L82.5 33.9004C71.8 39.3004 63 48.1004 57.6 58.8004L70.5 64.2004C74.4 56.8004 80.5 50.7004 87.9 46.8004ZM70.5 103.6L57.6 109C63 119.8 71.8 128.5 82.6 134L87.9 121C80.5 117.1 74.4 111 70.5 103.6ZM148.8 163.9C151.5 163.9 152.6 161.7 152.9 161.1L152.907 161.078C153.119 160.446 153.876 158.177 151.9 156.2L136.6 140.9L136.6 140.9C135.2 141.6 133.8 142.3 132.4 142.9C132.359 142.9 132.249 142.952 132.12 143.012C131.937 143.097 131.717 143.2 131.6 143.2C124.2 146.2 116.1 147.9 107.6 147.9C99.1 147.9 91.1 146.3 83.7 143.3C83.5 143.3 82.8 143 82.7 142.9C81.3 142.3 80 141.7 78.7 141L63.4 156.3C61.4 158.3 62.1 160.6 62.4 161.2C62.6 161.9 63.7 164 66.5 164L148.8 163.9ZM125.5 83.9C125.5 93.8 117.5 101.8 107.6 101.8C97.8 101.8 89.7 93.8 89.7 83.9C89.7 74 97.7 66 107.6 66C117.5 66 125.5 74 125.5 83.9ZM117.5 83.9C117.5 78.4 113 74 107.6 74C102.2 74 97.7 78.4 97.7 83.9C97.7 89.4 102.1 93.8 107.6 93.8C113.1 93.8 117.5 89.4 117.5 83.9Z"
//       fill="#0F0E5B"
//     ></path>
//   </svg>
// );

// const MembershipIcon = () => (
//   <svg
//     className="w-6 h-6 mx-auto svg-safari-fix"
//     viewBox="0 0 192 192"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path
//       fill-rule="evenodd"
//       clip-rule="evenodd"
//       d="M47.8 57H144.5C149.9 57 154.3 52.6 154.3 47.1V30.8C154.3 25.4 149.9 21 144.5 21H47.8C42.4 21 38 25.4 38 30.8V47.2C38 52.6 42.4 57 47.8 57Z"
//       fill="#074C2D"
//     ></path>
//     <path
//       fill-rule="evenodd"
//       clip-rule="evenodd"
//       d="M167.3 160.5H24.4C15.4 160.5 8 153.1 8 144.1V54.1998C8 45.1998 15.4 37.7998 24.4 37.7998H167.3C176.3 37.7998 183.7 45.1998 183.7 54.1998V144.1C183.7 153.1 176.3 160.5 167.3 160.5ZM24.4 45.7998C19.8 45.7998 16 49.5998 16 54.1998V144.1C16 148.7 19.8 152.5 24.4 152.5H167.3C171.9 152.5 175.7 148.7 175.7 144.1V54.1998C175.7 49.5998 171.9 45.7998 167.3 45.7998H24.4ZM118.5 92.2998H156C158.2 92.2998 160 90.4998 160 88.2998C160 86.0998 158.2 84.2998 156 84.2998H118.5C116.3 84.2998 114.5 86.0998 114.5 88.2998C114.5 90.4998 116.3 92.2998 118.5 92.2998ZM156 108.3H118.5C116.3 108.3 114.5 106.5 114.5 104.3C114.5 102.1 116.3 100.3 118.5 100.3H156C158.2 100.3 160 102.1 160 104.3C160 106.5 158.2 108.3 156 108.3ZM139.5 124.3H118.5C116.3 124.3 114.5 122.5 114.5 120.3C114.5 118.1 116.3 116.3 118.5 116.3H139.5C141.7 116.3 143.5 118.1 143.5 120.3C143.5 122.5 141.8 124.3 139.5 124.3ZM59.7 131.5C60.9 132.4 62.3999 132.9 63.7999 132.9C65.2999 132.9 66.7 132.5 68 131.4C82.5 120 89.3999 111.9 92.7 107.2C94.7 104.4 97.3 100.1 97.3 94.7996C97.3 84.1996 88.7 75.5996 78.0999 75.5996C72.0999 75.5996 67.2999 79.0996 64 83.1996C60.7 79.0996 55.9 75.5996 49.9 75.5996C39.3 75.5996 30.7 84.1996 30.7 94.7996C30.7 97.8996 31.5 101 32.9 103.7C33.7 105.5 38.7 114.9 59.7 131.5ZM38.7 94.8996C38.7 88.6996 43.7 83.6996 49.9 83.6996C54.2 83.6996 58.1 87.8996 59.9 91.7996C60.6 93.3996 62.2999 94.3996 64 94.3996C65.7 94.3996 67.2999 93.3996 68.0999 91.7996C70 87.8996 73.8999 83.7996 78.0999 83.7996C84.2999 83.7996 89.3 88.7996 89.3 94.9996C89.3 97.2996 88.2999 99.6996 86.0999 102.8C83.7 106.2 77.5999 113.6 63.7999 124.6C44.0999 108.9 40.2 100.5 40.2 100.5L40 100.1C39.1 98.4996 38.7 96.6996 38.7 94.8996Z"
//       fill="#0F0E5B"
//     ></path>
//   </svg>
// );

// const AuctionIcon = () => (
//   <svg
//     className="w-6 h-6 mx-auto svg-safari-fix"
//     viewBox="0 0 192 192"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <g clip-path="url(#clip0_7164_1781)">
//       <path
//         d="M147.938 105H32.2566C28.2144 105 24.9375 108.277 24.9375 112.319V134.169C24.9375 138.211 28.2144 141.488 32.2566 141.488H147.938C151.98 141.488 155.257 138.211 155.257 134.169V112.319C155.257 108.277 151.98 105 147.938 105Z"
//         fill="#074C2D"
//       ></path>
//       <path
//         d="M82.8183 160.147H24.8473C21.5287 160.147 18.8317 157.45 18.8317 154.131V150.532C18.8317 145.228 23.1429 140.917 28.4467 140.917H79.2289C84.5328 140.917 88.844 145.228 88.844 150.532V154.131C88.844 157.45 86.147 160.147 82.8283 160.147H82.8183ZM26.8526 152.126H80.8131V150.532C80.8131 149.65 80.1012 148.938 79.2189 148.938H28.4467C27.5644 148.938 26.8526 149.65 26.8526 150.532V152.126Z"
//         fill="#0F0E5B"
//       ></path>
//       <path
//         d="M67.2477 109.556C64.1998 109.556 61.1518 108.392 58.8358 106.076L35.8961 83.1367C33.6502 80.8909 32.407 77.9031 32.407 74.7248C32.407 71.5465 33.6402 68.5588 35.8961 66.3129C40.5382 61.6809 48.0778 61.6809 52.7199 66.3129L75.6596 89.2526C77.9055 91.4985 79.1487 94.4863 79.1487 97.6646C79.1487 100.843 77.9155 103.831 75.6596 106.076C73.3436 108.392 70.2957 109.556 67.2477 109.556ZM44.308 70.8547C43.3154 70.8547 42.3228 71.2357 41.5708 71.9877C40.8389 72.7196 40.4379 73.6921 40.4379 74.7248C40.4379 75.7575 40.8389 76.73 41.5708 77.462L64.5106 100.402C66.0245 101.916 68.4809 101.916 69.9848 100.402C70.7167 99.6698 71.1178 98.6973 71.1178 97.6646C71.1178 96.6319 70.7167 95.6593 69.9848 94.9274L47.0451 71.9877C46.2931 71.2357 45.3006 70.8547 44.308 70.8547Z"
//         fill="#0F0E5B"
//       ></path>
//       <path
//         d="M90.2677 97.8346C87.6308 97.8346 84.9839 96.832 82.9787 94.8168L80.7429 92.5809C76.7224 88.5605 76.7224 82.0134 80.7429 77.9929L93.6164 65.1194C95.5615 63.1744 98.1582 62.1016 100.905 62.1016C103.653 62.1016 106.249 63.1744 108.194 65.1194L110.43 67.3552C114.451 71.3757 114.451 77.9228 110.43 81.9432L97.5567 94.8168C95.5515 96.832 92.9046 97.8346 90.2677 97.8346ZM100.905 70.1225C100.294 70.1225 99.7223 70.3631 99.2812 70.7942L86.4076 83.6677C85.5153 84.56 85.5153 86.0138 86.4076 86.9062L88.6435 89.142C89.5358 90.0343 90.9896 90.0343 91.8819 89.142L104.755 76.2685C105.648 75.3761 105.648 73.9223 104.755 73.03L102.52 70.7942C102.088 70.3631 101.517 70.1225 100.895 70.1225H100.905Z"
//         fill="#0F0E5B"
//       ></path>
//       <path
//         d="M72.5716 97.5038L44.4684 69.4006L85.024 28.835L113.127 56.9381L72.5616 97.5038H72.5716ZM55.8079 69.4006L72.5716 86.1643L101.788 56.9482L85.024 40.1845L55.8079 69.4006Z"
//         fill="#0F0E5B"
//       ></path>
//       <path
//         d="M113.288 63.5155C110.24 63.5155 107.192 62.3525 104.876 60.0364L81.936 37.0967C77.3039 32.4646 77.3039 24.915 81.936 20.2729C86.5781 15.6408 94.1177 15.6408 98.7598 20.2729L121.7 43.2126C126.342 47.8447 126.342 55.3943 121.7 60.0364C119.383 62.3525 116.336 63.5155 113.288 63.5155ZM90.3479 24.8147C89.3553 24.8147 88.3627 25.1957 87.6107 25.9477C86.0968 27.4616 86.0968 29.918 87.6107 31.4219L110.55 54.3616C112.064 55.8756 114.521 55.8756 116.025 54.3616C117.529 52.8477 117.539 50.3913 116.025 48.8874L93.085 25.9477C92.333 25.1957 91.3405 24.8147 90.3479 24.8147Z"
//         fill="#0F0E5B"
//       ></path>
//       <path
//         d="M159.087 155.605C156.069 155.605 153.222 154.432 151.086 152.297L89.9167 91.1275L106.741 74.3037L167.91 135.473C172.321 139.884 172.321 147.053 167.91 151.465L167.078 152.297C164.942 154.432 162.105 155.605 159.087 155.605ZM101.256 91.1175L156.761 146.622C158.004 147.865 160.17 147.865 161.413 146.622L162.245 145.8C163.528 144.517 163.528 142.431 162.245 141.148L106.741 85.6432L101.266 91.1175H101.256Z"
//         fill="#0F0E5B"
//       ></path>
//     </g>
//     <defs>
//       <clipPath id="clip0_7164_1781">
//         <rect width="192" height="192" fill="white"></rect>
//       </clipPath>
//     </defs>
//   </svg>
// );

// const OtherIcon = () => (
//   <svg
//     className="w-6 h-6 mx-auto svg-safari-fix"
//     viewBox="0 0 192 192"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path
//       fill-rule="evenodd"
//       clip-rule="evenodd"
//       d="M55.6434 49.4263L143.417 137.199C145.705 139.488 145.705 143.198 143.417 145.487L122.012 166.891C119.724 169.179 116.014 169.179 113.725 166.891L25.952 79.1177C23.6635 76.8293 23.6635 73.1189 25.9519 70.8304L47.3561 49.4263C49.6445 47.1378 53.3549 47.1378 55.6434 49.4263Z"
//       fill="#074C2D"
//     ></path>
//     <path
//       d="M130.76 96.7602L152.73 74.7902L152.75 74.8102L164.54 62.9802C174.15 53.3702 174.7 38.1602 165.78 28.3602C161.16 23.2902 154.85 20.4002 148.01 20.2402C141.18 20.0802 134.73 22.6602 129.89 27.5002L126.78 30.6102L95.7 61.6902L57.08 23.0802C55.04 21.0402 52.32 19.9102 49.43 19.9102C46.54 19.9102 43.82 21.0302 41.78 23.0802L22.82 42.0402C18.6 46.2602 18.6 53.1202 22.82 57.3402L61.43 95.9501L34.01 123.37C31.66 125.72 29.92 128.65 28.98 131.83L20.98 158.98C19.94 162.51 20.91 166.33 23.51 168.93C25.42 170.84 27.99 171.88 30.62 171.88C31.57 171.88 32.53 171.75 33.46 171.47L60.61 163.47C63.8 162.53 66.72 160.79 69.07 158.44L96.49 131.02L134.31 168.85C136.42 170.96 139.19 172.01 141.96 172.01C144.73 172.01 147.5 170.96 149.61 168.85L168.57 149.89C170.61 147.85 171.74 145.13 171.74 142.24C171.74 139.35 170.62 136.63 168.57 134.59L130.75 96.7702L130.76 96.7602ZM135.54 33.1602C138.82 29.8802 143.18 28.1402 147.82 28.2502C152.45 28.3602 156.73 30.3102 159.86 33.7602C165.8 40.2802 165.36 50.8602 158.88 57.3402L156.2 60.0302L132.44 36.2702L135.55 33.1602H135.54ZM28.48 51.6802C27.38 50.5802 27.38 48.7902 28.48 47.6902L47.44 28.7302C48.51 27.6702 50.36 27.6702 51.43 28.7302L57.19 34.4902L47 44.6802C45.53 46.1502 45.53 48.5402 47 50.0102C47.74 50.7502 48.7 51.1102 49.67 51.1102C50.64 51.1102 51.6 50.7402 52.34 50.0102L62.53 39.8202L67.38 44.6702L60.02 52.0302C58.55 53.5002 58.55 55.8902 60.02 57.3602C60.76 58.1002 61.72 58.4702 62.69 58.4702C63.66 58.4702 64.62 58.1002 65.36 57.3702L72.72 50.0102L77.57 54.8602L67.38 65.0502C65.91 66.5202 65.91 68.9102 67.38 70.3802C68.12 71.1202 69.08 71.4802 70.05 71.4802C71.02 71.4802 71.98 71.1102 72.72 70.3802L82.91 60.1902L90.06 67.3402L67.11 90.2902L28.48 51.6802ZM31.21 163.8C30.16 164.11 29.44 163.54 29.18 163.28C28.92 163.02 28.35 162.3 28.66 161.25L36.66 134.1C36.72 133.88 36.82 133.68 36.89 133.47L58.99 155.57C58.78 155.65 58.57 155.74 58.36 155.8L31.21 163.8ZM65.47 150.74L41.72 126.99L126.77 41.9202L150.52 65.6702L65.46 150.73L65.47 150.74ZM162.93 144.23L143.97 163.19C142.87 164.29 141.08 164.29 139.98 163.19L102.16 125.37L125.11 102.42L132.23 109.54L122.04 119.73C120.57 121.2 120.57 123.59 122.04 125.06C122.78 125.8 123.74 126.16 124.71 126.16C125.68 126.16 126.64 125.79 127.38 125.06L137.57 114.87L142.42 119.72L135.06 127.08C133.59 128.55 133.59 130.94 135.06 132.41C135.8 133.15 136.76 133.51 137.73 133.51C138.7 133.51 139.66 133.14 140.4 132.41L147.76 125.05L152.61 129.9L142.42 140.09C140.95 141.56 140.95 143.95 142.42 145.42C143.16 146.16 144.12 146.52 145.09 146.52C146.06 146.52 147.02 146.15 147.76 145.42L157.95 135.23L162.95 140.23C163.48 140.76 163.78 141.47 163.78 142.22C163.78 142.97 163.49 143.68 162.95 144.21L162.93 144.23Z"
//       fill="#0F0E5B"
//     ></path>
//   </svg>
// );

// const campaignTypes = [
//   { title: "Event", icon: <EventIcon /> },
//   { title: "Donation", icon: <DonationIcon /> },
//   { title: "Peer-to-peer", icon: <PeerIcon /> },
//   { title: "Online shop", icon: <ShopIcon /> },
//   { title: "Raffle", icon: <RaffleIcon /> },
//   { title: "Membership", icon: <MembershipIcon /> },
//   { title: "Auction", icon: <AuctionIcon /> },
//   { title: "Other sales", icon: <OtherIcon /> },
// ];

// function renderStep(
//   step,
//   campaignData,
//   setCampaignData,
//   handleDelete,
//   showInputSteps,
//   toggleInput,
//   errors
// ) {
//   const handleBannerChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const previewUrl = URL.createObjectURL(file);
//       setCampaignData((prev) => ({
//         ...prev,
//         banner: previewUrl,
//         bannerFile: file,
//       }));
//     }
//   };

//   const handleDeleteBanner = () => {
//     setCampaignData((prev) => ({
//       ...prev,
//       banner: null,
//       bannerFile: null,
//     }));
//   };

//   const handleLogoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const previewUrl = URL.createObjectURL(file);
//       setCampaignData((prev) => ({
//         ...prev,
//         logo: previewUrl,
//         logoFile: file,
//       }));
//     }
//   };

//   const handleDeletelogo = () => {
//     setCampaignData((prev) => ({
//       ...prev,
//       logo: null,
//       logoFile: null,
//     }));
//   };

//   switch (step) {
//     case 0:
//       return (
//         <div>
//           <h1 className="text-2xl font-semibold mb-2">
//             What causes do you want to create?
//           </h1>
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
//             {campaignTypes.map((item) => {
//               const active = campaignData.causeType === item.title;

//               return (
//                 <button
//                   key={item.title}
//                   onClick={() =>
//                     setCampaignData((prev) => ({
//                       ...prev,
//                       causeType: item.title,
//                     }))
//                   }
//                   className={`border rounded-xl p-4 text-center transition flex justify-center items-center gap-4
//           ${active ? "border-primary bg-primary/10" : "hover:border-primary"}
//         `}
//                 >
//                   <div className="flex justify-center items-center">
//                     {item.icon}
//                   </div>
//                   <p className="font-medium">{item.title}</p>
//                 </button>
//               );
//             })}
//           </div>
//           {errors.causeType && (
//             <p className="text-red-500 text-sm my-2">{errors.causeType}</p>
//           )}
//         </div>
//       );

//     case 1:
//       return (
//         <div>
//           <h1 className="text-xl font-semibold mb-4">Title your causes</h1>
//           <label htmlFor="cause-title" className="py-2 block">
//             Title
//           </label>
//           <input
//             id="cause-title"
//             className="w-full border rounded-lg p-2"
//             placeholder="Causes title"
//             value={campaignData.title}
//             onChange={(e) =>
//               setCampaignData((prev) => ({ ...prev, title: e.target.value }))
//             }
//           />
//           {errors.title && (
//             <p className="text-red-500 text-sm mt-1">{errors.title}</p>
//           )}
//         </div>
//       );

//     case 2: {
//       const showInput = showInputSteps[step] || false;
//       return (
//         <div>
//           <h1 className="text-xl font-semibold mb-4">Set a fundraising goal</h1>
//           <p className="pb-2">
//             Causes with a thermometer raise more money, and donors love watching
//             the progress towards reaching your goal!
//           </p>
//           <div className="w-full">
//             {!showInput ? (
//               <button
//                 onClick={() => toggleInput(step)}
//                 className="flex gap-2 px-4 py-2 mt-3 bg-transparent text-primary border border-dotted border-2 hover:bg-primary hover:text-white border-primary rounded-lg"
//               >
//                 <Plus /> Add a fundraising goal
//               </button>
//             ) : (
//               <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg flex-col">
//                 <div className="flex justify-between items-center w-full">
//                   <label htmlFor="">Target</label>
//                   <button
//                     onClick={() => handleDelete(step)}
//                     className="px-4 py-2"
//                   >
//                     <LucideDelete />
//                   </button>
//                 </div>
//                 <div className="relative w-full">
//                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
//                     $
//                   </span>

//                   <input
//                     type="number"
//                     className="w-full border rounded-lg pl-7 pr-3 py-2 focus:outline-none"
//                     value={campaignData.goalAmount}
//                     onChange={(e) =>
//                       setCampaignData((prev) => ({
//                         ...prev,
//                         goalAmount: Number(e.target.value),
//                       }))
//                     }
//                   />
//                 </div>
//                 {errors.goalAmount && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.goalAmount}
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       );
//     }

//     case 3: {
//       const showInputDesc = showInputSteps[step] || false;
//       return (
//         <div>
//           <h1 className="text-xl font-semibold mb-4">
//             Share more about your mission
//           </h1>
//           <p className="mt-0 mb-2 pt-0">
//             Share what makes your cause special and inspire supporters to give.
//           </p>
//           {showInputDesc ? (
//             <div className="bg-gray-100 p-3 rounded-lg">
//               <div className="flex justify-between items-center w-full">
//                 <label htmlFor="">Description</label>
//                 <button
//                   onClick={() => handleDelete(step)}
//                   className="px-4 py-2"
//                 >
//                   <LucideDelete />
//                 </button>
//               </div>
//               <ReactQuill
//                 theme="snow"
//                 value={campaignData.description}
//                 onChange={(value) =>
//                   setCampaignData((prev) => ({
//                     ...prev,
//                     description: value,
//                   }))
//                 }
//                 modules={quillModules}
//                 formats={quillFormats}
//                 placeholder="Write your description…"
//                 className="bg-white rounded-lg border-none"
//               />
//               {errors.description && (
//                 <p className="text-red-500 text-sm mt-2">
//                   {errors.description}
//                 </p>
//               )}
//             </div>
//           ) : (
//             <>
//               <button
//                 onClick={() => toggleInput(step)}
//                 className="flex gap-2 px-4 py-2 mt-3 bg-transparent text-primary border border-dotted border-2 hover:bg-primary hover:text-white border-primary rounded-lg"
//               >
//                 <Plus /> Add a Description
//               </button>
//               {errors.description && (
//                 <p className="text-red-500 text-sm mt-2">
//                   {errors.description}
//                 </p>
//               )}
//             </>
//           )}
//         </div>
//       );
//     }

//     case 4:
//       return (
//         <div>
//           <h1 className="text-xl font-semibold mb-4">
//             Set the color of your cause
//           </h1>
//           <div className="p-4 bg-gray-100 rounded-lg">
//             <label className="block text-md font-medium mb-3">
//               Select a color
//             </label>

//             <div className="flex flex-wrap gap-3">
//               {colors.map((color, index) => {
//                 const isGradient = color.includes("gradient");

//                 return (
//                   <button
//                     key={index}
//                     onClick={() =>
//                       setCampaignData((prev) => ({ ...prev, color }))
//                     }
//                     className={`w-10 h-10 rounded-md border cursor-pointer
//             ${
//               campaignData.color === color
//                 ? "ring-2 ring-primary"
//                 : "hover:ring-2 hover:ring-gray-300"
//             }`}
//                     style={{
//                       background: isGradient ? color : undefined,
//                       backgroundColor: !isGradient ? color : undefined,
//                     }}
//                   />
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       );

//     case 5:
//       return (
//         <>

//           <div className="flex flex-col gap-4 ">
//             <label className="text-xl font-semibold">Add a banner</label>
//             <div className="w-full bg-gray-100 p-5 rounded-lg">
//               <label className="font-semibold text-lg pb-2">Banner</label>
//             <div
//               className="relative w-full border-2 mt-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition"
//               onClick={() => document.getElementById("bannerInput").click()}
//             >
//               <input
//                 type="file"
//                 id="bannerInput"
//                 accept="image/*"
//                 onChange={handleBannerChange}
//                 className="hidden"
//               />
//               {!campaignData.banner ? (
//                 <>
//                   <div className="text-gray-400 flex flex-col items-center gap-2">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-12 w-12"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M3 15a4 4 0 014-4h1a1 1 0 011 1v1a4 4 0 004 4h4a4 4 0 004-4v-1a1 1 0 011-1h1a4 4 0 014 4v4a4 4 0 01-4 4H7a4 4 0 01-4-4v-4z"
//                       />
//                     </svg>
//                     <p className="text-gray-600 text-center">
//                       Click or drag banner to upload
//                     </p>
//                   </div>
//                   {errors.banner && (
//                     <p className="text-red-500 text-sm mt-2">{errors.banner}</p>
//                   )}
//                 </>
//               ) : (
//                 <div className="relative w-full">
//                   <img
//                     src={campaignData.banner}
//                     alt="Banner Preview"
//                     className="w-full h-60 object-cover rounded"
//                   />
//                   <button
//                     onClick={handleDeleteBanner}
//                     className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
//                   >
//                     <LucideDelete size={16} />
//                   </button>
//                 </div>
//               )}
//             </div>
//             </div>
//           </div>
//         </>
//       );

//     case 6:
//       return (
//         <div className="flex flex-col gap-4">
//           <label className="font-semibold text-lg">Upload your Logo</label>
//           <p>For best results, choose a square logo.</p>
//           <div
//             className="relative w-full border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition"
//             onClick={() => document.getElementById("logoInput").click()}
//           >
//             <input
//               type="file"
//               id="logoInput"
//               accept="image/*"
//               onChange={handleLogoChange}
//               className="hidden"
//             />
//             {!campaignData.logo ? (
//               <>
//                 <div className="text-gray-400 flex flex-col items-center gap-2">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-12 w-12"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M3 15a4 4 0 014-4h1a1 1 0 011 1v1a4 4 0 004 4h4a4 4 0 004-4v-1a1 1 0 011-1h1a4 4 0 014 4v4a4 4 0 01-4 4H7a4 4 0 01-4-4v-4z"
//                     />
//                   </svg>
//                   <p className="text-gray-600 text-center">
//                     Click or drag logo to upload
//                   </p>
//                 </div>
//                 {errors.logo && (
//                   <p className="text-red-500 text-sm mt-2">{errors.logo}</p>
//                 )}
//               </>
//             ) : (
//               <div className="relative w-full">
//                 <img
//                   src={campaignData.logo}
//                   alt="Logo Preview"
//                   className="w-full h-60 object-cover rounded"
//                 />
//                 <button
//                   onClick={handleDeletelogo}
//                   className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
//                 >
//                   <LucideDelete size={16} />
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       );

//     case 7:
//       return (
//         <div>
//           <h1 className="text-xl font-semibold mb-4">
//             What is the most common donation amount you expect to receive on
//             this cause?
//           </h1>
//           <p>
//             Based on your answer, we’ll suggest donation amounts to help you
//             raise more. Our smart recommendations have been shown to increase
//             donations by 10%!
//           </p>
//           <div className="space-y-3">
//             {["Less than $100", "$100 - $300", "More than $300"].map(
//               (amount) => (
//                 <button
//                   key={amount}
//                   className={`w-full border p-2 rounded-lg mt-3 ${
//                     campaignData.commonDonation === amount
//                       ? "border-gray-700 text-gray-700"
//                       : "border-primary text-primary hover:border-gray-700"
//                   }`}
//                   onClick={() =>
//                     setCampaignData((prev) => ({
//                       ...prev,
//                       commonDonation: amount,
//                     }))
//                   }
//                 >
//                   {amount}
//                 </button>
//               )
//             )}

//             <p className="mt-2">
//               Selected Donation: <strong>{campaignData.commonDonation}</strong>
//             </p>
//             {errors.commonDonation && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.commonDonation}
//               </p>
//             )}
//           </div>
//         </div>
//       );

//     case 8:
//       return (
//         <div>
//           <h1 className="text-xl font-semibold mb-4">
//             Would you like to automatically generate & send tax receipts?
//           </h1>
//           <p>
//             Whenever a donation is made on your campaign, Zeffy will
//             automatically generate a tax receipt and send it to the donor
//             directly. For recurring donations, we'll send one consolidated tax
//             receipt for the whole year.
//           </p>
//           <label className="flex items-center gap-2 mt-3">
//             <input
//               type="checkbox"
//               checked={campaignData.taxReceipt}
//               onChange={(e) =>
//                 setCampaignData((prev) => ({
//                   ...prev,
//                   taxReceipt: e.target.checked,
//                 }))
//               }
//             />{" "}
//             Auto generate & send tax receipts
//           </label>
//         </div>
//       );

//     case 9: {
//       const handleAddCustomQuestion = () => {
//         setCampaignData((prev) => ({
//           ...prev,
//           customQuestions: [
//             ...prev.customQuestions,
//             { question: "", answer: "" },
//           ],
//         }));
//       };

//       const handleCustomQuestionChange = (index, field, value) => {
//         const updatedQuestions = [...campaignData.customQuestions];
//         updatedQuestions[index][field] = value;
//         setCampaignData((prev) => ({
//           ...prev,
//           customQuestions: updatedQuestions,
//         }));
//       };

//       const handleDeleteCustomQuestion = (index) => {
//         const updatedQuestions = [...campaignData.customQuestions];
//         updatedQuestions.splice(index, 1);
//         setCampaignData((prev) => ({
//           ...prev,
//           customQuestions: updatedQuestions,
//         }));
//       };

//       return (
//         <div className="flex flex-col gap-4">
//           <h1 className="text-xl font-semibold mb-2">Add custom questions</h1>
//           <p className="text-gray-600 mb-4">
//             Gather more info on your donors. By default, we ask the donor for
//             the following information for your records:
//           </p>

//           <button
//             onClick={handleAddCustomQuestion}
//             className="self-start border px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark transition"
//           >
//             Add Question
//           </button>

//           <div className="flex flex-col gap-3 mt-4">
//             {campaignData.customQuestions.map((q, index) => {
//               const questionError = errors[`customQuestions.${index}.question`];

//               return (
//                 <div
//                   key={index}
//                   className="border p-3 rounded-lg bg-gray-50 relative"
//                 >
//                   <button
//                     onClick={() => handleDeleteCustomQuestion(index)}
//                     className="absolute top-2 right-2 text-red-500 hover:text-red-700"
//                   >
//                     <LucideDelete size={16} />
//                   </button>

//                   <label className="block mb-1 font-medium">Question</label>
//                   <input
//                     type="text"
//                     value={q.question}
//                     onChange={(e) =>
//                       handleCustomQuestionChange(
//                         index,
//                         "question",
//                         e.target.value
//                       )
//                     }
//                     placeholder="Type your question..."
//                     className="w-full border rounded p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                   />
//                   {questionError && (
//                     <p className="text-red-500 text-sm mb-1">{questionError}</p>
//                   )}

//                   <label className="block mb-1 font-medium">Answer</label>
//                   <input
//                     type="text"
//                     value={q.answer}
//                     onChange={(e) =>
//                       handleCustomQuestionChange(
//                         index,
//                         "answer",
//                         e.target.value
//                       )
//                     }
//                     placeholder="Type your answer..."
//                     className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                   />
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       );
//     }

//     case 10:
//       return (
//         <div>
//           <h1 className="text-xl font-semibold mb-4">Thank you email</h1>
//           <p className="text-gray-600 mb-3">
//             This email will be automatically sent to your donors and will
//             include their transaction receipts. If applicable, their tax
//             receipts will also be attached.
//           </p>

//           <input
//             type="text"
//             className="border w-full p-2 rounded-lg my-3 focus:outline-none focus:ring-2 focus:ring-primary"
//             placeholder="Email subject"
//             value={campaignData.thankYouEmail.subject}
//             onChange={(e) =>
//               setCampaignData((prev) => ({
//                 ...prev,
//                 thankYouEmail: {
//                   ...prev.thankYouEmail,
//                   subject: e.target.value,
//                 },
//               }))
//             }
//           />
//           {errors.thankYouSubject && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.thankYouSubject}
//             </p>
//           )}

//           <ReactQuill
//             theme="snow"
//             value={campaignData.thankYouEmail.body}
//             onChange={(value) =>
//               setCampaignData((prev) => ({
//                 ...prev,
//                 thankYouEmail: {
//                   ...prev.thankYouEmail,
//                   body: value,
//                 },
//               }))
//             }
//             modules={quillModules}
//             formats={quillFormats}
//             placeholder="Write your thank you email…"
//             className="bg-white rounded-lg border-none"
//           />
//           {errors.thankYouBody && (
//             <p className="text-red-500 text-sm mt-2">{errors.thankYouBody}</p>
//           )}
//         </div>
//       );

//     case 11:
//       return (
//         <div className="flex flex-col gap-4">
//           <h1 className="text-xl font-semibold mb-4">Advanced settings</h1>

//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={campaignData.advanced.honor}
//               onChange={(e) =>
//                 setCampaignData((prev) => ({
//                   ...prev,
//                   advanced: {
//                     ...prev.advanced,
//                     honor: e.target.checked,
//                   },
//                 }))
//               }
//             />
//             In honor / memory
//           </label>

//           <label className="flex items-center gap-2 mt-2">
//             <input
//               type="checkbox"
//               checked={campaignData.advanced.cheque}
//               onChange={(e) =>
//                 setCampaignData((prev) => ({
//                   ...prev,
//                   advanced: {
//                     ...prev.advanced,
//                     cheque: e.target.checked,
//                   },
//                 }))
//               }
//             />
//             Cheque payments
//           </label>

//           <div className="bg-gray-100 p-4 rounded-lg mt-3">
//             <label htmlFor="" className="font-medium">
//               Notifications
//             </label>
//             <p className="text-gray-600 text-sm">
//               Email addresses to notify when a payment is made (separate emails
//               with commas)
//             </p>
//             <input
//               type="text"
//               className="border w-full p-2 mt-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//               placeholder="Notification emails"
//               value={campaignData.advanced.notificationEmails}
//               onChange={(e) =>
//                 setCampaignData((prev) => ({
//                   ...prev,
//                   advanced: {
//                     ...prev.advanced,
//                     notificationEmails: e.target.value,
//                   },
//                 }))
//               }
//             />
//           </div>
//         </div>
//       );

//     case 12:
//       return (
//         <div className="text-center">
//           <div className="flex flex-col items-center gap-3 mb-6">
//             <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
//               <svg
//                 className="h-8 w-8 text-green-600"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <polyline points="20 6 9 17 4 12" />
//               </svg>
//             </div>
//             <h1 className="text-2xl font-semibold">
//               Congrats! Your campaign is ready.
//             </h1>
//             <p className="text-gray-600">
//               Your campaign has been created successfully.
//             </p>
//           </div>

//           <div className="pt-4 max-w-xl mx-auto">
//             <Link to="/dashboard">
//               <button className="flex items-center justify-between gap-3 px-5 py-4 mb-3 hover:bg-gray-100 w-full rounded-lg border border-primary text-gray-900 font-semibold">
//                 <div className="flex gap-3 justify-center items-center">
//                   <svg
//                     width={28}
//                     height={28}
//                     className="svg-safari-fix bg-[#DCFCE7] p-1 rounded-md"
//                     viewBox="0 0 24 24"
//                     fill="inherit"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       fill-rule="evenodd"
//                       clip-rule="evenodd"
//                       d="M19 14.0405C19 13.4905 19.45 13.0405 20 13.0405C20.55 13.0405 21 13.4905 21 14.0405V17.9805C21 19.6305 19.65 20.9805 18 20.9805H6C4.35 20.9805 3 19.6305 3 17.9805V5.98047C3 4.33047 4.35 2.98047 6 2.98047H10.45C11 2.98047 11.45 3.43047 11.45 3.98047C11.45 4.53047 11 4.98047 10.45 4.98047H6C5.45 4.98047 5 5.43047 5 5.98047V17.9805C5 18.5305 5.45 18.9805 6 18.9805H18C18.55 18.9805 19 18.5305 19 17.9805V14.0405ZM17.52 5.01047H14.63H14.62C14.07 5.01047 13.62 4.56047 13.62 4.01047C13.62 3.46047 14.07 3.01047 14.62 3.01047L20 2.98047C20.27 2.98047 20.52 3.08047 20.71 3.27047C20.9 3.46047 21 3.72047 21 3.99047L20.94 9.30047C20.93 9.85047 20.49 10.2905 19.94 10.2905H19.93C19.38 10.2805 18.94 9.83047 18.94 9.28047L18.97 6.36047L9.65 15.6805C9.45 15.8705 9.2 15.9705 8.94 15.9705C8.68 15.9705 8.43 15.8805 8.23 15.6805C7.84 15.2905 7.84 14.6605 8.23 14.2705L17.52 5.01047Z"
//                       fill="inherit"
//                     ></path>
//                   </svg>
//                   <span>View my causes</span>
//                 </div>
//                 <svg
//                   width={20}
//                   height={20}
//                   className="svg-safari-fix"
//                   viewBox="0 0 24 24"
//                   fill="inherit"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M8.40003 19.9396C8.14003 19.9396 7.88003 19.8396 7.69003 19.6396C7.30003 19.2496 7.31003 18.6096 7.71003 18.2296L14.1 11.9796L7.66003 5.60958C7.27003 5.21958 7.26003 4.58958 7.66003 4.19958C8.05003 3.80958 8.68003 3.79958 9.07003 4.19958L16.22 11.2796C16.41 11.4696 16.52 11.7296 16.52 11.9896C16.52 12.2496 16.41 12.5096 16.22 12.6996L9.11003 19.6596C8.92003 19.8496 8.66003 19.9496 8.41003 19.9496L8.40003 19.9396Z"
//                     fill="inherit"
//                   ></path>
//                 </svg>
//               </button>
//             </Link>
//             <Link to="/dashboard">
//               <button className="flex items-center justify-between gap-3 px-5 py-4 mb-3 hover:bg-gray-100 w-full rounded-lg border border-primary text-gray-900 font-semibold">
//                 <div className="flex gap-3 justify-center items-center">
//                   <svg
//                     width={28}
//                     height={28}
//                     className="svg-safari-fix bg-[#DCFCE7] p-1 rounded-md"
//                     viewBox="0 0 24 24"
//                     fill="inherit"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M17 15.0201C16.29 15.0201 15.66 15.2801 15.15 15.6901L9.85999 12.5501C9.88999 12.3801 9.90999 12.2001 9.90999 12.0101C9.90999 11.8201 9.88999 11.6301 9.84999 11.4501L15.12 8.32008C15.63 8.74008 16.28 9.00008 16.99 9.00008C18.62 9.00008 19.95 7.68008 19.95 6.04008C19.95 4.40008 18.63 3.08008 16.99 3.08008C15.35 3.08008 14.03 4.40008 14.03 6.04008C14.03 6.23008 14.05 6.42008 14.09 6.60008L8.81999 9.73008C8.30999 9.31008 7.65999 9.05008 6.94999 9.05008C5.31999 9.05008 3.98999 10.3701 3.98999 12.0101C3.98999 13.6501 5.30999 14.9701 6.94999 14.9701C7.66999 14.9701 8.31999 14.7001 8.83999 14.2701L14.1 17.3901C14.06 17.5801 14.04 17.7701 14.04 17.9701C14.04 19.6001 15.36 20.9301 17 20.9301C18.64 20.9301 19.96 19.6101 19.96 17.9701C19.96 16.3301 18.64 15.0101 17 15.0101V15.0201Z"
//                       fill="inherit"
//                     ></path>
//                   </svg>
//                   <span>Share my causes</span>
//                 </div>
//                 <svg
//                   width={20}
//                   height={20}
//                   className="svg-safari-fix"
//                   viewBox="0 0 24 24"
//                   fill="inherit"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M8.40003 19.9396C8.14003 19.9396 7.88003 19.8396 7.69003 19.6396C7.30003 19.2496 7.31003 18.6096 7.71003 18.2296L14.1 11.9796L7.66003 5.60958C7.27003 5.21958 7.26003 4.58958 7.66003 4.19958C8.05003 3.80958 8.68003 3.79958 9.07003 4.19958L16.22 11.2796C16.41 11.4696 16.52 11.7296 16.52 11.9896C16.52 12.2496 16.41 12.5096 16.22 12.6996L9.11003 19.6596C8.92003 19.8496 8.66003 19.9496 8.41003 19.9496L8.40003 19.9396Z"
//                     fill="inherit"
//                   ></path>
//                 </svg>
//               </button>
//             </Link>
//           </div>
//         </div>
//       );

//     default:
//       return null;
//   }
// }

// export default CreateCampaign;

// @ts-nocheck
import { useAppContext } from "@/context/AppContext";
import { campaignApi } from "@/service/apiService";
import { LucideDelete, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "link",
  "image",
];

const colors = [
  "#f87878",
  "#f7bd7a",
  "#f6e186",
  "#a4eb99",
  "#76e0cf",
  "#a1cffb",
  "#e4aefb",
  "#fa85b0",
  "#14b8a6",
  "linear-gradient(135deg, #76e0cf, #14b8a6)",
];

const steps = [
  "Campaign Type",
  "Title",
  "Fundraising Goal",
  "Description",
  "Color",
  "Banner",
  "Logo",
  "Common Donation",
  "Suggested Amounts", // NEW STEP ADDED HERE
  "Tax Receipts",
  "Custom Questions",
  "Thank You Email",
  "Advanced Settings",
  "Success",
];

function CreateCampaign() {
  const { loadProfileData } = useAppContext();
  const [step, setStep] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showInputSteps, setShowInputSteps] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const { campaignId } = useParams();
  const isEditMode = Boolean(campaignId);

  const [isLoading, setIsLoading] = useState(false);

  const isSuccessStep = step === steps.length - 1;
  const isLastInputStep = step === steps.length - 2;
  const progress = ((step + 1) / steps.length) * 100;

  const toggleInput = (stepNum) => {
    setShowInputSteps((prev) => ({ ...prev, [stepNum]: true }));
  };

  const hideInput = (stepNum) => {
    setShowInputSteps((prev) => ({ ...prev, [stepNum]: false }));
  };

  const [campaignData, setCampaignData] = useState({
    causeType: "",
    title: "",
    goalAmount: 1000,
    description:
      "Your gift fuels practical, local solutions across Africa 🌍When you donate, you help provide classroom supplies, teacher support, basic medical care, and training that strengthens community income. Give To Africa invests in community-led projects—from schools and clinics to small business support—so families can build lasting stability. ❤️Choose an amount that works for you; every contribution helps communities move toward long-term self‑sufficiency.",
    fundraiserOptions: {
      team: true,
      solo: true,
      paid: false,
    },
    color: "#f87878",

    banner: null,
    bannerFile: null,
    logo: null,
    logoFile: null,

    commonDonation: "",
    // OLD: suggestedAmounts: [], // Removed, replaced by structured object below
    taxReceipt: true,
    customQuestions: [],
    thankYouEmail: {
      subject: "",
      body: "",
    },
    fundraiserEmail: "",
    advanced: {
      honor: false,
      cheque: false,
      notificationEmails: "",
    },
    // NEW: Structured suggestedAmounts
    suggestedAmounts: {
      oneTime: {
        isActive: true,
        amounts: [
          { id: 1, amount: 50, description: "Will help feed 6 children..." },
          {
            id: 2,
            amount: 100,
            description: "Describe how this amount will make a difference",
          },
          {
            id: 3,
            amount: 300,
            description: "Describe how this amount will make a difference",
          },
          {
            id: 4,
            amount: 500,
            description: "Describe how this amount will make a difference",
          },
        ],
      },
      monthly: {
        isActive: true,
        amounts: [
          { id: 5, amount: 10, description: "Will help feed 6 children..." },
          {
            id: 6,
            amount: 25,
            description: "Describe how this amount will make a difference",
          },
          {
            id: 7,
            amount: 35,
            description: "Describe how this amount will make a difference",
          },
          {
            id: 8,
            amount: 45,
            description: "Describe how this amount will make a difference",
          },
        ],
      },
      yearly: {
        isActive: false,
        amounts: [
          { id: 5, amount: 10, description: "Will help feed 6 children..." },
          {
            id: 6,
            amount: 25,
            description: "Describe how this amount will make a difference",
          },
          {
            id: 7,
            amount: 35,
            description: "Describe how this amount will make a difference",
          },
          {
            id: 8,
            amount: 45,
            description: "Describe how this amount will make a difference",
          },
        ],
      },
    },
  });

  const buildCampaignPayload = (campaignData) => {
    const flattenedSuggestedAmounts = [];

    const processAmounts = (type, isActive, amounts) => {
      if (isActive) {
        amounts.forEach((item) => {
          // Only include if amount is a valid positive number
          if (item.amount && !isNaN(item.amount) && Number(item.amount) > 0) {
            flattenedSuggestedAmounts.push({
              type: type,
              amount: Number(item.amount),
              description: item.description || "",
              isActive: true, // Assuming individual items are active if their category is active
            });
          }
        });
      }
    };

    processAmounts(
      "oneTime",
      campaignData.suggestedAmounts.oneTime.isActive,
      campaignData.suggestedAmounts.oneTime.amounts
    );
    processAmounts(
      "monthly",
      campaignData.suggestedAmounts.monthly.isActive,
      campaignData.suggestedAmounts.monthly.amounts
    );
    processAmounts(
      "yearly",
      campaignData.suggestedAmounts.yearly.isActive,
      campaignData.suggestedAmounts.yearly.amounts
    );

    return {
      causeType: campaignData.causeType,
      title: campaignData.title,
      goalAmount: campaignData.goalAmount,
      description: campaignData.description,

      fundraiserOptions: campaignData.fundraiserOptions,
      color: campaignData.color,

      commonDonation: campaignData.commonDonation,
      suggestedAmounts: flattenedSuggestedAmounts, // NEW: Flattened array for API

      taxReceipt: campaignData.taxReceipt,
      customQuestions: campaignData.customQuestions,

      thankYouEmail: {
        subject: campaignData.thankYouEmail.subject,
        body: campaignData.thankYouEmail.body,
      },

      fundraiserEmail: campaignData.fundraiserEmail,

      advanced: {
        honor: campaignData.advanced.honor,
        cheque: campaignData.advanced.cheque,
        notificationEmails: campaignData.advanced.notificationEmails,
      },
    };
  };

  useEffect(() => {
    if (!isEditMode || !campaignId) return;

    const fetchCampaign = async () => {
      try {
        setIsLoading(true);
        setApiError("");

        const res = await campaignApi.getCampaign(campaignId as string);
        if (!res.success) {
          setApiError(res.message || "Failed to load campaign");
          return;
        }

        const c = res.data;

        // Process suggestedAmounts from flat API response to nested state structure
        // Assuming c.suggestedAmounts from API is an array like:
        // [{ type: 'oneTime', amount: 50, description: 'desc' }, ...]
        const oneTimeAmounts = (c.suggestedAmounts || [])
          .filter((sa) => sa.type === "oneTime")
          .map((item, idx) => ({
            id: item.id || Date.now() + `ot-${idx}`, // Ensure unique ID
            amount: item.amount,
            description: item.description,
          }));
        const monthlyAmounts = (c.suggestedAmounts || [])
          .filter((sa) => sa.type === "monthly")
          .map((item, idx) => ({
            id: item.id || Date.now() + `mt-${idx}`, // Ensure unique ID
            amount: item.amount,
            description: item.description,
          }));
        const yearlyAmounts = (c.suggestedAmounts || [])
          .filter((sa) => sa.type === "yearly")
          .map((item, idx) => ({
            id: item.id || Date.now() + `yr-${idx}`, // Ensure unique ID
            amount: item.amount,
            description: item.description,
          }));

        setCampaignData((prev) => ({
          ...prev,
          causeType: c.causeType ?? "",
          title: c.title ?? "",
          goalAmount: typeof c.goalAmount === "number" ? c.goalAmount : 1000,
          description: c.description ?? "",

          fundraiserOptions: c.fundraiserOptions ?? {
            team: true,
            solo: true,
            paid: false,
          },

          color: c.color ?? "#f87878",

          banner: c.bannerUrl ?? null,
          bannerFile: null,
          logo: c.logoUrl ?? null,
          logoFile: null,

          commonDonation: c.commonDonation ?? "",
          // OLD: suggestedAmounts: c.suggestedAmounts ?? [], // Removed
          taxReceipt:
            typeof c.taxReceipt === "boolean" ? c.taxReceipt : prev.taxReceipt,

          customQuestions: c.customQuestions ?? [],

          thankYouEmail: {
            subject: c.thankYouEmail?.subject ?? "",
            body: c.thankYouEmail?.body ?? "",
          },

          fundraiserEmail: c.fundraiserEmail ?? "",

          advanced: {
            honor: c.advanced?.honor ?? false,
            cheque: c.advanced?.cheque ?? false,
            notificationEmails: c.advanced?.notificationEmails ?? "",
          },
          // NEW: Populate suggestedAmounts structure
          suggestedAmounts: {
            oneTime: {
              isActive: oneTimeAmounts.length > 0, // Assume active if items exist
              amounts: oneTimeAmounts,
            },
            monthly: {
              isActive: monthlyAmounts.length > 0,
              amounts: monthlyAmounts,
            },
            yearly: {
              isActive: yearlyAmounts.length > 0,
              amounts: yearlyAmounts,
            },
          },
        }));

        const openSteps: Record<number, boolean> = {};
        if (c.goalAmount) openSteps[2] = true;
        if (c.description) openSteps[3] = true;
        if (c.customQuestions?.length) openSteps[10] = true; // Adjusted index
        if (c.suggestedAmounts?.length > 0) openSteps[8] = true; // New step index for suggested amounts

        setShowInputSteps((prev) => ({ ...prev, ...openSteps }));
      } catch (err: any) {
        console.error(err);
        setApiError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load campaign"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId, isEditMode]);

  if (isEditMode && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading causes...</p>
      </div>
    );
  }

  const submitCampaign = async () => {
    setIsSubmitting(true);
    setApiError("");

    try {
      const payload = buildCampaignPayload(campaignData);

      const files = {
        banner: campaignData.bannerFile || undefined,
        logo: campaignData.logoFile || undefined,
      };

      // 🔥 CREATE
      if (!isEditMode) {
        if (!campaignData.bannerFile) {
          setApiError("Banner file is missing");
          return false;
        }

        await campaignApi.createCampaign(payload, {
          banner: campaignData.bannerFile,
          logo: campaignData.logoFile || undefined,
        });
      }

      // 🔥 UPDATE
      else {
        await campaignApi.updateCampaign(campaignId, payload, files);
      }

      await loadProfileData(true);

      console.log(isEditMode ? "Campaign Updated" : "Campaign Created");
      return true;
    } catch (error) {
      console.error("Campaign error", error);
      setApiError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to save campaign"
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (stepNum) => {
    if (stepNum === 2) {
      setCampaignData((prev) => ({ ...prev, goalAmount: 1000 }));
    } else if (stepNum === 3) {
      setCampaignData((prev) => ({ ...prev, description: "" }));
    }
    hideInput(stepNum);
  };

  const validateStep = () => {
    const newErrors = {};

    switch (step) {
      case 0:
        if (!campaignData.causeType) {
          newErrors.causeType = "Please select a campaign type.";
        }
        break;

      case 1:
        if (!campaignData.title.trim()) {
          newErrors.title = "Title is required.";
        }
        break;

      case 2:
        if (!campaignData.goalAmount || campaignData.goalAmount <= 0) {
          newErrors.goalAmount = "Please enter a goal greater than 0.";
        }
        break;

      case 3: {
        const text = campaignData.description
          ? campaignData.description.replace(/<[^>]*>/g, "").trim()
          : "";
        if (!text) {
          newErrors.description = "Description is required.";
        }
        break;
      }

      case 5:
        if (!isEditMode && !campaignData.bannerFile) {
          newErrors.banner = "Please upload a banner image.";
        }
        break;

      case 6:
        if (!isEditMode && !campaignData.logoFile) {
          // Consider existing logo in edit mode
          newErrors.logo = "Please upload a logo image.";
        }
        break;

      case 7:
        if (!campaignData.commonDonation) {
          newErrors.commonDonation = "Please select a common donation range.";
        }
        break;

      case 8: // NEW: Suggested Amounts validation
        const types = ["oneTime", "monthly", "yearly"];
        let hasActiveSuggestedAmounts = false;
        types.forEach((type) => {
          if (campaignData.suggestedAmounts[type].isActive) {
            hasActiveSuggestedAmounts = true;
            if (campaignData.suggestedAmounts[type].amounts.length === 0) {
              newErrors[
                `${type}.amounts`
              ] = `Please add at least one amount for ${
                type === "oneTime" ? "one-time" : type
              } donations or deactivate this section.`;
            } else {
              campaignData.suggestedAmounts[type].amounts.forEach(
                (item, index) => {
                  if (
                    !item.amount ||
                    isNaN(item.amount) ||
                    Number(item.amount) <= 0
                  ) {
                    newErrors[`${type}.amounts.${index}.amount`] =
                      "Amount must be a positive number.";
                  }
                }
              );
            }
          }
        });
        // Optional: If you want to enforce at least one active section with amounts:
        // if (!hasActiveSuggestedAmounts && Object.keys(newErrors).length === 0) {
        //   newErrors.suggestedAmounts = "Please activate at least one suggested amount section and add amounts, or turn off suggested amounts entirely.";
        // }
        break;

      case 9: // OLD: Case 8 - Tax Receipts (No validation needed for a checkbox)
        break;

      case 10: // OLD: Case 9 - Custom Questions
        campaignData.customQuestions.forEach((q, index) => {
          if (!q.question?.trim()) {
            newErrors[`customQuestions.${index}.question`] =
              "Question is required.";
          }
        });
        break;

      case 11: // OLD: Case 10 - Thank You Email
        if (!campaignData.thankYouEmail.subject.trim()) {
          newErrors.thankYouSubject = "Subject is required.";
        }
        {
          const bodyText = campaignData.thankYouEmail.body
            ? campaignData.thankYouEmail.body.replace(/<[^>]*>/g, "").trim()
            : "";
          if (!bodyText) {
            newErrors.thankYouBody = "Email body is required.";
          }
        }
        break;

      // Cases 12 and 13 (Advanced Settings, Success) generally don't have validation in this flow
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (isSuccessStep) {
      setStep(0);
      setErrors({});
      setApiError("");
      return;
    }

    const isValid = validateStep();
    if (!isValid) return;

    if (isLastInputStep) {
      const ok = await submitCampaign();
      if (ok) {
        setStep(steps.length - 1);
        setErrors({});
      }
    } else {
      setStep((prev) => prev + 1);
      setErrors({});
      setApiError("");
    }
  };

  const handleBack = () => {
    if (step === 0) return;
    setStep((prev) => prev - 1);
    setErrors({});
    setApiError("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      {!isSuccessStep && sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-72 bg-white border-r p-4 overflow-y-auto">
            <h2 className="font-semibold mb-4">Jump to edit…</h2>
            {steps.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  setStep(i);
                  setSidebarOpen(false);
                  setErrors({});
                  setApiError("");
                }}
                className="w-full text-left px-3 py-2 rounded mb-1 text-sm border border-gray-200"
              >
                {s}
              </button>
            ))}
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main */}
      <main className="flex-1 px-3 ms:px-8">
        <div className="flex justify-end my-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 py-2 border rounded text-sm"
          >
            Edit Cause steps
          </button>
        </div>

        {!isSuccessStep && (
          <div className="mb-6">
            <div className="h-3 bg-gray-200 rounded-lg">
              <div
                className="h-3 bg-primary rounded-lg"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="min-h-[75vh] p-4 md:p-8 flex justify-between flex-col">
            {/* API error show */}
            {apiError && (
              <p className="text-red-500 text-sm mb-3">{apiError}</p>
            )}

            {renderStep(
              step,
              campaignData,
              setCampaignData,
              handleDelete,
              showInputSteps,
              toggleInput,
              errors
            )}

            <div>
              <hr />
              <div className="flex justify-between mt-8">
                <button
                  disabled={step === 0 || isSubmitting}
                  onClick={handleBack}
                  className="px-4 py-2 rounded border disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded bg-primary text-white disabled:opacity-50"
                >
                  {isSubmitting
                    ? isEditMode
                      ? "Updating..."
                      : "Creating..."
                    : isSuccessStep
                    ? "Edit Cause"
                    : isLastInputStep
                    ? isEditMode
                      ? "Update Cause"
                      : "Create Cause"
                    : "Next"}
                </button>
              </div>
            </div>
          </div>

          {/* <div className="bg-gray-100 h-full flex items-center justify-center text-gray-400">
            Causes preview
          </div> */}
        </div>
      </main>
    </div>
  );
}

// Icons (Moved here to keep CreateCampaign cleaner)
const EventIcon = () => (
  <svg
    className="w-6 h-6 mx-auto svg-safari-fix"
    viewBox="0 0 192 192"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M102.7 76.2998H69.5C64.3 76.2998 60 80.5998 60 85.7998V126.5C60 131.7 64.3 136 69.5 136H102.8C108 136 112.3 131.7 112.3 126.5V85.7998C112.3 80.5998 108 76.2998 102.7 76.2998Z"
      fill="#074C2D"
    ></path>
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M177.6 86.9996C177.6 89.8996 175.3 92.2996 172.5 92.4996C165.4 92.9996 159.9 99.0996 159.8 106.4C159.8 113.7 165.4 119.8 172.5 120.3C175.4 120.5 177.6 122.9 177.6 125.8V145.2C177.6 153.4 171 160.1 162.8 160.1H28.4C20.3 160.1 13.6 153.4 13.6 145.2V125.8C13.6 122.9 15.9 120.5 18.7 120.3C25.8 119.7 31.4 113.7 31.4 106.4C31.4 99.0996 25.8 92.9996 18.7 92.4996C15.8 92.2996 13.6 89.8996 13.6 86.9996V67.5996C13.6 59.3996 20.2 52.6996 28.4 52.6996L30 52.5L151.9 32.1996C155.7 31.4996 159.6 32.3996 162.7 34.6996C165.9 36.9996 168 40.3996 168.6 44.2996L170.3 54.6996C174.6 57.2996 177.6 62.0996 177.6 67.5996V86.9996ZM158 41.0996C156.6 39.9996 154.8 39.5996 153.1 39.8996L75.5 52.5996H161.9L160.7 45.4996C160.4 43.6996 159.5 42.1996 158 41.0996ZM169.6 145.1V127.9C159.5 126 151.9 116.9 151.9 106.4C151.9 95.7996 159.5 86.7996 169.6 84.8996V67.5996C169.6 63.7996 166.6 60.6996 162.8 60.6996H28.4C24.7 60.6996 21.6 63.7996 21.6 67.5996V84.8996C31.7 86.7996 39.3 95.7996 39.3 106.4C39.3 117 31.7 126 21.6 127.9V145.1C21.6 148.9 24.6 152 28.4 152H162.8C166.5 152 169.6 148.9 169.6 145.1ZM95 94.0996H128.6C130.8 94.0996 132.6 92.2996 132.6 90.0996C132.6 87.8996 130.8 86.0996 128.6 86.0996H95C92.8 86.0996 91 87.8996 91 90.0996C91 92.2996 92.8 94.0996 95 94.0996ZM95 126.5H120.1C122.3 126.5 124 124.7 124 122.5C124 120.3 122.2 118.5 120 118.5H95C92.8 118.5 91 120.3 91 122.5C91 124.7 92.8 126.5 95 126.5ZM128.6 110.3H95C92.8 110.3 91 108.5 91 106.3C91 104.1 92.8 102.3 95 102.3H128.6C130.8 102.3 132.6 104.1 132.6 106.3C132.6 108.5 130.8 110.3 128.6 110.3Z"
      fill="#0F0E5B"
    ></path>
  </svg>
);

const DonationIcon = () => (
  <svg
    className="w-6 h-6 mx-auto svg-safari-fix"
    viewBox="0 0 192 192"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M97.36 32.1504C91.48 32.1504 86.67 35.5204 83.37 39.5404C80.07 35.5104 75.26 32.1504 69.38 32.1504C58.74 32.1504 50.08 40.8104 50.08 51.4504C50.08 54.5504 50.83 57.6304 52.26 60.3704C53.09 62.1904 58.1 71.6004 78.94 88.0404C80.19 89.0304 81.68 89.5204 83.18 89.5204C84.68 89.5204 86.17 89.0304 87.42 88.0404C101.81 76.6804 108.75 68.6604 112.02 63.9604C114.01 61.1604 116.65 56.8204 116.65 51.4504C116.65 40.8104 107.99 32.1504 97.35 32.1504H97.36Z"
      fill="#074C2D"
    ></path>
    <path
      d="M171.91 109.63C171.62 107.39 170.41 104.14 166.35 101.37C158.16 95.7904 151.85 99.2604 149.52 102.01L134.59 117.54C133.94 115.14 132.74 113.06 130.99 111.39C126.1 106.73 118.91 106.93 118.1 106.96L115.95 107.06C114.09 107.08 110.35 107.08 102.88 106.95C96.51 106.84 94.44 105.09 91.81 102.87C88.66 100.21 84.75 96.9004 75.02 96.9004C63.71 96.9004 56.4 100.61 52.45 103.47C49.14 100.2 44.6 98.1804 39.6 98.1804H31.12C25.19 98.1804 20.36 103.01 20.36 108.94V148.61C20.36 154.59 25.65 160.03 31.47 160.03H39.95C44.54 160.03 48.71 158.19 51.89 155.19C56.52 157.1 65.89 159.81 81.74 159.81H126.75C127.25 159.81 139.11 159.63 151.13 143.66L169.13 118.75C169.84 117.87 172.5 114.21 171.9 109.61L171.91 109.63ZM39.96 152.05H31.48C30.03 152.05 28.37 150.23 28.37 148.63V108.96C28.37 107.44 29.61 106.2 31.13 106.2H39.61C45.28 106.2 49.9 110.82 49.9 116.49V141.1C49.9 147.04 45.35 152.05 39.96 152.05ZM162.94 113.71L144.7 138.93C135.32 151.38 127.03 151.82 126.75 151.83H81.74C68.71 151.83 60.73 149.89 56.5 148.41C57.39 146.16 57.89 143.69 57.89 141.1V116.49C57.89 114.29 57.48 112.18 56.76 110.23C59.41 108.19 65.19 104.93 75.02 104.93C81.82 104.93 83.95 106.73 86.65 109.01C89.72 111.6 93.53 114.83 102.75 114.98C109.08 115.09 113.61 115.12 116.23 115.08C116.99 115.08 117.75 115.06 118.45 114.97C119.72 114.93 123.44 115.24 125.48 117.22C126.59 118.29 127.13 119.8 127.13 121.84C127.13 124.25 126.64 125.68 125.95 126.54L125.58 126.92C124.8 127.6 123.86 127.74 123.04 127.74H91.53C89.32 127.74 87.53 129.53 87.53 131.74C87.53 133.95 89.32 135.74 91.53 135.74H123.04C125.58 135.74 128.31 134.97 130.54 133.18C130.77 133.03 130.98 132.85 131.18 132.64L155.38 107.46L155.59 107.23C156.13 106.68 158 105.38 161.84 107.99C163.12 108.87 163.84 109.76 163.97 110.65C164.15 111.9 163.24 113.35 162.94 113.72V113.71Z"
      fill="#0F0E5B"
    ></path>
    <path
      d="M102.33 87.7605C103.54 88.7105 104.98 89.1905 106.42 89.1905C107.86 89.1905 109.31 88.7105 110.52 87.7605C124.99 76.3405 131.96 68.2805 135.23 63.5705C137.21 60.7805 139.85 56.4605 139.85 51.1305C139.85 40.5705 131.26 31.9805 120.7 31.9805C114.75 31.9805 109.89 35.4705 106.61 39.5905C103.33 35.4705 98.48 31.9805 92.53 31.9805C81.97 31.9805 73.38 40.5705 73.38 51.1305C73.38 54.2105 74.13 57.2605 75.55 59.9805C76.36 61.7605 81.34 71.1805 102.34 87.7505L102.33 87.7605ZM92.52 39.9805C96.76 39.9805 100.66 44.1205 102.49 47.9805C103.24 49.5605 104.86 50.5805 106.61 50.5805C108.36 50.5805 109.98 49.5605 110.73 47.9705C112.56 44.1205 116.46 39.9805 120.69 39.9805C126.84 39.9805 131.84 44.9805 131.84 51.1305C131.84 53.4705 130.87 55.8805 128.68 58.9705C126.28 62.4205 120.23 69.8005 106.42 80.8005C86.78 65.1505 82.85 56.7505 82.84 56.7205L82.67 56.3705C81.81 54.7505 81.37 52.9905 81.37 51.1405C81.37 44.9905 86.37 39.9905 92.52 39.9905V39.9805Z"
      fill="#0F0E5B"
    ></path>
  </svg>
);

const PeerIcon = () => (
  <svg
    className="w-6 h-6 mx-auto svg-safari-fix"
    viewBox="0 0 192 192"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M156.9 127.8L110.8 111.6C106.4 110 103.4 105.8 103.4 101.2V79.0998C103.4 74.3998 106.4 70.2998 110.8 68.6998L156.9 52.4998C164.1 49.9998 171.6 55.2998 171.6 62.8998V117.4C171.6 125 164.1 130.3 156.9 127.8Z"
      fill="#074C2D"
    ></path>
    <path
      d="M152.3 34.7C148.8 32.2 144.2 31.5 140.1 32.9L47.5 65H21.1C13.7 65 7.69995 71 7.69995 78.4V101.7C7.69995 108.7 13 114.4 19.9 115.1L26 149C27.2 155.3 32.8 159.9 39.2 159.9H45C49 159.9 52.8 158.1 55.4 155C58 151.9 59 147.9 58.2 144L53.2999 117.2L140.1 147.3C141.5 147.8 143 148 144.5 148C147.3 148 150 147.2 152.3 145.5C155.8 143 157.9 138.9 157.9 134.6V45.6C157.9 41.3 155.8 37.2 152.3 34.7ZM52.0999 71.9L129.3 45.1V135L52.0999 108.2V71.9ZM15.6 101.7V78.4C15.6 75.4 18 73 21 73H44.0999V107.1H21.1C18.1 107.1 15.6 104.7 15.6 101.7ZM49.0999 149.9C48.0999 151.2 46.5 151.9 44.9 151.9H39.0999C36.4999 151.9 34.2999 150 33.7999 147.5L27.9 115.1H44.7999L50.2999 145.4C50.5999 147 50.1999 148.7 49.0999 149.9ZM149.9 134.5C149.9 136.3 149.1 137.9 147.6 138.9C146.1 139.9 144.3 140.2 142.7 139.6L137.4 137.7V42.3L142.7 40.5C144.4 39.9 146.2 40.2 147.6 41.2C149.1 42.2 149.9 43.8 149.9 45.6V134.5Z"
      fill="#0F0E5B"
    ></path>
  </svg>
);

const ShopIcon = () => (
  <svg
    className="w-6 h-6 mx-auto svg-safari-fix"
    viewBox="0 0 192 192"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M14.2 123.5H76.3C81.7 123.5 86.1 119.1 86.1 113.7V90.3C86.1 84.9 81.7 80.5 76.3 80.5H14.2C8.80002 80.5 4.40002 84.9 4.40002 90.3V113.7C4.40002 119.1 8.80002 123.5 14.2 123.5Z"
      fill="#074C2D"
    ></path>
    <path
      d="M169.9 55.3002L157.6 34.1002C154.8 29.2002 149.5 26.2002 143.8 26.2002H53.5C47.9 26.2002 42.6 29.2002 39.8 34.1002L27.3 55.3002C25.9 57.7002 25.1 60.5002 25.1 63.4002V150.3C25.1 159.1 32.2 166.2 41 166.2H156.1C164.9 166.2 172 159.1 172 150.3V63.3002C172 60.5002 171.3 57.7002 169.9 55.3002ZM150.7 38.1002L162 57.5002H136L131 34.1002H143.9C146.6 34.2002 149.2 35.7002 150.7 38.1002ZM127.8 57.5002H103V34.2002H122.8L127.8 57.5002ZM75.1 34.2002H95V57.6002H69.2L75.1 34.2002ZM46.7 38.1002C48.1 35.7002 50.7 34.2002 53.5 34.2002H66.9L61 57.5002H35.2L46.7 38.1002ZM144.3 158.1H115.4V116.1C115.4 112 118.7 108.7 122.8 108.7H136.9C141 108.7 144.3 112 144.3 116.1V158.1ZM156.1 158.1H152.3V116.2C152.3 107.7 145.4 100.8 136.9 100.8H122.8C114.3 100.8 107.4 107.7 107.4 116.2V158.2H41C36.6 158.2 33.1 154.7 33.1 150.3V65.5002H164V150.1C164 154.5 160.5 158.1 156.1 158.1Z"
      fill="#0F0E5B"
    ></path>
  </svg>
);

const RaffleIcon = () => (
  <svg
    className="w-6 h-6 mx-auto svg-safari-fix"
    viewBox="0 0 192 192"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M93 76.7007L31.6 49.8007C26.1 47.2007 19.7 51.2007 19.6 57.3007V111.901C19.6 118.001 26.1 122.101 31.6 119.301L93.1 91.6007C99.3 88.5007 99.2 79.7007 93 76.7007Z"
      fill="#074C2D"
    ></path>
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M171.6 83.9004C171.6 105.8 160.5 125.2 143.7 136.7L157.4 150.7C161 154.3 162.1 159.6 160.1 164.3C158.2 169 153.7 172 148.6 172L66.4 172.1C61.3 172.1 56.9 169.1 54.9 164.4C52.9 159.7 54 154.4 57.6 150.8L71.5 136.9C61.5 130 53.4 120.3 48.6 108.9C48.55 108.85 48.525 108.775 48.5 108.7C48.475 108.625 48.45 108.55 48.4 108.5C48.4 108.45 48.375 108.375 48.35 108.3C48.325 108.225 48.3 108.15 48.3 108.1C45.3 100.7 43.6 92.5004 43.6 84.0004C43.6 75.6004 45.3 67.6004 48.2 60.3004C48.2 60.0004 48.3 59.7004 48.4 59.5004L48.7 58.9004C58.5 36.0004 81.2 19.9004 107.6 19.9004C142.9 19.9004 171.6 48.6004 171.6 83.9004ZM127.3 121.1L132.7 134C143.4 128.6 152.2 119.8 157.6 109.1L144.7 103.7C140.8 111.1 134.7 117.2 127.3 121.1ZM54.5 66.3004C52.6 71.8004 51.6 77.7004 51.6 83.9004C51.6 90.1004 52.7 96.0004 54.6 101.7L67.5 96.4004C66.3 92.4004 65.6 88.3004 65.6 84.0004C65.6 79.7004 66.2 75.6004 67.4 71.7004L54.5 66.3004ZM94.3 52.6004C82.2 57.7004 73.6 69.8004 73.6 83.9004C73.6 102.7 88.8 118 107.8 118C121.8 118 133.9 109.5 139.1 97.4004C139.1 97.3004 139.1 97.1004 139.2 97.0004C139.2 96.9004 139.3 96.7004 139.4 96.6004C140.9 92.6004 141.8 88.4004 141.8 83.9004C141.8 79.4004 140.9 75.1004 139.3 71.2004C139.3 71.2004 139.2 71.1004 139.2 71.0004C139.1 70.9004 139.1 70.8004 139.1 70.7004C135.6 62.7004 129.2 56.2004 121.1 52.7004C120.983 52.7004 120.9 52.6661 120.831 52.6376C120.783 52.6175 120.741 52.6004 120.7 52.6004C120.65 52.5504 120.6 52.5254 120.55 52.5004C120.5 52.4754 120.45 52.4504 120.4 52.4004C116.5 50.8004 112.2 49.9004 107.7 49.9004C103.1 49.9004 98.8 50.8004 94.8 52.4004C94.75 52.4004 94.725 52.4254 94.7 52.4504C94.675 52.4754 94.65 52.5004 94.6 52.5004C94.5 52.6004 94.4 52.6004 94.3 52.6004ZM160.7 101.6C162.6 96.0004 163.6 90.1004 163.6 83.9004C163.6 77.7004 162.6 71.8004 160.8 66.2004L147.9 71.6004C149.1 75.5004 149.7 79.6004 149.7 83.9004C149.7 88.2004 149 92.4004 147.8 96.3004L160.7 101.6ZM119.9 124.2C116 125.4 111.9 126 107.6 126C103.3 126 99.2 125.3 95.3 124.2L90 137.1C95.6 139 101.5 140 107.7 140C113.8 140 119.7 138.9 125.3 137.1L119.9 124.2ZM144.8 64.3004L157.7 58.9004C152.3 48.1004 143.5 39.3004 132.8 33.9004L127.4 46.8004C134.8 50.8004 140.9 56.9004 144.8 64.3004ZM120 43.7004L125.3 30.8004C119.7 28.9004 113.8 27.9004 107.7 28.0004C101.5 28.0004 95.6 29.0004 90 30.9004L95.3 43.8004C99.3 42.6004 103.4 41.9004 107.7 41.9004C112 41.9004 116.1 42.5004 120 43.7004ZM87.9 46.8004L82.5 33.9004C71.8 39.3004 63 48.1004 57.6 58.8004L70.5 64.2004C74.4 56.8004 80.5 50.7004 87.9 46.8004ZM70.5 103.6L57.6 109C63 119.8 71.8 128.5 82.6 134L87.9 121C80.5 117.1 74.4 111 70.5 103.6ZM148.8 163.9C151.5 163.9 152.6 161.7 152.9 161.1L152.907 161.078C153.119 160.446 153.876 158.177 151.9 156.2L136.6 140.9L136.6 140.9C135.2 141.6 133.8 142.3 132.4 142.9C132.359 142.9 132.249 142.952 132.12 143.012C131.937 143.097 131.717 143.2 131.6 143.2C124.2 146.2 116.1 147.9 107.6 147.9C99.1 147.9 91.1 146.3 83.7 143.3C83.5 143.3 82.8 143 82.7 142.9C81.3 142.3 80 141.7 78.7 141L63.4 156.3C61.4 158.3 62.1 160.6 62.4 161.2C62.6 161.9 63.7 164 66.5 164L148.8 163.9ZM125.5 83.9C125.5 93.8 117.5 101.8 107.6 101.8C97.8 101.8 89.7 93.8 89.7 83.9C89.7 74 97.7 66 107.6 66C117.5 66 125.5 74 125.5 83.9ZM117.5 83.9C117.5 78.4 113 74 107.6 74C102.2 74 97.7 78.4 97.7 83.9C97.7 89.4 102.1 93.8 107.6 93.8C113.1 93.8 117.5 89.4 117.5 83.9Z"
      fill="#0F0E5B"
    ></path>
  </svg>
);

const MembershipIcon = () => (
  <svg
    className="w-6 h-6 mx-auto svg-safari-fix"
    viewBox="0 0 192 192"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M47.8 57H144.5C149.9 57 154.3 52.6 154.3 47.1V30.8C154.3 25.4 149.9 21 144.5 21H47.8C42.4 21 38 25.4 38 30.8V47.2C38 52.6 42.4 57 47.8 57Z"
      fill="#074C2D"
    ></path>
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M167.3 160.5H24.4C15.4 160.5 8 153.1 8 144.1V54.1998C8 45.1998 15.4 37.7998 24.4 37.7998H167.3C176.3 37.7998 183.7 45.1998 183.7 54.1998V144.1C183.7 153.1 176.3 160.5 167.3 160.5ZM24.4 45.7998C19.8 45.7998 16 49.5998 16 54.1998V144.1C16 148.7 19.8 152.5 24.4 152.5H167.3C171.9 152.5 175.7 148.7 175.7 144.1V54.1998C175.7 49.5998 171.9 45.7998 167.3 45.7998H24.4ZM118.5 92.2998H156C158.2 92.2998 160 90.4998 160 88.2998C160 86.0998 158.2 84.2998 156 84.2998H118.5C116.3 84.2998 114.5 86.0998 114.5 88.2998C114.5 90.4998 116.3 92.2998 118.5 92.2998ZM156 108.3H118.5C116.3 108.3 114.5 106.5 114.5 104.3C114.5 102.1 116.3 100.3 118.5 100.3H156C158.2 100.3 160 102.1 160 104.3C160 106.5 158.2 108.3 156 108.3ZM139.5 124.3H118.5C116.3 124.3 114.5 122.5 114.5 120.3C114.5 118.1 116.3 116.3 118.5 116.3H139.5C141.7 116.3 143.5 118.1 143.5 120.3C143.5 122.5 141.8 124.3 139.5 124.3ZM59.7 131.5C60.9 132.4 62.3999 132.9 63.7999 132.9C65.2999 132.9 66.7 132.5 68 131.4C82.5 120 89.3999 111.9 92.7 107.2C94.7 104.4 97.3 100.1 97.3 94.7996C97.3 84.1996 88.7 75.5996 78.0999 75.5996C72.0999 75.5996 67.2999 79.0996 64 83.1996C60.7 79.0996 55.9 75.5996 49.9 75.5996C39.3 75.5996 30.7 84.1996 30.7 94.7996C30.7 97.8996 31.5 101 32.9 103.7C33.7 105.5 38.7 114.9 59.7 131.5ZM38.7 94.8996C38.7 88.6996 43.7 83.6996 49.9 83.6996C54.2 83.6996 58.1 87.8996 59.9 91.7996C60.6 93.3996 62.2999 94.3996 64 94.3996C65.7 94.3996 67.2999 93.3996 68.0999 91.7996C70 87.8996 73.8999 83.7996 78.0999 83.7996C84.2999 83.7996 89.3 88.7996 89.3 94.9996C89.3 97.2996 88.2999 99.6996 86.0999 102.8C83.7 106.2 77.5999 113.6 63.7999 124.6C44.0999 108.9 40.2 100.5 40.2 100.5L40 100.1C39.1 98.4996 38.7 96.6996 38.7 94.8996Z"
      fill="#0F0E5B"
    ></path>
  </svg>
);

const AuctionIcon = () => (
  <svg
    className="w-6 h-6 mx-auto svg-safari-fix"
    viewBox="0 0 192 192"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_7164_1781)">
      <path
        d="M147.938 105H32.2566C28.2144 105 24.9375 108.277 24.9375 112.319V134.169C24.9375 138.211 28.2144 141.488 32.2566 141.488H147.938C151.98 141.488 155.257 138.211 155.257 134.169V112.319C155.257 108.277 151.98 105 147.938 105Z"
        fill="#074C2D"
      ></path>
      <path
        d="M82.8183 160.147H24.8473C21.5287 160.147 18.8317 157.45 18.8317 154.131V150.532C18.8317 145.228 23.1429 140.917 28.4467 140.917H79.2289C84.5328 140.917 88.844 145.228 88.844 150.532V154.131C88.844 157.45 86.147 160.147 82.8283 160.147H82.8183ZM26.8526 152.126H80.8131V150.532C80.8131 149.65 80.1012 148.938 79.2189 148.938H28.4467C27.5644 148.938 26.8526 149.65 26.8526 150.532V152.126Z"
        fill="#0F0E5B"
      ></path>
      <path
        d="M67.2477 109.556C64.1998 109.556 61.1518 108.392 58.8358 106.076L35.8961 83.1367C33.6502 80.8909 32.407 77.9031 32.407 74.7248C32.407 71.5465 33.6402 68.5588 35.8961 66.3129C40.5382 61.6809 48.0778 61.6809 52.7199 66.3129L75.6596 89.2526C77.9055 91.4985 79.1487 94.4863 79.1487 97.6646C79.1487 100.843 77.9155 103.831 75.6596 106.076C73.3436 108.392 70.2957 109.556 67.2477 109.556ZM44.308 70.8547C43.3154 70.8547 42.3228 71.2357 41.5708 71.9877C40.8389 72.7196 40.4379 73.6921 40.4379 74.7248C40.4379 75.7575 40.8389 76.73 41.5708 77.462L64.5106 100.402C66.0245 101.916 68.4809 101.916 69.9848 100.402C70.7167 99.6698 71.1178 98.6973 71.1178 97.6646C71.1178 96.6319 70.7167 95.6593 69.9848 94.9274L47.0451 71.9877C46.2931 71.2357 45.3006 70.8547 44.308 70.8547Z"
        fill="#0F0E5B"
      ></path>
      <path
        d="M90.2677 97.8346C87.6308 97.8346 84.9839 96.832 82.9787 94.8168L80.7429 92.5809C76.7224 88.5605 76.7224 82.0134 80.7429 77.9929L93.6164 65.1194C95.5615 63.1744 98.1582 62.1016 100.905 62.1016C103.653 62.1016 106.249 63.1744 108.194 65.1194L110.43 67.3552C114.451 71.3757 114.451 77.9228 110.43 81.9432L97.5567 94.8168C95.5515 96.832 92.9046 97.8346 90.2677 97.8346ZM100.905 70.1225C100.294 70.1225 99.7223 70.3631 99.2812 70.7942L86.4076 83.6677C85.5153 84.56 85.5153 86.0138 86.4076 86.9062L88.6435 89.142C89.5358 90.0343 90.9896 90.0343 91.8819 89.142L104.755 76.2685C105.648 75.3761 105.648 73.9223 104.755 73.03L102.52 70.7942C102.088 70.3631 101.517 70.1225 100.895 70.1225H100.905Z"
        fill="#0F0E5B"
      ></path>
      <path
        d="M72.5716 97.5038L44.4684 69.4006L85.024 28.835L113.127 56.9381L72.5616 97.5038H72.5716ZM55.8079 69.4006L72.5716 86.1643L101.788 56.9482L85.024 40.1845L55.8079 69.4006Z"
        fill="#0F0E5B"
      ></path>
      <path
        d="M113.288 63.5155C110.24 63.5155 107.192 62.3525 104.876 60.0364L81.936 37.0967C77.3039 32.4646 77.3039 24.915 81.936 20.2729C86.5781 15.6408 94.1177 15.6408 98.7598 20.2729L121.7 43.2126C126.342 47.8447 126.342 55.3943 121.7 60.0364C119.383 62.3525 116.336 63.5155 113.288 63.5155ZM90.3479 24.8147C89.3553 24.8147 88.3627 25.1957 87.6107 25.9477C86.0968 27.4616 86.0968 29.918 87.6107 31.4219L110.55 54.3616C112.064 55.8756 114.521 55.8756 116.025 54.3616C117.529 52.8477 117.539 50.3913 116.025 48.8874L93.085 25.9477C92.333 25.1957 91.3405 24.8147 90.3479 24.8147Z"
        fill="#0F0E5B"
      ></path>
      <path
        d="M159.087 155.605C156.069 155.605 153.222 154.432 151.086 152.297L89.9167 91.1275L106.741 74.3037L167.91 135.473C172.321 139.884 172.321 147.053 167.91 151.465L167.078 152.297C164.942 154.432 162.105 155.605 159.087 155.605ZM101.256 91.1175L156.761 146.622C158.004 147.865 160.17 147.865 161.413 146.622L162.245 145.8C163.528 144.517 163.528 142.431 162.245 141.148L106.741 85.6432L101.266 91.1175H101.256Z"
        fill="#0F0E5B"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_7164_1781">
        <rect width="192" height="192" fill="white"></rect>
      </clipPath>
    </defs>
  </svg>
);

const OtherIcon = () => (
  <svg
    className="w-6 h-6 mx-auto svg-safari-fix"
    viewBox="0 0 192 192"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M55.6434 49.4263L143.417 137.199C145.705 139.488 145.705 143.198 143.417 145.487L122.012 166.891C119.724 169.179 116.014 169.179 113.725 166.891L25.952 79.1177C23.6635 76.8293 23.6635 73.1189 25.9519 70.8304L47.3561 49.4263C49.6445 47.1378 53.3549 47.1378 55.6434 49.4263Z"
      fill="#074C2D"
    ></path>
    <path
      d="M130.76 96.7602L152.73 74.7902L152.75 74.8102L164.54 62.9802C174.15 53.3702 174.7 38.1602 165.78 28.3602C161.16 23.2902 154.85 20.4002 148.01 20.2402C141.18 20.0802 134.73 22.6602 129.89 27.5002L126.78 30.6102L95.7 61.6902L57.08 23.0802C55.04 21.0402 52.32 19.9102 49.43 19.9102C46.54 19.9102 43.82 21.0302 41.78 23.0802L22.82 42.0402C18.6 46.2602 18.6 53.1202 22.82 57.3402L61.43 95.9501L34.01 123.37C31.66 125.72 29.92 128.65 28.98 131.83L20.98 158.98C19.94 162.51 20.91 166.33 23.51 168.93C25.42 170.84 27.99 171.88 30.62 171.88C31.57 171.88 32.53 171.75 33.46 171.47L60.61 163.47C63.8 162.53 66.72 160.79 69.07 158.44L96.49 131.02L134.31 168.85C136.42 170.96 139.19 172.01 141.96 172.01C144.73 172.01 147.5 170.96 149.61 168.85L168.57 149.89C170.61 147.85 171.74 145.13 171.74 142.24C171.74 139.35 170.62 136.63 168.57 134.59L130.75 96.7702L130.76 96.7602ZM135.54 33.1602C138.82 29.8802 143.18 28.1402 147.82 28.2502C152.45 28.3602 156.73 30.3102 159.86 33.7602C165.8 40.2802 165.36 50.8602 158.88 57.3402L156.2 60.0302L132.44 36.2702L135.55 33.1602H135.54ZM28.48 51.6802C27.38 50.5802 27.38 48.7902 28.48 47.6902L47.44 28.7302C48.51 27.6702 50.36 27.6702 51.43 28.7302L57.19 34.4902L47 44.6802C45.53 46.1502 45.53 48.5402 47 50.0102C47.74 50.7502 48.7 51.1102 49.67 51.1102C50.64 51.1102 51.6 50.7402 52.34 50.0102L62.53 39.8202L67.38 44.6702L60.02 52.0302C58.55 53.5002 58.55 55.8902 60.02 57.3602C60.76 58.1002 61.72 58.4702 62.69 58.4702C63.66 58.4702 64.62 58.1002 65.36 57.3702L72.72 50.0102L77.57 54.8602L67.38 65.0502C65.91 66.5202 65.91 68.9102 67.38 70.3802C68.12 71.1202 69.08 71.4802 70.05 71.4802C71.02 71.4802 71.98 71.1102 72.72 70.3802L82.91 60.1902L90.06 67.3402L67.11 90.2902L28.48 51.6802ZM31.21 163.8C30.16 164.11 29.44 163.54 29.18 163.28C28.92 163.02 28.35 162.3 28.66 161.25L36.66 134.1C36.72 133.88 36.82 133.68 36.89 133.47L58.99 155.57C58.78 155.65 58.57 155.74 58.36 155.8L31.21 163.8ZM65.47 150.74L41.72 126.99L126.77 41.9202L150.52 65.6702L65.46 150.73L65.47 150.74ZM162.93 144.23L143.97 163.19C142.87 164.29 141.08 164.29 139.98 163.19L102.16 125.37L125.11 102.42L132.23 109.54L122.04 119.73C120.57 121.2 120.57 123.59 122.04 125.06C122.78 125.8 123.74 126.16 124.71 126.16C125.68 126.16 126.64 125.79 127.38 125.06L137.57 114.87L142.42 119.72L135.06 127.08C133.59 128.55 133.59 130.94 135.06 132.41C135.8 133.15 136.76 133.51 137.73 133.51C138.7 133.51 139.66 133.14 140.4 132.41L147.76 125.05L152.61 129.9L142.42 140.09C140.95 141.56 140.95 143.95 142.42 145.42C143.16 146.16 144.12 146.52 145.09 146.52C146.06 146.52 147.02 146.15 147.76 145.42L157.95 135.23L162.95 140.23C163.48 140.76 163.78 141.47 163.78 142.22C163.78 142.97 163.49 143.68 162.95 144.21L162.93 144.23Z"
      fill="#0F0E5B"
    ></path>
  </svg>
);

const campaignTypes = [
  // { title: "Event", icon: <EventIcon /> },
  { title: "Donation", icon: <DonationIcon /> },
  { title: "Peer-to-peer", icon: <PeerIcon /> },
  // { title: "Online shop", icon: <ShopIcon /> },
  // { title: "Raffle", icon: <RaffleIcon /> },
  // { title: "Membership", icon: <MembershipIcon /> },
  // { title: "Auction", icon: <AuctionIcon /> },
  // { title: "Other sales", icon: <OtherIcon /> },
];

function renderStep(
  step,
  campaignData,
  setCampaignData,
  handleDelete,
  showInputSteps,
  toggleInput,
  errors
) {
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setCampaignData((prev) => ({
        ...prev,
        banner: previewUrl,
        bannerFile: file,
      }));
    }
  };

  const handleDeleteBanner = () => {
    setCampaignData((prev) => ({
      ...prev,
      banner: null,
      bannerFile: null,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setCampaignData((prev) => ({
        ...prev,
        logo: previewUrl,
        logoFile: file,
      }));
    }
  };

  const handleDeletelogo = () => {
    setCampaignData((prev) => ({
      ...prev,
      logo: null,
      logoFile: null,
    }));
  };

  // Helper component for Suggested Amounts section
  const SuggestedAmountSection = ({
    title,
    type, // 'oneTime', 'monthly', 'yearly'
    isActive,
    amounts,
    onToggle,
    onAmountChange,
    onAddAmount,
    onDeleteAmount,
    errors,
  }) => (
    <div className="bg-gray-100 p-4 rounded-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              isActive
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isActive}
            onChange={() => onToggle(type)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary" />
        </label>
      </div>

      {isActive && (
        <div className="space-y-3">
          {amounts.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2">
              <div className="relative flex-grow-[1]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  $
                </span>
                <input
                  type="number"
                  className="w-full border rounded-lg pl-7 pr-3 py-2 focus:outline-none"
                  value={item.amount === 0 ? "" : item.amount} // Display empty string for 0 for better UX
                  onChange={(e) =>
                    onAmountChange(
                      type,
                      item.id,
                      "amount",
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  min="1"
                />
                {errors?.[`${type}.amounts.${index}.amount`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[`${type}.amounts.${index}.amount`]}
                  </p>
                )}
              </div>
              <div className="relative flex-grow-[2]">
                <input
                  type="text"
                  className="w-full border rounded-lg p-2 text-sm focus:outline-none"
                  placeholder="Describe how this amount will make a difference"
                  value={item.description}
                  onChange={(e) =>
                    onAmountChange(type, item.id, "description", e.target.value)
                  }
                />
                {errors?.[`${type}.amounts.${index}.description`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[`${type}.amounts.${index}.description`]}
                  </p>
                )}
              </div>
              {/* <button
                onClick={() => onDeleteAmount(type, item.id)}
                className="p-2 text-gray-500 hover:text-red-500 transition"
              >
                <LucideDelete size={20} />
              </button> */}
            </div>
          ))}
          {errors?.[`${type}.amounts`] && ( // Error for empty section when active
            <p className="text-red-500 text-sm mt-1">
              {errors[`${type}.amounts`]}
            </p>
          )}
          {/* <button
            onClick={() => onAddAmount(type)}
            className="flex items-center gap-2 px-3 py-2 border rounded-lg text-primary hover:bg-primary-50 transition"
          >
            <Plus size={16} /> Add Amount
          </button> */}
        </div>
      )}
    </div>
  );

  switch (step) {
    case 0:
      return (
        <div>
          <h1 className="text-2xl font-semibold mb-2">
            What causes do you want to create?
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-3 mt-4 gap-2 md:gap-4">
            {campaignTypes.map((item) => {
              const active = campaignData.causeType === item.title;

              return (
                <button
                  key={item.title}
                  onClick={() =>
                    setCampaignData((prev) => ({
                      ...prev,
                      causeType: item.title,
                    }))
                  }
                  className={`border rounded-xl p-4 text-center transition flex justify-center items-center gap-4
          ${active ? "border-primary bg-primary/10" : "hover:border-primary"}
        `}
                >
                  <div className="flex justify-center items-center">
                    {item.icon}
                  </div>
                  <p className="font-medium">{item.title}</p>
                </button>
              );
            })}
          </div>
          {errors.causeType && (
            <p className="text-red-500 text-sm my-2">{errors.causeType}</p>
          )}
        </div>
      );

    case 1:
      return (
        <div>
          <h1 className="text-xl font-semibold mb-4">Title your causes</h1>
          <label htmlFor="cause-title" className="py-2 block">
            Title
          </label>
          <input
            id="cause-title"
            className="w-full border rounded-lg p-2"
            placeholder="Causes title"
            value={campaignData.title}
            onChange={(e) =>
              setCampaignData((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>
      );

    case 2: {
      const showInput = showInputSteps[step] || false;
      return (
        <div>
          <h1 className="text-xl font-semibold mb-4">Set a fundraising goal</h1>
          <p className="pb-2">
            Causes with a thermometer raise more money, and donors love watching
            the progress towards reaching your goal!
          </p>
          <div className="w-full">
            {!showInput ? (
              <button
                onClick={() => toggleInput(step)}
                className="flex gap-2 px-4 py-2 mt-3 bg-transparent text-primary border border-dotted border-2 hover:bg-primary hover:text-white border-primary rounded-lg"
              >
                <Plus /> Add a fundraising goal
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg flex-col">
                <div className="flex justify-between items-center w-full">
                  <label htmlFor="">Target</label>
                  <button
                    onClick={() => handleDelete(step)}
                    className="px-4 py-2"
                  >
                    <LucideDelete />
                  </button>
                </div>
                <div className="relative w-full">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    $
                  </span>

                  <input
                    type="number"
                    className="w-full border rounded-lg pl-7 pr-3 py-2 focus:outline-none"
                    value={campaignData.goalAmount}
                    onChange={(e) =>
                      setCampaignData((prev) => ({
                        ...prev,
                        goalAmount: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                {errors.goalAmount && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.goalAmount}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    case 3: {
      const showInputDesc = showInputSteps[step] || false;
      return (
        <div>
          <h1 className="text-xl font-semibold mb-4">
            Share more about your mission
          </h1>
          <p className="mt-0 mb-2 pt-0">
            Share what makes your cause special and inspire supporters to give.
          </p>
          {showInputDesc ? (
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex justify-between items-center w-full">
                <label htmlFor="">Description</label>
                <button
                  onClick={() => handleDelete(step)}
                  className="px-4 py-2"
                >
                  <LucideDelete />
                </button>
              </div>
              <ReactQuill
                theme="snow"
                value={campaignData.description}
                onChange={(value) =>
                  setCampaignData((prev) => ({
                    ...prev,
                    description: value,
                  }))
                }
                modules={quillModules}
                formats={quillFormats}
                placeholder="Write your description…"
                className="bg-white rounded-lg border-none"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.description}
                </p>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => toggleInput(step)}
                className="flex gap-2 px-4 py-2 mt-3 bg-transparent text-primary border border-dotted border-2 hover:bg-primary hover:text-white border-primary rounded-lg"
              >
                <Plus /> Add a Description
              </button>
              {errors.description && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.description}
                </p>
              )}
            </>
          )}
        </div>
      );
    }

    case 4:
      return (
        <div>
          <h1 className="text-xl font-semibold mb-4">
            Set the color of your cause
          </h1>
          <div className="p-4 bg-gray-100 rounded-lg">
            <label className="block text-md font-medium mb-3">
              Select a color
            </label>

            <div className="flex flex-wrap gap-3">
              {colors.map((color, index) => {
                const isGradient = color.includes("gradient");

                return (
                  <button
                    key={index}
                    onClick={() =>
                      setCampaignData((prev) => ({ ...prev, color }))
                    }
                    className={`w-10 h-10 rounded-md border cursor-pointer
            ${
              campaignData.color === color
                ? "ring-2 ring-primary"
                : "hover:ring-2 hover:ring-gray-300"
            }`}
                    style={{
                      background: isGradient ? color : undefined,
                      backgroundColor: !isGradient ? color : undefined,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      );

    case 5:
      return (
        <>
          <div className="flex flex-col gap-4 ">
            <label className="text-xl font-semibold">Add a banner</label>
            <div className="w-full bg-gray-100 p-5 rounded-lg">
              <label className="font-semibold text-lg pb-2">Banner</label>
              <div
                className="relative w-full border-2 mt-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition"
                onClick={() => document.getElementById("bannerInput").click()}
              >
                <input
                  type="file"
                  id="bannerInput"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                />
                {!campaignData.banner ? (
                  <>
                    <div className="text-gray-400 flex flex-col items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 15a4 4 0 014-4h1a1 1 0 011 1v1a4 4 0 004 4h4a4 4 0 004-4v-1a1 1 0 011-1h1a4 4 0 014 4v4a4 4 0 01-4 4H7a4 4 0 01-4-4v-4z"
                        />
                      </svg>
                      <p className="text-gray-600 text-center">
                        Click or drag banner to upload
                      </p>
                    </div>
                    {errors.banner && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.banner}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="relative w-full">
                    <img
                      src={campaignData.banner}
                      alt="Banner Preview"
                      className="w-full h-60 object-cover rounded"
                    />
                    <button
                      onClick={handleDeleteBanner}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
                    >
                      <LucideDelete size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      );

    case 6:
      return (
        <div className="flex flex-col gap-4">
          <label className="font-semibold text-lg">Upload your Logo</label>
          <p>For best results, choose a square logo.</p>
          <div
            className="relative w-full border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition"
            onClick={() => document.getElementById("logoInput").click()}
          >
            <input
              type="file"
              id="logoInput"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
            {!campaignData.logo ? (
              <>
                <div className="text-gray-400 flex flex-col items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 15a4 4 0 014-4h1a1 1 0 011 1v1a4 4 0 004 4h4a4 4 0 004-4v-1a1 1 0 011-1h1a4 4 0 014 4v4a4 4 0 01-4 4H7a4 4 0 01-4-4v-4z"
                    />
                  </svg>
                  <p className="text-gray-600 text-center">
                    Click or drag logo to upload
                  </p>
                </div>
                {errors.logo && (
                  <p className="text-red-500 text-sm mt-2">{errors.logo}</p>
                )}
              </>
            ) : (
              <div className="relative w-full">
                <img
                  src={campaignData.logo}
                  alt="Logo Preview"
                  className="w-full h-60 object-cover rounded"
                />
                <button
                  onClick={handleDeletelogo}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
                >
                  <LucideDelete size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      );

    case 7:
      return (
        <div>
          <h1 className="text-xl font-semibold mb-4">
            What is the most common donation amount you expect to receive on
            this cause?
          </h1>
          <p>
            Based on your answer, we’ll suggest donation amounts to help you
            raise more. Our smart recommendations have been shown to increase
            donations by 10%!
          </p>
          <div className="space-y-3">
            {["Less than $100", "$100 - $300", "More than $300"].map(
              (amount) => (
                <button
                  key={amount}
                  className={`w-full border p-2 rounded-lg mt-3 ${
                    campaignData.commonDonation === amount
                      ? "border-gray-700 text-gray-700"
                      : "border-primary text-primary hover:border-gray-700"
                  }`}
                  onClick={() =>
                    setCampaignData((prev) => ({
                      ...prev,
                      commonDonation: amount,
                    }))
                  }
                >
                  {amount}
                </button>
              )
            )}

            <p className="mt-2">
              Selected Donation: <strong>{campaignData.commonDonation}</strong>
            </p>
            {errors.commonDonation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.commonDonation}
              </p>
            )}
          </div>
        </div>
      );

    case 8: // NEW: Suggested Amounts Step
      const handleToggleSuggestedAmounts = (type) => {
        setCampaignData((prev) => ({
          ...prev,
          suggestedAmounts: {
            ...prev.suggestedAmounts,
            [type]: {
              ...prev.suggestedAmounts[type],
              isActive: !prev.suggestedAmounts[type].isActive,
            },
          },
        }));
      };

      const handleSuggestedAmountChange = (type, id, field, value) => {
        setCampaignData((prev) => ({
          ...prev,
          suggestedAmounts: {
            ...prev.suggestedAmounts,
            [type]: {
              ...prev.suggestedAmounts[type],
              amounts: prev.suggestedAmounts[type].amounts.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
              ),
            },
          },
        }));
      };

      const handleAddSuggestedAmount = (type) => {
        setCampaignData((prev) => ({
          ...prev,
          suggestedAmounts: {
            ...prev.suggestedAmounts,
            [type]: {
              ...prev.suggestedAmounts[type],
              amounts: [
                ...prev.suggestedAmounts[type].amounts,
                { id: Date.now(), amount: "", description: "" }, // New item, amount can be empty initially for user input
              ],
            },
          },
        }));
      };

      const handleDeleteSuggestedAmount = (type, id) => {
        setCampaignData((prev) => ({
          ...prev,
          suggestedAmounts: {
            ...prev.suggestedAmounts,
            [type]: {
              ...prev.suggestedAmounts[type],
              amounts: prev.suggestedAmounts[type].amounts.filter(
                (item) => item.id !== id
              ),
            },
          },
        }));
      };

      return (
        <div>
          <h1 className="text-xl font-semibold mb-4">
            Suggested Donation Amounts
          </h1>
          <p className="text-gray-600 mb-6">
            Based on your answer on the previous step, we suggest the following
            amounts. Feel free to adjust them if needed!
          </p>

          <SuggestedAmountSection
            title="One-time amounts"
            type="oneTime"
            isActive={campaignData.suggestedAmounts.oneTime.isActive}
            amounts={campaignData.suggestedAmounts.oneTime.amounts}
            onToggle={handleToggleSuggestedAmounts}
            onAmountChange={handleSuggestedAmountChange}
            onAddAmount={handleAddSuggestedAmount}
            onDeleteAmount={handleDeleteSuggestedAmount}
            errors={errors}
          />

          <SuggestedAmountSection
            title="Monthly amounts"
            type="monthly"
            isActive={campaignData.suggestedAmounts.monthly.isActive}
            amounts={campaignData.suggestedAmounts.monthly.amounts}
            onToggle={handleToggleSuggestedAmounts}
            onAmountChange={handleSuggestedAmountChange}
            onAddAmount={handleAddSuggestedAmount}
            onDeleteAmount={handleDeleteSuggestedAmount}
            errors={errors}
          />

          <SuggestedAmountSection
            title="Yearly amounts"
            type="yearly"
            isActive={campaignData.suggestedAmounts.yearly.isActive}
            amounts={campaignData.suggestedAmounts.yearly.amounts}
            onToggle={handleToggleSuggestedAmounts}
            onAmountChange={handleSuggestedAmountChange}
            onAddAmount={handleAddSuggestedAmount}
            onDeleteAmount={handleDeleteSuggestedAmount}
            errors={errors}
          />
        </div>
      );

    case 9: // OLD: Case 8 - Tax Receipts
      return (
        <div>
          <h1 className="text-xl font-semibold mb-4">
            Would you like to automatically generate & send tax receipts?
          </h1>
          <p>
            Whenever a donation is made on your campaign, Zeffy will
            automatically generate a tax receipt and send it to the donor
            directly. For recurring donations, we'll send one consolidated tax
            receipt for the whole year.
          </p>
          <div className="mt-6 flex items-center gap-4">
            Auto generate & send tax receipts
            <label className="relative inline-flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={campaignData.taxReceipt}
                onChange={(e) =>
                  setCampaignData((prev) => ({
                    ...prev,
                    taxReceipt: e.target.checked,
                  }))
                }
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary" />
            </label>
          </div>
        </div>
      );

    case 10: // OLD: Case 9 - Custom Questions
      const handleAddCustomQuestion = () => {
        setCampaignData((prev) => ({
          ...prev,
          customQuestions: [
            ...prev.customQuestions,
            { question: "", answer: "" },
          ],
        }));
      };

      const handleCustomQuestionChange = (index, field, value) => {
        const updatedQuestions = [...campaignData.customQuestions];
        updatedQuestions[index][field] = value;
        setCampaignData((prev) => ({
          ...prev,
          customQuestions: updatedQuestions,
        }));
      };

      const handleDeleteCustomQuestion = (index) => {
        const updatedQuestions = [...campaignData.customQuestions];
        updatedQuestions.splice(index, 1);
        setCampaignData((prev) => ({
          ...prev,
          customQuestions: updatedQuestions,
        }));
      };

      return (
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-semibold mb-2">Add custom questions</h1>
          <p className="text-gray-600 mb-4">
            Gather more info on your donors. By default, we ask the donor for
            the following information for your records:
          </p>

          <button
            onClick={handleAddCustomQuestion}
            className="self-start border px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark transition"
          >
            Add Question
          </button>

          <div className="flex flex-col gap-3 mt-4">
            {campaignData.customQuestions.map((q, index) => {
              const questionError = errors[`customQuestions.${index}.question`];

              return (
                <div
                  key={index}
                  className="border p-3 rounded-lg bg-gray-50 relative"
                >
                  <button
                    onClick={() => handleDeleteCustomQuestion(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <LucideDelete size={16} />
                  </button>

                  <label className="block mb-1 font-medium">Question</label>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) =>
                      handleCustomQuestionChange(
                        index,
                        "question",
                        e.target.value
                      )
                    }
                    placeholder="Type your question..."
                    className="w-full border rounded p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {questionError && (
                    <p className="text-red-500 text-sm mb-1">{questionError}</p>
                  )}

                  <label className="block mb-1 font-medium">Answer</label>
                  <input
                    type="text"
                    value={q.answer}
                    onChange={(e) =>
                      handleCustomQuestionChange(
                        index,
                        "answer",
                        e.target.value
                      )
                    }
                    placeholder="Type your answer..."
                    className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              );
            })}
          </div>
        </div>
      );

    case 11: // OLD: Case 10 - Thank You Email
      return (
        <div>
          <h1 className="text-xl font-semibold mb-4">Thank you email</h1>
          <p className="text-gray-600 mb-3">
            This email will be automatically sent to your donors and will
            include their transaction receipts. If applicable, their tax
            receipts will also be attached.
          </p>

          <input
            type="text"
            className="border w-full p-2 rounded-lg my-3 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Email subject"
            value={campaignData.thankYouEmail.subject}
            onChange={(e) =>
              setCampaignData((prev) => ({
                ...prev,
                thankYouEmail: {
                  ...prev.thankYouEmail,
                  subject: e.target.value,
                },
              }))
            }
          />
          {errors.thankYouSubject && (
            <p className="text-red-500 text-sm mt-1">
              {errors.thankYouSubject}
            </p>
          )}

          <ReactQuill
            theme="snow"
            value={campaignData.thankYouEmail.body}
            onChange={(value) =>
              setCampaignData((prev) => ({
                ...prev,
                thankYouEmail: {
                  ...prev.thankYouEmail,
                  body: value,
                },
              }))
            }
            modules={quillModules}
            formats={quillFormats}
            placeholder="Write your thank you email…"
            className="bg-white rounded-lg border-none"
          />
          {errors.thankYouBody && (
            <p className="text-red-500 text-sm mt-2">{errors.thankYouBody}</p>
          )}
        </div>
      );

    case 12: // OLD: Case 11 - Advanced Settings
      return (
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-semibold mb-4">Advanced settings</h1>
          <div className="bg-gray-100 p-4 rounded-lg mt-3 flex gap-4 flex-col">
          <label className="flex items-center gap-4">
            In honor / memory
            <label className="relative inline-flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={campaignData.advanced.honor}
                onChange={(e) =>
                  setCampaignData((prev) => ({
                    ...prev,
                    advanced: {
                      ...prev.advanced,
                      honor: e.target.checked,
                    },
                  }))
                }
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary" />
            </label>
          </label>

          <label className="flex items-center gap-4 mt-2">
            Cheque payments
            <label className="relative inline-flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={campaignData.advanced.cheque}
                onChange={(e) =>
                  setCampaignData((prev) => ({
                    ...prev,
                    advanced: {
                      ...prev.advanced,
                      cheque: e.target.checked,
                    },
                  }))
                }
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary" />
            </label>
          </label>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg mt-3">
            <label htmlFor="" className="font-medium">
              Notifications
            </label>
            <p className="text-gray-600 text-sm">
              Email addresses to notify when a payment is made (separate emails
              with commas)
            </p>
            <input
              type="text"
              className="border w-full p-2 mt-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Notification emails"
              value={campaignData.advanced.notificationEmails}
              onChange={(e) =>
                setCampaignData((prev) => ({
                  ...prev,
                  advanced: {
                    ...prev.advanced,
                    notificationEmails: e.target.value,
                  },
                }))
              }
            />
          </div>
        </div>
      );

    case 13: // OLD: Case 12 - Success
      return (
        <div className="text-center">
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
              <svg
                className="h-8 w-8 text-green-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold">
              Congrats! Your campaign is ready.
            </h1>
            <p className="text-gray-600">
              Your campaign has been created successfully.
            </p>
          </div>

          <div className="pt-4 max-w-xl mx-auto">
            <Link to="/dashboard">
              <button className="flex items-center justify-between gap-3 px-5 py-4 mb-3 hover:bg-gray-100 w-full rounded-lg border border-primary text-gray-900 font-semibold">
                <div className="flex gap-3 justify-center items-center">
                  <svg
                    width={28}
                    height={28}
                    className="svg-safari-fix bg-[#DCFCE7] p-1 rounded-md"
                    viewBox="0 0 24 24"
                    fill="inherit"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M19 14.0405C19 13.4905 19.45 13.0405 20 13.0405C20.55 13.0405 21 13.4905 21 14.0405V17.9805C21 19.6305 19.65 20.9805 18 20.9805H6C4.35 20.9805 3 19.6305 3 17.9805V5.98047C3 4.33047 4.35 2.98047 6 2.98047H10.45C11 2.98047 11.45 3.43047 11.45 3.98047C11.45 4.53047 11 4.98047 10.45 4.98047H6C5.45 4.98047 5 5.43047 5 5.98047V17.9805C5 18.5305 5.45 18.9805 6 18.9805H18C18.55 18.9805 19 18.5305 19 17.9805V14.0405ZM17.52 5.01047H14.63H14.62C14.07 5.01047 13.62 4.56047 13.62 4.01047C13.62 3.46047 14.07 3.01047 14.62 3.01047L20 2.98047C20.27 2.98047 20.52 3.08047 20.71 3.27047C20.9 3.46047 21 3.72047 21 3.99047L20.94 9.30047C20.93 9.85047 20.49 10.2905 19.94 10.2905H19.93C19.38 10.2805 18.94 9.83047 18.94 9.28047L18.97 6.36047L9.65 15.6805C9.45 15.8705 9.2 15.9705 8.94 15.9705C8.68 15.9705 8.43 15.8805 8.23 15.6805C7.84 15.2905 7.84 14.6605 8.23 14.2705L17.52 5.01047Z"
                      fill="inherit"
                    ></path>
                  </svg>
                  <span>View my causes</span>
                </div>
                <svg
                  width={20}
                  height={20}
                  className="svg-safari-fix"
                  viewBox="0 0 24 24"
                  fill="inherit"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.40003 19.9396C8.14003 19.9396 7.88003 19.8396 7.69003 19.6396C7.30003 19.2496 7.31003 18.6096 7.71003 18.2296L14.1 11.9796L7.66003 5.60958C7.27003 5.21958 7.26003 4.58958 7.66003 4.19958C8.05003 3.80958 8.68003 3.79958 9.07003 4.19958L16.22 11.2796C16.41 11.4696 16.52 11.7296 16.52 11.9896C16.52 12.2496 16.41 12.5096 16.22 12.6996L9.11003 19.6596C8.92003 19.8496 8.66003 19.9496 8.41003 19.9496L8.40003 19.9396Z"
                    fill="inherit"
                  ></path>
                </svg>
              </button>
            </Link>
            <Link to="/dashboard">
              <button className="flex items-center justify-between gap-3 px-5 py-4 mb-3 hover:bg-gray-100 w-full rounded-lg border border-primary text-gray-900 font-semibold">
                <div className="flex gap-3 justify-center items-center">
                  <svg
                    width={28}
                    height={28}
                    className="svg-safari-fix bg-[#DCFCE7] p-1 rounded-md"
                    viewBox="0 0 24 24"
                    fill="inherit"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17 15.0201C16.29 15.0201 15.66 15.2801 15.15 15.6901L9.85999 12.5501C9.88999 12.3801 9.90999 12.2001 9.90999 12.0101C9.90999 11.8201 9.88999 11.6301 9.84999 11.4501L15.12 8.32008C15.63 8.74008 16.28 9.00008 16.99 9.00008C18.62 9.00008 19.95 7.68008 19.95 6.04008C19.95 4.40008 18.63 3.08008 16.99 3.08008C15.35 3.08008 14.03 4.40008 14.03 6.04008C14.03 6.23008 14.05 6.42008 14.09 6.60008L8.81999 9.73008C8.30999 9.31008 7.65999 9.05008 6.94999 9.05008C5.31999 9.05008 3.98999 10.3701 3.98999 12.0101C3.98999 13.6501 5.30999 14.9701 6.94999 14.9701C7.66999 14.9701 8.31999 14.7001 8.83999 14.2701L14.1 17.3901C14.06 17.5801 14.04 17.7701 14.04 17.9701C14.04 19.6001 15.36 20.9301 17 20.9301C18.64 20.9301 19.96 19.6101 19.96 17.9701C19.96 16.3301 18.64 15.0101 17 15.0101V15.0201Z"
                      fill="inherit"
                    ></path>
                  </svg>
                  <span>Share my causes</span>
                </div>
                <svg
                  width={20}
                  height={20}
                  className="svg-safari-fix"
                  viewBox="0 0 24 24"
                  fill="inherit"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.40003 19.9396C8.14003 19.9396 7.88003 19.8396 7.69003 19.6396C7.30003 19.2496 7.31003 18.6096 7.71003 18.2296L14.1 11.9796L7.66003 5.60958C7.27003 5.21958 7.26003 4.58958 7.66003 4.19958C8.05003 3.80958 8.68003 3.79958 9.07003 4.19958L16.22 11.2796C16.41 11.4696 16.52 11.7296 16.52 11.9896C16.52 12.2496 16.41 12.5096 16.22 12.6996L9.11003 19.6596C8.92003 19.8496 8.66003 19.9496 8.41003 19.9496L8.40003 19.9396Z"
                    fill="inherit"
                  ></path>
                </svg>
              </button>
            </Link>
          </div>
        </div>
      );

    default:
      return null;
  }
}

export default CreateCampaign;
