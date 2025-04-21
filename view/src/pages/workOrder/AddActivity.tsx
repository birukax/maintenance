import { useState, useEffect } from "react";
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
  Box,
} from "@mui/material";

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

const AddActivity = ({ entityState, setModalOpen }) => {
  const id = entityState.data.id;
  const [formData, setFormData] = useState({
    activity_ids: [],
  });
  const { activities } = useSelector((state: AppState) => state.activity);
  const [inputs, setInputs] = useState(5);
  const [error, setError] = useState(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchActivities());
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // await api.patch(`/inventory/items/${item.data.id}/`, formData);
      await dispatch(createWorkOrderActivities({ id, formData })).unwrap();
      setModalOpen(false);
    } catch (err) {
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
        className="w-full max-w-lg space-y-4"
      >
        <FormControl
          fullWidth
          variant="outlined"
          disabled={entityState.loading}
        >
          <InputLabel id="activity-select-label">Activities</InputLabel>
          <Select
            multiple
            labelId="activity-select-label"
            id="activity-select"
            name="activity_ids"
            value={formData.activity_ids}
            onChange={handleChange}
            label="Activities"
          >
            {activities.data &&
              activities.data
                .filter(
                  (activity) =>
                    activity.activity_type.id ===
                    entityState.data.activity_type.id
                )
                .map((activity) => (
                  <MenuItem key={activity.id} value={activity.id}>
                    {activity.code}
                  </MenuItem>
                ))}
          </Select>
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
