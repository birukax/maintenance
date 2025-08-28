import { useState, useEffect, useMemo, ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppState, AppDispatch } from "../../store/store";
import { createWorkOrder } from "../../store/slices/workOrderSlice";
import { fetchItems } from "../../store/slices/itemSlice";
import { fetchEquipments } from "../../store/slices/equipmentSlice";
import { fetchMachines } from "../../store/slices/machineSlice";
import { fetchActivityTypes } from "../../store/slices/activityTypeSlice";
import { fetchWorkOrderTypes } from "../../store/slices/workOrderTypeSlice";
import { Link } from "react-router-dom";
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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast } from "react-toastify";
import { type FormData } from '../../store/types';

const Create = () => {
  const [formData, setFormData] = useState<FormData>({
    start_date: "",
    machine_id: "",
    equipment_id: "",
    activity_type_id: "",
    work_order_type_id: "",
    spareparts_required_id: [],
    tools_required_id: [],
    total_days: 0,
    total_hours: 0,
    total_minutes: 0,
  });
  const { workOrder } = useSelector((state: AppState) => state.workOrder);
  const { items } = useSelector((state: AppState) => state.item);
  const { machines } = useSelector((state: AppState) => state.machine);
  const { equipments } = useSelector((state: AppState) => state.equipment);
  const { activityTypes } = useSelector((state: AppState) => state.activityType);
  const { workOrderTypes } = useSelector((state: AppState) => state.workOrderType);

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


  const toolOptions = useMemo(() => {
    return Array.isArray(items.data)
      ? items.data?.filter((item) => item.category === "TOOL")
      : [];
  }, [items.data]);

  const sparepartOptions = useMemo(() => {
    return Array.isArray(items.data) && items.data
      ? items.data?.filter((item) => item.category === "SPAREPART")
      : [];
  }, [items.data]);

  const selectedSpareparts = useMemo(() => {
    return sparepartOptions.filter((option) =>
      formData.spareparts_required_id.includes(option.id)
    );
  }, [formData.spareparts_required_id, sparepartOptions]);

  const selectedTools = useMemo(() => {
    return toolOptions.filter((option) =>
      formData.tools_required_id.includes(option.id)
    );
  }, [formData.tools_required_id, toolOptions]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // setFormData({ ...formData, [name]: value });
    if (['total_days', 'total_hours', 'total_minutes'].includes(name)) {
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
  const handleDateChange = (value: dayjs.Dayjs | null) => {
    const formattedDate = value ? value.format("YYYY-MM-DD") : null;
    setFormData({
      ...formData,
      start_date: formattedDate,
    });
  };
  const handleAutocompleteChange = (fieldName: string, value: any) => {
    // Extract only the IDs from the selected objects
    const selectedIds = value.map((item: FormData) => item.id);
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: selectedIds,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData?.total_days > 0 || formData?.total_hours > 0 || formData?.total_minutes > 0) {
      try {
        await dispatch(createWorkOrder(formData)).unwrap();
        toast.success("Work Order created successfully");
        navigate("/work-orders");
      } catch (error) {
        toast.error(workOrder.error?.error || error || "Something Went Wrong");
      }
    } else {
      toast.warning("At least one field of total time required must be greater than 0 ")
    }

  };


  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h5" color='primary' className="mb-2! ">
        Create Work Order
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
                helperText: workOrder.error?.start_date || "",
              },
            }}
          />
        </LocalizationProvider>
        <FormControl fullWidth variant="outlined" disabled={workOrder.loading}>
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
                helperText={workOrder.error?.machine_id || ""}

              />
            )}
            id="machine-select"
            value={Array.isArray(machines.data) && machines.data?.find((machine) => machine.id === formData.machine_id) || null}
            onChange={(_event, value) => {
              setFormData({ ...formData, machine_id: value ? value.id : "" });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </FormControl>
        <FormControl fullWidth variant="outlined" disabled={workOrder.loading}>
          <Autocomplete
            size='small'
            options={Array.isArray(equipments.data) && equipments.data?.filter(
              (equipment) => equipment.machine.id === formData.machine_id
            ) || []}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Equipment"
                placeholder="Search equipments..."
                helperText={workOrder.error?.equipment_id || ""}
              />
            )}
            id="equipment-select"
            value={
              Array.isArray(equipments.data) && equipments.data?.find(
                (equipment) => equipment.id === formData.equipment_id
              ) || null
            }
            onChange={(_event, value) => {
              setFormData({ ...formData, equipment_id: value ? value.id : "" });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </FormControl>


        <FormControl fullWidth variant="outlined" disabled={workOrder.loading}>
          <Autocomplete
            size='small'
            options={
              Array.isArray(workOrderTypes.data)
                ? workOrderTypes.data.filter(
                  (workOrderType) =>
                    workOrderType.scheduled === false &&
                    workOrderType.breakdown === false
                )
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
                helperText={workOrder.error?.work_order_type_id}
              />
            )}
            id="work-order-type-select"
            value={
              Array.isArray(workOrderTypes.data)
                ? workOrderTypes.data.find(
                  (workOrderType) =>
                    workOrderType.id === formData.work_order_type_id
                ) || null
                : null
            }
            onChange={(_event, value) => {
              setFormData({
                ...formData,
                work_order_type_id: value ? value.id : "",
              });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </FormControl>
        <FormControl fullWidth variant="outlined" disabled={workOrder.loading}>
          <Autocomplete
            size='small'
            options={
              Array.isArray(activityTypes.data) && activityTypes.data
                ? activityTypes.data.filter(
                  (activityType) =>
                    activityType.work_order_type?.id === formData.work_order_type_id
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
                helperText={workOrder.error?.activity_type_id || ""}
              />
            )}
            id="activity-type-select"
            value={
              Array.isArray(activityTypes.data) && activityTypes.data
                ? Array.isArray(activityTypes.data) && activityTypes.data.find(
                  (activityType) => activityType.id === formData.activity_type_id
                ) || null
                : null
            }
            onChange={(_event, value) => {
              setFormData({
                ...formData,
                activity_type_id: value ? value.id : "",
              });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </FormControl>




        <FormControl fullWidth variant="outlined" disabled={workOrder.loading}>
          <Autocomplete
            size='small'
            multiple
            options={sparepartOptions}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Spareparts Required"
                placeholder="Search spareparts..."
                helperText={workOrder.error?.spareparts_required_id || ""}
              />
            )}
            id="sparepart-autocomplete"
            value={selectedSpareparts}
            onChange={(_event, value) =>
              handleAutocompleteChange("spareparts_required_id", value)
            }
          ></Autocomplete>
        </FormControl>





        <FormControl fullWidth variant="outlined" disabled={workOrder.loading}>
          <Autocomplete
            size='small'
            multiple
            options={toolOptions}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="tools Required"
                placeholder="Search tools..."
                helperText={workOrder.error?.tools_required_id || ""}
              />
            )}
            id="tool-select"
            value={selectedTools}
            onChange={(_event, value) =>
              handleAutocompleteChange("tools_required_id", value)
            }
          ></Autocomplete>
        </FormControl>

        <div className="total-time-group">
          <TextField
            size='small'
            label="Total Days"
            name="total_days"
            type="number"
            className="mb-8"
            variant="outlined"
            fullWidth
            value={formData.total_days}
            onChange={handleChange}
            disabled={workOrder.loading}
          />
          <TextField
            size='small'
            label="Total Hours"
            name="total_hours"
            type="number"
            className="mb-8"
            variant="outlined"
            fullWidth
            value={formData.total_hours}
            onChange={handleChange}
            disabled={workOrder.loading}
          />
          <TextField
            size='small'
            label="Total Minutes"
            name="total_minutes"
            type="number"
            className="mb-8"
            variant="outlined"
            fullWidth
            value={formData.total_minutes}
            onChange={handleChange}
            disabled={workOrder.loading}
          />
        </div>


        <div className='flex gap-4'>

          <Button
            size='small'
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={workOrder.loading}
            className="mt-4"
          >
            {workOrder.loading ? <CircularProgress size={24} /> : "Create"}
          </Button>
          <Button
            component={Link}
            to='/work-orders'
            type='button'
            size='small'
            variant='outlined'
            fullWidth
            disabled={workOrder.loading}

          >
            Cancel
          </Button>
        </div>
      </Box>
    </Container>
  );
};

export default Create;
