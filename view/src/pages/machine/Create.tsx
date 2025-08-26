import { useState, useEffect, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createMachine } from "../../store/slices/machineSlice";
import { fetchPlants } from "../../store/slices/plantSlice";
import { fetchAreas } from "../../store/slices/areaSlice";
import { AppState, AppDispatch } from "../../store/store";
import { Link } from "react-router-dom";
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
const Create = () => {
  const [formData, setFormData] = useState({
    name: "",
    area_id: "",
    code: "",
  });
  const machine = useSelector((state: AppState) => state.machine.machine);
  const [selectedPlant, setSelectedPlant] = useState("");
  const { plants } = useSelector((state: AppState) => state.plant);
  const { areas } = useSelector((state: AppState) => state.area);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const params = {
    no_pagination: "true",
  };
  useEffect(() => {
    dispatch(fetchPlants(params));
    dispatch(fetchAreas(params));

  }, []);



  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createMachine(formData)).unwrap();
      toast.success("Machine created successfully");
      navigate("/machines");
    } catch (err) {
      toast.error(machine.error?.error || "Something Went Wrong");
    }
  };


  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h5" color='primary' className="mb-2! ">
        Create Machine
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
        <FormControl fullWidth variant="outlined" disabled={machine.loading}>
          <Autocomplete
            size='small'
            options={plants.data || []}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Plant"
                placeholder="Search plants..."
                required
                helperText={machine.error?.plant_id}
              />
            )}
            id="plant-select"
            value={Array.isArray(plants.data) && plants.data?.find((plant) => plant.id === selectedPlant) || null}
            onChange={(event, newValue) => {
              setSelectedPlant(newValue ? newValue.id : "");
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </FormControl>
        <FormControl fullWidth variant="outlined" disabled={machine.loading}>
          <Autocomplete
            size='small'
            options={
              areas.data
                ? areas?.data?.filter((area) => area?.plant?.id === selectedPlant)
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
                helperText={machine.error?.area_id}
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
          label="Code"
          name="code"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.code}
          onChange={handleChange}
          required
          disabled={machine.loading}
          helperText={machine.error?.code}
        />
        <TextField
          size='small'
          multiline
          label="Name"
          name="name"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          required
          disabled={machine.loading}
          helperText={machine.error?.name}
        />
        <div className='flex gap-4'>

          <Button
            size='small'
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={machine.loading}
            className="mt-4"
          >
            {machine.loading ? <CircularProgress size={24} /> : "Create"}
          </Button>
          <Button
            component={Link}
            to='/machines'
            type='button'
            size='small'
            variant='outlined'
            fullWidth
            disabled={machine.loading}

          >
            Cancel
          </Button>
        </div>
      </Box>
    </Container>
  );
};

export default Create;
