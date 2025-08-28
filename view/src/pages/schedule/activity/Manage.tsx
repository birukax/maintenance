import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppState, AppDispatch } from "../../../store/store";
import { createActivity } from "../../../store/slices/activitySlice";
import { fetchActivityTypes } from "../../../store/slices/activityTypeSlice";
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
import { toast } from "react-toastify";
import { type FormData } from '../../../store/types';

const Create = () => {
  const [formData, setFormData] = useState<FormData>({
    code: "",
    description: "",
    activity_type_id: "",
    name: "",
  });
  const activity = useSelector((state: AppState) => state.activity.activity)
  const { activityTypes } = useSelector(
    (state: AppState) => state.activityType
  );
  const params = {
    no_pagination: "true",
  };
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchActivityTypes(params));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(createActivity(formData)).unwrap();
      toast.success("Activity created successfully");
      navigate("/activities");
    } catch (error) {
      toast.error(activity.error?.error || error || "Something Went Wrong");
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
        className="form-gap w-full"
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
          disabled={activity.loading}
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
          disabled={activity.loading}
          helperText={activity.error?.name}
        />

        <FormControl fullWidth variant="outlined" disabled={activity.loading}>
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
              Array.isArray(activityTypes.data) && activityTypes.data?.find(
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
          disabled={activity.loading}
          helperText={activity.error?.decription}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={activity.loading}
          className="mt-4"
        >
          {activity.loading ? <CircularProgress size={24} /> : "Create Activity"}
        </Button>

      </Box>
    </Container>
  );
};

export default Create;
