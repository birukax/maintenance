import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { AppState, AppDispatch } from "../../store/store";
import { createBreakdown } from "../../store/slices/breakdownSlice";
import { fetchEquipments } from "../../store/slices/equipmentSlice";
import { fetchMachines } from "../../store/slices/machineSlice";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  FormControl,
  Box,
  Autocomplete,
} from "@mui/material";
import { toast } from "react-toastify";
const Create = () => {
  const [formData, setFormData] = useState({
    start_date: "",
    machine_id: "",
    equipment_id: "",
    reason: "",
    start_time: ""
  });
  const breakdown = useSelector((state: AppState) => state.breakdown.breakdown);
  const { machines } = useSelector((state: AppState) => state.machine);
  const { equipments } = useSelector((state: AppState) => state.equipment);

  const params = {
    no_pagination: "true",
  };
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchMachines(params));
    dispatch(fetchEquipments(params));
  }, []);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleDateChange = (value) => {
    const formattedDate = value ? value.format("YYYY-MM-DD") : null;
    setFormData({
      ...formData,
      start_date: formattedDate,
    });
  };
  const handleTimeChange = (value) => {
    const formattedTime = value ? value.format("HH:mm:ss") : null;
    setFormData({
      ...formData,
      start_time: formattedTime,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createBreakdown(formData)).unwrap();
      toast.success("Breakdown created successfully");
      navigate("/breakdowns");
    } catch (err) {
      toast.error(breakdown?.error?.error || "Something Went Wrong");
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h5" color='primary' className="mb-2!">
        Create Breakdown
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            disableFuture
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
                disabled: breakdown.loading,
                helperText: breakdown?.error?.start_date,
              },
            }}
          />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="Start Time"
            name="start_time"
            value={formData.start_time ? dayjs(formData.start_time, "HH:mm:ss") : null}
            onChange={handleTimeChange}
            // views={['hours', 'minutes', 'seconds']}
            slotProps={{
              textField: {
                size: 'small',
                variant: "outlined",
                fullWidth: true,
                required: true,
                disabled: breakdown.loading,
                helperText: breakdown?.error?.start_time,
              },
            }}
          />
        </LocalizationProvider>
        <FormControl fullWidth variant="outlined" disabled={breakdown.loading}>
          <Autocomplete
            size='small'
            options={machines.data || []}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Machine"
                placeholder="Search machines..."
                required
                helperText={breakdown?.error?.machine_id}

              />
            )}
            id="machine-select"
            value={Array.isArray(machines.data) && machines.data?.find((machine) => machine.id === formData.machine_id) || null}
            onChange={(event, newValue) => {
              setFormData({ ...formData, machine_id: newValue ? newValue.id : "" });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </FormControl>
        <FormControl fullWidth variant="outlined" disabled={breakdown.loading}>
          <Autocomplete
            size='small'
            options={Array.isArray(equipments.data) && equipments.data?.filter(
              (equipment) => equipment?.machine?.id === formData.machine_id
            ) || []}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Equipment"
                placeholder="Search equipments..."
                helperText={breakdown?.error?.equipment_id}
              />
            )}
            id="equipment-select"
            value={
              Array.isArray(equipments.data) && equipments.data?.find(
                (equipment) => equipment.id === formData.equipment_id
              ) || null
            }
            onChange={(event, newValue) => {
              setFormData({ ...formData, equipment_id: newValue ? newValue.id : "" });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </FormControl>

        <TextField
          size='small'
          multiline
          label="Reason"
          name="reason"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.reason}
          onChange={handleChange}
          required
          disabled={breakdown.loading}
          helperText={breakdown?.error?.reason}
        />
        <div className='flex gap-4'>

          <Button
            size='small'
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={breakdown.loading}
            className="mt-4"
          >
            {breakdown.loading ? <CircularProgress size={24} /> : "Create"}
          </Button>
          <Button
            component={Link}
            to='/breakdowns'
            type='button'
            size='small'
            variant='outlined'
            fullWidth
            disabled={breakdown.loading}

          >
            Cancel
          </Button>
        </div>
      </Box>
    </Container>
  );
};

export default Create;
