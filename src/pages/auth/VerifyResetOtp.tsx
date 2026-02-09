import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "@/service/apiService";
import bgFlag3 from "../../../public/images/flag6.webp";
import type { AxiosError } from "axios";

const OTP_LENGTH = 6;

export default function VerifyResetOtp() {
  const [params] = useSearchParams();
  const email = params.get("email") || "";
  const navigate = useNavigate();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (inputsRef.current[0]) inputsRef.current[0].focus();
  }, []);

  const code = useMemo(() => otp.join(""), [otp]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) inputsRef.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!text) return;
    const arr = text.split("");
    while (arr.length < OTP_LENGTH) arr.push("");
    setOtp(arr);
    inputsRef.current[Math.min(text.length, OTP_LENGTH - 1)]?.focus();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== OTP_LENGTH) return setError("Please enter the full OTP");
    setSubmitting(true);
    setError(null);
    try {
      // API: verify OTP -> returns a resetToken
      const res = await authApi.verifyResetOtp({ email, otp: code });
      if (!res?.success) throw new Error(res?.error || "Invalid OTP");
      const resetToken = res?.data?.resetToken; // adjust to your API
      toast.success("OTP verified");
      navigate(`/forgot-password/reset?email=${encodeURIComponent(email)}&token=${encodeURIComponent(resetToken)}`);
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

  const resendOtp = async () => {
    setResending(true);
    try {
      const res = await authApi.requestPasswordReset({ email });
      if (!res?.success) throw new Error(res?.error || "Failed to resend OTP");
      toast.success("OTP resent");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not resend OTP");
    } finally {
      setResending(false);
    }
  };

  if (!email) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <p className="mb-4">email missing.</p>
          <Link to="/forgot-password" className="text-[#074C2D] underline">Go back</Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-[100vh] bg-fixed bg-center bg-cover"
      style={{ backgroundImage: `url(${bgFlag3})` }}
    >
      <div className="absolute inset-0 bg-black/60 z-0" />
      <div className="relative z-10 min-h-[100vh] flex items-center justify-center px-4">
        <div className="w-full max-w-[980px] bg-white rounded-[28px] shadow-2xl px-6 py-10 sm:px-12 md:px-20 text-center">
          <h1 className="text-4xl font-extrabold text-[#074C2D]">Enter OTP</h1>
          <p className="mt-4 text-gray-700 text-lg">
            We sent a 6-digit code to <span className="font-semibold">{email}</span>
          </p>

          <form onSubmit={onSubmit} className="mx-auto mt-8 max-w-xl space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-center gap-3">
              {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                <Input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[i]}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  className="w-12 h-14 text-center text-xl font-semibold rounded-xl border border-gray-300 focus-visible:ring-2 focus-visible:ring-[#074C2D]"
                />
              ))}
            </div>

            <Button
              type="submit"
              disabled={submitting || code.length !== OTP_LENGTH}
              className="w-full"
            //   className="w-full h-12 rounded-xl bg-[#b80c0c] hover:bg-[#a60b0b] text-white font-semibold disabled:opacity-60"
            >
              {submitting ? "Verifying..." : "Verify OTP"}
            </Button>

            <div className="text-sm text-gray-700">
              Didn’t receive the code?{" "}
              <button
                type="button"
                onClick={resendOtp}
                disabled={resending}
                className="text-[#074C2D] hover:underline disabled:opacity-60"
              >
                {resending ? "Resending..." : "Resend OTP"}
              </button>
            </div>

            <div className="text-sm">
              <Link to={`/forgot-password?email=${encodeURIComponent(email)}`} className="text-gray-600 hover:underline">
                Edit email
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}