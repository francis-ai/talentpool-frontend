import React, { useState, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";

export default function UpdatePassword() {
  const { axiosInstance, isAuthenticated, loading: authLoading } =
    useContext(AuthContext);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (authLoading) {
      toast.error("Please wait... authentication is still loading.");
      return;
    }

    if (!isAuthenticated) {
      toast.error("⚠️ You must be logged in to update your password.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("❌ New password and confirmation do not match!");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.put("/update-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      toast.success(res.data?.message || "✅ Password updated successfully!");

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "❌ Failed to update password. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-900 px-4 py-8">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-3xl">
        <div className="px-8 py-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              Update Password
            </h2>
            <p className="text-gray-600 mt-2">
              Secure your account with a new password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300 text-gray-800 placeholder-blue-200 disabled:opacity-60"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300 text-gray-800 placeholder-blue-200 disabled:opacity-60"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300 text-gray-800 placeholder-blue-200 disabled:opacity-60"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading || authLoading}
              className={`w-full py-3.5 bg-blue-900 text-white font-bold rounded-xl shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 ${
                loading || authLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-blue-800 hover:scale-[1.02] transform"
              }`}
            >
              {loading
                ? "Updating..."
                : authLoading
                ? "Loading User..."
                : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}