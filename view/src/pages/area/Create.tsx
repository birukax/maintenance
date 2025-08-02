import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { createArea } from "../../store/slices/areaSlice";
import { fetchPlants } from "../../store/slices/plantSlice";
import { AppState, AppDispatch } from "../../store/store";
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
    code: "",
    name: "",
    plant_id: ""
  });

  const area = useSelector((state: AppState) => state.area.area);
  const { plants } = useSelector((state: AppState) => state.plant);
  const { tokens } = useSelector((state: AppState) => state.auth);
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
    try {
      await dispatch(createArea(formData)).unwrap();
      toast.success("Area created successfully");
      navigate("/areas");
    } catch (err) {
      toast.error(area.error?.error || "Something Went Wrong");

    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h5" color='primary' className="mb-2!">
        Create Area
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
        <FormControl fullWidth variant="outlined" required disabled={area.loading}>
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
          size='small'
          label="Code"
          name="code"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.code}
          onChange={handleChange}
          required
          disabled={area.loading}
          helperText={area?.error?.code}

        />

        <TextField
          size='small'
          label="Name"
          name="name"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          required
          disabled={area.loading}
          helperText={area?.error?.name}

        />
        <div className='flex gap-4'>

          <Button
            size='small'
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={area.loading}
            className="mt-4"
          >
            {area.loading ? <CircularProgress size={24} /> : "Create"}
          </Button>
          <Button
            component={Link}
            to='/areas'
            type='button'
            size='small'
            variant='outlined'
            fullWidth
            disabled={area.loading}

          >
            Cancel
          </Button>
        </div>

      </Box>
    </Container>
  );
};

export default Create;
