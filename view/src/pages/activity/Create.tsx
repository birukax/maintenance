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
  Autocomplete,
} from "@mui/material";
import { toast } from "react-toastify";
const Create = () => {
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    activity_type_id: "",
    name: "",
  });
  const activity = useSelector((state:AppState)=>state.activity.activity)
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
      toast.error(activity.error?.error||"Something Went Wrong");
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
          helperText={activity.error?.code}
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
          helperText={activity.error?.name}
        />

        <FormControl fullWidth variant="outlined" disabled={loading}>
          <Autocomplete
            options={activityTypes.data || []}
            getOptionLabel={(option) => (option.code ? `${option.code} - ${option.name}` : option.name || "")}
            renderInput={(params) => (
              <TextField
          {...params}
          variant="outlined"
          label="Activity Type"
          placeholder="Search activity types..."
          required
          helperText={activity.error?.activity_type_id}
              />
            )}
            id="activity-type-select"
            value={
              Array.isArray(activityTypes.data)&&activityTypes.data?.find(
          (activityType) => activityType.id === formData.activity_type_id
              ) || null
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
          helperText={activity.error?.decription}
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
         
      </Box>
    </Container>
  );
};

export default Create;
