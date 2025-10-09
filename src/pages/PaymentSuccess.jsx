import React, { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { AuthContext } from "../context/AuthContext"; // ✅ import context

export default function PaymentVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reference = searchParams.get("reference");

  const { axiosInstance, isAuthenticated } = useContext(AuthContext); // ✅ get from context

  const [status, setStatus] = useState("verifying"); // verifying | success | failed
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      // Handle missing reference
      if (!reference) {
        setStatus("failed");
        setMessage("Payment reference missing. Please try again.");
        return;
      }

      // Handle not logged in
      if (!isAuthenticated) {
        setStatus("failed");
        setMessage("You need to be logged in to verify payment.");
        return;
      }

      try {
        const res = await axiosInstance.get(`/payment/verify/${reference}`, {
          timeout: 15000, // Timeout after 15 seconds
        });

        setStatus("success");
        setMessage(res.data.message || "Payment verified successfully!");
      } catch (err) {
        console.error("Verification failed:", err.response?.data || err.message);
        setStatus("failed");
        setMessage(
          err.response?.data?.message ||
            "Payment verification failed. Please try again or contact support."
        );
      }
    };

    verifyPayment();
  }, [reference, axiosInstance, isAuthenticated]);

  const handleGoToDashboard = () => {
    navigate("/student-dashboard");
  };

  const handleTryAgain = () => {
    navigate("/pricing");
  };

  const handleContactSupport = () => {
    navigate("/support");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white font-sans p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Verifying Status */}
        {status === "verifying" && (
          <div className="flex flex-col items-center gap-4 animate-fadeIn">
            <Loader2 className="h-14 w-14 text-blue-600 animate-spin" />
            <h1 className="text-2xl font-semibold text-gray-800">
              Verifying your payment...
            </h1>
            <p className="text-gray-500">Please wait a moment</p>
          </div>
        )}

        {/* Success Status */}
        {status === "success" && (
          <div className="flex flex-col items-center gap-4 animate-fadeIn">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
            <h1 className="text-2xl font-semibold text-green-700">
              Payment Successful
            </h1>
            <p className="text-gray-600">{message}</p>
            <button
              onClick={handleGoToDashboard}
              className="mt-4 w-full rounded-lg bg-green-600 px-6 py-3 text-white font-medium hover:bg-green-700 transition-colors shadow-md"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {/* Failed Status */}
        {status === "failed" && (
          <div className="flex flex-col items-center gap-4 animate-fadeIn">
            <XCircle className="h-16 w-16 text-red-600" />
            <h1 className="text-2xl font-semibold text-red-700">
              Payment Failed
            </h1>
            <p className="text-gray-600">{message}</p>
            <div className="flex gap-4 mt-4 w-full">
              <button
                onClick={handleTryAgain}
                className="flex-1 rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors shadow-md"
              >
                Try Again
              </button>
              <button
                onClick={handleContactSupport}
                className="flex-1 rounded-lg border border-gray-300 px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-md"
              >
                Contact Support
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
