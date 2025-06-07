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
  Autocomplete,
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
      const consumption = useSelector((state:AppState)=>state.consumption.consumption)


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { items } = useSelector((state: AppState) => state.item);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
const params = {
    no_pagination: "true",
  };
  useEffect(() => {
    dispatch(fetchItems(params));
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
        <FormControl fullWidth variant="outlined" disabled={loading}>
          <Autocomplete
            options={Array.isArray(items.data) && items.data || []}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Item"
                placeholder="Search items..."
                required
                helperText={consumption.error?.item_id}

              />
            )}
            id="item-select"
            value={Array.isArray(items.data)&&items.data?.find((item) => item.id === formData.item_id) || null}
            onChange={(event, newValue) => {
              setFormData({
                ...formData,
                item_id: newValue ? newValue.id : "",
              });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
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
          helperText={consumption.error?.quantity}
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
          helperText={consumption.error?.reason}
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
