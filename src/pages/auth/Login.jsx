import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  Box,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from "@mui/material";

import { AuthContext } from "../../context/AuthContext"; // ✅ use context

const MySwal = withReactContent(Swal);

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setFormData((prev) => ({ ...prev, email: rememberedEmail }));
    }
  }, []);

  // ✅ Redirect if already logged in (only after AuthContext finished loading)
  useEffect(() => {
    if (!authLoading && user) {
      const role = user.role || "student";
      if (role === "admin") navigate("/admin/dashboard");
      else navigate("/student-dashboard");
    }
  }, [user, authLoading, navigate]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      await login(formData.email, formData.password);

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      await MySwal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Redirecting to your dashboard...",
        timer: 2000,
        showConfirmButton: false,
      });

      // 🚀 Redirect handled automatically by useEffect above
    } catch (err) {
      console.error("❌ Login error:", err.response || err.message);
      const errorMsg =
        err.response?.data?.message ||
        (err.response?.status === 401
          ? "Invalid email or password"
          : "Login failed");
      MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-12"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Button
        onClick={() => navigate("/")}
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          bgcolor: "white",
          color: "primary.main",
          fontWeight: "bold",
          borderRadius: 3,
          p: 1.2,
          boxShadow: 2,
          "&:hover": { bgcolor: "grey.100", boxShadow: 4 },
        }}
      >
        <AiOutlineClose />
      </Button>

      <Card sx={{ maxWidth: 400, width: "100%", borderRadius: 4, boxShadow: 6 }}>
        <CardHeader
          title="Login to Your Account"
          sx={{
            bgcolor: "primary.main",
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
          }}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                error={!!errors.email}
                helperText={errors.email}
              />
            </Box>

            <Box mb={2}>
              <TextField
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                error={!!errors.password}
                helperText={errors.password}
              />
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                  />
                }
                label="Remember me"
              />
              <Button onClick={() => navigate("/forgot-password")} size="small">
                Forgot password?
              </Button>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ py: 1.5, fontWeight: "bold", borderRadius: 2 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            Don’t have an account?{" "}
            <Button onClick={() => navigate("/register")} size="small" color="primary">
              Register here
            </Button>
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Login;
