import { useState, useEffect } from "react";
import { useDispatch,useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import { createShelf } from "../../store/slices/shelfSlice";
import { AppState, AppDispatch } from "../../store/store";
import { fetchLocations } from "../../store/slices/locationSlice";

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
    location_id:"",
    code: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const { locations } = useSelector((state: AppState) => state.location);
  const { tokens } = useSelector((state: AppState) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await dispatch(createShelf(formData)).unwrap();
      toast.success("Shelf created successfully");
      navigate("/shelves");
    } catch (err) {
      toast.error("Error creating Shelf");
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
      const params = {
        no_pagination: "true",
      };
      if (tokens) {
        dispatch(fetchLocations(params));
      }
    }, []);
    
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Create Shelf
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap"
      >
        <FormControl fullWidth variant="outlined" required disabled={loading}>
          <Autocomplete
            options={Array.isArray(locations.data) ? locations.data : []}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Location"
                placeholder="Search locations..."
                required
              />
            )}
            id="location-select"
            value={
              Array.isArray(locations.data)
                ? locations.data.find((location) => location.id === formData.location_id)
                : null
            }
            onChange={(event, newValue) => {
              setFormData({ ...formData, location_id: newValue ? newValue.id : "" });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            disabled={loading}
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
          {loading ? <CircularProgress size={24} /> : "Create Shelf"}
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
