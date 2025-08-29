import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createReturn } from "../../store/slices/returnSlice";
import { fetchItems } from "../../store/slices/itemSlice";
import { AppState, AppDispatch } from "../../store/store";
import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Box,
  Switch,
  Autocomplete,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast } from "react-toastify";
import { type FormData } from '../../store/types';

const Create = () => {
  const [formData, setFormData] = useState<FormData>({
    item_id: "",
    reason: "",
    used: true,
    quantity: "",
    date: '',
  });
  const ret = useSelector((state: AppState) => state.return.return)

  const { items } = useSelector((state: AppState) => state.item);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const params = {
    no_pagination: "true",
  };
  useEffect(() => {
    dispatch(fetchItems(params));

  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    if (name === "used") {
      setFormData({ ...formData, [name]: checked });
    } else setFormData({ ...formData, [name]: value });
  };
  const handleDateChange = (value: any) => {
    const formattedDate = value ? value.format("YYYY-MM-DD") : null;
    setFormData({
      ...formData,
      date: formattedDate,
    });
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(createReturn(formData)).unwrap();
      toast.success("Return created successfully");
      navigate("/returns");
    } catch (error) {
      toast.error(ret.error?.error || error || "Something Went Wrong");
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Create Return
      </Typography>
      <Box component="form" onSubmit={handleSubmit} className="form-gap w-full">
        <FormControlLabel
          labelPlacement="start"
          label="Used"
          checked={formData.used}
          disabled={ret.loading}
          required
          control={<Switch
            onChange={handleChange}
            name="used"
          />}
        />
        <FormControl fullWidth variant="outlined" disabled={ret.loading}>
          <Autocomplete
            options={Array.isArray(items.data) ? items.data : []}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Item"
                placeholder="Search items..."
                required
                helperText={ret.error?.item_id}

              />
            )}
            id="item-select"
            value={Array.isArray(items.data) && items.data?.find((item) => item.id === formData.item_id) || null}
            onChange={(_event, newValue) => {
              setFormData({
                ...formData,
                item_id: newValue ? newValue.id : "",
              });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </FormControl>

        <TextField
          label="Quantity"
          type="number"
          name="quantity"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.quantity}
          onChange={handleChange}
          required
          disabled={ret.loading}
          helperText={ret.error?.quantity}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            disableFuture
            label="Date"
            name="date"
            value={formData.date ? dayjs(formData.date) : null}
            onChange={handleDateChange}
            slotProps={{
              textField: {
                variant: "outlined",
                fullWidth: true,
                required: true,
                helperText: ret.error?.date,
              },
            }}
          />
        </LocalizationProvider>
        <TextField
          multiline
          label="Reason"
          name="reason"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.reason}
          onChange={handleChange}
          required
          disabled={ret.loading}
          helperText={ret.error?.reason}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={ret.loading}
          className="mt-4"
        >
          {ret.loading ? <CircularProgress size={24} /> : "Create Return"}
        </Button>

      </Box>
    </Container>
  );
};

export default Create;
