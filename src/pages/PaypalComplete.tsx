// src/pages/PaypalComplete.tsx
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

type ApiResponse = {
    message?: string;
    merchant_id?: string;
};

const PaypalComplete: React.FC = () => {
    const { ngoId } = useParams<{ ngoId: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [status, setStatus] = useState<
        "idle" | "success" | "error" | "missing_code"
    >("idle");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const code = searchParams.get("code");

    useEffect(() => {
        if (!ngoId) {
            setErrorMsg("NGO ID is missing from URL.");
            setStatus("error");
            return;
        }

        if (!code) {
            setStatus("missing_code");
            return;
        }

        const complete = async () => {
            try {
                setErrorMsg(null);

                const resp = await axios.post<ApiResponse>(
                    `/api/v1/ngos/paypal-complete/${ngoId}`,
                    { code }
                );

                resp.data;
                setStatus("success");
            } catch (err: any) {
                console.error("Complete onboarding error:", err?.response?.data || err?.message);
                const serverMsg = err?.response?.data?.message || err?.message || "Unknown error";
                setErrorMsg(String(serverMsg));
                setStatus("error");
            }
        };

        complete();
    }, [ngoId, code]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col p-4">
            <div className="max-w-xl w-full bg-white shadow-md rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50">
                        <svg className="w-6 h-6 text-brand-purple" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a6 6 0 100 12 6 6 0 000-12zM2 18a8 8 0 0116 0H2z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold">PayPal Onboarding</h1>
                        <p className="text-sm text-gray-500">Connecting NGO to PayPal — finalizing the setup.</p>
                    </div>
                </div>

                {/* Content */}

                {status === "success" && (
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full text-brand-purple mx-auto mb-4">
                            <svg className="w-8 h-8 text-brand-purple" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold">Onboarding completed</h2>
                        <p className="text-sm text-gray-600 mt-2">
                            NGO has been connected to PayPal successfully.
                        </p>

                        <div className="mt-6 flex justify-center gap-3">
                            <button
                                onClick={() => navigate(`/dashboard`)}
                                className="px-4 py-2 rounded bg-brand-purple text-white hover:bg-brand-yellow text-sm"
                            >
                                Go to NGO Dashboard
                            </button>
                        </div>
                    </div>
                )}

                {status === "missing_code" && (
                    <div className="text-center">
                        <h2 className="text-lg font-semibold">No code found</h2>
                        <p className="text-sm text-gray-600 mt-2">
                            PayPal did not return a code in the URL. Make sure you completed the PayPal onboarding flow.
                        </p>
                        <div className="mt-4 flex justify-center gap-3">
                            <button
                                onClick={() => navigate(-1)}
                                className="px-4 py-2 rounded bg-gray-200 text-gray-800 text-sm"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                )}

                {status === "error" && (
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8.257 3.099c.366-.446.957-.567 1.44-.31l.094.064 7.148 6.127c.518.444.66 1.185.35 1.778l-.06.108-7.148 11a1 1 0 01-1.498.234l-.082-.066-7.148-6.127a1.149 1.149 0 01-.248-1.653l.058-.077 7.148-11z" />
                            </svg>
                        </div>

                        <h2 className="text-lg font-semibold">Onboarding failed</h2>
                        <p className="text-sm text-gray-600 mt-2">{errorMsg || "Something went wrong."}</p>

                        <div className="mt-4 flex justify-center gap-3">
                            <button
                                onClick={() => navigate(`/dashboard`)}
                                className="px-4 py-2 rounded bg-gray-200 text-gray-800 text-sm"
                            >
                                Back to NGO
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Small footer */}
            <div className="mt-6 text-xs text-gray-400 text-center">
                <p>
                    If this page does not update automatically, copy the URL parameters and try again or contact support.
                </p>
            </div>
        </div>
    );
};

export default PaypalComplete;
