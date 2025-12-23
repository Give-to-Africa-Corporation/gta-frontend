// import { Footer } from "@/components/shared/Footer";
// import { Navbar } from "@/components/shared/Navbar";
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
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useAppContext } from "@/context/AppContext";
// import { authApi } from "@/service/apiService";
// import { AlertCircle, Eye, EyeOff } from "lucide-react";
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// const Signup = () => {
//   const navigate = useNavigate();
//   const { isLoading, refreshUserData } = useAppContext();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [error, setError] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const toggleConfirmPasswordVisibility = () => {
//     setShowConfirmPassword(!showConfirmPassword);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setIsSubmitting(true);

//     try {
//       // Basic validation
//       if (Object.values(formData).some((value) => value === "")) {
//         throw new Error("Please fill in all fields");
//       }

//       if (formData.password !== formData.confirmPassword) {
//         throw new Error("Passwords do not match");
//       }

//       // Validate email format
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(formData.email)) {
//         throw new Error("Please enter a valid email address");
//       }

//       // In a real app, preferably validate if email ends with .org
//       // TODO: Uncomment this when we have a way to validate email
//       // if (!formData.email.endsWith(".org")) {
//       //   throw new Error("Please use an official NGO email ending with .org");
//       // }

//       // Register the NGO using the API service
//       const response = await authApi.register({
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//       });

//       if (!response.success) {
//         throw new Error(response.error || "Registration failed");
//       }

//       // Load user data after successful registration
//       await refreshUserData();

//       toast.success("Account created successfully!");

//       // If successful, redirect to registration form
//       navigate("/registration");
//     } catch (error) {
//       const errorMessage =
//         error instanceof Error ? error.message : "Registration failed";
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
//         <div className="w-full max-w-md">
//           <Card className="shadow-lg">
//             <CardHeader className="space-y-1">
//               <CardTitle className="text-2xl text-center">
//                 Create an account
//               </CardTitle>
//               <CardDescription className="text-center">
//                 Enter your details to create your NGO account
//               </CardDescription>
//             </CardHeader>
//             <form onSubmit={handleSubmit}>
//               <CardContent className="grid gap-4">
//                 {error && (
//                   <Alert variant="destructive">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertDescription>{error}</AlertDescription>
//                   </Alert>
//                 )}
//                 <div className="grid gap-2">
//                   <Label htmlFor="name">NGO Name</Label>
//                   <Input
//                     id="name"
//                     name="name"
//                     type="text"
//                     placeholder="Wildlife Protection Network"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="email">Email</Label>
//                   <Input
//                     id="email"
//                     name="email"
//                     type="email"
//                     placeholder="ngo@example.org"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                   />
//                   <p className="text-xs text-muted-foreground mt-1">
//                     Please use your official NGO email (preferably ending with
//                     .org)
//                   </p>
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="password">Password</Label>
//                   <div className="relative">
//                     <Input
//                       id="password"
//                       name="password"
//                       type={showPassword ? "text" : "password"}
//                       value={formData.password}
//                       onChange={handleChange}
//                       required
//                     />
//                     <button
//                       type="button"
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                       onClick={togglePasswordVisibility}
//                     >
//                       {showPassword ? (
//                         <EyeOff className="h-4 w-4 text-gray-500" />
//                       ) : (
//                         <Eye className="h-4 w-4 text-gray-500" />
//                       )}
//                     </button>
//                   </div>
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="confirmPassword">Confirm Password</Label>
//                   <div className="relative">
//                     <Input
//                       id="confirmPassword"
//                       name="confirmPassword"
//                       type={showConfirmPassword ? "text" : "password"}
//                       value={formData.confirmPassword}
//                       onChange={handleChange}
//                       required
//                     />
//                     <button
//                       type="button"
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                       onClick={toggleConfirmPasswordVisibility}
//                     >
//                       {showConfirmPassword ? (
//                         <EyeOff className="h-4 w-4 text-gray-500" />
//                       ) : (
//                         <Eye className="h-4 w-4 text-gray-500" />
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </CardContent>
//               <CardFooter className="flex flex-col space-y-4">
//                 <Button
//                   type="submit"
//                   className="w-full"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? "Creating account..." : "Sign up"}
//                 </Button>
//                 <div className="text-center text-sm">
//                   Already have an account?{" "}
//                   <Link
//                     to="/login"
//                     className="text-brand-purple hover:underline"
//                   >
//                     Log in
//                   </Link>
//                 </div>
//               </CardFooter>
//             </form>
//           </Card>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Signup;


// @ts-nocheck
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/context/AppContext";
import { authApi } from "@/service/apiService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { africanCountries } from "@/lib/countries";

const TOTAL_STEPS = 7;

const stepLabels = [
  "Account",
  "Identity & Location",
  "Contact",
  "Online Presence",
  "About Work",
  "Banking",
  "Media & Agreements",
];

const initialFormData = {
  // SECTION 1
  organizationName: "",
  organizationEmail: "",
  password: "",
  confirmPassword: "",
  isAuthorized: false,

  // SECTION 2
  organizationType: "",
  organizationTypeOther: "",
  causeType: "",
  causeTypeOther: "",

  // SECTION 3
  country: "",
  city: "",

  // SECTION 4
  primaryContactName: "",
  primaryContactTitle: "",
  contactEmail: "",
  contactPhone: "",

  // SECTION 5
  website: "",
  socialLinks: "",

  // SECTION 6
  missionStatement: "",
  programs: [],
  programsOther: "",
  workSamples: "",

  // SECTION 7
  bankName: "",
  accountName: "",
  accountNumber: "",
  bankCountry: "",

  // SECTION 8
  profileImage: null,

  // SECTION 9
  verificationConfirmed: false,
  termsAccepted: false,
};

const programOptions = [
  "Education",
  "Health",
  "Food Support",
  "Women’s Empowerment",
  "Youth Development",
  "Faith-Based Services",
  "Community Development",
  "Climate / Environment",
  "Skills Training",
  "Emergency Relief",
  "Other",
];

function Signup() {
  const {
    organizationTypesall,
    causeTypesall,
    loading: metaLoading,
  } = useAppContext();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false); // submit loading
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ---------- helpers ----------

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 3 dropdown programs select
  const handleProgramSelect = (index, value) => {
    setFormData((prev) => {
      const programs = [...(prev.programs || [])];
      programs[index] = value;
      return { ...prev, programs };
    });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateStep = (currentStep) => {
    const d = formData;

    switch (currentStep) {
      case 1: {
        if (!d.organizationName.trim()) {
          return "Please enter your organization name.";
        }
        if (!d.organizationEmail.trim()) {
          return "Please enter your organization email.";
        }
        if (!validateEmail(d.organizationEmail.trim())) {
          return "Please enter a valid organization email address.";
        }
        if (!d.password || d.password.length < 8) {
          return "Password must be at least 8 characters long.";
        }
        if (d.password !== d.confirmPassword) {
          return "Password and Confirm Password do not match.";
        }
        return null;
      }

      case 2: {
        // Organization Type
        if (!d.organizationType) {
          return "Please select your organization type.";
        }
        if (d.organizationType === "Other" && !d.organizationTypeOther.trim()) {
          return "Please specify your organization type.";
        }

        // Cause Type
        if (!d.causeType) {
          return "Please select your primary cause.";
        }
        if (d.causeType === "Other" && !d.causeTypeOther.trim()) {
          return "Please specify your primary cause.";
        }

        // Location
        if (!d.country.trim()) {
          return "Please enter your country of operation.";
        }
        if (!d.city.trim()) {
          return "Please enter the city / community you serve.";
        }
        return null;
      }

      case 3: {
        if (!d.primaryContactName.trim()) {
          return "Please enter the primary contact person’s full name.";
        }
        if (!d.primaryContactTitle.trim()) {
          return "Please enter the primary contact person’s position/title.";
        }
        if (!d.contactEmail.trim()) {
          return "Please enter the contact email address.";
        }
        if (!validateEmail(d.contactEmail.trim())) {
          return "Please enter a valid contact email address.";
        }
        if (!d.contactPhone.trim()) {
          return "Please enter the contact phone number.";
        }
        return null;
      }

      case 4: {
        // Online presence all optional
        return null;
      }

      case 5: {
        if (!d.missionStatement.trim()) {
          return "Please enter a short mission statement.";
        }
        const selectedPrograms = (d.programs || []).filter(Boolean);
        if (selectedPrograms.length === 0) {
          return "Please select at least one program or activity.";
        }
        if (selectedPrograms.includes("Other") && !d.programsOther.trim()) {
          return "Please specify your other program(s).";
        }
        return null;
      }

      case 6: {
        if (!d.bankName.trim()) {
          return "Please enter your bank name.";
        }
        if (!d.accountName.trim()) {
          return "Please enter the account name.";
        }
        if (!d.accountNumber.trim()) {
          return "Please enter the account number or IBAN.";
        }
        if (!d.bankCountry.trim()) {
          return "Please enter the country of bank.";
        }
        return null;
      }

      case 7: {
        if (!d.verificationConfirmed) {
          return "Please confirm that the provided information is accurate.";
        }
        if (!d.termsAccepted) {
          return "Please agree to the Terms of Use and fundraising guidelines.";
        }
        return null;
      }

      default:
        return null;
    }
  };

  const nextStep = () => {
    const validationError = validateStep(step);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
  };

  const prevStep = () => {
    setError("");
    if (step > 1) setStep((s) => s - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // validate all steps before submit
    for (let i = 1; i <= TOTAL_STEPS; i++) {
      const validationError = validateStep(i);
      if (validationError) {
        setError(validationError);
        setStep(i);
        return;
      }
    }

    setLoading(true);

    try {
      // ✅ FormData (MANDATORY for file upload)
      const fd = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value === null || value === undefined) return;

        // programs array → string
        if (key === "programs" && Array.isArray(value)) {
          fd.append("programs", value.filter(Boolean).join(", "));
        }
        // file
        else if (key === "profileImage" && value instanceof File) {
          fd.append("profileImage", value); // 👈 VERY IMPORTANT
        }
        // normal fields
        else {
          fd.append(key, value);
        }
      });

      const response = await authApi.register(fd);

      if (!response.success) {
        throw new Error(response.message || "Something went wrong.");
      }

      // setSuccess("Your application has been submitted successfully.");
      toast.success("Application submitted successfully!");
      setFormData(initialFormData);
      navigate("/verification-pending");
      setStep(1);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- UI per step ----------

  const renderStep = () => {
    switch (step) {
      // STEP 1 — ACCOUNT SETUP
      case 1:
        return (
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              ACCOUNT SETUP
            </h2>

            <div className="grid gap-3 mt-4">
              <Label htmlFor="organizationName">Organization Name</Label>
              <Input
                id="organizationName"
                name="organizationName"
                type="text"
                placeholder="Your Organization Name"
                value={formData.organizationName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-3 mt-4">
              <Label htmlFor="organizationEmail">
                Organization Email Address
              </Label>
              <Input
                id="organizationEmail"
                name="organizationEmail"
                type="email"
                placeholder="Organization Email Address"
                value={formData.organizationEmail}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="******"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="******"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>
        );

      // STEP 2 — ORGANIZATION IDENTITY + LOCATION
      case 2:
        return (
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              ORGANIZATION IDENTITY
            </h2>

            <div className="space-y-3 mt-4">
              {/* Organization Type */}
              <div className="space-y-2">
                <Label>Organization Type (Who You Are)</Label>
                {metaLoading ? (
                  <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
                ) : (
                  <Select
                    value={formData.organizationType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        organizationType: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select organization type" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem disabled>Select the option that best describes your organization’s structure.</SelectItem>
                      {organizationTypesall?.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other">
                        Other (please specify)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
                {formData.organizationType === "Other" && (
                  <Input
                    className="mt-2"
                    type="text"
                    name="organizationTypeOther"
                    value={formData.organizationTypeOther}
                    onChange={handleChange}
                    placeholder="Please specify your organization type"
                  />
                )}
              </div>

              {/* Cause Type */}
              <div className="space-y-2">
                <Label>Cause Type (What You Work On)</Label>
                {metaLoading ? (
                  <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
                ) : (
                  <Select
                    value={formData.causeType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        causeType: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select primary cause" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem disabled>Select the primary cause your organization addresses.</SelectItem>
                      {causeTypesall?.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other">
                        Other (please specify)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
                {formData.causeType === "Other" && (
                  <Input
                    className="mt-2"
                    type="text"
                    name="causeTypeOther"
                    value={formData.causeTypeOther}
                    onChange={handleChange}
                    placeholder="Please specify your primary cause"
                  />
                )}
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-4">
              LOCATION
            </h2>
            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="country">
                  Country of Operation<span className="text-red-500">*</span>
                </Label>
                {/* <Input
                  id="country"
                  name="country"
                  type="text"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="e.g., Kenya, Nigeria, Pakistan"
                /> */}
                {/* select country dropdown */}
                <Select
                  value={formData.country}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      country: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {africanCountries?.map((country) => (
                      <SelectItem key={country} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="city">
                  City / Community Served
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g., Nairobi, Lagos, Lahore"
                />
              </div>
            </div>
          </section>
        );

      // STEP 3 — LEADERSHIP & CONTACT
      case 3:
        return (
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              LEADERSHIP & CONTACT INFORMATION
            </h2>

            <div className="grid gap-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="primaryContactName">
                    Primary Contact Person (Full Name)
                  </Label>
                  <Input
                    id="primaryContactName"
                    name="primaryContactName"
                    type="text"
                    value={formData.primaryContactName}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="primaryContactTitle">Position / Title</Label>
                  <Input
                    id="primaryContactTitle"
                    name="primaryContactTitle"
                    type="text"
                    value={formData.primaryContactTitle}
                    onChange={handleChange}
                    placeholder="e.g., Pastor, Director, Principal"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="contactEmail">Contact Email Address</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="contactPhone">
                    Phone Number (WhatsApp accepted)
                  </Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    type="text"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    placeholder="+254 7XX XXX XXX"
                  />
                </div>
              </div>
            </div>
          </section>
        );

      // STEP 4 — ONLINE PRESENCE
      case 4:
        return (
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              ONLINE PRESENCE
            </h2>

            <div className="grid gap-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://your-website.org"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="socialLinks">Social Media Link(s)</Label>
                <Textarea
                  id="socialLinks"
                  name="socialLinks"
                  rows={3}
                  value={formData.socialLinks}
                  onChange={handleChange}
                  placeholder="Paste links to Facebook, Instagram, LinkedIn, YouTube, TikTok, etc."
                />
              </div>
            </div>
          </section>
        );

      // STEP 5 — ABOUT YOUR WORK
      case 5:
        return (
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              ABOUT YOUR WORK
            </h2>

            <div className="space-y-6 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="missionStatement">
                  Short Mission Statement
                </Label>
                <Textarea
                  id="missionStatement"
                  name="missionStatement"
                  rows={3}
                  value={formData.missionStatement}
                  onChange={handleChange}
                  placeholder="2–3 sentences describing what you do and who you serve."
                />
              </div>

              {/* Programs or Activities — 3 dropdowns */}
              <div className="space-y-3">
                <Label>Programs or Activities (Select up to three)</Label>

                <div className="grid gap-3 md:grid-cols-3">
                  {/* Program 1 */}
                  <div className="grid gap-1">
                    <span className="text-xs text-gray-500">Program 1</span>
                    <Select
                      value={formData.programs[0] || ""}
                      onValueChange={(value) => handleProgramSelect(0, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {programOptions.map((program) => (
                          <SelectItem key={program} value={program}>
                            {program}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Program 2 */}
                  <div className="grid gap-1">
                    <span className="text-xs text-gray-500">
                      Program 2 (optional)
                    </span>
                    <Select
                      value={formData.programs[1] || ""}
                      onValueChange={(value) => handleProgramSelect(1, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {programOptions.map((program) => (
                          <SelectItem key={program} value={program}>
                            {program}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Program 3 */}
                  <div className="grid gap-1">
                    <span className="text-xs text-gray-500">
                      Program 3 (optional)
                    </span>
                    <Select
                      value={formData.programs[2] || ""}
                      onValueChange={(value) => handleProgramSelect(2, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {programOptions.map((program) => (
                          <SelectItem key={program} value={program}>
                            {program}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Other text field if any program is "Other" */}
                {(formData.programs || []).includes("Other") && (
                  <Input
                    type="text"
                    name="programsOther"
                    value={formData.programsOther}
                    onChange={handleChange}
                    placeholder="Please specify your other program(s)"
                    className="mt-1"
                  />
                )}
              </div>

              {/* Work Samples */}
              <div className="grid gap-2">
                <Label htmlFor="workSamples">
                  Photos or Links Showing Your Work
                </Label>
                <Textarea
                  id="workSamples"
                  name="workSamples"
                  rows={3}
                  value={formData.workSamples}
                  onChange={handleChange}
                  placeholder="Paste 2–3 links to photos or pages showing your real programs or community impact."
                />
              </div>
            </div>
          </section>
        );

      // STEP 6 — BANKING
      case 6:
        return (
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              BANKING DETAILS (FOR DONATIONS)
            </h2>

            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="bankName">
                  Bank Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="bankName"
                  name="bankName"
                  type="text"
                  value={formData.bankName}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="accountName">
                  Account Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="accountName"
                  name="accountName"
                  type="text"
                  value={formData.accountName}
                  onChange={handleChange}
                  placeholder="Must match the organization or cause name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="accountNumber">Account Number / IBAN</Label>
                <Input
                  id="accountNumber"
                  name="accountNumber"
                  type="text"
                  placeholder="Personal bank accounts are not accepted."
                  value={formData.accountNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bankCountry">
                  Country of Bank<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="bankCountry"
                  name="bankCountry"
                  type="text"
                  value={formData.bankCountry}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>
        );

      // STEP 7 — LOGO + AGREEMENTS
      case 7:
        return (
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              LOGO / PROFILE IMAGE
            </h2>

            <div className="grid gap-2 mt-4">
              <Label htmlFor="profileImage">Logo or Profile Image</Label>
              <Input
                id="profileImage"
                name="profileImage"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    profileImage: e.target.files[0], // ✅ FILE OBJECT
                  }))
                }
              />
              {/* <p className="mt-1 text-xs text-gray-500">
                (For file uploads, first upload to a cloud service and paste the
                image link here.)
              </p> */}
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-4">
              AGREEMENTS
            </h2>

            <div className="space-y-4 mt-4">
              <label className="flex items-start text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="verificationConfirmed"
                  checked={formData.verificationConfirmed}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-primary border-gray-300 rounded"
                />
                <span className="ml-2">
                  I confirm that all information provided is accurate and
                  represents my organization’s real work.
                </span>
              </label>

              <label className="flex items-start text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-primary border-gray-300 rounded"
                />
                <span className="ml-2">
                  I agree to Yendaa’s Terms of Use and fundraising guidelines.
                </span>
              </label>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  // ---------- render ----------

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <Card className="shadow-lg p-6 max-w-3xl w-full">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Create an Account on Yendaa
          </h1>
          <p className="text-sm text-gray-600 mt-2">Welcome to Yendaa.</p>
          <p className="text-sm text-gray-600 mt-1">
            Please complete the form below to create your organization account.
            This information helps us verify your cause and build a trusted
            public profile for donors.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-medium text-gray-600 mb-2">
            <span>
              Step {step} of {TOTAL_STEPS}
            </span>
            <span className="text-primary font-semibold">
              {stepLabels[step - 1]}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-2.5 bg-gradient-to-r from-primary via-indigo-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {renderStep()}

          {/* Navigation buttons */}
          <div className="mt-8 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Back
              </button>
            ) : (
              <span />
            )}

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark disabled:opacity-60"
              >
                {loading ? "Submitting…" : "Submit Application"}
              </button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}

export default Signup;
