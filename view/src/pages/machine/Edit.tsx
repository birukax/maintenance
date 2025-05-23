import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchMachine,
  updateMachine,
} from "../../store/slices/machineSlice";
import { fetchPlants } from "../../store/slices/plantSlice";
import { fetchAreas } from "../../store/slices/areaSlice";
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
  Autocomplete,
} from "@mui/material";
import { toast } from "react-toastify";
const Edit = () => {
  const { areas } = useSelector((state: AppState) => state.area);
  const { plants } = useSelector((state: AppState) => state.plant);
  const { machine } = useSelector((state: AppState) => state.machine);
  const [selectedPlant,setSelectedPlant]=useState("")
  const { tokens } = useSelector((state: AppState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); 
  const [formData, setFormData] = useState({
    name: "",
    area_id: "",
  });

  const params = {
    no_pagination: "true",
  };
  
  useEffect(() => {
    if (id) {
      // handleFetchMachine()
      dispatch(fetchMachine(id)).unwrap();
      dispatch(fetchPlants(params));
      dispatch(fetchAreas(params));

    }
  }, [dispatch, id]);

  useEffect(() => {
    setSelectedPlant(machine?.data?.area?.plant?.id)

    
    setFormData({
      name: machine.data?.name,
      area_id: machine.data?.area?.id,
    });
  }, [machine])

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
     await dispatch(updateMachine({ id, formData })).unwrap();
      toast.success("Machine edited successfully");
      navigate(`/machine/detail/${machine.data.id}`);
    } catch (err) {
      toast.error("Error editing Machine");
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
        className="form-gap"
      >
        <FormControl fullWidth variant="outlined" disabled={loading}>
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
                      />
                    )}
                    id="plant-select"
                    value={plants.data?.find((plant) => plant.id === selectedPlant) || null}
                    onChange={(event, newValue) => {
                      setSelectedPlant(newValue ? newValue.id : "");
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                  />
                </FormControl>
                <FormControl fullWidth variant="outlined" disabled={loading}>
                  <Autocomplete
                    options={
                      areas.data
                  ? areas.data.filter((area) => area.plant.id === selectedPlant)
                  : []
                    }
                    getOptionLabel={(option) => option.name || ""}
                    renderInput={(params) => (
                      <TextField
                  {...params}
                  variant="outlined"
                  label="Area"
                  placeholder="Search areas..."
                  required
                      />
                    )}
                    id="area-select"
                    value={
                      areas.data?.find((area) => area.id === formData.area_id) || null
                    }
                    onChange={(event, newValue) => {
                      setFormData({
                  ...formData,
                  area_id: newValue ? newValue.id : "",
                      });
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                  />
                </FormControl>

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
