import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "@/service/apiService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import bgFlag3 from "../../../public/images/flag3.webp";
import type { AxiosError } from "axios";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const email = params.get("email") || "";
  const token = params.get("token") || ""; // from OTP verify step
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError("Password must be at least 8 characters");
    if (password !== confirm) return setError("Passwords do not match");

    setSubmitting(true);
    try {
      const res = await authApi.resetPassword({ email, token, password });
      if (!res?.success) throw new Error(res?.error || "Reset failed");
      toast.success("Password reset successful");
      navigate("/login", { replace: true });
    } catch (err) {
      const axiosErr = err as AxiosError<{ success: boolean; error?: string; message?: string }>;
    const apiMsg =
      axiosErr?.response?.data?.error ||
      axiosErr?.response?.data?.message ||
      axiosErr?.message ||
      "Verification failed";

    setError(apiMsg);
    toast.error(apiMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="relative min-h-[100vh] bg-fixed bg-center bg-cover"
      style={{ backgroundImage: `url(${bgFlag3})` }}
    >
      <div className="absolute inset-0 bg-black/60 z-0" />
      <div className="relative z-10 min-h-[100vh] flex items-center justify-center px-4">
        <div className="w-full max-w-[980px] bg-white rounded-[28px] shadow-2xl px-6 py-10 sm:px-12 md:px-20">
          <h1 className="text-center text-4xl font-extrabold text-[#074C2D]">
            Reset Password
          </h1>
          <p className="mt-4 text-center text-gray-700 text-lg">
            Set a new password for <span className="font-semibold">{email}</span>
          </p>

          <form onSubmit={onSubmit} className="mx-auto mt-8 max-w-xl space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="password">
                New Password
              </Label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  type={show1 ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                //   className="h-12 rounded-xl border border-gray-300 px-4 pr-10 focus-visible:ring-2 focus-visible:ring-[#b80c0c]"
                />
                <button
                  type="button"
                  onClick={() => setShow1((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={show1 ? "Hide password" : "Show password"}
                >
                  {show1 ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirm">
                Confirm Password
              </Label>
              <div className="relative mt-2">
                <Input
                  id="confirm"
                  type={show2 ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                //   className="h-12 rounded-xl border border-gray-300 px-4 pr-10 focus-visible:ring-2 focus-visible:ring-[#b80c0c]"
                />
                <button
                  type="button"
                  onClick={() => setShow2((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={show2 ? "Hide password" : "Show password"}
                >
                  {show2 ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full"
            //   className="w-full h-12 rounded-xl bg-[#b80c0c] hover:bg-[#a60b0b] text-white font-semibold disabled:opacity-60"
            >
              {submitting ? "Resetting..." : "Reset Password"}
            </Button>

            <div className="text-center text-sm">
              <button type="button" onClick={() => navigate("/login")} className="text-gray-600 hover:underline">
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}