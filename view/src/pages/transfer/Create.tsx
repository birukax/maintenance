import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppState, AppDispatch } from "../../store/store";
import { Link } from "react-router-dom";
import { fetchItems } from "../../store/slices/itemSlice";
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
  Card,
  TableRow,
  Table,
  TableHead,
  TableCell,
  TableBody,
} from "@mui/material";
import { toast } from "react-toastify";
import { fetchLocations } from "../../store/slices/locationSlice";
import { createTransfer } from "../../store/slices/transferSlice";
const Create = () => {
  const [formData, setFormData] = useState({
    from_location_id: null,
    to_location_id: null,
    requested_items: [],
  });
  const transfer = useSelector((state: AppState) => state.transfer.transfer);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { items } = useSelector((state: AppState) => state.item);
  const { locations } = useSelector((state: AppState) => state.location);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const params = {
    no_pagination: "true",
  };
  useEffect(() => {
    dispatch(fetchLocations(params));
    dispatch(fetchItems(params));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await dispatch(createTransfer(formData)).unwrap();
      toast.success("Transfer created successfully");
      navigate("/transfers");
    } catch (err) {
      toast.error(transfer.error?.error || "Something Went Wrong");
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedItems =
    formData.requested_items.length > 0
      ? formData.requested_items.map((el) => {
        return items.data.filter((item) => item.id === el.item_id);
      })
      : [];


  return (
    <Container className="flex flex-col items-center justify-start min-h-full p-9">
      <Box component="form" className="form-gap w-full! min-w-full">
        <div className="flex gap-4">
          <Typography variant="h5" color='primary' className="mb-2! min-w-fit!" noWrap>
            Create Transfer
          </Typography>
          <FormControl fullWidth variant="outlined" required disabled={loading}>
            <Autocomplete
              size="small"
              options={
                Array.isArray(locations.data)
                  ? locations.data.filter(
                    (el) => el.id !== formData.to_location_id
                  )
                  : []
              }
              getOptionLabel={(option) => option.name || ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="From Location"
                  placeholder="Search locations..."
                  required
                  helperText={transfer.error?.from_location_id}
                />
              )}
              id="location-select"
              value={
                Array.isArray(locations.data)
                  ? locations.data.find(
                    (location) => location.id === formData.from_location_id
                  )
                  : null
              }
              onChange={(event, newValue) => {
                setFormData({
                  ...formData,
                  from_location_id: newValue ? newValue.id : "",
                });
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              disabled={loading}
            />
          </FormControl>
          <FormControl fullWidth variant="outlined" required disabled={loading}>
            <Autocomplete
              size="small"
              options={
                Array.isArray(locations.data)
                  ? locations.data.filter(
                    (el) => el.id !== formData.from_location_id
                  )
                  : []
              }
              getOptionLabel={(option) => option.name || ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="To Location"
                  placeholder="Search locations..."
                  required
                  helperText={transfer.error?.to_location_id}
                />
              )}
              id="location-select"
              value={
                Array.isArray(locations.data)
                  ? locations.data.find(
                    (location) => location.id === formData.to_location_id
                  )
                  : null
              }
              onChange={(event, newValue) => {
                setFormData({
                  ...formData,
                  to_location_id: newValue ? newValue.id : "",
                });
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              disabled={loading}
            />
          </FormControl>
        </div>


        <FormControl fullWidth variant="outlined" disabled={loading}>
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
                helperText={transfer.error?.requested_items}
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            disabled={loading}
          />
        </FormControl>
      </Box>
      <Table size='small' sx={{ width: "100%" }} className="table table-auto">
        <TableHead>
          <TableCell>Item ID</TableCell>
          <TableCell>Item Name</TableCell>
          <TableCell>Transfer Quantity</TableCell>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="w-full">
        <div className="flex gap-4 w-fit my-6">
          <Button
            size="small"
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading || selectedItems.length <= 0}
            onClick={handleSubmit}
            className="mt-4"
          >
            {loading ? <CircularProgress size={24} /> : "Create"}
          </Button>
          <Button
            component={Link}
            to="/transfers"
            type="button"
            size="small"
            variant="outlined"
            fullWidth
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default Create;
