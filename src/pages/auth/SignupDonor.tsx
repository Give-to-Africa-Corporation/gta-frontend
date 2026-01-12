import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/context/AppContext";
import { authApi } from "@/service/apiService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Footer } from "@/components/shared/Footer";

const initialFormData = {
  username: "",
  useremail: "",
  password: "",
  confirmPassword: "",
  isAuthorized: false,
};

function SignupDonor() {
  const navigate = useNavigate();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false); // submit loading
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    setError("");
    setSuccess("");

    setLoading(true);

    try {
      // ✅ FormData (MANDATORY for file upload)
      const fd = new FormData();

      const response = await authApi.register({
        username: formData.username,
        useremail: formData.useremail,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        isAuthorized: formData.isAuthorized,
      });

      if (!response.success) {
        throw new Error(response.message || "Something went wrong.");
      }

      // setSuccess("Your application has been submitted successfully.");
      toast.success("User Register Successfully!");
      setFormData(initialFormData);
      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong.");
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
                Sign up as donor
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
                <div className="grid gap-3 mt-4">
                  <Label htmlFor="username">User Name</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Your User Name"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid gap-3 mt-4">
                  <Label htmlFor="useremail">
                    Email Address
                  </Label>
                  <Input
                    id="useremail"
                    name="useremail"
                    type="email"
                    placeholder="Email Address"
                    value={formData.useremail}
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
                <button
                  type="submit"
                  className="mt-6 w-full bg-brand-purple text-white py-3 px-4 rounded-lg hover:bg-brand-yellow hover:text-gray-800 transition-colors duration-300"
                >
                  Create Account
                </button>
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
