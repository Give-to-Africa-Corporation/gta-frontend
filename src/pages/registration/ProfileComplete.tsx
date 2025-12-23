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
import { africanCities, africanCountries, africanProvinces } from "@/lib/countries";
import { ngoApi } from "@/service/apiService";
import { AlertCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfileComplete = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal-info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "",
    province: "",
    city: "",
    postal_code: "",
    addressLine1: "",
    dob_day: "",
    dob_month: "",
    dob_year: "",
    accountHolderName: "",
    accountNumber: "",
    registration_number: "",
    routing_number: "",
    ssn: "",
    itin: "",
    ein: "",
    preferredCurrency: "",
  });

  // Step 2: Country / Province / City logic
  const handleCountryChange = (value: string) => {
    setFormData({ ...formData, country: value, province: "", city: "" });
  };

  const handleProvinceChange = (value: string) => {
    setFormData({ ...formData, province: value, city: "" });
  };

  const handleCityChange = (value: string) => {
    setFormData({ ...formData, city: value });
  };

  const provinces = africanProvinces[formData.country?.replace(/\s/g, "")] || [];
  const cities = africanCities[formData.country]?.[formData.province] || [];

  // Step 3: Input handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Step 4: Currency change
  const handleCurrencyChange = (value: string) => {
    setFormData((prev) => ({ ...prev, preferredCurrency: value }));
  };

  const validatePersonalInfo = () => {
    const { firstName, lastName, country, addressLine1, postal_code, dob_day, dob_month, dob_year } = formData;
    const missingFields: string[] = [];

    if (!firstName) missingFields.push("First Name");
    if (!lastName) missingFields.push("Last Name");
    if (!country) missingFields.push("Country");
    if (!addressLine1) missingFields.push("Address Line 1");
    if (!postal_code) missingFields.push("Postal Code");
    if (!dob_day || !dob_month || !dob_year) missingFields.push("Date of Birth");

    if (missingFields.length > 0) {
      setError(`Please fill the following fields: ${missingFields.join(", ")}`);
      return false;
    }
    return true;
  };

  const validateBankInfo = () => {
    const {
      accountHolderName,
      accountNumber,
      registration_number,
      routing_number,
      ssn,
      itin,
      ein,
      preferredCurrency,
      country,
    } = formData;

    const missingFields: string[] = [];

    if (!accountHolderName) missingFields.push("Account Holder Name");
    if (!accountNumber) missingFields.push("Account Number");
    if (!preferredCurrency) missingFields.push("Preferred Currency");
    if (!country) missingFields.push("Country");

    // US-specific SSN / ITIN check
    if (country.toUpperCase() === "US") {
      if (!ssn && !itin) {
        missingFields.push("SSN or ITIN (US only)");
      } else if (ssn && !/^\d{4}$/.test(ssn)) {
        setError("Invalid SSN format. Provide the last 4 digits only.");
        return false;
      } else if (itin && !/^9\d{8}$/.test(itin)) {
        setError("Invalid ITIN format. Must start with 9 and be 9 digits.");
        return false;
      }
    }

    // South Africa routing number check
    if (country.toUpperCase() === "ZA" && routing_number && !/^[A-Z]{4}ZA[A-Z]{2,3}$/.test(routing_number)) {
      setError("Invalid South Africa routing number. Use BIC format like ABSAZAJJ.");
      return false;
    }

    if (missingFields.length > 0) {
      setError(`Please fill the following fields: ${missingFields.join(", ")}`);
      return false;
    }

    return true;
  };

  // Step 5: Validation & Navigation
  const goToBankInfo = () => {
    if (!validatePersonalInfo()) return;
    setError(null);
    setActiveTab("bank-info");
  };

  // Step 6: Submit Handler
  const handleSubmit = async () => {
    setError(null);

    if (!validateBankInfo()) return;

    setIsSubmitting(true);
    try {
      const payload = { ...formData };
      const response = await ngoApi.completeBankDetails(payload);
      if (!response.success) throw new Error(response.error || "Submission failed");
      // navigate("/verification-pending");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-10">
            NGO Bank Account Verification
          </h1>
          <p className="text-center text-gray-600 mb-10">
            Enter your official NGO details to verify your account and enable donation
            transfers securely.
          </p>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-center">
                Bank Account Verification Form
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="personal-info">Personal Information</TabsTrigger>
                  <TabsTrigger value="bank-info">Bank Details</TabsTrigger>
                </TabsList>

                {/* PERSONAL INFO TAB */}
                <TabsContent value="personal-info">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>First Name</Label>
                        <Input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="First name"
                          required
                        />
                      </div>
                      <div>
                        <Label>Last Name</Label>
                        <Input
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Last name"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Country</Label>
                        <Select
                          value={formData.country}
                          onValueChange={handleCountryChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {africanCountries.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Province</Label>
                        <Select
                          value={formData.province}
                          onValueChange={handleProvinceChange}
                          disabled={!provinces.length}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select province" />
                          </SelectTrigger>
                          <SelectContent>
                            {provinces.map((prov, idx) => (
                              <SelectItem key={idx} value={prov}>
                                {prov}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>City</Label>
                        <Select
                          value={formData.city}
                          onValueChange={handleCityChange}
                          disabled={!cities.length}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Postal Code</Label>
                        <Input
                          name="postal_code"
                          value={formData.postal_code}
                          onChange={handleChange}
                          placeholder="Postal code"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Address</Label>
                        <Input
                          name="addressLine1"
                          value={formData.addressLine1}
                          onChange={handleChange}
                          placeholder="Address line"
                        />
                      </div>
                      <div>
                        <Label>Date of Birth</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            name="dob_day"
                            value={formData.dob_day}
                            onChange={handleChange}
                            placeholder="Day"
                            className="w-1/3"
                          />
                          <Input
                            type="number"
                            name="dob_month"
                            value={formData.dob_month}
                            onChange={handleChange}
                            placeholder="Month"
                            className="w-1/3"
                          />
                          <Input
                            type="number"
                            name="dob_year"
                            value={formData.dob_year}
                            onChange={handleChange}
                            placeholder="Year"
                            className="w-1/3"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={goToBankInfo} className="mt-4">
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* BANK INFO TAB */}
                <TabsContent value="bank-info">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Account Holder Name</Label>
                        <Input
                          name="accountHolderName"
                          value={formData.accountHolderName}
                          onChange={handleChange}
                          placeholder="Account holder name"
                        />
                      </div>
                      <div>
                        <Label>Account Number</Label>
                        <Input
                          name="accountNumber"
                          value={formData.accountNumber}
                          onChange={handleChange}
                          placeholder="Account number"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Registration Number</Label>
                        <Input
                          name="registration_number"
                          value={formData.registration_number}
                          onChange={handleChange}
                          placeholder="Registration number"
                        />
                      </div>
                      <div>
                        <Label>Routing Number</Label>
                        <Input
                          name="routing_number"
                          value={formData.routing_number}
                          onChange={handleChange}
                          placeholder="Routing number"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>SSN</Label>
                        <Input
                          name="ssn"
                          value={formData.ssn}
                          onChange={handleChange}
                          placeholder="SSN"
                        />
                      </div>
                      <div>
                        <Label>ITIN</Label>
                        <Input
                          name="itin"
                          value={formData.itin}
                          onChange={handleChange}
                          placeholder="ITIN"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>EIN</Label>
                        <Input
                          name="ein"
                          value={formData.ein}
                          onChange={handleChange}
                          placeholder="EIN"
                        />
                      </div>
                      <div>
                        <Label>Preferred Currency</Label>
                        <Select
                          value={formData.preferredCurrency}
                          onValueChange={handleCurrencyChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">GBP - British Pound</SelectItem>
                            <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                            <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                            <SelectItem value="ZAR">ZAR - South African Rand</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileComplete;
