import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { ITEM_TYPES, ITEM_CATEGORIES } from "../utils/choices";
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
  FormHelperText,
} from "@mui/material";

const ItemForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    uom_id: 0,
    type: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uoms, setUoms] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const item_types = Object.keys(ITEM_TYPES).map((key) => ({
    value: ITEM_TYPES[key][0],
    label: ITEM_TYPES[key][1],
  }));
  const item_categories = Object.keys(ITEM_CATEGORIES).map((key) => ({
    value: ITEM_CATEGORIES[key][0],
    label: ITEM_CATEGORIES[key][1],
  }));

  useEffect(() => {
    const fetchUoms = async () => {
      try {
        const response = await api.get("./inventory/unit-of-measures/");
        setUoms(response.data);
      } catch (err) {
        setError(err.response?.data.detail || err.message);
      }
    };
    fetchUoms();
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
      await api.post("/inventory/items/", formData);
      navigate("/items");
    } catch (err) {
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-screen">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Create Item
      </Typography>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <TextField
          label="Name"
          name="name"
          variant="outlined"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <FormControl fullWidth variant="outlined" required disabled={loading}>
          <InputLabel id="uom-select-label">Unit of Measure</InputLabel>
          <Select
            labelId="uom-select-label"
            id="uom-select"
            name="uom_id"
            value={formData.uom_id}
            onChange={handleChange}
            label="Unit of Measure"
          >
            {uoms.map((uom) => (
              <MenuItem key={uom.id} value={uom.id}>
                {uom.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined" required disabled={loading}>
          <InputLabel id="item-types-select-label">Item Type</InputLabel>
          <Select
            labelId="item-types-select-label"
            id="item-types-select"
            name="type"
            value={formData.type}
            onChange={handleChange}
            label="Item Type"
          >
            {item_types.map((item_type) => (
              <MenuItem key={item_type.value} value={item_type.value}>
                {item_type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined" required disabled={loading}>
          <InputLabel id="item-categories-select-label">
            Item Category
          </InputLabel>
          <Select
            labelId="item-categories-select-label"
            id="item-categories-select"
            name="category"
            value={formData.category}
            onChange={handleChange}
            label="Item Category"
          >
            {item_categories.map((item_category) => (
              <MenuItem key={item_category.value} value={item_category.value}>
                {item_category.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          className="mt-4"
        >
          {loading ? <CircularProgress size={24} /> : "Create Item"}
        </Button>
        {error && (
          <Typography variant="body2" className="mt-4 text-red-500">
            {error}
          </Typography>
        )}
      </form>
    </Container>
  );
};

export default ItemForm;
