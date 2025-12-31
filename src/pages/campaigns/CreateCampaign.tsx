import { Footer } from "@/components/shared/Footer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Image } from "@/components/ui/Image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { africanCountries } from "@/lib/countries";
import { campaignCauses } from "@/lib/types";
import { FALLBACK_IMAGE } from "@/lib/utils";
import { campaignApi } from "@/service/apiService";
import {
  ArrowLeft,
  Calendar,
  Image as ImageIcon,
  MapPin,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

// interface FAQItem {
//   question: string;
//   answer: string;
// }

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { campaignId } = useParams();
  const isEditMode = !!campaignId;
  const [isLoading, setIsLoading] = useState(false);
  const [isPerpetual, setIsPerpetual] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fundingGoal: "",
    endDate: "",
    cause: "",
    country: "",
    campaignSlug: "",
    status: "draft",
  });
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [currentCoverImageUrl, setCurrentCoverImageUrl] = useState<
    string | null
  >(null);
  const [currentAdditionalImages, setCurrentAdditionalImages] = useState<
    string[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  // faqs
  // const [faqs, setFaqs] = useState<FAQItem[]>([]);
  // const [newQuestion, setNewQuestion] = useState("");
  // const [newAnswer, setNewAnswer] = useState("");

  // Fetch campaign data if in edit mode
  useEffect(() => {
    const fetchCampaignData = async () => {
      if (!isEditMode) return;

      setIsLoading(true);
      try {
        const response = await campaignApi.getCampaign(campaignId!);

        if (!response.success) {
          throw new Error(response.error || "Failed to fetch cause data");
        }

        const campaign = response.data;

        // Set form data from campaign
        setFormData({
          title: campaign.title,
          description: campaign.description,
          fundingGoal: campaign.fundingGoal.toString(),
          endDate: campaign.deadline
            ? new Date(campaign.deadline).toISOString().split("T")[0]
            : "",
          cause: campaign.cause,
          country: campaign.country,
          campaignSlug: campaign.campaignSlug || "",
          status: campaign.status,
        });

        // Set perpetual status based on deadline
        setIsPerpetual(!campaign.deadline);

        // Set current images
        if (campaign.media?.mainImage) {
          setCurrentCoverImageUrl(campaign.media.mainImage);
        }

        if (campaign.media?.additionalImages?.length) {
          setCurrentAdditionalImages(campaign.media.additionalImages);
        }
        
        // if (campaign.faqs && Array.isArray(campaign.faqs)) {
        //   setFaqs(campaign.faqs);
        // } else if (typeof campaign.faqs === "string") {
        //   try {
        //     const parsedFaqs = JSON.parse(campaign.faqs);
        //     if (Array.isArray(parsedFaqs)) {
        //       setFaqs(parsedFaqs);
        //     }
        //   } catch (err) {
        //     console.error("Failed to parse faqs", err);
        //   }
        // }

      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaignData();
  }, [campaignId, isEditMode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 500 * 1024) {
        // 500KB in bytes
        toast.error("Cover image must be under 500KB");
        return;
      }
      setCoverImage(file);
      setCurrentCoverImageUrl(null); // Clear the current URL since we're uploading a new image
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter((file) => {
        if (file.size > 500 * 1024) {
          // 500KB in bytes
          toast.error(`${file.name} is too large. Images must be under 500KB`);
          return false;
        }
        return true;
      });
      setMediaFiles((prev) => [...prev, ...newFiles].slice(0, 2)); // Limit to 2 additional images as per API
      setCurrentAdditionalImages([]); // Clear current additional images
    }
  };

  const removeMediaFile = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeCurrentAdditionalImage = (index: number) => {
    setCurrentAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    setCurrentCoverImageUrl(null);
  };

  // faq
  // const addFAQ = () => {
  //   if (newQuestion.trim() === "" || newAnswer.trim() === "") return;
  //   setFaqs([...faqs, { question: newQuestion, answer: newAnswer }]);
  //   setNewQuestion("");
  //   setNewAnswer("");
  // };

  // const removeFAQ = (index: number) => {
  //   setFaqs(faqs.filter((_, i) => i !== index));
  // };

  const handleSubmit = async (
    e: React.FormEvent,
    submitStatus: "draft" | "ongoing"
  ) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Basic validation
      if (
        !formData.title ||
        !formData.description ||
        !formData.fundingGoal ||
        (!isPerpetual && !formData.endDate) ||
        !formData.cause ||
        !formData.country
      ) {
        throw new Error("Please fill in all required fields");
      }

      if (!coverImage && !currentCoverImageUrl) {
        throw new Error("Please upload a cover image for your cause");
      }

      // if (!faqs || faqs.length === 0) {
      //   throw new Error("Please add at least one FAQ for your campaign");
      // }
      // for (const faq of faqs) {
      //   if (!faq.question.trim() || !faq.answer.trim()) {
      //     throw new Error("Each FAQ must have a question and an answer");
      //   }
      // }

      // Prepare campaign data
      const campaignData = {
        title: formData.title,
        description: formData.description,
        fundingGoal: Number(formData.fundingGoal),
        cause: formData.cause,
        country: formData.country,
        campaignSlug: formData.campaignSlug || undefined,
        status: submitStatus, // Set status based on which button was clicked
        deadline:
          !isPerpetual && formData.endDate
            ? new Date(formData.endDate).getTime()
            : undefined,
        // faqs: JSON.stringify(faqs),
      };

      // Prepare media files
      const files: {
        mainImage?: File;
        additionalImages?: File[];
      } = {};

      if (coverImage) {
        files.mainImage = coverImage;
      }

      if (mediaFiles.length > 0) {
        files.additionalImages = mediaFiles;
      }

      let response;

      if (isEditMode) {
        // Update existing campaign
        response = await campaignApi.updateCampaign(
          campaignId!,
          campaignData,
          Object.keys(files).length > 0 ? files : undefined
        );
      } else {
        // Create new campaign
        response = await campaignApi.createCampaign(campaignData, {
          mainImage: coverImage!,
          additionalImages: mediaFiles.length > 0 ? mediaFiles : undefined,
        });
      }

      if (!response.success) {
        throw new Error(
          response.error ||
          `Failed to ${isEditMode ? "update" : "create"} cause`
        );
      }

      toast.success(
        `cause ${isEditMode ? "updated" : "created"} successfully!`
      );
      navigate("/dashboard?tab=campaigns");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="mr-4"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <h1 className="text-3xl font-bold">
                {isEditMode ? "Edit Causes" : "Create Causes"}
              </h1>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Basic Information Card */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>causes Information</CardTitle>
                  <CardDescription>
                    Basic details about your fundraising causes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="title">cause Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Give your cause a clear, attention-grabbing title"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">cause Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      rows={5}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your cause, its purpose, and how the funds will be used"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fundingGoal">Funding Goal</Label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                          $
                        </span>
                        <Input
                          id="fundingGoal"
                          name="fundingGoal"
                          type="number"
                          min="1"
                          value={formData.fundingGoal}
                          onChange={handleInputChange}
                          className="pl-7"
                          placeholder="10000"
                          required
                        />
                      </div>
                    </div>

                    {/* <div>
                      <Label htmlFor="campaignSlug">
                        Custom URL (Optional)
                      </Label>
                      <Input
                        id="campaignSlug"
                        name="campaignSlug"
                        value={formData.campaignSlug}
                        onChange={handleInputChange}
                        placeholder="your-campaign-name"
                        className="pl-3"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Leave blank to generate automatically from title
                      </p>
                    </div> */}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) =>
                          handleSelectChange(value, "country")
                        }
                      >
                        <SelectTrigger className="pl-9">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <SelectValue placeholder="Select African country" />
                        </SelectTrigger>
                        <SelectContent>
                          {africanCountries.map((country) => (
                            <SelectItem key={country.code} value={country.name}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="cause">Cause Category</Label>
                      <Select
                        value={formData.cause}
                        onValueChange={(value) =>
                          handleSelectChange(value, "cause")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select cause category" />
                        </SelectTrigger>
                        <SelectContent>
                          {campaignCauses.map((cause) => (
                            <SelectItem key={cause} value={cause}>
                              {cause}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>cause Duration</Label>
                        <p className="text-sm text-muted-foreground">
                          Set if your cause has an end date
                        </p>
                      </div>
                      <Switch
                        checked={!isPerpetual}
                        onCheckedChange={(checked) => setIsPerpetual(!checked)}
                      />
                    </div>

                    {!isPerpetual && (
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input
                          id="endDate"
                          name="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          className="pl-9"
                          required={!isPerpetual}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Media Uploads Card */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>cause Media</CardTitle>
                  <CardDescription>
                    Add visual content to make your cause more compelling
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Cover Image Upload */}
                  <div>
                    <Label className="block mb-2">Cover Image (Required)</Label>
                    {!coverImage && !currentCoverImageUrl ? (
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <div className="text-sm text-gray-600">
                          <label
                            htmlFor="cover-image"
                            className="cursor-pointer text-brand-purple hover:underline"
                          >
                            Click to upload
                          </label>{" "}
                          or drag and drop
                          <p className="text-xs text-gray-500">
                            Recommended size: 1200 × 630 pixels
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Maximum file size: 500KB
                          </p>
                        </div>
                        <input
                          id="cover-image"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleCoverImageChange}
                        />
                      </div>
                    ) : (
                      <div className="relative">
                        <Image
                          src={
                            coverImage
                              ? URL.createObjectURL(coverImage)
                              : currentCoverImageUrl!
                          }
                          alt="Cover preview"
                          className="w-full h-64 object-cover rounded-lg"
                          fallback={FALLBACK_IMAGE}
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-3 right-3"
                          onClick={removeCoverImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Additional Media Upload */}
                  <div>
                    <Label className="block mb-2">
                      Additional Images (Optional, max 2)
                    </Label>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <div className="text-sm text-gray-600">
                        <label
                          htmlFor="media-files"
                          className="cursor-pointer text-brand-purple hover:underline"
                        >
                          Click to upload
                        </label>{" "}
                        or drag and drop
                        <p className="text-xs text-gray-500">
                          Images only (max. 2 files, 500KB per image)
                        </p>
                      </div>
                      <input
                        id="media-files"
                        type="file"
                        multiple
                        className="hidden"
                        accept="image/*"
                        onChange={handleMediaUpload}
                        disabled={
                          mediaFiles.length + currentAdditionalImages.length >=
                          2
                        }
                      />
                    </div>
                  </div>

                  {/* Preview Existing Additional Images */}
                  {currentAdditionalImages.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-3">Existing Images</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {currentAdditionalImages.map((imageUrl, index) => (
                          <div
                            key={`existing-${index}`}
                            className="relative group rounded-lg overflow-hidden bg-gray-100 aspect-square"
                          >
                            <img
                              src={
                                imageUrl.startsWith("http")
                                  ? imageUrl
                                  : `${import.meta.env.VITE_BE_URL}${imageUrl}`
                              }
                              alt={`Media ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() =>
                                removeCurrentAdditionalImage(index)
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Preview Uploaded Media */}
                  {mediaFiles.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-3">Uploaded Images</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {mediaFiles.map((file, index) => (
                          <div
                            key={`new-${index}`}
                            className="relative group rounded-lg overflow-hidden bg-gray-100 aspect-square"
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Media ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeMediaFile(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <div className="absolute bottom-1 left-1 right-1 text-xs bg-black bg-opacity-50 text-white p-1 truncate rounded">
                              {file.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}


                </CardContent>
              </Card>

              {/* FAQ */}
              {/* <Card className="mb-8">
                <CardHeader>
                  <CardTitle>FAQ</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div>
                    <Input
                      type="text"
                      placeholder="Enter Question"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Textarea
                      placeholder="Enter Answer"
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      className="w-full mt-2 border rounded px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                      onClick={addFAQ}
                      type="button"
                      className="px-4 py-2 border mt-2 rounded transition"
                    >
                      Add FAQ
                    </Button>
                  </div>
                  <div>
                    {faqs.map((faq, index) => (
                      <div key={index} className="border mb-2 rounded p-3 bg-gray-50">
                        <p className="font-medium mb-2">{faq.question}</p>
                        <hr />
                        <p className="mt-2 whitespace-pre-wrap">{faq.answer}</p>
                        <button
                          onClick={() => removeFAQ(index)}
                          className="my-3 text-[#fff] bg-red-500 hover:bg-red-400 py-1 px-2 rounded"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card> */}

              {/* Submit Buttons */}
              <CardFooter className="flex justify-between px-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </Button>
                <div className="space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => handleSubmit(e, "draft")}
                    disabled={isLoading}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    type="button"
                    onClick={(e) => handleSubmit(e, "ongoing")}
                    disabled={isLoading}
                  >
                    {isLoading
                      ? isEditMode
                        ? "Updating..."
                        : "Creating..."
                      : isEditMode
                        ? "Update cause"
                        : "Publish cause"}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateCampaign;
