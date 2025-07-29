import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPurchaseRequest } from "../../../store/slices/purchaseRequestSlice";
import { fetchItems } from "../../../store/slices/itemSlice";
import { AppState, AppDispatch } from "../../../store/store";
import { fetchLocations } from "../../../store/slices/locationSlice";

import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  FormControl,
  Box,
  Autocomplete,
  TableRow,
  Table,
  TableHead,
  TableCell,
  TableBody,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";
import { PRIORITIES } from "../../../utils/choices";
const Create = () => {
  const [formData, setFormData] = useState({
    location_id: "",
    priority: "",
    requested_items: [],
  });
  const { purchaseRequest } = useSelector((state: AppState) => state.purchaseRequest)
  const { items } = useSelector((state: AppState) => state.item);
  const { locations } = useSelector((state: AppState) => state.location)
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const params = {
    no_pagination: "true",
  };
  useEffect(() => {
    dispatch(fetchLocations(params))
    dispatch(fetchItems(params));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createPurchaseRequest(formData)).unwrap();
      toast.success("Purchase Request created successfully");
      navigate("/purchase-requests");
    } catch (err) {
      toast.error(purchaseRequest.error?.error || "Something Went Wrong");
    }

  };


  const selectedItems = formData.requested_items.length > 0
    ? formData.requested_items.map((el) => {
      return items.data.filter((item) => item.id === el.item_id)
    }) : [];

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
        <FormControl fullWidth variant="outlined" required disabled={purchaseRequest.loading}>
          <Autocomplete
            size="small"
            options={
              Array.isArray(locations.data)
                ? locations.data
                : []
            }
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Location"
                placeholder="Search locations..."
                required
                helperText={purchaseRequest.error?.location_id}
              />
            )}
            id="location-select"
            value={
              Array.isArray(locations.data)
                ? locations.data.find(
                  (location) => location.id === formData.location_id
                )
                : null
            }
            onChange={(event, newValue) => {
              setFormData({
                ...formData,
                location_id: newValue ? newValue.id : "",
              });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            disabled={purchaseRequest.loading}
          />
        </FormControl>
        <FormControl size='small' fullWidth variant="outlined" required disabled={purchaseRequest.loading}>
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

        <FormControl fullWidth variant="outlined" disabled={purchaseRequest.loading}>
          <Autocomplete
            size="small"
            multiple
            options={Array.isArray(items.data) ? items.data : []}
            getOptionLabel={(option) => option.name || ""}
            value={
              Array.isArray(items.data)
                ? items.data.filter((item) =>
                  formData.requested_items
                    .map((el) => el.item_id)
                    .includes(item.id)
                )
                : []
            }
            onChange={(_, newValue) => {
              setFormData({
                ...formData,
                requested_items: newValue.map((item) => {
                  return { item_id: item.id, quantity: null };
                }),
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Requested Items"
                placeholder="Search Items..."
                helperText={purchaseRequest.error?.requested_items}
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            disabled={purchaseRequest.loading}
          />
        </FormControl>
        <Table size='small' sx={{ width: "100%" }} className="table table-auto">
          <TableHead>
            <TableCell>Item ID</TableCell>
            <TableCell>Item Name</TableCell>
            <TableCell>Quantity</TableCell>
          </TableHead>

          <TableBody>

            {selectedItems?.map((item) => (
              <TableRow
                key={item[0].id}
              >
                <TableCell>
                  {item[0].no}
                </TableCell>
                <TableCell>
                  {item[0]?.name}{" "}
                </TableCell>
                <TableCell>
                  <FormControl>
                    <TextField
                      variant="outlined"
                      label="Quantity"
                      type="number"
                      value={
                        formData.requested_items.filter(
                          (el) => el.item_id === item[0].id
                        )[0]?.quantity
                      }
                      required
                      sx={{ width: "160px", padding: "0" }}
                      size="small"
                      inputProps={{ min: 1 }}
                      InputLabelProps={{
                        style: { fontSize: 14 },
                      }}
                      onChange={(e) =>
                        setFormData((prev) => {
                          return {
                            ...prev,
                            requested_items: [
                              ...prev.requested_items.filter((el) => {
                                if (el.item_id === item[0].id) {
                                  el.quantity = Number(e.target.value);
                                }
                                return el;
                              }),
                            ],
                          };
                        })
                      }
                    />
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className='flex gap-4'>

          <Button
            size='small'
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={purchaseRequest.loading || selectedItems.length <= 0}
            className="mt-4"
          >
            {purchaseRequest.loading ? <CircularProgress size={24} /> : "Create"}
          </Button>
          <Button
            component={Link}
            to='/purchase-requests'
            type='button'
            size='small'
            variant='outlined'
            fullWidth
            disabled={purchaseRequest.loading}

          >
            Cancel
          </Button>
        </div>
      </Box>
    </Container>
  );
};

export default Create;
