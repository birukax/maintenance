import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createScheduledWorkOrder } from "../../../store/slices/scheduleSlice";
import { AppState, AppDispatch } from "../../../store/store";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Button,
  Typography,
  Container,
  CircularProgress,
  Box,
} from "@mui/material";
import { fetchWorkOrders } from "../../../store/slices/workOrderSlice";
import { toast } from "react-toastify";

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

const Create = ({ entityState, setModalOpen, params }) => {
  const id = entityState.data.id;
  const [formData, setFormData] = useState({
    schedule_id: id,
    start_date: "",
  });
  const scheduledWorkOrder = useSelector((state: AppState) => state.schedule.scheduledWorkOrder);

  const dispatch = useDispatch<AppDispatch>();

  const handleDateChange = (value) => {
    const formattedDate = value ? value.format("YYYY-MM-DD") : null;
    setFormData({
      ...formData,
      start_date: formattedDate,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // await api.patch(`/inventory/items/${item.data.id}/`, formData);
      await dispatch(createScheduledWorkOrder({ id, formData })).unwrap();
      setModalOpen(false);
      dispatch(fetchWorkOrders(params))
      toast.success("Scheduled Work Order created successfully");
    } catch (err) {
      // console.log(scheduledWorkOrder.error.non_field_errors[0])
      toast.error(Array.isArray(scheduledWorkOrder.error.non_field_errors) ? scheduledWorkOrder.error.non_field_errors.join(' ') : scheduledWorkOrder.error.non_field_errors);

    }
  };
  return (
    <Container sx={style} className="flex flex-col items-center justify-center">
      <Typography variant="h5" color='primary' className="mb-2!">
        Create Scheduled Work Order
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            disablePast
            label="Start Date"
            name="start_date"
            value={formData.start_date ? dayjs(formData.start_date) : null}
            onChange={handleDateChange}
            slotProps={{
              textField: {
                size: 'small',
                variant: "outlined",
                fullWidth: true,
                required: true,
                disabled: scheduledWorkOrder.loading,
                helperText: scheduledWorkOrder.error?.start_date,
              },
            }}
          />
        </LocalizationProvider>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={scheduledWorkOrder.loading}
          className="mt-4"
        >
          {scheduledWorkOrder.loading ? (
            <CircularProgress size={24} />
          ) : (
            "Create"
          )}
        </Button>

      </Box>
    </Container>
  );
};

export default Create;
