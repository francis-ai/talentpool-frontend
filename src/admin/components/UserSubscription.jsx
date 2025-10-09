import { useEffect, useState, useContext, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../context/AuthContext";

export default function UserSubscriptions() {
  const { axiosInstance } = useContext(AuthContext);
  const [subs, setSubs] = useState([]);

  // ✅ Added dependency array for useCallback
  const fetchUserSubscriptions = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/subscription/subscriptions");
      setSubs(data);
    } catch (err) {
      toast.error("❌ Failed to fetch user subscriptions");
    }
  }, [axiosInstance]);

  // ✅ Added fetchUserSubscriptions as dependency
  useEffect(() => {
    fetchUserSubscriptions();
  }, [fetchUserSubscriptions]);

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer />
      <Paper elevation={3} className="p-6">
        <Typography variant="h5" className="font-bold text-gray-800 mb-6">
          👥 User Subscriptions
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead className="bg-gray-200">
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" className="text-gray-500">
                    No subscription yet on the table
                  </TableCell>
                </TableRow>
              ) : (
                subs.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.user_name}</TableCell>
                    <TableCell>{s.user_email}</TableCell>
                    <TableCell>{s.plan_name}</TableCell>
                    <TableCell>
                      {new Date(s.start_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(s.end_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell
                      className={`font-semibold ${
                        s.status === "active" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {s.status}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
