import { useState, useEffect } from "react";
import { useDispatch,useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import { createShelfRow } from "../../store/slices/shelfRowSlice";
import { AppState, AppDispatch } from "../../store/store";
import { fetchShelves } from "../../store/slices/shelfSlice";

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
    shelf_id:"",
    code: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const shelfRow = useSelector((state: AppState) => state.shelfRow.shelfRow);
    const { shelves } = useSelector((state: AppState) => state.shelf);
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
      await dispatch(createShelfRow(formData)).unwrap();
      toast.success("ShelfRow created successfully");
      navigate("/shelf-rows");
    } catch (err) {
      toast.error(shelfRow.error?.error||"Something Went Wrong");
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
        dispatch(fetchShelves(params));
      }
    }, []);
    
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Create ShelfRow
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap"
      >
        <FormControl fullWidth variant="outlined" required disabled={loading}>
          <Autocomplete
            options={Array.isArray(shelves.data) ? shelves.data : []}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField
          {...params}
          variant="outlined"
          label="Shelf"
          placeholder="Search shelves..."
          required
          helperText={shelfRow?.error?.shelf_id}
              />
            )}
            id="shelf-select"
            value={
              Array.isArray(shelves.data)
          ? shelves.data.find((shelf) => shelf.id === formData.shelf_id)
          : null
            }
            onChange={(event, newValue) => {
              setFormData({ ...formData, shelf_id: newValue ? newValue.id : "" });
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
          helperText={shelfRow?.error?.code}
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
          helperText={shelfRow?.error?.name}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          className="mt-4"
        >
          {loading ? <CircularProgress size={24} /> : "Create ShelfRow"}
        </Button>
         
      </Box>
    </Container>
  );
};

export default Create;
