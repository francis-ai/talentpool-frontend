import React, { useState, useEffect } from "react";  
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import axios from "axios";

export default function RegistrationForm({ onRegistrationSuccess }) {
  const initialState = {
    course: "",
    price: "",
    full_name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    city: "",
    qualification: "",
    experience: "",
    linked_in: "",
    schedule: "",
    duration: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [availableDurations, setAvailableDurations] = useState([]);
  const [courses, setCourses] = useState([]);

  const qualifications = [
    "WAEC / College",
    "OND",
    "HND",
    "BSc",
    "MSc",
    "MBA",
    "PhD",
    "Professor",
  ];

  const schedules = ["Weekdays", "Weekends (Sat/Sun)"];

  // Fetch courses from API (public, no login required)
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/courses`);
        setCourses(res.data); // expects [{id, title, price, description, image_url}, ...]
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        toast.error("Failed to load courses. Try again later.");
      }
    };
    fetchCourses();
  }, []);

  // Update durations dynamically based on schedule
  useEffect(() => {
    if (formData.schedule === "Weekends (Sat/Sun)") {
      setAvailableDurations(["6 Hours"]);
      setFormData(prev => ({ ...prev, duration: "6 Hours" }));
    } else if (formData.schedule === "Weekdays") {
      setAvailableDurations(["2 Hours for 3 Days (6 Hours Total)"]);
      setFormData(prev => ({ ...prev, duration: "" }));
    } else {
      setAvailableDurations([]);
      setFormData(prev => ({ ...prev, duration: "" }));
    }
  }, [formData.schedule]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));

    // Auto-fill price when course changes
    if (name === "course") {
      const selectedCourse = courses.find(c => c.id === parseInt(value));
      setFormData(prev => ({ ...prev, price: selectedCourse ? selectedCourse.price : "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.course) newErrors.course = "Please choose a course.";
    if (!formData.full_name) newErrors.full_name = "Full Name cannot be empty.";
    if (!formData.email) newErrors.email = "Email cannot be empty.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email address is invalid.";
    if (!formData.phone) newErrors.phone = "Phone Number cannot be empty.";
    else if (!/^\d{10,15}$/.test(formData.phone)) newErrors.phone = "Phone number must be 10-15 digits.";
    if (!formData.dob) newErrors.dob = "Date of Birth cannot be empty.";
    else {
      const today = new Date();
      const birthDate = new Date(formData.dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
      if (age < 18) newErrors.dob = "You must be at least 18 years old.";
    }
    if (!formData.address) newErrors.address = "Address cannot be empty.";
    if (!formData.city) newErrors.city = "City cannot be empty.";
    if (!formData.qualification) newErrors.qualification = "Select a qualification.";
    if (!formData.experience) newErrors.experience = "Experience is required.";
    if (!formData.schedule) newErrors.schedule = "Select a schedule.";
    if (!formData.duration) newErrors.duration = "Select a duration.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix the highlighted errors.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/registercourse`, formData);
      toast.success("Registration Successful!");
      onRegistrationSuccess?.(formData);
      setFormData(initialState);
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = ({ id, label, type }) => (
    <div key={id}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={id}
        value={formData[id]}
        onChange={handleChange}
        className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          errors[id] ? "border-red-500 bg-red-50" : "border-gray-200"
        }`}
      />
      {errors[id] && <p className="text-red-500 text-sm mt-1">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-8 text-white relative overflow-hidden">
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Course Registration</h1>
              <p className="mt-2 text-blue-100">Join our professional training programs today</p>
            </div>
            <Link to="/">
              <button className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2">
                Home
              </button>
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="p-8 sm:p-10">
          <form onSubmit={handleSubmit} noValidate>
            {/* Course Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                  errors.course ? "border-red-500 bg-red-50" : "border-gray-200"
                }`}
              >
                <option value="">--Select a Course--</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title} (₦{c.price})
                  </option>
                ))}
              </select>
              {errors.course && <p className="text-red-500 text-sm mt-1">{errors.course}</p>}
            </div>

            {/* Display price dynamically */}
            {formData.price && (
              <p className="mb-4 text-gray-700 font-medium">
                Price: <span className="font-bold">₦{formData.price}</span>
              </p>
            )}

            {/* Personal Info */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {[ 
                { id: "full_name", label: "Full Name", type: "text" },
                { id: "email", label: "Email", type: "email" },
                { id: "phone", label: "Phone Number", type: "tel" },
                { id: "dob", label: "Date of Birth", type: "date" },
                { id: "address", label: "Address", type: "text" },
                { id: "city", label: "City", type: "text" },
                { id: "experience", label: "Years of Experience", type: "number" },
                { id: "linked_in", label: "LinkedIn Profile (Optional)", type: "url" },
              ].map(renderInput)}

              {/* Qualification */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Highest Qualification</label>
                <select
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                    errors.qualification ? "border-red-500 bg-red-50" : "border-gray-200"
                  }`}
                >
                  <option value="">--Select Qualification--</option>
                  {qualifications.map((q, idx) => <option key={idx} value={q}>{q}</option>)}
                </select>
                {errors.qualification && <p className="text-red-500 text-sm mt-1">{errors.qualification}</p>}
              </div>
            </div>

            {/* Schedule & Duration */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Schedule</label>
                <select
                  name="schedule"
                  value={formData.schedule}
                  onChange={handleChange}
                  className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                    errors.schedule ? "border-red-500 bg-red-50" : "border-gray-200"
                  }`}
                >
                  <option value="">--Select Schedule--</option>
                  {schedules.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
                </select>
                {errors.schedule && <p className="text-red-500 text-sm mt-1">{errors.schedule}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Duration</label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                    errors.duration ? "border-red-500 bg-red-50" : "border-gray-200"
                  }`}
                >
                  <option value="">--Select Duration--</option>
                  {availableDurations.map((d, idx) => <option key={idx} value={d}>{d}</option>)}
                </select>
                {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white py-4 px-6 rounded-xl font-semibold shadow-lg transition-all duration-300"
            >
              {loading ? "Processing..." : "Register Now"}
            </button>
          </form>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
    </div>
  );
}
