import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createMachine } from "../../store/slices/machineSlice";
import { fetchPlants } from "../../store/slices/plantSlice";
import { fetchAreas } from "../../store/slices/areaSlice";
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
    name: "",
    area_id: "",
    code: "",
  });
  const [selectedPlant,setSelectedPlant]=useState("")
  const { tokens } = useSelector((state: AppState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { plants } = useSelector((state: AppState) => state.plant);
  const { areas } = useSelector((state: AppState) => state.area);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (tokens) {
      dispatch(fetchPlants());
      dispatch(fetchAreas());
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
      await dispatch(createMachine(formData)).unwrap();
      toast.success("Machine created successfully");
      navigate("/machines");
    } catch (err) {
      toast.error("Error creating Machine");
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Create Machine
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
            value={selectedPlant}
            onChange={(e)=>{
              setSelectedPlant(
                e.target.value
              )
            }}
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
        <FormControl
          fullWidth
          variant="outlined"
          required={false}
          disabled={loading}
        >
          <InputLabel id="area-select-label">Area</InputLabel>
          <Select
            labelId="area-select-label"
            id="area-select"
            name="area_id"
            value={formData.area_id}
            onChange={handleChange}
            label="Area"
          >
            {areas.data &&
              areas.data
                .filter(
                  (area) => area.plant.id === selectedPlant
                )
                .map((area) => (
                  <MenuItem key={area.id} value={area.id}>
                    {area.name}
                  </MenuItem>
                ))}
          </Select>
        </FormControl>
        <TextField
          multiline
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
          {loading ? <CircularProgress size={24} /> : "Create Machine"}
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
