import { useState, useEffect, ChangeEvent, FormEvent, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createItem } from "../../store/slices/itemSlice";
import { fetchUnitOfMeasures } from "../../store/slices/unitOfMeasureSlice";
import { AppState, AppDispatch } from "../../store/store";
import { Link } from "react-router-dom";
import { ITEM_TYPES, ITEM_CATEGORIES } from "../../utils/choices";
import { fetchShelves } from "../../store/slices/shelfSlice";
import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  FormControl,
  Autocomplete,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import { fetchContacts } from "../../store/slices/contactSlice";
import { fetchShelfRows } from "../../store/slices/shelfRowSlice";
import { fetchShelfBoxes } from "../../store/slices/shelfBoxSlice";
import { type Data, type FormData } from '../../store/types';
const Create = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    uom_id: "",
    type: "",
    category: "",
    shelf_id: "",
    row_id: "",
    box_id: "",
    minimum_stock_level: 0,
    suppliers_id: []
  });
  const { contacts } = useSelector((state: AppState) => state.contact);

  const { unitOfMeasures } = useSelector(
    (state: AppState) => state.unitOfMeasure
  );
  const item = useSelector((state: AppState) => state.item.item)

  const { shelves } = useSelector((state: AppState) => state.shelf);
  const { shelfRows } = useSelector((state: AppState) => state.shelfRow);
  const { shelfBoxes } = useSelector((state: AppState) => state.shelfBox);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const params = {
      no_pagination: "true",
    };

    dispatch(fetchUnitOfMeasures(params));
    dispatch(fetchContacts(params));
    dispatch(fetchShelves(params));
    dispatch(fetchShelfRows(params));
    dispatch(fetchShelfBoxes(params));


  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleAutocompleteChange = (field: string, value: any) => {
    // Extract only the IDs from the selected objects
    const selectedIds = value.map((item: Data) => item.id);
    setFormData((prevData) => ({
      ...prevData,
      [field]: selectedIds,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(createItem(formData)).unwrap();
      toast.success("Item created successfully");
      navigate("/items");
    } catch (error) {
      toast.error(item.error?.error || error || "Something Went Wrong");
    }
  };
  const supplierOptions = useMemo(() => {
    return Array.isArray(contacts?.data) ? contacts?.data : [];
  }, [contacts.data]);


  const selectedSuppliers = useMemo(() => {
    return Array.isArray(supplierOptions)
      ? supplierOptions?.filter((option: Data) =>
        formData.suppliers_id.includes(option.id)
      )
      : [];
  }, [formData.suppliers_id, supplierOptions]);



  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h5" color='primary' className="mb-2! ">
        Create Item
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
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
          disabled={item.loading}
          helperText={item.error?.name}
        />
        <FormControl fullWidth variant="outlined" required disabled={item.loading}>
          <Autocomplete
            size='small'
            options={Array.isArray(unitOfMeasures.data) ? unitOfMeasures.data : []}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Unit of Measure"
                placeholder="Search unit of measure..."
                required
                helperText={item.error?.uom_id}

              />
            )}
            id="uom-select"
            value={
              Array.isArray(unitOfMeasures.data)
                ? unitOfMeasures.data.find((uom) => uom.id === formData.uom_id || null)
                : null
            }
            onChange={(_event, newValue) => {
              setFormData({ ...formData, uom_id: newValue ? newValue.id : "" });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </FormControl>
        <FormControl fullWidth variant="outlined" disabled={item.loading}>
          <Autocomplete
            size='small'
            options={ITEM_TYPES}
            getOptionLabel={(option) => option || ""}
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
              ITEM_TYPES.find((item_type) => item_type === formData.type) || null
            }
            onChange={(_event, newValue) => {
              setFormData({ ...formData, type: newValue ? newValue : "" });
            }}
            isOptionEqualToValue={(option, value) => option === value}
          />
        </FormControl>
        <FormControl fullWidth variant="outlined" disabled={item.loading}>
          <Autocomplete
            size='small'
            options={ITEM_CATEGORIES}
            getOptionLabel={(option) => option || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Item Category"
                placeholder="Search item categories..."
                helperText={item.error?.category}
                required

              />
            )}
            id="item-category-select"
            value={
              ITEM_CATEGORIES.find((item_category) => item_category === formData.category) || null
            }
            onChange={(_event, newValue) => {
              setFormData({ ...formData, category: newValue ? newValue : "" });
            }}
            isOptionEqualToValue={(option, value) => option === value}
          />
        </FormControl>
        <FormControl fullWidth variant="outlined" required disabled={item.loading}>
          <Autocomplete
            size='small'
            options={Array.isArray(shelves.data) ? shelves.data : []}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Shelf"
                placeholder="Search shelves..."
                helperText={item.error?.shelf}

              />
            )}
            id="shelf-select"
            value={
              Array.isArray(shelves.data)
                ? shelves.data.find((shelf) => shelf.id === formData.shelf_id || null)
                : null
            }
            onChange={(_event, newValue) => {
              setFormData({ ...formData, shelf_id: newValue ? newValue.id : "" });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            disabled={item.loading}
          />
        </FormControl>
        <FormControl fullWidth variant="outlined" required disabled={item.loading}>
          <Autocomplete
            size='small'
            options={Array.isArray(shelfRows.data) && shelfRows.data?.filter(
              (shelfRow) => shelfRow?.shelf?.id === formData.shelf_id
            ) || []}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Shelf Row"
                placeholder="Search shelf rows..."
                helperText={item.error?.row}

              />
            )}
            id="shelf-row-select"
            value={
              Array.isArray(shelfRows.data)
                ? shelfRows.data.find((row) => row.id === formData.row_id || null)
                : null
            }
            onChange={(_event, newValue) => {
              setFormData({ ...formData, row_id: newValue ? newValue.id : "" });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            disabled={item.loading}
          />
        </FormControl>
        <FormControl fullWidth variant="outlined" required disabled={item.loading}>
          <Autocomplete
            size='small'
            options={Array.isArray(shelfBoxes.data) && shelfBoxes.data?.filter(
              (shelfBox) => shelfBox?.row?.id === formData.row_id
            ) || []}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Shelf Box"
                placeholder="Search shelf boxes..."
                helperText={item.error?.box}

              />
            )}
            id="shelf-box-select"
            value={
              Array.isArray(shelfBoxes.data)
                ? shelfBoxes.data.find((box) => box.id === formData.box_id || null)
                : null
            }
            onChange={(_event, newValue) => {
              setFormData({ ...formData, box_id: newValue ? newValue.id : "" });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            disabled={item.loading}
          />
        </FormControl>
        <TextField
          size='small'
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
          disabled={item.loading}
          helperText={item.error?.minimum_stock_level}

        />
        <FormControl fullWidth variant="outlined" disabled={item.loading}>
          <Autocomplete
            size='small'
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
            value={Array.isArray(selectedSuppliers) ? selectedSuppliers : []}
            onChange={(_event, newValue) =>
              handleAutocompleteChange("suppliers_id", newValue)
            }
          ></Autocomplete>
        </FormControl>
        <div className='flex gap-4'>

          <Button
            size='small'
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={item.loading}
            className="mt-4"
          >
            {item.loading ? <CircularProgress size={24} /> : "Create"}
          </Button>
          <Button
            component={Link}
            to='/items'
            type='button'
            size='small'
            variant='outlined'
            fullWidth
            disabled={item.loading}

          >
            Cancel
          </Button>
        </div>
      </Box>
    </Container>
  );
};

export default Create;
