import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateBreakdown,
  fetchBreakdown,
} from "../../store/slices/breakdownSlice";
import { AppState, AppDispatch } from "../../store/store";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import {
  Button,
  Typography,
  Container,
  CircularProgress,
  TextField,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
const style = {
  boxSizing: "border-box",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 300,
  width: "40%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Update = ({ entityState, setModalOpen }) => {
  const id = entityState.data.id;
  const [formData, setFormData] = useState({
    remark: "",
    end_date: dayjs(entityState?.data?.start_date).format("YYYY-MM-DD") || null,
    end_time: "",
    status: "FIXED",
  });
  const breakdown  = useSelector((state: AppState) => state.breakdown.breakdown);
  const [error, setError] = useState(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const handleDateChange = (value) => {
    const formattedDate = value ? value.format("YYYY-MM-DD") : null;
    setFormData({
      ...formData,
      end_date: formattedDate,
    });
  };

  const handleTimeChange = (field, value) => {
    const formattedTime = value ? value.format("HH:mm:ss") : null;
    setFormData({
      ...formData,
      [field]: formattedTime,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // await api.patch(`/inventory/items/${item.data.id}/`, formData);
      await dispatch(updateBreakdown({ id, formData })).unwrap();
      setModalOpen(false);
      toast.success("Breakdown updated successfully");
      navigate(`/breakdown/detail/${id}`);
    } catch (err) {
      toast.error(breakdown.error?.error||"Something Went Wrong");
      setError(err.response?.data?.detail || "Failed to update Breakdown.");
    }
  };

  return (
    <Container sx={style} className="flex flex-col items-center justify-center">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Update Breakdown
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap"
        sx={{ minWidth: "90%" }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            minDate={dayjs(entityState?.data?.start_date)}
            label="End Date"
            name="end_date"
            value={formData.end_date ? dayjs(formData.end_date) : null}
            onChange={handleDateChange}
            slotProps={{
              textField: {
                variant: "outlined",
                fullWidth: true,
                required: true,
                disabled: entityState.loading,
                helperText: breakdown.error?.end_date||"",
              },
            }}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="End Time"
            name="end_time"
            minTime={dayjs(
              formData.end_date === entityState.data.start_date
                ? entityState.data.start_time
                : null
            )}
            value={
              formData.end_time ? dayjs(formData.end_time, "HH:mm:ss") : null
            }
            onChange={(value) => handleTimeChange("end_time", value)}
            // views={['hours', 'minutes', 'seconds']}
            slotProps={{
              textField: {
                variant: "outlined",
                fullWidth: true,
                required: true,
                disabled: entityState.loading,
                helperText: breakdown.error?.end_time||"",
              },
            }}
          />
        </LocalizationProvider>

        <TextField
          multiline
          label="Remark"
          name="remark"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.remark}
          onChange={handleChange}
          required
          disabled={entityState.loading}
          helperText={breakdown.error?.remark||""}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={entityState.loading}
          className="mt-4"
        >
          {entityState.loading ? (
            <CircularProgress size={24} />
          ) : (
            "Update Breakdown"
          )}
        </Button>
      </Box>
    </Container>
  );
};

export default Update;
