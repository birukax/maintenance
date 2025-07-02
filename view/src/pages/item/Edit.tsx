import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchItem, updateItem } from "../../store/slices/itemSlice";
import { AppState, AppDispatch } from "../../store/store";
import { fetchContacts } from "../../store/slices/contactSlice";
import { Link } from "react-router-dom";

import {
  Button,
  Typography,
  Container,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Autocomplete,

  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import { fetchShelves } from "../../store/slices/shelfSlice";
import { fetchShelfRows } from "../../store/slices/shelfRowSlice";
import { fetchShelfBoxes } from "../../store/slices/shelfBoxSlice";
const Create = () => {
  const [formData, setFormData] = useState({
    minimum_stock_level: 0,
    suppliers_id: [],
    shelf_id: "",
    row_id: "",
    box_id: ""
  });
  const item = useSelector((state: AppState) => state.item.item)

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const { contacts } = useSelector((state: AppState) => state.contact);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { shelves } = useSelector((state: AppState) => state.shelf);
  const { shelfRows } = useSelector((state: AppState) => state.shelfRow);
  const { shelfBoxes } = useSelector((state: AppState) => state.shelfBox);
  const params = {
    no_pagination: "true",
  };


  useEffect(() => {
    if (id) {
      dispatch(fetchContacts(params));
      dispatch(fetchItem(id));
      dispatch(fetchShelves(params))
      dispatch(fetchShelfRows(params))
      dispatch(fetchShelfBoxes(params))
    }
  }, []);

  useEffect(() => {
    setFormData({
      minimum_stock_level: item.data?.minimum_stock_level || 0,
      suppliers_id: item.data?.suppliers?.map((supplier) => supplier.id) || [],
      shelf_id: item.data?.shelf?.id,
      row_id: item.data?.row?.id,
      box_id: item.data?.box?.id
    });
  }, [item.data, contacts.data])

  const supplierOptions = useMemo(() => {
    return contacts.data
      ? contacts.data
      : [];
  }, [contacts.data]);

  const selectedSuppliers = useMemo(() => {
    return supplierOptions ? supplierOptions.filter((option) =>
      formData.suppliers_id?.includes(option.id)
    ) : [];
  }, [formData.suppliers_id, supplierOptions]);


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
    try {
      // await api.patch(`/inventory/items/${item.data.id}/`, formData);
      await dispatch(updateItem({ id, formData })).unwrap();
      toast.success("Item updated successfully");
      navigate(`/item/detail/${item.data.id}`);
    } catch (err) {
      toast.error(item.error?.error || "Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };



  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <div className='flex gap-4 '>
        <Typography variant="h5" color='primary' className="mb-2! ">
          Edit Item
        </Typography>
        <Typography variant="h5" color='warning' >
          {item?.data?.no}

        </Typography>
      </div>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
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
          disabled={loading}
          helperText={item.error?.minimum_stock_level || ""}
        />
        <FormControl fullWidth variant="outlined" required disabled={loading}>
          <InputLabel id="shelf-select-label">Shelf</InputLabel>
          <Select
            size='small'
            labelId="shelf-select-label"
            id="shelf-select"
            name="shelf_id"
            value={formData.shelf_id}
            onChange={handleChange}
            label="Shelf"
          >
            {Array.isArray(shelves.data) &&
              shelves.data.map((shelf) => (
                <MenuItem key={shelf.id} value={shelf.id}>
                  {shelf.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined" required disabled={loading}>
          <InputLabel id="shelf-row-select-label">Shelf Row</InputLabel>
          <Select
            size='small'
            labelId="shelf-row-select-label"
            id="shelf-row-select"
            name="row_id"
            value={formData.row_id}
            onChange={handleChange}
            label="Shelf Row"
          >
            {Array.isArray(shelfRows.data) &&
              shelfRows.data
                .filter((shelfRow) => shelfRow?.shelf?.id === formData.shelf_id)
                .map((row) => (
                  <MenuItem key={row.id} value={row.id}>
                    {row.name}
                  </MenuItem>
                ))}
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined" required disabled={loading}>
          <InputLabel id="shelf-box-select-label">Shelf Box</InputLabel>
          <Select
            size='small'
            labelId="shelf-box-select-label"
            id="shelf-box-select"
            name="box_id"
            value={formData.box_id}
            onChange={handleChange}
            label="Shelf Box"
          >
            {Array.isArray(shelfBoxes.data) &&
              shelfBoxes.data
                .filter((shelfBox) => shelfBox?.row?.id === formData.row_id)
                .map((box) => (
                  <MenuItem key={box.id} value={box.id}>
                    {box.name}
                  </MenuItem>
                ))}
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined" disabled={loading}>
          <Autocomplete
            size='small'
            multiple
            options={supplierOptions}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Suppliers"
                placeholder="Search suppliers..."
                helperText={item.error?.suppliers_id || ""}
              />
            )}
            id="supplier-autocomplete"
            value={selectedSuppliers}
            onChange={(event, newValue) =>
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
            disabled={loading}
            className="mt-4"
          >
            {loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
          <Button
            component={Link}
            to={`/item/detail/${id}`}
            type='button'
            size='small'
            variant='outlined'
            fullWidth
            disabled={loading}

          >
            Cancel
          </Button>

        </div>
      </Box>
    </Container>
  );
};

export default Create;
