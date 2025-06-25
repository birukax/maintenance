import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPurchaseRequest } from "../../store/slices/purchaseRequestSlice";
import { fetchItems } from "../../store/slices/itemSlice";
import { AppState, AppDispatch } from "../../store/store";
import { Link } from "react-router-dom";
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
import { PRIORITIES } from "../../utils/choices";
const Create = () => {
  const [formData, setFormData] = useState({
    item_id: "",
    quantity: "",
    priority: "",
  });
  const purchaseRequest = useSelector((state: AppState) => state.purchaseRequest.purchaseRequest)
  const { tokens } = useSelector((state: AppState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { items } = useSelector((state: AppState) => state.item);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const params = {
    no_pagination: "true",
  };
  useEffect(() => {
    if (tokens) {
      dispatch(fetchItems(params));
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
      await dispatch(createPurchaseRequest(formData)).unwrap();
      toast.success("Purchase Request created successfully");
      navigate("/purchase-requests");
    } catch (err) {
      toast.error(purchaseRequest.error?.error || "Something Went Wrong");
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h5" color='primary' className="mb-2! ">
        Create Purchase Request
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
        <FormControl fullWidth variant="outlined" disabled={loading}>
          <Autocomplete
            size='small'
            options={items.data || []}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Item"
                placeholder="Search items..."
                required
                helperText={purchaseRequest.error?.item_id}
              />
            )}
            id="item-select"
            value={Array.isArray(items.data) && items.data?.find((item) => item.id === formData.item_id) || null}
            onChange={(event, newValue) => {
              setFormData({
                ...formData,
                item_id: newValue ? newValue.id : "",
              });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </FormControl>
        <FormControl size='small' fullWidth variant="outlined" required disabled={loading}>
          <InputLabel id="priority-select-label">Priority</InputLabel>
          <Select
            size='small'
            labelId="priority-select-label"
            id="priority-select"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            label="Priority"

          >
            {PRIORITIES.map((priority, index) => (
              <MenuItem key={index} value={priority[0]}>
                {priority[0]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          size='small'
          label="Quantity"
          name="quantity"
          type="number"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.quantity}
          onChange={handleChange}
          inputProps={{
            min: 0,
            step: 1,
          }}
          required
          disabled={loading}
          helperText={purchaseRequest.error?.quantity}
        />

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
            {loading ? <CircularProgress size={24} /> : "Create"}
          </Button>
          <Button
            component={Link}
            to='/purchase-requests'
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
