import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchActivity,
  updateActivity,
} from "../../../store/slices/activitySlice";
import { AppState, AppDispatch } from "../../../store/store";
import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
const Edit = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });
  const activity = useSelector((state: AppState) => state.activity.activity)
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      dispatch(fetchActivity(id));
    }
    setFormData({
      name: activity.data?.name,
      description: activity.data?.description,
    });
  }, []);

  useEffect(() => {
    setFormData({
      name: activity.data?.name,
      description: activity.data?.description,
    });
  }, [activity])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // await api.patch(`/inventory/items/${item.data.id}/`, formData);
      await dispatch(updateActivity({ id, formData })).unwrap();
      toast.success("Activity edited successfully");
      navigate(`/activity/detail/${activity.data?.id}`);
    } catch (err) {
      toast.error(activity.error?.error || "Something Went Wrong");
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Edit Activity
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
        <TextField
          multiline
          label="Name"
          name="name"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData?.name}
          onChange={handleChange}
          required
          disabled={activity.loading}
          helperText={activity.error?.name || ""}
        />
        <TextField
          multiline
          label="Description"
          name="description"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData?.description}
          onChange={handleChange}
          required
          disabled={activity.loading}
          helperText={activity.error?.description || ""}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={activity.loading}
          className="mt-4"
        >
          {activity.loading ? <CircularProgress size={24} /> : "Edit Activity"}
        </Button>

      </Box>
    </Container>
  );
};

export default Edit;
