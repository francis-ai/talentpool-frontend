import { useState } from "react";  
import { motion } from "framer-motion";
import axios from "axios";
import { 
  AiOutlineClose, 
  AiOutlineUser, 
  AiOutlineMail, 
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible 
} from "react-icons/ai";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const MotionLink = motion(Link);

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const validationErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) validationErrors.name = "Full name is required";
    if (!formData.email.trim()) validationErrors.email = "Email is required";
    else if (!emailPattern.test(formData.email)) validationErrors.email = "Please enter a valid email";
    if (!formData.password.trim()) validationErrors.password = "Password is required";
    else if (formData.password.length < 6) validationErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword.trim()) validationErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) validationErrors.confirmPassword = "Passwords do not match";

    return validationErrors;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);


    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/registerAuthen`;
      const res = await axios.post(apiUrl, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (res.status === 201) {
        await Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: res.data.message || "You have registered successfully.",
          showConfirmButton: false,
          timer: 2000
        });

        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
        setLoginInfo(true);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: msg,
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1, when: "beforeChildren" } } };
  const itemVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-4 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <MotionLink 
        to="/" 
        className="absolute top-6 right-6 lg:right-10 bg-white/90 backdrop-blur-sm text-blue-900 font-bold p-3 rounded-xl hover:bg-white transition-all shadow-md hover:shadow-lg z-10"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AiOutlineClose className="w-5 h-5" />
      </MotionLink>

      <motion.div 
        className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl w-full max-w-md overflow-hidden border border-white/20 relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-200 rounded-full opacity-20"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-200 rounded-full opacity-20"></div>
        
        <div className="p-8 sm:p-10 relative z-10">
          {!loginInfo ? (
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <motion.div className="text-center mb-4" variants={itemVariants}>
                <h2 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Create Account
                </h2>
                <p className="mt-2 text-gray-600">Join our community today</p>
              </motion.div>

              <form onSubmit={handleFormSubmit} className="space-y-5">
                {/* Name */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AiOutlineUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.name ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-blue-300"}`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
                </motion.div>

                {/* Email */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AiOutlineMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.email ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-blue-300"}`}
                      placeholder="your@email.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
                </motion.div>

                {/* Password */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AiOutlineLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.password ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-blue-300"}`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <AiOutlineEyeInvisible className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <AiOutlineEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password}</p>}
                </motion.div>

                {/* Confirm Password */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AiOutlineLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.confirmPassword ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-blue-300"}`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <AiOutlineEyeInvisible className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <AiOutlineEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-2">{errors.confirmPassword}</p>}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-3 px-6 rounded-lg font-medium shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 relative overflow-hidden ${loading ? "opacity-80 cursor-not-allowed" : ""}`}
                  >
                    {loading ? "Creating Account..." : "Register Now"}
                  </button>
                </motion.div>
              </form>

              <motion.div className="text-center text-sm text-gray-600 mt-6" variants={itemVariants}>
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 font-medium hover:text-blue-800 hover:underline transition-colors">
                  Log in
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div className="text-center space-y-4 py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-full mb-6 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                🎉 Registration Successful!
              </h1>
              <p className="text-green-600">
                Welcome to our community <span className="font-medium">{formData.name}</span>!
              </p>
            
              <Link
                to="/login"
                className="inline-block mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-8 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
              >
                Continue to Login
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
