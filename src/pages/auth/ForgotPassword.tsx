import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "@/service/apiService";
import bgFlag3 from "../../../public/images/flag6.webp";
import type { AxiosError } from "axios";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await authApi.requestPasswordReset({ email });
      toast.success(
        res?.message ||
          "If an account exists, an OTP has been sent to your email.",
      );
      navigate(`/forgot-password/verify?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      const axiosErr = err as AxiosError<{ success: boolean; error?: string; message?: string }>;
    const apiMsg =
      axiosErr?.response?.data?.error ||
      axiosErr?.response?.data?.message ||
      axiosErr?.message ||
      "Verification failed";

    setError(apiMsg);
    toast.error(apiMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="relative min-h-[90vh] bg-fixed bg-center bg-cover"
      style={{ backgroundImage: `url(${bgFlag3})` }}
    >
      <div className="absolute inset-0 bg-black/60 z-0" />

      <div className="relative z-10 min-h-[90vh] flex items-center justify-center px-4">
        <div className="w-full max-w-[980px] bg-white rounded-[28px] shadow-2xl px-6 py-20 sm:px-12 md:px-20">
          <h1 className="text-center text-4xl font-extrabold text-[#074C2D]">
            Forgot your Password?
          </h1>
          <p className="mt-4 text-center text-gray-700 text-lg">
            Enter your email so that we can send you password reset OTP
          </p>

          <form onSubmit={onSubmit} className="mx-auto mt-8 max-w-xl space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                inputMode="tel"
                placeholder="ngo@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2"
                // className="mt-2 h-12 rounded-xl border border-gray-300 px-4 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#b80c0c]"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
              //   className="w-full h-12 rounded-xl bg-[#b80c0c] hover:bg-[#a60b0b] text-white font-semibold disabled:opacity-60"
            >
              {isSubmitting ? "Please wait..." : "Continue"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
