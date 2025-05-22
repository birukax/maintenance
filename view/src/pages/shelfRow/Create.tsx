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
      toast.error("Error creating ShelfRow");
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
          <InputLabel id="shelf-select-label">Shelf</InputLabel>
          <Select
            labelId="shelf-select-label"
            id="shelf-select"
            name="shelf_id"
            value={formData.shelf_id}
            onChange={handleChange}
            label="Shelf"
          >
            {shelves.data &&
              shelves.data.map((shelf) => (
                <MenuItem key={shelf.id} value={shelf.id}>
                  {shelf.name}
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
          {loading ? <CircularProgress size={24} /> : "Create ShelfRow"}
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
