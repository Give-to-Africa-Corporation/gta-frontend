// src/pages/StripeOnboardingReturn.tsx
import axios from "axios";
import React, { useEffect, useState } from "react";

interface StatusResponse {
  success: boolean;
  NGOAccountReady: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  missingFields: string[];
}

const StripeOnboardingReturn: React.FC = () => {
  const [data, setData] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryLoading, setRetryLoading] = useState(false);

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5001/api/v1";

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get<StatusResponse>(
          `${API_URL}/ngos/stripe/status`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setData(res.data);
      } catch (err: any) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
            "Failed to fetch Stripe account status."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const handleResumeOnboarding = async () => {
    try {
      setRetryLoading(true);
      const res = await axios.post(
        `${API_URL}/ngos/stripe/onboarding/start`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { success, url } = res.data;
      if (success && url) {
        window.location.href = url; // dubara Stripe onboarding par bhej do
      } else {
        setError("Unable to restart Stripe onboarding.");
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Failed to restart Stripe onboarding."
      );
    } finally {
      setRetryLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 mx-auto max-w-md text-center my-20">
        <h1 className="text-lg font-semibold mb-2">
          Checking your Stripe onboarding status...
        </h1>
        <p className="text-sm text-gray-600">Please wait.</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 mx-auto max-w-md text-center my-20">
        <h1 className="text-lg font-semibold mb-2">Stripe onboarding</h1>
        <p className="text-sm text-red-600 mb-2">{error || "Unknown error."}</p>
        <button
          onClick={handleResumeOnboarding}
          disabled={retryLoading}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm disabled:opacity-60"
        >
          {retryLoading ? "Redirecting..." : "Retry onboarding"}
        </button>
      </div>
    );
  }

  const { NGOAccountReady, missingFields, payoutsEnabled, chargesEnabled } =
    data;

  if (NGOAccountReady) {
    return (
      <div className="p-4 mx-auto max-w-md text-center my-20">
        <h1 className="text-lg font-semibold mb-2">
          Stripe onboarding complete ✅
        </h1>
        <p className="text-sm text-gray-700">
          Your bank / payout details are set up. You can now receive payouts.
        </p>
        <button
          className="bg-primary mt-3 text-white px-3 py-1 rounded hover:bg-primary text-sm"
          onClick={() => {
            window.location.href = "/dashboard";
          }}
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 mx-auto max-w-md text-center my-20">
        <h1 className="text-xl font-semibold mb-2">Stripe onboarding status</h1>

        <p className="text-sm text-gray-700 mb-2">
          Your Stripe account is not fully ready yet.
        </p>

        <ul className="text-sm text-gray-700 mb-3">
          <li>Charges enabled: {chargesEnabled ? "Yes" : "No"}</li>
          <li>Payouts enabled: {payoutsEnabled ? "Yes" : "No"}</li>
        </ul>

        {missingFields && missingFields.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-semibold mb-1">Stripe still needs:</p>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {missingFields.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleResumeOnboarding}
          disabled={retryLoading}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm disabled:opacity-60"
        >
          {retryLoading ? "Redirecting..." : "Continue in Stripe"}
        </button>
      </div>
    </>
  );
};

export default StripeOnboardingReturn;
