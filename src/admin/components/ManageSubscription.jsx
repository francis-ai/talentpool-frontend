import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function ManagePlans() {
  const { axiosInstance } = useContext(AuthContext);

  const [plans, setPlans] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration_days: "",
    features: "",
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  const fetchPlans = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/subscription/plans");
      setPlans(data);
    } catch (err) {
      toast.error("❌ Failed to fetch plans");
    }
  }, [axiosInstance]); // ✅ include axiosInstance here

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]); // ✅ dependency included



  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        features: formData.features.split(",").map((f) => f.trim()),
      };

      if (editId) {
        await axiosInstance.put(`/subscription/plans/${editId}`, payload);
        toast.success("✅ Plan updated!");
      } else {
        await axiosInstance.post("/subscription/plans", payload);
        toast.success("🎉 Plan created!");
      }

      setOpen(false);
      setEditId(null);
      setFormData({ name: "", price: "", duration_days: "", features: "" });
      fetchPlans();
    } catch (err) {
      toast.error("❌ Failed to save plan");
    }
  };

  const handleEdit = (plan) => {
    setFormData({
      name: plan.name,
      price: plan.price,
      duration_days: plan.duration_days,
      features: JSON.parse(plan.features).join(", "),
    });
    setEditId(plan.id);
    setOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/subscription/plans/${deleteDialog.id}`);
      toast.success("🗑️ Plan deleted!");
      setDeleteDialog({ open: false, id: null });
      fetchPlans();
    } catch (err) {
      toast.error("❌ Failed to delete plan");
    }
  };

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer />
      <Paper elevation={3} className="p-6">
        <Box className="flex justify-between items-center mb-6">
          <Typography variant="h5" className="font-bold text-gray-800">
            📋 Manage Subscription Plans
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
          >
            Add Plan
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead className="bg-gray-200">
              <TableRow>
                <TableCell className="font-bold">Name</TableCell>
                <TableCell className="font-bold">Price</TableCell>
                <TableCell className="font-bold">Duration (days)</TableCell>
                <TableCell className="font-bold">Features</TableCell>
                <TableCell className="font-bold">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>{plan.name}</TableCell>
                  <TableCell>₦{plan.price.toLocaleString()}</TableCell>
                  <TableCell>{plan.duration_days}</TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {JSON.parse(plan.features).map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(plan)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() =>
                        setDeleteDialog({ open: true, id: plan.id })
                      }
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editId ? "Edit Plan" : "Add Plan"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            value={formData.price}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="duration_days"
            label="Duration (days)"
            type="number"
            fullWidth
            value={formData.duration_days}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="features"
            label="Features (comma-separated)"
            fullWidth
            multiline
            minRows={3}
            value={formData.features}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {editId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ⚠️ Are you sure you want to delete this plan?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
