import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchActivities } from "../../store/slices/activitySlice";
import { createWorkOrderActivities } from "../../store/slices/workOrderSlice";
import { AppState, AppDispatch } from "../../store/store";
import {
  Button,
  Typography,
  Container,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Autocomplete,

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

const AddActivity = ({ entityState, setModalOpen }) => {
  const id = entityState.data.id;
  const [formData, setFormData] = useState({
    activity_ids: [],
  });
  const workOrder = useSelector((state: AppState) => state.workOrder.workOrder)

  const { activities } = useSelector((state: AppState) => state.activity);
  const [error, setError] = useState(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const params = {
    no_pagination: "true",
  };
  useEffect(() => {
    dispatch(fetchActivities(params));
  }, []);

  const activityOptions = useMemo(() => {
    return activities?.data
      ? activities?.data?.filter(
        (activity) =>
          activity.activity_type.id ===
          entityState.data.activity_type.id
      )
      : [];
  }, [activities.data]);

  const selectedActivities = useMemo(() => {
    return activityOptions.filter((option) =>
      formData.activity_ids.includes(option.id)
    );
  }, [formData.activity_ids, activityOptions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    setError(null);
    try {
      // await api.patch(`/inventory/items/${item.data.id}/`, formData);
      await dispatch(createWorkOrderActivities({ id, formData })).unwrap();
      toast.success("Work Order Activities created successfully");
      setModalOpen(false);
    } catch (err) {
      toast.error(workOrder.error?.error || "Something Went Wrong");
      setError(
        err.response?.data.detail || "Failed to create work order activities."
      );
    }
  };

  return (
    <Container sx={style} className="flex flex-col items-center justify-center">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Add Activities
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
        sx={{ minWidth: "90%" }}
      >
        <FormControl fullWidth variant="outlined" disabled={entityState.loading}>
          <Autocomplete
            multiple
            options={activityOptions}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Activities"
                placeholder="Search activities..."
                helperText={workOrder.error?.activity_ids || ""}
              />
            )}
            id="activity-autocomplete"
            value={selectedActivities}
            onChange={(event, newValue) =>
              handleAutocompleteChange("activity_ids", newValue)
            }
          ></Autocomplete>
        </FormControl>
        <Button
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
            "Add Activity"
          )}
        </Button>
        {error && (
          <Typography variant="body2" className="mt-4 text-red-500">
            {error.detail}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default AddActivity;
