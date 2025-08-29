import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
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
  Box,
  Autocomplete,
} from "@mui/material";
import { SCHEDULE_TYPES } from "../../utils/choices";
import { toast } from "react-toastify";
import { type Data, type FormData } from '../../store/types';

const Create = () => {
  const [formData, setFormData] = useState<FormData>({
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
  const schedule = useSelector((state: AppState) => state.schedule.schedule)
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // setFormData({ ...formData, [name]: value });
    if (['planned_days', 'planned_hours', 'planned_minutes'].includes(name)) {
      const num = Number(value);
      if (value === '' || isNaN(num)) {
        setFormData({ ...formData, [name]: 0 });
      } else {
        setFormData({ ...formData, [name]: num });
      }
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.planned_days > 0 || formData.planned_hours > 0 || formData.planned_minutes > 0) {
      try {
        await dispatch(createSchedule(formData)).unwrap();
        toast.success("Schedule created successfully");
        navigate("/schedules");
      } catch (error) {
        toast.error(schedule.error?.error || error || "Something Went Wrong");
      }
    } else {
      toast.warning("At least one field of planned time must be greater than 0")
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h5" color='primary' className="mb-2! ">
        Create Schedule
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
        <FormControl fullWidth variant="outlined" disabled={schedule.loading}>
          <Autocomplete
            size='small'
            options={SCHEDULE_TYPES}
            getOptionLabel={(option) => option[1] || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Type"
                placeholder="Search types..."
                required
                helperText={schedule.error?.type}
              />
            )}
            id="types-select"
            value={SCHEDULE_TYPES.find((type) => type[0] === formData.type) || null}
            onChange={(_event, newValue) => {
              setFormData({ ...formData, type: newValue ? newValue[0] : "" });
            }}
            isOptionEqualToValue={(option, value) => option[0] === value[0]}
          />
        </FormControl>
        <TextField
          size='small'
          multiline
          label="Description"
          name="description"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.description}
          onChange={handleChange}
          required
          disabled={schedule.loading}
          helperText={schedule.error?.description}

        />
        <FormControl fullWidth variant="outlined" disabled={schedule.loading}>
          <Autocomplete
            size='small'
            options={Array.isArray(machines.data) ? machines.data : []}
            getOptionLabel={(option: Data) => `${option?.code} - ${option?.name}`}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Machine"
                placeholder="Search machines..."
                required
                helperText={schedule.error?.machine_id}

              />
            )}
            id="machine-select"
            value={Array.isArray(machines.data) && machines.data?.find((machine) => machine.id === formData.machine_id) || null}
            onChange={(_event, newValue) => {
              setFormData({ ...formData, machine_id: newValue ? newValue.id : "" });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </FormControl>
        <FormControl fullWidth variant="outlined" disabled={schedule.loading}>
          <Autocomplete
            size='small'
            options={Array.isArray(equipments.data) && equipments.data?.filter(
              (equipment) => equipment.machine.id === formData.machine_id
            ) || []}
            getOptionLabel={(option) => `${option.code} - ${option.name}`}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Equipment"
                placeholder="Search equipments..."
                helperText={schedule.error?.equipment_id}

              />
            )}
            id="equipment-select"
            value={
              Array.isArray(equipments.data) && equipments.data?.find(
                (equipment) => equipment.id === formData.equipment_id
              ) || null
            }
            onChange={(_event, newValue) => {
              setFormData({ ...formData, equipment_id: newValue ? newValue.id : "" });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </FormControl>

        <FormControl fullWidth variant="outlined" disabled={schedule.loading}>
          <Autocomplete
            size='small'
            options={
              Array.isArray(workOrderTypes.data)
                ? workOrderTypes.data.filter((workOrderType) => workOrderType?.scheduled === true)
                : []
            }
            getOptionLabel={(option) => `${option.code} - ${option.name}`}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Work Order Type"
                placeholder="Search work order types..."
                required
                helperText={schedule.error?.work_order_type_id}

              />
            )}
            id="work-order-type-select"
            value={
              Array.isArray(workOrderTypes.data)
                ? workOrderTypes.data.find((workOrderType) => workOrderType?.id === formData.work_order_type_id) || null
                : null
            }
            onChange={(_event, newValue) => {
              setFormData({ ...formData, work_order_type_id: newValue ? newValue.id : "" });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </FormControl>
        <FormControl fullWidth variant="outlined" disabled={schedule.loading}>
          <Autocomplete
            size='small'
            options={
              Array.isArray(activityTypes.data)
                ? activityTypes.data.filter(
                  (activityType) =>
                    activityType.work_order_type.id === formData.work_order_type_id
                )
                : []
            }
            getOptionLabel={(option) => `${option.code} - ${option.name}`}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Activity Type"
                placeholder="Search activity types..."
                required
                helperText={schedule.error?.activity_type_id}

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
            onChange={(_event, newValue) => {
              setFormData({ ...formData, activity_type_id: newValue ? newValue.id : "" });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </FormControl>
        <FormControl fullWidth variant="outlined" disabled={schedule.loading}>
          <Autocomplete
            size='small'
            multiple
            options={Array.isArray(items.data) && items.data ? items.data.filter((item) => item.category === "SPAREPART") : []}
            getOptionLabel={(option) => option.name || ""}
            value={
              Array.isArray(items.data)
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
                helperText={schedule.error?.spareparts_required_id}

              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            disabled={schedule.loading}
          />
        </FormControl>
        <FormControl fullWidth variant="outlined" disabled={schedule.loading}>
          <Autocomplete
            size='small'
            multiple
            options={Array.isArray(items.data) && items.data ? items.data.filter((item) => item.category === "TOOL") : []}
            getOptionLabel={(option) => option.name || ""}
            value={
              Array.isArray(items.data)
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
                helperText={schedule.error?.tools_required_id}

              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            disabled={schedule.loading}
          />
        </FormControl>
        <div className="planned-time-group">
          <TextField
            size='small'
            label="Planned Days"
            name="planned_days"
            type="number"
            className="mb-8"
            variant="outlined"
            fullWidth
            value={formData.planned_days}
            onChange={handleChange}
            disabled={schedule.loading}

          />
          <TextField
            size='small'
            label="Planned Hours"
            name="planned_hours"
            type="number"
            className="mb-8"
            variant="outlined"
            fullWidth
            value={formData.planned_hours}
            onChange={handleChange}
            disabled={schedule.loading}
          />
          <TextField
            size='small'
            label="Planned Minutes"
            name="planned_minutes"
            type="number"
            className="mb-8"
            variant="outlined"
            fullWidth
            value={formData.planned_minutes}
            onChange={handleChange}
            disabled={schedule.loading}
          />
        </div>
        <div className='flex gap-4'>

          <Button
            size='small'
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={schedule.loading}
            className="mt-4"
          >
            {schedule.loading ? <CircularProgress size={24} /> : "Create"}
          </Button>
          <Button
            component={Link}
            to='/schedules'
            type='button'
            size='small'
            variant='outlined'
            fullWidth
            disabled={schedule.loading}

          >
            Cancel
          </Button>
        </div>
      </Box>
    </Container>
  );
};

export default Create;
