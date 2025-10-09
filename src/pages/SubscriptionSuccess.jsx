import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Card, CardContent, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { FiCheckCircle, FiCheck } from "react-icons/fi";

export default function SubscriptionSuccess() {
  const { user } = useContext(AuthContext);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const queryParams = new URLSearchParams(location.search);
  const reference = queryParams.get("trxref") || queryParams.get("reference");

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      if (!reference) {
        setError("Invalid payment reference.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const email = user?.email || null;

        const { data } = await axios.get(
          `${BASE_URL}/api/subscription/payment-info/${reference}`,
          { params: { email } }
        );

        if (!data) {
          setError("Payment not found or not verified yet.");
        } else {
          setPaymentInfo(data);
        }
      } catch (err) {
        console.error("Error fetching payment info:", err.response?.data || err.message);
        setError("Failed to verify payment.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentInfo();
  }, [reference, user, BASE_URL]);

  return (
    <Box className="p-6 min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <ToastContainer />

      {loading && (
        <Typography variant="h5" className="text-gray-700 animate-pulse">
          Verifying your payment...
        </Typography>
      )}

      {!loading && error && (
        <Box className="text-center mt-6">
          <Typography variant="h5" className="text-red-600 font-bold mb-4">
            ❌ {error}
          </Typography>
          <Button
            variant="contained"
            color="error"
            size="large"
            onClick={() => navigate("/subscription")}
          >
            Back to Plans
          </Button>
        </Box>
      )}

      {!loading && paymentInfo && (
        <Box className="flex flex-col items-center gap-6">
          <FiCheckCircle className="text-green-600 text-8xl animate-bounce" />

          <Typography variant="h3" className="font-extrabold text-green-700 text-center">
            🎉 Subscription Successful!
          </Typography>

          <Card className="w-full max-w-md shadow-2xl rounded-2xl border border-gray-200 overflow-hidden">
            <CardContent className="p-6 bg-white">
              <Typography variant="h5" className="font-bold text-gray-900 mb-3">
                {paymentInfo.plan_name}
              </Typography>
              <Typography className="text-gray-700 mb-1">
                Amount Paid: ₦{Number(paymentInfo.amount).toLocaleString()}
              </Typography>
              <Typography className="text-gray-700 mb-1">
                Duration: {paymentInfo.duration_days} days
              </Typography>
              <Typography className="text-gray-700 font-medium mt-2 mb-1">
                Status:{" "}
                <span className={paymentInfo.status === "active" ? "text-green-600" : "text-red-600"}>
                  {paymentInfo.status}
                </span>
              </Typography>

              {paymentInfo.features && paymentInfo.features.length > 0 && (
                <>
                  <Typography className="text-gray-800 font-semibold mt-3 mb-1">Features:</Typography>
                  <List>
                    {paymentInfo.features.map((feature, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <FiCheck className="text-green-600" />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              <Typography className="text-gray-600 mt-2">
                Subscription Start: {paymentInfo.start_date ? new Date(paymentInfo.start_date).toLocaleDateString() : "N/A"}
              </Typography>
              <Typography className="text-gray-600">
                Subscription End: {paymentInfo.end_date ? new Date(paymentInfo.end_date).toLocaleDateString() : "N/A"}
              </Typography>
            </CardContent>
          </Card>

          <Button
            variant="contained"
            color="primary"
            size="large"
            className="mt-4 px-8 py-3 text-lg"
            onClick={() => navigate("/videos")}
          >
            Go to Videos
          </Button>
        </Box>
      )}
    </Box>
  );
}
