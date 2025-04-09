import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchItem, updateItem } from "../../store/slices/itemSlice";
import { fetchUnitOfMeasures } from "../../store/slices/unitOfMeasureSlice";
import { AppState, AppDispatch } from "../../store/store";
import api from "../../utils/api";
import { ITEM_TYPES, ITEM_CATEGORIES } from "../../utils/choices";
import {
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

const Create = () => {
  const [formData, setFormData] = useState({
    uom_id: "",
    type: "",
    category: "",
  });
  const { id } = useParams();
  const { tokens } = useSelector((state: AppState) => state.auth);
  const { item } = useSelector((state: AppState) => state.item);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { unitOfMeasures } = useSelector(
    (state: AppState) => state.unitOfMeasure
  );
  const dispatch = useDispatch<AppDispatch>();
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
    if (tokens && id) {
      dispatch(fetchItem(id));
    }
    setFormData({
      uom_id: item.data.uom.id,
      type: item.data.type,
      category: item.data.category,
    });
  }, []);

  useEffect(() => {
    if (tokens) {
      dispatch(fetchUnitOfMeasures());
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
      // await api.patch(`/inventory/items/${item.data.id}/`, formData);
      dispatch(updateItem({ id, formData }));
      dispatch(fetchItems());
      navigate(`/item/detail/${item.data.id}}`);
    } catch (err) {
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Edit Item
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-4"
      >
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
            {unitOfMeasures.data &&
              unitOfMeasures.data.map((uom) => (
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
          {loading ? <CircularProgress size={24} /> : "Edit Item"}
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
