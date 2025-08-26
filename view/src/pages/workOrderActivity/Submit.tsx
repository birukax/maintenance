import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  submitWorkOrder,
  fetchWorkOrder,
} from "../../store/slices/workOrderSlice";
import { AppDispatch } from "../../store/store";
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

const Submit = ({ entityState, setModalOpen }) => {
  const id = entityState.data.id;
  const [formData, setFormData] = useState({
    remark: "",
    start_time: "",
    end_date: dayjs(entityState?.data?.start_date).format("YYYY-MM-DD") || null,
    end_time: "",
  });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchWorkOrder(id));
  }, []);

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // await api.patch(`/inventory/items/${item.data.id}/`, formData);
      await dispatch(submitWorkOrder({ id, formData })).unwrap();
      setModalOpen(false);
      toast.success("Work Order submitted successfully");
      navigate(`/work-order/detail/${id}`);
    } catch (err) {
      toast.error("Error submitting Work Order");
    }
  };

  return (
    <Container sx={style} className="flex flex-col items-center justify-center">
      <Typography variant="h5" color='primary' className="mb-2!">
        Submit Work Order
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
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
                size: 'small',
                variant: "outlined",
                fullWidth: true,
                required: true,
                disabled: entityState.loading,
                helperText: entityState.error?.end_date,
              },
            }}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="Start Time"
            name="start_time"
            value={
              formData.start_time
                ? dayjs(formData.start_time, "HH:mm:ss")
                : null
            }
            onChange={(value) => handleTimeChange("start_time", value)}
            // views={['hours', 'minutes', 'seconds']}
            slotProps={{
              textField: {
                size: 'small',
                variant: "outlined",
                fullWidth: true,
                required: true,
                disabled: entityState.loading,
                helperText: entityState.error?.start_time,
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
                ? formData.start_time
                : null
            )}
            value={
              formData.end_time ? dayjs(formData.end_time, "HH:mm:ss") : null
            }
            onChange={(value) => handleTimeChange("end_time", value)}
            // views={['hours', 'minutes', 'seconds']}
            slotProps={{
              textField: {
                size: 'small',
                variant: "outlined",
                fullWidth: true,
                required: true,
                disabled: entityState.loading,
                helperText: entityState.error?.end_time,
              },
            }}
          />
        </LocalizationProvider>

        <TextField
          size='small'
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
        />
        <Button
          size='small'
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
            "Submit"
          )}
        </Button>
        {entityState.error && (
          <Typography variant="body2" className="mt-4 text-red-500">
            {entityState.error?.detail}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Submit;
