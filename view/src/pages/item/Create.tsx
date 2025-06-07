import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createItem } from "../../store/slices/itemSlice";
import { fetchUnitOfMeasures } from "../../store/slices/unitOfMeasureSlice";
import { AppState, AppDispatch } from "../../store/store";
import api from "../../utils/api";
import { ITEM_TYPES, ITEM_CATEGORIES } from "../../utils/choices";
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
  Autocomplete,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import { fetchContacts } from "../../store/slices/contactSlice";
import { fetchShelfRows } from "../../store/slices/shelfRowSlice";
import { fetchShelfBoxes } from "../../store/slices/shelfBoxSlice";
const Create = () => {
  const [formData, setFormData] = useState({
    name: "",
    uom_id: "",
    type: "",
    category: "",
    shelf_id:"",
    row_id:"",
    box_id:"",
    minimum_stock_level: 0,
    suppliers_id:[]
  });
  const { tokens } = useSelector((state: AppState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { contacts } = useSelector((state: AppState) => state.contact);

  const { unitOfMeasures } = useSelector(
    (state: AppState) => state.unitOfMeasure
  );
  const item = useSelector((state:AppState)=>state.item.item)

    const { shelves } = useSelector((state: AppState) => state.shelf);
    const { shelfRows } = useSelector((state: AppState) => state.shelfRow);
    const { shelfBoxes } = useSelector((state: AppState) => state.shelfBox);

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
    let isMounted = true;
    let controller = new AbortController();
    const params = {
      no_pagination: "true",
    };

    dispatch(fetchUnitOfMeasures(params));
    dispatch(fetchContacts(params));
            dispatch(fetchShelves(params));
                    dispatch(fetchShelfRows(params));
                    dispatch(fetchShelfBoxes(params));
            
    
  }, []);

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
    return Array.isArray(contacts?.data) ? contacts?.data : [];
  }, [contacts.data]);


  const selectedSuppliers = useMemo(() => {
    return Array.isArray(supplierOptions)
      ? supplierOptions?.filter((option) =>
          formData.suppliers_id.includes(option.id)
        )
      : [];
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
          helperText={item.error?.name}
        />
        <FormControl fullWidth variant="outlined" required disabled={loading}>
          <Autocomplete
            options={Array.isArray(unitOfMeasures.data) ? unitOfMeasures.data : []}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField
          {...params}
          variant="outlined"
          label="Unit of Measure"
          placeholder="Search unit of measure..."
          helperText={item.error?.uom}

              />
            )}
            id="uom-select"
            value={
              Array.isArray(unitOfMeasures.data)
          ? unitOfMeasures.data.find((uom) => uom.id === formData.uom_id)
          : null
            }
            onChange={(event, newValue) => {
              setFormData({ ...formData, uom_id: newValue ? newValue.id : "" });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </FormControl>
        <FormControl fullWidth variant="outlined" disabled={loading}>
          <Autocomplete
            options={item_types}
            getOptionLabel={(option) => option.label || ""}
            renderInput={(params) => (
              <TextField
          {...params}
          variant="outlined"
          label="Item Type"
          placeholder="Search item types..."
          helperText={item.error?.type}

              />
            )}
            id="item-type-select"
            value={
              item_types.find((item_type) => item_type.value === formData.type) || null
            }
            onChange={(event, newValue) => {
              setFormData({ ...formData, type: newValue ? newValue.value : "" });
            }}
            isOptionEqualToValue={(option, value) => option.value === value.value}
          />
        </FormControl>
        <FormControl fullWidth variant="outlined" disabled={loading}>
          <Autocomplete
            options={item_categories}
            getOptionLabel={(option) => option.label || ""}
            renderInput={(params) => (
              <TextField
          {...params}
          variant="outlined"
          label="Item Category"
          placeholder="Search item categories..."
          helperText={item.error?.category}

              />
            )}
            id="item-category-select"
            value={
              item_categories.find((item_category) => item_category.value === formData.category) || null
            }
            onChange={(event, newValue) => {
              setFormData({ ...formData, category: newValue ? newValue.value : "" });
            }}
            isOptionEqualToValue={(option, value) => option.value === value.value}
          />
        </FormControl>
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
          helperText={item.error?.shelf}

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
        <FormControl fullWidth variant="outlined" required disabled={loading}>
          <Autocomplete
            
            options={Array.isArray(shelfRows.data)&&shelfRows.data ?.filter(
              (shelfRow) => shelfRow?.shelf?.id === formData.shelf_id
            ) || []}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField
          {...params}
          variant="outlined"
          label="Shelf Row"
          placeholder="Search shelf rows..."
          required
          helperText={item.error?.row}

              />
            )}
            id="shelf-row-select"
            value={
              Array.isArray(shelfRows.data)
          ? shelfRows.data.find((row) => row.id === formData.row_id)
          : null
            }
            onChange={(event, newValue) => {
              setFormData({ ...formData, row_id: newValue ? newValue.id : "" });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            disabled={loading}
          />
        </FormControl>
        <FormControl fullWidth variant="outlined" required disabled={loading}>
          <Autocomplete
            options={Array.isArray(shelfBoxes.data)&&shelfBoxes.data ?.filter(
              (shelfBox) => shelfBox?.row?.id === formData.row_id
            ) || []}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField
          {...params}
          variant="outlined"
          label="Shelf Box"
          placeholder="Search shelf boxes..."
          required
          helperText={item.error?.box}

              />
            )}
            id="shelf-box-select"
            value={
              Array.isArray(shelfBoxes.data)
          ? shelfBoxes.data.find((box) => box.id === formData.box_id)
          : null
            }
            onChange={(event, newValue) => {
              setFormData({ ...formData, box_id: newValue ? newValue.id : "" });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            disabled={loading}
          />
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
          helperText={item.error?.minimum_stock_level}

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
                              helperText={item.error?.supplier}

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
