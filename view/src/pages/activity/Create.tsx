import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppState, AppDispatch } from "../../store/store";
import { createActivity } from "../../store/slices/activitySlice";
import { fetchActivityTypes } from "../../store/slices/activityTypeSlice";
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
import { toast } from "react-toastify";
const Create = () => {
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    activity_type_id: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const { activityTypes } = useSelector(
    (state: AppState) => state.activityType
  );
  const params = {
    no_pagination: "true",
  };
  const [error, setError] = useState(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchActivityTypes(params));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await dispatch(createActivity(formData)).unwrap();
      toast.success("Activity created successfully");
      navigate("/activities");
    } catch (err) {
      toast.error("Error creating Activity");
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Create Activity
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap"
      >
        <TextField
          label="Code"
          name="code"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.code}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <TextField
          label="Name"
          name="name"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          required
          disabled={loading}
        />

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
              activityTypes.data.map((activityType) => (
                <MenuItem key={activityType.id} value={activityType.id}>
                  {activityType.code} - {activityType.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <TextField
          multiline
          label="DescriptIon"
          name="description"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.description}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          className="mt-4"
        >
          {loading ? <CircularProgress size={24} /> : "Create Activity"}
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
