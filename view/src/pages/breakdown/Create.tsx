import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppState, AppDispatch } from "../../store/store";
import { createBreakdown } from "../../store/slices/breakdownSlice";
// import { fetchItems } from "../../store/slices/itemSlice";
import { fetchEquipments } from "../../store/slices/equipmentSlice";
import { fetchMachines } from "../../store/slices/machineSlice";
// import { fetchActivityTypes } from "../../store/slices/activityTypeSlice";
// import { fetchWorkOrderTypes } from "../../store/slices/workOrderTypeSlice";
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
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
// import { BREAKDOWN_TYPES } from "../../utils/choices";

import { toast } from "react-toastify";
const Create = () => {
  const [formData, setFormData] = useState({
    start_date:"",
    machine_id:"",
    equipment_id:"",
    reason:"",
    start_time:""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { breakdown } = useSelector((state: AppState) => state.breakdown);
  // const { items } = useSelector((state: AppState) => state.item);
  const { machines } = useSelector((state: AppState) => state.machine);
  const { equipments } = useSelector((state: AppState) => state.equipment);
  // const { activityTypes } = useSelector(
  //   (state: AppState) => state.activityType
  // );
  // const { workOrderTypes } = useSelector(
  //   (state: AppState) => state.workOrderType
  // );
const params = {
    no_pagination: "true",
  };
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchMachines(params));
    dispatch(fetchEquipments(params));
    // dispatch(fetchWorkOrderTypes());
    // dispatch(fetchActivityTypes());
    // dispatch(fetchItems());
  }, []);

  console.log("machi",machines);
  

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
    setLoading(true);
    setError(null);
    try {
      await dispatch(createBreakdown(formData)).unwrap();
      toast.success("Breakdown created successfully");
      navigate("/breakdowns");
    } catch (err) {
      toast.error("Error creating Breakdown");
      // setError(err.response?.data.detail || err.message);
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Create Breakdown
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap"
      >

        {/* <FormControl fullWidth variant="outlined" required disabled={loading}>
          <InputLabel id="types-select-label">Type</InputLabel>
          <Select
            labelId="types-select-label"
            id="types-select"
            name="type"
            value={formData.type}
            onChange={handleChange}
            label="Type"
          >
            {BREAKDOWN_TYPES.map((type) => (
              <MenuItem key={type[0]} value={type[0]}>
                {type[1]}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}

<LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            disableFuture
            label="Start Date"
            name="start_date"
            value={formData.start_date ? dayjs(formData.start_date) : null}
            onChange={handleDateChange}
            slotProps={{
              textField: {
                variant: "outlined",
                fullWidth: true,
                required: true,
                disabled: breakdown.loading,
                helperText: error,
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
                variant: "outlined",
                fullWidth: true,
                required: true,
                disabled: breakdown.loading,
                helperText: error,
              },
            }}
          />
        </LocalizationProvider>
        <FormControl fullWidth variant="outlined" required disabled={loading}>
          <InputLabel id="machine-select-label">Machine</InputLabel>
          <Select
            labelId="machine-select-label"
            id="machine-select"
            name="machine_id"
            value={formData.machine_id}
            onChange={handleChange}
            label="Machine"
          >
            {machines.data &&
              machines.data.map((machine) => (
                <MenuItem key={machine.id} value={machine.id}>
                  {machine.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <FormControl
          fullWidth
          variant="outlined"
          required={false}
          disabled={loading}
        >
          <InputLabel id="equipment-select-label">Equipment</InputLabel>
          <Select
            labelId="equipment-select-label"
            id="equipment-select"
            name="equipment_id"
            value={formData.equipment_id}
            onChange={handleChange}
            label="Equipment"
          >
            {equipments.data &&
              equipments.data
              .filter(
                (equipment) => equipment.machine.id === formData.machine_id
              )
              .map((equipment) => (
                <MenuItem key={equipment.id} value={equipment.id}>
                    {equipment.name}
                  </MenuItem>
                ))}
          </Select>
        </FormControl>

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
        {/* <FormControl fullWidth variant="outlined" required disabled={loading}>
          <InputLabel id="work-order-type-select-label">
          Work Order Type
          </InputLabel>
          <Select
            labelId="work-order-type-select-label"
            id="work-order-type-select"
            name="work_order_type_id"
            value={formData.work_order_type_id}
            onChange={handleChange}
            label="Work Order Type"
          >
            {workOrderTypes.data &&
              workOrderTypes.data
                .filter((workOrderType) => workOrderType.breakdownd === true)
                .map((workOrderType) => (
                  <MenuItem key={workOrderType.id} value={workOrderType.id}>
                    {workOrderType.name}
                  </MenuItem>
                ))}
          </Select>
        </FormControl> */}

        {/* <FormControl fullWidth variant="outlined" required disabled={loading}>
          <InputLabel id="activity-type-select-label">Activity Type</InputLabel>
          <Select
            labelId="activity-type-select-label"
            id="activity-type-select"
            name="activity_type_id"
            value={formData.activity_type_id}
            onChange={handleChange}
            label="Activity Type"
          >
            {activityTypes.data &&
              activityTypes.data
                .filter(
                  (activityType) =>
                    activityType.work_order_type.id ===
                    formData.work_order_type_id
                )
                .map((activityType) => (
                  <MenuItem key={activityType.id} value={activityType.id}>
                    {activityType.name}
                  </MenuItem>
                ))}
          </Select>
        </FormControl> */}

        {/* <FormControl fullWidth variant="outlined" disabled={loading}>
          <InputLabel id="sparepart-select-label">
            Spareparts Required
          </InputLabel>
          <Select
            multiple
            labelId="sparepart-select-label"
            id="sparepart-select"
            name="spareparts_required_id"
            value={formData.spareparts_required_id}
            onChange={handleChange}
            label="Spareparts Required"
          >
            {items.data &&
              items.data
                .filter((item) => item.category === "SPAREPART")
                .map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
          </Select>
        </FormControl> */}

        {/* <FormControl fullWidth variant="outlined" disabled={loading}>
          <InputLabel id="tool-select-label">Tools Required</InputLabel>
          <Select
            multiple
            labelId="tool-select-label"
            id="tool-select"
            name="tools_required_id"
            value={formData.tools_required_id}
            onChange={handleChange}
            label="Tools Required"
          >
            {items.data &&
              items.data
                .filter((item) => item.category === "TOOL")
                .map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
          </Select>
        </FormControl> */}
        {/* <TextField
          label="Planned Time (In minutes)"
          name="planned_time"
          type="number"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.planned_time}
          onChange={handleChange}
          required
          disabled={loading}
        /> */}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          className="mt-4"
        >
          {loading ? <CircularProgress size={24} /> : "Create Breakdown"}
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
