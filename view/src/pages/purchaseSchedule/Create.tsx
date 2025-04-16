import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppState, AppDispatch } from "../../store/store";
import { MONTH_NAMES } from "../../utils/choices";
import { createPurchaseSchedule } from "../../store/slices/purchaseScheduleSlice";
import { fetchItems } from "../../store/slices/itemSlice";
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

const Create = () => {
  const [formData, setFormData] = useState({
    name: "",
    item_id: "",
    type: "",
    category: "",
  });
  const [monthFormData, setMonthFormData] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
  });
  const { tokens } = useSelector((state: AppState) => state.auth);
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
    setMonthFormData({ ...monthFormData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      dispatch(createPurchaseSchedule({ formData, monthFormData }));
      navigate("/purchase-schedules");
    } catch (err) {
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Create Item
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-4"
      >
        <FormControl fullWidth variant="outlined" required disabled={loading}>
          <InputLabel id="item-select-label">Item</InputLabel>
          <Select
            labelId="item-select-label"
            id="item-select"
            name="item_id"
            value={formData.item_id}
            onChange={handleChange}
            label="Item"
          >
            {items.data &&
              items.data.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        {MONTH_NAMES.map(([monthNumber, monthName]) => (
          <TextField
            label={monthName}
            name={monthNumber}
            type="number"
            className="mb-8"
            variant="outlined"
            fullWidth
            value={monthFormData[monthNumber]}
            onChange={handleChange}
            inputProps={{
              min: 0,
              step: 1,
            }}
            required
            disabled={loading}
          />
        ))}

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
