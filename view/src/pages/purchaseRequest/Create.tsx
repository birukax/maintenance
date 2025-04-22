import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPurchaseRequest } from "../../store/slices/purchaseRequestSlice";
import { fetchItems } from "../../store/slices/itemSlice";
import { AppState, AppDispatch } from "../../store/store";
import api from "../../utils/api";
import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import { PRIORITIES } from "../../utils/choices";
const Create = () => {
  const [formData, setFormData] = useState({
    item_id: "",
    quantity: "",
    priority: "",
  });
  const { tokens } = useSelector((state: AppState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { items } = useSelector((state: AppState) => state.item);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (tokens) {
      dispatch(fetchItems());
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await dispatch(createPurchaseRequest(formData)).unwrap();
      toast.success("Purchase Request created successfully");
      navigate("/purchase-requests");
    } catch (err) {
      toast.error("Error creating Purchase Request");
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Create Purchase Request
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap"
      >
        <FormControl fullWidth variant="outlined" required disabled={loading}>
          <InputLabel id="uom-select-label">Item</InputLabel>
          <Select
            labelId="uom-select-label"
            id="uom-select"
            name="item_id"
            value={formData.item_id}
            onChange={handleChange}
            label="Unit of Measure"
          >
            {items.data &&
              items.data.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined" required disabled={loading}>
          <InputLabel id="priority-select-label">Priority</InputLabel>
          <Select
            labelId="priority-select-label"
            id="priority-select"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            label="Priority"
          >
            {PRIORITIES.map((priority,index) => (
                <MenuItem key={index} value={priority[0]}>
                  {priority[0]}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.quantity}
          onChange={handleChange}
          inputProps={{
            min: 0,
            step: 1,
          }}
          required
          disabled={loading}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          className="mt-4"
        >
          {loading ? <CircularProgress size={24} /> : "Create Item"}
        </Button>
        {error && (
          <Typography variant="body2" className="mt-4 text-red-500">
            {error}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Create;
