import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createReturn } from "../../store/slices/returnSlice";
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
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Switch,
} from "@mui/material";

const Create = () => {
  const [formData, setFormData] = useState({
    item_id: "",
    reason: "",
    used: true,
    quantity: "",
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
    const { name, value, checked } = e.target;
    if (name === "used") {
      setFormData({ ...formData, [name]: checked });
    } else setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      dispatch(createReturn(formData));
      navigate("/returns");
    } catch (err) {
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Create Return
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-4"
      >
        <FormControlLabel
          labelPlacement="start"
          label="Used"
          onChange={handleChange}
          checked={formData.used}
          disabled={loading}
          required
          control={<Switch name="used" />}
        />
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

        <TextField
          label="Quantity"
          type="number"
          name="quantity"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.quantity}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <TextField
          multiline
          label="Reason"
          name="reason"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.reason}
          onChange={handleChange}
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
          {loading ? <CircularProgress size={24} /> : "Create Return"}
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
