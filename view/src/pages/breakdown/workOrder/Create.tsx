import { useState, useEffect, useMemo, SetStateAction, Dispatch, ChangeEvent, FC, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBreakdownWorkOrder, fetchBreakdown } from "../../../store/slices/breakdownSlice";
import { AppState, AppDispatch } from "../../../store/store";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { fetchItems } from "../../../store/slices/itemSlice";
import { fetchActivityTypes } from "../../../store/slices/activityTypeSlice";
import { fetchWorkOrderTypes } from "../../../store/slices/workOrderTypeSlice";
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
import { toast } from "react-toastify";
import { type Data, type FormData } from '../../../store/types';
import { EntityDetailState } from "../../../hooks/useEntityDetail";
import { SelectChangeEvent } from '../../../components/types';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

interface CreateProps {
  entityState: EntityDetailState;
  setModalOpen: Dispatch<SetStateAction<boolean>>
}

const Create: FC<CreateProps> = ({ entityState, setModalOpen }) => {
  const id = entityState.data?.id;
  const [formData, setFormData] = useState<FormData>({
    start_date: "",
    work_order_type_id: "",
    activity_type_id: "",
    total_hours: 0,
    total_days: 0,
    total_minutes: 0,
    tools_required_id: [],
    spareparts_required_id: []
  });
  const { breakdownWorkOrder } = useSelector((state: AppState) => state.breakdown);
  const { items } = useSelector((state: AppState) => state.item);
  const { activityTypes } = useSelector(
    (state: AppState) => state.activityType
  );
  const { workOrderTypes } = useSelector(
    (state: AppState) => state.workOrderType
  );
  const params = {
    no_pagination: "true",
  };


  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchWorkOrderTypes(params));
    dispatch(fetchActivityTypes(params));
    dispatch(fetchItems(params));
  }, []);

  const toolOptions = useMemo(() => {
    return Array.isArray(items.data)
      ? items.data.filter((item: Data) => item.category === "TOOL")
      : [];
  }, [items.data]);

  const sparepartOptions = useMemo(() => {
    return Array.isArray(items.data)
      ? items.data.filter((item: Data) => item.category === "SPAREPART")
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
      if (value === '' || isNaN(num) || num < 0) {
        setFormData({ ...formData, [name]: 0 });
      } else {
        setFormData({ ...formData, [name]: num });
      }
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string | number>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleDateChange = (value: dayjs.Dayjs | null) => {
    const formattedDate = value ? value.format("YYYY-MM-DD") : null;

    setFormData({
      ...formData,
      start_date: formattedDate,
    });
  };

  const handleAutocompleteChange = (field: string, value: any) => {
    // Extract only the IDs from the selected objects
    const selectedIds = value.map((item: Data) => item.id);
    setFormData((prevData) => ({
      ...prevData,
      [field]: selectedIds,
    }));
  }
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // setModalOpen(true);
    if (formData.total_days < 1 || formData.total_hours < 1 || formData.total_minutes < 1) {
      try {
        // await api.patch(`/inventory/items/${item.data.id}/`, formData);
        await dispatch(createBreakdownWorkOrder({ id, formData })).unwrap();
        toast.success("Breakdown Work Order created successfully");
        if (id) {
          dispatch(fetchBreakdown(id))
        }
        setModalOpen(false);

      } catch (error) {
        toast.error(breakdownWorkOrder?.error?.error || error || "Something Went Wrong");
      }
    } else {
      toast.warning("At least one field of planned time must be greater than 0")
    }
  };
  return (
    <Container sx={style} className="flex flex-col items-center justify-center">
      <Typography variant="h5" color='primary' className="mb-2! ">
        Create Breakdown Work Order
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            minDate={dayjs(breakdownWorkOrder?.data?.start_date)}
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
                disabled: breakdownWorkOrder?.loading,
                helperText: breakdownWorkOrder?.error?.start_date || "",
              },
            }}
          />
        </LocalizationProvider>
        <FormControl size='small' fullWidth variant="outlined" required disabled={breakdownWorkOrder?.loading}>
          <InputLabel id="work-order-type-select-label">
            Work Order Type
          </InputLabel>
          <Select
            size='small'
            labelId="work-order-type-select-label"
            id="work-order-type-select"
            name="work_order_type_id"
            value={formData.work_order_type_id}
            onChange={handleSelectChange}
            label="Work Order Type"
          >
            {Array.isArray(workOrderTypes.data) &&
              workOrderTypes.data.filter((workOrderType: Data) => workOrderType.breakdown === true).map((workOrderType: Data) => (
                <MenuItem key={workOrderType.id} value={workOrderType.id}>
                  {workOrderType.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl size='small' fullWidth variant="outlined" required disabled={breakdownWorkOrder?.loading}>
          <InputLabel id="activity-type-select-label">Activity Type</InputLabel>
          <Select
            size='small'
            labelId="activity-type-select-label"
            id="activity-type-select"
            name="activity_type_id"
            value={formData.activity_type_id}
            onChange={handleSelectChange}
            label="Activity Type"
          >
            {Array.isArray(activityTypes.data) &&
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
        <FormControl fullWidth variant="outlined" disabled={breakdownWorkOrder?.loading}>
          <Autocomplete
            multiple
            size='small'
            options={sparepartOptions}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Spareparts Required"
                placeholder="Search spareparts..."
                helperText={breakdownWorkOrder?.error?.spareparts_required_id || ""}
              />
            )}
            id="sparepart-autocomplete"
            value={selectedSpareparts}
            onChange={(_event, newValue) =>
              handleAutocompleteChange("spareparts_required_id", newValue)
            }
          ></Autocomplete>
        </FormControl>
        <FormControl size='small' fullWidth variant="outlined" disabled={breakdownWorkOrder?.loading}>
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
                helperText={breakdownWorkOrder?.error?.tools_required_id || ""}
              />
            )}
            id="tool-select"
            value={selectedTools}
            onChange={(_event, newValue) =>
              handleAutocompleteChange("tools_required_id", newValue)
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
            disabled={breakdownWorkOrder.loading}
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
            disabled={breakdownWorkOrder.loading}
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
            disabled={breakdownWorkOrder.loading}
          />
        </div>

        <Button
          size='small'
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={breakdownWorkOrder?.loading}
          className="mt-4"
        >
          {breakdownWorkOrder?.loading ? (
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
