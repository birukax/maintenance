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
import { Link } from "react-router-dom";
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
  const [selectedPlant, setSelectedPlant] = useState("")
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
  const machine = useSelector((state: AppState) => state.machine.machine)

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
      toast.error(machine.error?.error || "Something Went Wrong");
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <div className='flex gap-4 '>
        <Typography variant="h5" color='primary' className="mb-2! ">
          Edit Machine
        </Typography>
        <Typography variant="h5" color='warning' >
          {machine?.data?.code}

        </Typography>
      </div>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
        <FormControl fullWidth variant="outlined" disabled={loading}>
          <Autocomplete
            size='small'
            options={plants.data || []}
            getOptionLabel={(option) => option.name || ""}
            getOptionKey={(option) => option.id || ''}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Plant"
                placeholder="Search plants..."
                required
                helperText={machine.error?.plant_id || ""}
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
            size='small'
            options={
              areas.data
                ? areas.data.filter((area) => area.plant.id === selectedPlant)
                : []
            }
            getOptionLabel={(option) => option.name || ""}
            getOptionKey={(option) => option.id || ''}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Area"
                placeholder="Search areas..."
                required
                helperText={machine.error?.area_id || ""}
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
          size='small'
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
          helperText={machine.error?.name || ""}
        />
        <div className='flex gap-4'>

          <Button
            size='small'
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            className="mt-4"
          >
            {loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
          <Button
            component={Link}
            to={`/machine/detail/${id}`}
            type='button'
            size='small'
            variant='outlined'
            fullWidth
            disabled={loading}

          >
            Cancel
          </Button>

        </div>
      </Box>
    </Container>
  );
};

export default Edit;
