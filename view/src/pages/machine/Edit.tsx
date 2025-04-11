import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchMachine,
  updateMachine,
  fetchMachines,
} from "../../store/slices/machineSlice";
import { fetchLocations } from "../../store/slices/locationSlice";
import { AppState, AppDispatch } from "../../store/store";
import api from "../../utils/api";
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
} from "@mui/material";

const Edit = () => {
  const [formData, setFormData] = useState({
    name: "",
    location_id: "",
  });
  const { id } = useParams();
  const { tokens } = useSelector((state: AppState) => state.auth);
  const { locations } = useSelector((state: AppState) => state.location);
  const { machine } = useSelector((state: AppState) => state.machine);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    if (tokens && id) {
      dispatch(fetchMachine(id));
    }
    setFormData({
      name: machine.data.name,
      location_id: machine.data.location.id,
    });
  }, []);

  useEffect(() => {
    if (tokens) {
      dispatch(fetchLocations());
    }
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
      // await api.patch(`/inventory/items/${item.data.id}/`, formData);
      dispatch(updateMachine({ id, formData }));
      navigate(`/machine/detail/${machine.data.id}`);
    } catch (err) {
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Edit Machine
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-4"
      >
        <FormControl fullWidth variant="outlined" required disabled={loading}>
          <InputLabel id="location-select-label">Location</InputLabel>
          <Select
            labelId="location-select-label"
            id="location-select"
            name="location_id"
            value={formData.location_id}
            onChange={handleChange}
            label="Location"
          >
            {locations.data &&
              locations.data.map((location) => (
                <MenuItem key={location.id} value={location.id}>
                  {location.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <TextField
          multiline
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          className="mt-4"
        >
          {loading ? <CircularProgress size={24} /> : "Edit Machine"}
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

export default Edit;
