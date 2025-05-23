import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createItem } from "../../store/slices/itemSlice";
import { fetchUnitOfMeasures } from "../../store/slices/unitOfMeasureSlice";
import { AppState, AppDispatch } from "../../store/store";
import api from "../../utils/api";
import { ITEM_TYPES, ITEM_CATEGORIES } from "../../utils/choices";
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
  Autocomplete,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import { fetchContacts } from "../../store/slices/contactSlice";
const Create = () => {
  const [formData, setFormData] = useState({
    name: "",
    uom_id: "",
    type: "",
    category: "",
    minimum_stock_level: 0,
    suppliers_id:[]
  });
  const { tokens } = useSelector((state: AppState) => state.auth);
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
    let isMounted=true
    let controller=new AbortController()
    const params = {
      no_pagination: "true",
    };
    
    dispatch(fetchUnitOfMeasures(params));
    dispatch(fetchContacts(params));
  }, []);
  const { contacts } = useSelector((state: AppState) => state.contact);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAutocompleteChange = (fieldName, newValue) => {
    // Extract only the IDs from the selected objects
    const selectedIds = newValue.map((item) => item.id);
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: selectedIds,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await dispatch(createItem(formData)).unwrap();
      toast.success("Item created successfully");
      navigate("/items");
    } catch (err) {
      toast.error("Error creating Item");
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
    }
  };



  
  const supplierOptions = useMemo(() => {
      return contacts?.data ? contacts?.data:[];
    }, [contacts.data]);

    console.log("supplier option",supplierOptions);
    
  const selectedSuppliers = useMemo(() => {
      return supplierOptions? supplierOptions?.filter((option) =>
        formData.suppliers_id.includes(option.id)
      ):[] ;
    }, [formData.suppliers_id, supplierOptions]);
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Create Item
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap"
      >
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
        <TextField
          label="Minimum Stock Level"
          name="minimum_stock_level"
          type="number"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.minimum_stock_level}
          onChange={handleChange}
          inputProps={{
            min: 0,
            step: 1,
          }}
          required
          disabled={loading}
        />
        <FormControl fullWidth variant="outlined" disabled={loading}>
                        <Autocomplete
                          multiple
                          options={supplierOptions && supplierOptions}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              label="Suppliers"
                              placeholder="Search suppliers..."
                            />
                          )}
                          id="supplier-autocomplete"
                          value={selectedSuppliers}
                          onChange={(event, newValue) =>
                            handleAutocompleteChange("suppliers_id", newValue)
                          }
                        ></Autocomplete>
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
      </Box>
    </Container>
  );
};

export default Create;
