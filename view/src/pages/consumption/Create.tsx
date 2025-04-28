import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createConsumption } from "../../store/slices/consumptionSlice";
import { fetchItems } from "../../store/slices/itemSlice";
import { AppState, AppDispatch } from "../../store/store";
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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast } from "react-toastify";
const Create = () => {
  const [formData, setFormData] = useState({
    item_id: "",
    reason: "",
    quantity: "",
    date:""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { items } = useSelector((state: AppState) => state.item);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchItems());
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleDateChange = (value) => {
    const formattedDate = value ? value.format("YYYY-MM-DD") : null;
    setFormData({
      ...formData,
      date: formattedDate,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await dispatch(createConsumption(formData)).unwrap();
      toast.success("Consumption created successfully");
      navigate("/consumptions");
    } catch (err) {
      toast.error("Error creating Consumption");
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Create Consumption
      </Typography>
      <Box component="form" onSubmit={handleSubmit} className="form-gap">
        <FormControl fullWidth variant="outlined" required disabled={loading}>
          <InputLabel id="item-select-label">Item</InputLabel>
          <Select
            labelId="item-select-label"
            id="item-select"
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            disableFuture
            label="Date"
            name="date"
            value={formData.date ? dayjs(formData.date) : null}
            onChange={handleDateChange}
            slotProps={{
              textField: {
                variant: "outlined",
                fullWidth: true,
                required: true,
                helperText: error?.date,
              },
            }}
          />
        </LocalizationProvider>
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
          {loading ? <CircularProgress size={24} /> : "Create Consumption"}
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
