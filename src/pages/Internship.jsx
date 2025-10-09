import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import "react-toastify/dist/ReactToastify.css";

const salaryOptions = [
  "₦100000 - ₦200000",
  "₦200000 - ₦300000",
  "₦300000 - ₦500000",
  "₦500000 - ₦800000",
  "₦900000 - ₦1000000",
  "₦5000000+",
];

const initialState = {
  companyName: "",
  email: "",
  description: "",
  amount: "",
  salaryRange: "",
};

export default function InternshipForm({ onClose }) {
  const [formData, setFormData] = useState(initialState);
  const [validateError, setValidateError] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validateError[name]) {
      setValidateError((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.companyName.trim()) errors.companyName = "Enter company name";
    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    )
      errors.email = "Enter a valid email";
    if (!formData.description.trim()) errors.description = "Describe the internship";
    if (!formData.amount || Number(formData.amount) <= 0)
      errors.amount = "Enter a valid amount";
    if (!formData.salaryRange) errors.salaryRange = "Select a salary range";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) {
      setValidateError(errors);
      const first = Object.keys(errors)[0];
      document.getElementsByName(first)[0]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    setLoading(true);
    try {
      await toast.promise(
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/SubmitInternship`, formData),
        {
          pending: "Submitting...",
          success: "Request submitted successfully 🎉",
          error: "Failed to submit. Please try again.",
        }
      );
      setFormData(initialState);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
   
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative  p-6 max-w-xl mx-auto bg-white shadow-md rounded-md"
    >
       <div className="mt-10">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl"
        aria-label="Close"
      >
        <AiOutlineClose />
      </button>

      <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">
        Internship Request Form
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Company Name */}
        <InputField
          label="Company Name"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          error={validateError.companyName}
          loading={loading}
          placeholder="Enter your company name"
        />

        {/* Email */}
        <InputField
          label="Contact Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={validateError.email}
          loading={loading}
          placeholder="Enter your email"
        />

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Internship Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
            rows={4}
            maxLength={500}
            className={`w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring ${
              validateError.description
                ? "border-red-500 ring-red-200"
                : "border-gray-300 ring-indigo-200"
            }`}
            placeholder="Describe the internship role"
          />
          <div className="text-right text-xs text-gray-400">
            {formData.description.length}/500
          </div>
          {validateError.description && (
            <p className="text-red-500 mt-1 text-sm">{validateError.description}</p>
          )}
        </div>

        {/* Amount */}
        <InputField
          label="Amount You’re Open to Pay (₦)"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          error={validateError.amount}
          loading={loading}
          placeholder="e.g. 500"
          min="0"
        />

        {/* Salary Range */}
        <div>
          <label htmlFor="salaryRange" className="block text-sm font-medium text-gray-700">
            Select Salary Range for Intern
          </label>
          <select
            id="salaryRange"
            name="salaryRange"
            value={formData.salaryRange}
            onChange={handleChange}
            disabled={loading}
            className={`w-full mt-1 p-2 border rounded-md bg-white focus:outline-none focus:ring ${
              validateError.salaryRange
                ? "border-red-500 ring-red-200"
                : "border-gray-300 ring-indigo-200"
            }`}
          >
            <option value="">-- Choose Salary Range --</option>
            {salaryOptions.map((range, i) => (
              <option key={i} value={range}>
                {range}
              </option>
            ))}
          </select>
          {validateError.salaryRange && (
            <p className="text-red-500 mt-1 text-sm">{validateError.salaryRange}</p>
          )}
        </div>

        {/* Submit */}
        <div className="text-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 font-semibold rounded-md text-white transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-950 hover:bg-blue-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </form>

      <ToastContainer position="top-center" />
    </div>
    </motion.div>
   
  );
}

// ✅ Reusable InputField Component
const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  loading,
  placeholder,
  ...rest
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      disabled={loading}
      placeholder={placeholder}
      className={`w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring ${
        error ? "border-red-500 ring-red-200" : "border-gray-300 ring-indigo-200"
      }`}
      {...rest}
    />
    {error && <p className="text-red-500 mt-1 text-sm">{error}</p>}
  </div>
);
