import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createShelf } from "../../store/slices/shelfSlice";
import { AppState, AppDispatch } from "../../store/store";
import { fetchLocations } from "../../store/slices/locationSlice";
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
import { type FormData } from '../../store/types';

const Create = () => {
  const [formData, setFormData] = useState<FormData>({
    location_id: "",
    code: "",
    name: "",
  });
  const shelf = useSelector((state: AppState) => state.shelf.shelf);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { locations } = useSelector((state: AppState) => state.location);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(createShelf(formData)).unwrap();
      toast.success("Shelf created successfully");
      navigate("/shelves");
    } catch (error) {
      toast.error(shelf.error?.error || error || "Something Went Wrong");
    }
  };
  useEffect(() => {
    const params = {
      no_pagination: "true",
    };
    dispatch(fetchLocations(params));

  }, []);

  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h5" color='primary' className="mb-2! ">
        Create Shelf
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
        <FormControl fullWidth variant="outlined" required disabled={locations.loading}>
          <Autocomplete
            size='small'
            options={Array.isArray(locations.data) ? locations.data : []}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Location"
                placeholder="Search locations..."
                required
                helperText={shelf?.error?.location_id}
              />
            )}
            id="location-select"
            value={
              Array.isArray(locations.data)
                ? locations.data.find((location) => location.id === formData.location_id)
                : null
            }
            onChange={(_event, newValue) => {
              setFormData({ ...formData, location_id: newValue ? newValue.id : "" });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            disabled={locations.loading}
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
          disabled={locations.loading}
          helperText={shelf?.error?.code}
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
          disabled={locations.loading}
          helperText={shelf?.error?.name}
        />
        <div className='flex gap-4'>

          <Button
            size='small'
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={locations.loading}
            className="mt-4"
          >
            {locations.loading ? <CircularProgress size={24} /> : "Create"}
          </Button>
          <Button
            component={Link}
            to='/shelves'
            type='button'
            size='small'
            variant='outlined'
            fullWidth
            disabled={locations.loading}

          >
            Cancel
          </Button>
        </div>

      </Box>
    </Container>
  );
};

export default Create;
