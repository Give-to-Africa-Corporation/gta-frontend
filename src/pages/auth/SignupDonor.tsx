// @ts-nocheck
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/context/AppContext";
import { userApi } from "@/service/apiService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Footer } from "@/components/shared/Footer";

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  userType: ""
};

function SignupDonor() {
  const navigate = useNavigate();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError("First Name is required");
      return false;
    }
    if (!formData.lastName.trim()) {
      setError("Last Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await userApi.userRegister({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      if (!response.success) {
        throw new Error(response.error || "Something went wrong.");
      }

      setSuccess("Registration successful! Redirecting...");
      toast.success("User Registered Successfully!");
      setFormData(initialFormData);
      
      // Redirect to home or dashboard after 1.5 seconds
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      const errorMsg = err.message || "Something went wrong.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex-grow flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="relative flex items-center justify-center">
          <Card className="shadow-lg p-6 max-w-4xl w-full z-10">
            {/* Header */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-primary mb-1">
                Sign up as {formData.userType ? (formData.userType.charAt(0).toUpperCase() + formData.userType.slice(1)) : "User / Volunteer"}
              </h1>
              <p className="text-sm text-gray-600 mt-2">Welcome to Yendaa.</p>
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-3 mt-4">
                  <Label htmlFor="email">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
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
                      required
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
                      required
                    />
                  </div>
                </div>

                
                  {/* aik select aai jis say user volunteer ya donor choose karay ga */}
                  <div className="grid gap-3 mt-4">
                    <Label htmlFor="userType">User Type</Label>
                    <select
                      id="userType"
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                    >
                      <option value="">Select User Type</option>
                      <option value="volunteer">Volunteer</option>
                      <option value="donor">Donor</option>
                    </select>
                  </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full bg-brand-purple text-white py-3 px-4 rounded-lg hover:bg-brand-yellow hover:text-gray-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>

                <div className="mt-4 text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/auth/login")}
                    className="text-brand-purple hover:underline font-medium"
                  >
                    Sign In
                  </button>
                </div>
            </form>
          </Card>
          <img
            src="https://cdn.prod.website-files.com/5f6b00b40c0b1e4bf53c7d60/6670372063dc58df744db688_bg-5.png"
            loading="lazy"
            width="258"
            height="228"
            alt=""
            className="bg-5"
          />
          <img
            src="https://cdn.prod.website-files.com/5f6b00b40c0b1e4bf53c7d60/66703674a5a268dcdbfaccbb_bg-4.png"
            loading="lazy"
            width="206"
            height="304"
            alt=""
            className="bg-4"
          />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default SignupDonor;
