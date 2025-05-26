import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppState, AppDispatch } from "../../store/store";
import { createWorkOrder } from "../../store/slices/workOrderSlice";
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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast } from "react-toastify";
const Create = () => {
  const [formData, setFormData] = useState({
    start_date: "",
    machine_id: "",
    equipment_id: "",
    activity_type_id: "",
    work_order_type_id: "",
    spareparts_required_id: [],
    tools_required_id: [],
    total_hours: 0,
    total_days: 0,
    total_minutes: 0,
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

  
  const toolOptions = useMemo(() => {
    return Array.isArray(items.data)
      ? items.data.filter((item) => item.category === "TOOL")
      : [];
  }, [items.data]);

  const sparepartOptions = useMemo(() => {
    return Array.isArray(items.data)&&items.data
      ? items.data.filter((item) => item.category === "SPAREPART")
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
  const handleAutocompleteChange = (fieldName, newValue) => {
    // Extract only the IDs from the selected objects
    const selectedIds = newValue.map((item) => item.id);
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: selectedIds,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if(formData?.total_days>0 ||formData?.total_hours>0 || formData?.total_minutes>0){
      try {
      await dispatch(createWorkOrder(formData)).unwrap();
      toast.success("Work Order created successfully");
      navigate("/work-orders");
    } catch (err) {
      toast.error("Error creating Work Order");
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
    }
    }else{
      toast.warning("At least one field of total time required must be greater than 0 ")
      setLoading(false);
    }
    
  };


  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Create Work Order
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap"
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
                variant: "outlined",
                fullWidth: true,
                required: true,
                helperText: error?.start_date,
              },
            }}
          />
        </LocalizationProvider>
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
            onChange={(event, newValue) => {
              setFormData({
          ...formData,
          work_order_type_id: newValue ? newValue.id : "",
              });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </FormControl>
        <FormControl fullWidth variant="outlined" disabled={loading}>
          <Autocomplete
            options={
              Array.isArray(activityTypes.data)&& activityTypes.data
                ?Array.isArray(activityTypes.data)&& activityTypes.data.filter(
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
              Array.isArray(activityTypes.data) && activityTypes.data
                ? Array.isArray(activityTypes.data) && activityTypes.data.find(
                    (activityType) => activityType.id === formData.activity_type_id
                  ) || null
                : null
            }
            onChange={(event, newValue) => {
              setFormData({
                ...formData,
                activity_type_id: newValue ? newValue.id : "",
              });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </FormControl>

       

              
              <FormControl fullWidth variant="outlined" disabled={loading}>
                <Autocomplete
                  multiple
                  options={sparepartOptions}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Spareparts Required"
                      placeholder="Search spareparts..."
                    />
                  )}
                  id="sparepart-autocomplete"
                  value={selectedSpareparts}
                  onChange={(event, newValue) =>
                    handleAutocompleteChange("spareparts_required_id", newValue)
                  }
                ></Autocomplete>
              </FormControl>




        
        <FormControl fullWidth variant="outlined" disabled={loading}>
          <Autocomplete
            multiple
            options={toolOptions}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="tools Required"
                placeholder="Search tools..."
              />
            )}
            id="tool-select"
            value={selectedTools}
            onChange={(event, newValue) =>
              handleAutocompleteChange("tools_required_id", newValue)
            }
          ></Autocomplete>
        </FormControl>

        <div className="total-time-group">
        <TextField
          label="Total Days"
          name="total_days"
          type="number"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.total_days}
          onChange={handleChange}
          disabled={loading}
        />
        <TextField
          label="Total Hours"
          name="total_hours"
          type="number"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.total_hours}
          onChange={handleChange}
          disabled={loading}
        />
        <TextField
          label="Total Minutes"
          name="total_minutes"
          type="number"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.total_minutes}
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
          {loading ? <CircularProgress size={24} /> : "Create Work Order"}
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
