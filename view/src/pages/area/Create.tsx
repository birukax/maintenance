import { useState, useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
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
} from "@mui/material";
import { toast } from "react-toastify";
const Create = () => {

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    plant_id:""
  });
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
      toast.error("Error creating Area");
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
        className="form-gap"
      >
        <FormControl fullWidth variant="outlined" required disabled={loading}>
          <InputLabel id="plant-select-label">Plant</InputLabel>
          <Select
            labelId="plant-select-label"
            id="plant-select"
            name="plant_id"
            value={formData.plant_id}
            onChange={handleChange}
            label="Plant"
          >
            {plants.data &&
              plants.data.map((plant) => (
                <MenuItem key={plant.id} value={plant.id}>
                  {plant.name}
                </MenuItem>
              ))}
          </Select>
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
