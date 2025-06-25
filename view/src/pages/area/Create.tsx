import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createArea } from "../../store/slices/areaSlice";
import { fetchPlants } from "../../store/slices/plantSlice";
import { AppState, AppDispatch } from "../../store/store";
import api from "../../utils/api";
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
    name: "",
    plant_id: ""
  });

  const area = useSelector((state: AppState) => state.area.area);
  const { plants } = useSelector((state: AppState) => state.plant);
  const { tokens } = useSelector((state: AppState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const params = {
    no_pagination: "true",
  };

  useEffect(() => {
    if (tokens) {
      dispatch(fetchPlants(params));
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
      await dispatch(createArea(formData)).unwrap();
      toast.success("Area created successfully");
      navigate("/areas");
    } catch (err) {
      toast.error(area.error?.error || "Something Went Wrong");

      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Create Area
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
        <FormControl fullWidth variant="outlined" required disabled={loading}>
          <Autocomplete
            options={plants.data || []}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Plant"
                placeholder="Search plants..."
                required
                helperText={area?.error?.plant_id}
              />
            )}
            id="plant-select"
            value={Array.isArray(plants.data) && plants.data?.find((plant) => plant.id === formData.plant_id) || null}
            onChange={(event, newValue) => {
              setFormData({ ...formData, plant_id: newValue ? newValue.id : "" });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </FormControl>
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
          helperText={area?.error?.code}

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
          helperText={area?.error?.name}

        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          className="mt-4"
        >
          {loading ? <CircularProgress size={24} /> : "Create Area"}
        </Button>

      </Box>
    </Container>
  );
};

export default Create;
