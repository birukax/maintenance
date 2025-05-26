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
  Autocomplete,
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
const params = {
    no_pagination: "true",
  };
  useEffect(() => {
    dispatch(fetchMachines(params));
    dispatch(fetchEquipments(params));
    dispatch(fetchWorkOrderTypes(params));
    dispatch(fetchActivityTypes(params));
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
        <FormControl fullWidth variant="outlined" disabled={loading}>
          <Autocomplete
            options={SCHEDULE_TYPES}
            getOptionLabel={(option) => option[1] || ""}
            renderInput={(params) => (
              <TextField
          {...params}
          variant="outlined"
          label="Type"
          placeholder="Search types..."
          required
              />
            )}
            id="types-select"
            value={SCHEDULE_TYPES.find((type) => type[0] === formData.type) || null}
            onChange={(event, newValue) => {
              setFormData({ ...formData, type: newValue ? newValue[0] : "" });
            }}
            isOptionEqualToValue={(option, value) => option[0] === value[0]}
          />
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
        <FormControl fullWidth variant="outlined" disabled={loading}>
          <Autocomplete
            options={machines.data || []}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Machine"
                placeholder="Search machines..."
                required
              />
            )}
            id="machine-select"
            value={ Array.isArray(machines.data)&& machines.data?.find((machine) => machine.id === formData.machine_id) || null}
            onChange={(event, newValue) => {
              setFormData({ ...formData, machine_id: newValue ? newValue.id : "" });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </FormControl>
        <FormControl fullWidth variant="outlined" disabled={loading}>
          <Autocomplete
            options={Array.isArray(equipments.data)&&equipments.data ?.filter(
              (equipment) => equipment.machine.id === formData.machine_id
            ) || []}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Equipment"
                placeholder="Search equipments..."
              />
            )}
            id="equipment-select"
            value={
              Array.isArray(equipments.data)&&equipments.data?.find(
                (equipment) => equipment.id === formData.equipment_id
              ) || null
            }
            onChange={(event, newValue) => {
              setFormData({ ...formData, equipment_id: newValue ? newValue.id : "" });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </FormControl>

        <FormControl fullWidth variant="outlined" disabled={loading}>
          <Autocomplete
            options={
              Array.isArray(workOrderTypes.data)
                ? workOrderTypes.data.filter((workOrderType) => workOrderType.scheduled === true)
                : []
            }
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Work Order Type"
                placeholder="Search work order types..."
                required
              />
            )}
            id="work-order-type-select"
            value={
              Array.isArray(workOrderTypes.data)
                ? workOrderTypes.data.find((workOrderType) => workOrderType.id === formData.work_order_type_id) || null
                : null
            }
            onChange={(event, newValue) => {
              setFormData({ ...formData, work_order_type_id: newValue ? newValue.id : "" });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </FormControl>
        <FormControl fullWidth variant="outlined" disabled={loading}>
          <Autocomplete
            options={
              Array.isArray(activityTypes.data)
          ? activityTypes.data.filter(
              (activityType) =>
                activityType.work_order_type.id === formData.work_order_type_id
            )
          : []
            }
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField
          {...params}
          variant="outlined"
          label="Activity Type"
          placeholder="Search activity types..."
          required
              />
            )}
            id="activity-type-select"
            value={
              Array.isArray(activityTypes.data)
          ? activityTypes.data.find(
              (activityType) => activityType.id === formData.activity_type_id
            ) || null
          : null
            }
            onChange={(event, newValue) => {
              setFormData({ ...formData, activity_type_id: newValue ? newValue.id : "" });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </FormControl>
        <FormControl fullWidth variant="outlined" disabled={loading}>
          <Autocomplete
            multiple
            options={items.data ? items.data.filter((item) => item.category === "SPAREPART") : []}
            getOptionLabel={(option) => option.name || ""}
            value={
              items.data
          ? items.data.filter((item) =>
              formData.spareparts_required_id.includes(item.id)
            )
          : []
            }
            onChange={(_, newValue) => {
              setFormData({
          ...formData,
          spareparts_required_id: newValue.map((item) => item.id),
              });
            }}
            renderInput={(params) => (
              <TextField
          {...params}
          variant="outlined"
          label="Spareparts Required"
          placeholder="Search spareparts..."
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            disabled={loading}
          />
        </FormControl>
        <FormControl fullWidth variant="outlined" disabled={loading}>
          <Autocomplete
            multiple
            options={items.data ? items.data.filter((item) => item.category === "TOOL") : []}
            getOptionLabel={(option) => option.name || ""}
            value={
              items.data
          ? items.data.filter((item) =>
              formData.tools_required_id.includes(item.id)
            )
          : []
            }
            onChange={(_, newValue) => {
              setFormData({
          ...formData,
          tools_required_id: newValue.map((item) => item.id),
              });
            }}
            renderInput={(params) => (
              <TextField
          {...params}
          variant="outlined"
          label="Tools Required"
          placeholder="Search tools..."
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            disabled={loading}
          />
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
