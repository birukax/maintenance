import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppState, AppDispatch } from "../../store/store";
import { createSchedule } from "../../store/slices/scheduleSlice";
import { fetchItems } from "../../store/slices/itemSlice";
import { fetchEquipments } from "../../store/slices/equipmentSlice";
import { fetchMachines } from "../../store/slices/machineSlice";
import { fetchActivityTypes } from "../../store/slices/activityTypeSlice";
import { fetchWorkOrderTypes } from "../../store/slices/workOrderTypeSlice";
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
import { SCHEDULE_TYPES } from "../../utils/choices";
import { toast } from "react-toastify";
const Create = () => {
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    machine_id: "",
    equipment_id: "",
    work_order_type_id: "",
    activity_type_id: "",
    spareparts_required_id: [],
    tools_required_id: [],
    planned_days: 0,
    planned_hours: 0,
    planned_minutes: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { items } = useSelector((state: AppState) => state.item);
  const { machines } = useSelector((state: AppState) => state.machine);
  const { equipments } = useSelector((state: AppState) => state.equipment);
  const { activityTypes } = useSelector(
    (state: AppState) => state.activityType
  );
  const { workOrderTypes } = useSelector(
    (state: AppState) => state.workOrderType
  );

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchMachines());
    dispatch(fetchEquipments());
    dispatch(fetchWorkOrderTypes());
    dispatch(fetchActivityTypes());
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

    if(formData.planned_days>0 || formData.planned_hours>0 || formData.planned_minutes>0){
    try {
      await dispatch(createSchedule(formData)).unwrap();
      toast.success("Schedule created successfully");
      navigate("/schedules");
    } catch (err) {
      toast.error("Error creating Schedule");
      // setError(err.response?.data.detail || err.message);
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
    }
  }else{
    setLoading(false)
    toast.warning("At least one field of planned time must be greater than 0")
  }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Create Schedule
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap"
      >
        <FormControl fullWidth variant="outlined" required disabled={loading}>
          <InputLabel id="types-select-label">Type</InputLabel>
          <Select
            labelId="types-select-label"
            id="types-select"
            name="type"
            value={formData.type}
            onChange={handleChange}
            label="Type"
          >
            {SCHEDULE_TYPES.map((type) => (
              <MenuItem key={type[0]} value={type[0]}>
                {type[1]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          multiline
          label="Description"
          name="description"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.description}
          onChange={handleChange}
          required
          disabled={loading}
        />
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

        <FormControl fullWidth variant="outlined" required disabled={loading}>
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
                .filter((workOrderType) => workOrderType.scheduled === true)
                .map((workOrderType) => (
                  <MenuItem key={workOrderType.id} value={workOrderType.id}>
                    {workOrderType.name}
                  </MenuItem>
                ))}
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined" required disabled={loading}>
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
        </FormControl>
        <FormControl fullWidth variant="outlined" disabled={loading}>
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
        </FormControl>
        <FormControl fullWidth variant="outlined" disabled={loading}>
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
        </FormControl>
        <div className="planned-time-group">
        <TextField
          label="Planned Days"
          name="planned_days"
          type="number"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.planned_days}
          onChange={handleChange}
          disabled={loading}
        />
        <TextField
          label="Planned Hours"
          name="planned_hours"
          type="number"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.planned_hours}
          onChange={handleChange}
          disabled={loading}
        />
        <TextField
          label="Planned Minutes"
          name="planned_minutes"
          type="number"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.planned_minutes}
          onChange={handleChange}
          disabled={loading}
        />
        </div>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          className="mt-4"
        >
          {loading ? <CircularProgress size={24} /> : "Create Schedule"}
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
