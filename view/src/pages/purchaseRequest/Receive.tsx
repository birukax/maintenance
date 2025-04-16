import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { receivePurchaseRequest } from "../../store/slices/purchaseRequestSlice";
import { AppState, AppDispatch } from "../../store/store";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Button,
  Typography,
  Container,
  CircularProgress,
  TextField,
  Box,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Receive = ({ id, setModalOpen }) => {
  const [formData, setFormData] = useState({
    received_quantity: 0,
    received_date: "",
  });
  const { purchaseRequest } = useSelector(
    (state: AppState) => state.purchaseRequest
  );
  const [error, setError] = useState(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (value) => {
    const formattedDate = value ? value.format("YYYY-MM-DD") : null;

    setFormData({
      ...formData,
      received_date: formattedDate,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // await api.patch(`/inventory/items/${item.data.id}/`, formData);
      await dispatch(receivePurchaseRequest({ id, formData })).unwrap();
      setModalOpen(false);
    } catch (err) {
      setError(err.response?.data.detail || "Failed to receive the item.");
    }
  };
  useEffect(() => {
    if (purchaseRequest.error) {
      setError(purchaseRequest.error);
    }
  }, [purchaseRequest.error]);
  return (
    <Container sx={style} className="flex flex-col items-center justify-center">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Receive Item
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-4"
      >
        <TextField
          label="Quantity"
          name="received_quantity"
          type="number"
          className="mb-8"
          variant="outlined"
          fullWidth
          helperText={error?.received_quantity}
          value={formData.received_quantity}
          onChange={handleChange}
          required
          disabled={purchaseRequest.loading}
          inputProps={{ min: 0 }}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            disableFuture
            label="Receive Date"
            name="received_date"
            value={
              formData.received_date ? dayjs(formData.received_date) : null
            }
            onChange={handleDateChange}
            slotProps={{
              textField: {
                variant: "outlined",
                fullWidth: true,
                required: true,
                disabled: purchaseRequest.loading,
                helperText: error?.received_date,
              },
            }}
          />
        </LocalizationProvider>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={purchaseRequest.loading}
          className="mt-4"
        >
          {purchaseRequest.loading ? (
            <CircularProgress size={24} />
          ) : (
            "Receive Item"
          )}
        </Button>
        {error && (
          <Typography variant="body2" className="mt-4 text-red-500">
            {error.detail}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Receive;
