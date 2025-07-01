import { Footer } from "@/components/shared/Footer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { africanCountries } from "@/lib/countries";
import { ngoApi } from "@/service/apiService";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Upload,
  User,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ngo-info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [ngoInfo, setNgoInfo] = useState({
    name: "",
    email: "",
    country: "",
    phoneNumber: "",
    website: "",
    description: "",
  });

  const [documents, setDocuments] = useState({
    registration: null as File | null,
    leadership: null as File | null,
    impact: null as File | null,
  });

  const [bankInfo, setBankInfo] = useState({
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
    swiftCode: "",
    preferredCurrency: "",
  });

  // Form handlers
  const handleNgoInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNgoInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (value: string) => {
    setNgoInfo((prev) => ({ ...prev, country: value }));
  };

  const handleFileChange = (name: keyof typeof documents, file: File) => {
    setDocuments((prev) => ({ ...prev, [name]: file }));
  };

  const handleBankInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCurrencyChange = (value: string) => {
    setBankInfo((prev) => ({ ...prev, preferredCurrency: value }));
  };

  // Navigation handlers
  const goToDocuments = () => {
    // Validate NGO info before proceeding
    if (
      !ngoInfo.name ||
      !ngoInfo.email ||
      !ngoInfo.country ||
      !ngoInfo.phoneNumber ||
      !ngoInfo.description
    ) {
      setError("Please fill all required fields before proceeding");
      return;
    }
    setError(null);
    setActiveTab("documents");
  };

  const goToBankInfo = () => {
    // Validate documents before proceeding
    if (!documents.registration) {
      setError("Registration certificate is required");
      return;
    }
    setError(null);
    handleSubmit();
  };

  const goToNgoInfo = () => {
    setActiveTab("ngo-info");
  };

  const goToDocumentsFromBankInfo = () => {
    setActiveTab("documents");
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Step 1: Complete profile with NGO info only
      const completeProfileResponse = await ngoApi.completeProfile({
        orgName: ngoInfo.name,
        officialEmail: ngoInfo.email,
        country: ngoInfo.country,
        phoneNumber: ngoInfo.phoneNumber,
        website: ngoInfo.website || undefined,
        description: ngoInfo.description,
        // Providing empty bank details to satisfy the type requirements
        bankDetails: {
          accountHolderName: "",
          bankName: "",
          accountNumber: "",
          swiftCode: "",
          preferredCurrency: "",
        },
      });

      if (!completeProfileResponse.success) {
        throw new Error(
          completeProfileResponse.error || "Failed to complete profile"
        );
      }

      // Step 2: Upload documents
      if (documents.registration) {
        const uploadResponse = await ngoApi.uploadDocuments({
          registrationCertificate: documents.registration,
          leadershipProof: documents.leadership || null, // Optional document
          additionalDocument: documents.impact || null, // Optional document
        });

        if (!uploadResponse.success) {
          throw new Error(uploadResponse.error || "Failed to upload documents");
        }

        // Only navigate if both API calls were successful
        navigate("/verification-pending");
      } else {
        throw new Error("Required documents are missing");
      }
    } catch (error) {
      console.error("Registration error:", error);

      // Check for specific error types
      if (
        error.message?.includes("unauthorized") ||
        error.message?.includes("401")
      ) {
        setError("Your session has expired. Please log in again to continue.");
      } else {
        // Handle other errors
        setError(
          error.message || "An unexpected error occurred during registration"
        );
      }

      // Stay on the current page for all errors
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-10">
              NGO Registration
            </h1>
            <p className="text-center text-gray-600 mb-10">
              Complete this form to register your NGO. Your information will be
              verified before you can create fundraising campaigns.
            </p>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-center">Registration Form</CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="ngo-info">NGO Information</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                  </TabsList>

                  {/* NGO Information Tab */}
                  <TabsContent value="ngo-info">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Organization Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={ngoInfo.name}
                            onChange={handleNgoInfoChange}
                            placeholder="Your NGO's official name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Official Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={ngoInfo.email}
                            onChange={handleNgoInfoChange}
                            placeholder="contact@yourorganization.org"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Select
                            value={ngoInfo.country}
                            onValueChange={handleCountryChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              {africanCountries.map((country) => (
                                <SelectItem
                                  key={country.code}
                                  value={country.code}
                                >
                                  {country.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="phoneNumber">Phone Number</Label>
                          <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            value={ngoInfo.phoneNumber}
                            onChange={handleNgoInfoChange}
                            placeholder="+1234567890"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="website">Website (Optional)</Label>
                        <Input
                          id="website"
                          name="website"
                          value={ngoInfo.website}
                          onChange={handleNgoInfoChange}
                          placeholder="https://yourorganization.org"
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">
                          Organization Description
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={ngoInfo.description}
                          onChange={handleNgoInfoChange}
                          placeholder="Tell us about your NGO's mission and impact..."
                          rows={5}
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button onClick={goToDocuments} className="mt-4">
                          Continue <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Documents Tab */}
                  <TabsContent value="documents">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium text-lg mb-2 flex items-center">
                          <FileText
                            className="mr-2 text-brand-purple"
                            size={20}
                          />
                          NGO Registration Certificate
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">
                          Upload your official NGO registration certificate or
                          equivalent document (PDF format).
                        </p>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <div className="text-sm text-gray-600">
                            <label
                              htmlFor="registration-file"
                              className="cursor-pointer text-brand-purple hover:underline"
                            >
                              Click to upload
                            </label>{" "}
                            or drag and drop
                            <p className="text-xs text-gray-500">
                              PDF (max. 10MB)
                            </p>
                          </div>
                          <input
                            id="registration-file"
                            type="file"
                            className="hidden"
                            accept="application/pdf"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFileChange(
                                  "registration",
                                  e.target.files[0]
                                );
                              }
                            }}
                          />
                          {documents.registration && (
                            <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                              <Check size={16} />
                              <span>{documents.registration.name}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-lg mb-2 flex items-center">
                          <User className="mr-2 text-brand-purple" size={20} />
                          Proof of Leadership (Optional)
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">
                          Upload identification document of organization leader
                          or authorized representative.
                        </p>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <div className="text-sm text-gray-600">
                            <label
                              htmlFor="leadership-file"
                              className="cursor-pointer text-brand-purple hover:underline"
                            >
                              Click to upload
                            </label>{" "}
                            or drag and drop
                            <p className="text-xs text-gray-500">
                              PDF or JPG/PNG (max. 10MB)
                            </p>
                          </div>
                          <input
                            id="leadership-file"
                            type="file"
                            className="hidden"
                            accept="application/pdf,image/jpeg,image/png"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFileChange(
                                  "leadership",
                                  e.target.files[0]
                                );
                              }
                            }}
                          />
                          {documents.leadership && (
                            <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                              <Check size={16} />
                              <span>{documents.leadership.name}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Project Impact Summary - commented out
                      <div>
                        <h3 className="font-medium text-lg mb-2 flex items-center">
                          <FileText
                            className="mr-2 text-brand-purple"
                            size={20}
                          />
                          Project Impact Summary
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">
                          Upload a document summarizing your organization's past
                          impact and projects.
                        </p>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <div className="text-sm text-gray-600">
                            <label
                              htmlFor="impact-file"
                              className="cursor-pointer text-brand-purple hover:underline"
                            >
                              Click to upload
                            </label>{" "}
                            or drag and drop
                            <p className="text-xs text-gray-500">
                              PDF or DOC/DOCX (max. 10MB)
                            </p>
                          </div>
                          <input
                            id="impact-file"
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) =>
                              e.target.files &&
                              handleFileChange("impact", e.target.files[0])
                            }
                          />
                          {documents.impact && (
                            <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                              <Check size={16} />
                              <span>{documents.impact.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      */}

                      <div className="flex justify-between">
                        <Button variant="outline" onClick={goToNgoInfo}>
                          <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <Button onClick={goToBankInfo}>
                          Submit Application
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Bank Information Tab - commented out
                  <TabsContent value="bank-info">
                    <div className="space-y-4">
                      <div className="flex items-center mb-6">
                        <CreditCard
                          className="text-brand-purple mr-3"
                          size={24}
                        />
                        <div>
                          <h3 className="font-medium">Banking Information</h3>
                          <p className="text-sm text-gray-500">
                            This information will be used to process donations
                            to your organization.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="accountHolderName">
                            Account Holder Name
                          </Label>
                          <Input
                            id="accountHolderName"
                            name="accountHolderName"
                            value={bankInfo.accountHolderName}
                            onChange={handleBankInfoChange}
                            placeholder="Official organization name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="accountNumber">Account Number</Label>
                          <Input
                            id="accountNumber"
                            name="accountNumber"
                            value={bankInfo.accountNumber}
                            onChange={handleBankInfoChange}
                            placeholder="Your bank account number"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="bankName">Bank Name</Label>
                          <Input
                            id="bankName"
                            name="bankName"
                            value={bankInfo.bankName}
                            onChange={handleBankInfoChange}
                            placeholder="Your bank name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="swiftCode">SWIFT/BIC Code</Label>
                          <Input
                            id="swiftCode"
                            name="swiftCode"
                            value={bankInfo.swiftCode}
                            onChange={handleBankInfoChange}
                            placeholder="International bank identifier"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="preferredCurrency">
                          Preferred Currency
                        </Label>
                        <Select
                          value={bankInfo.preferredCurrency}
                          onValueChange={handleCurrencyChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">
                              GBP - British Pound
                            </SelectItem>
                            <SelectItem value="CAD">
                              CAD - Canadian Dollar
                            </SelectItem>
                            <SelectItem value="AUD">
                              AUD - Australian Dollar
                            </SelectItem>
                            <SelectItem value="INR">
                              INR - Indian Rupee
                            </SelectItem>
                            <SelectItem value="ZAR">
                              ZAR - South African Rand
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="mt-6">
                        <p className="text-sm text-gray-600">
                          By submitting this application, you certify that all
                          provided information is accurate and that you are
                          authorized to register this organization.
                        </p>
                      </div>

                      <div className="flex justify-between pt-2">
                        <Button
                          variant="outline"
                          onClick={goToDocumentsFromBankInfo}
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                          {isSubmitting
                            ? "Submitting..."
                            : "Submit Application"}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  */}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Registration;
