import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppState, AppDispatch } from "../../store/store";
import { createActivityType } from "../../store/slices/activityTypeSlice";
import { fetchWorkOrderTypes } from "../../store/slices/workOrderTypeSlice";
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
const Create = () => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    work_order_type_id: "",
  });
  const activityType = useSelector((state: AppState) => state.activityType.activityType)
  const [loading, setLoading] = useState(false);
  const { workOrderTypes } = useSelector(
    (state: AppState) => state.workOrderType
  );
  const [error, setError] = useState(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const params = {
    no_pagination: "true",
  };

  useEffect(() => {
    dispatch(fetchWorkOrderTypes(params));
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
      await dispatch(createActivityType(formData)).unwrap();
      toast.success("Activity Type created successfully");
      navigate("/activity-types");
    } catch (err) {
      toast.error(activityType.error?.error || "Something Went Wrong");

      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h5" color='primary' className="mb-2! ">
        Create Activity Type
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >

        <FormControl fullWidth variant="outlined" disabled={loading}>
          <Autocomplete
            size='small'
            options={workOrderTypes.data || []}
            getOptionLabel={(option) =>
              option.code ? `${option.code} - ${option.name}` : option.name || ""
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Work Order Type"
                placeholder="Search work order types..."
                required
                helperText={activityType.error?.work_order_type_id}
              />
            )}
            id="work-order-type-select"
            value={
              Array.isArray(workOrderTypes) && workOrderTypes.data?.find(
                (workOrderType) => workOrderType.id === formData.work_order_type_id
              ) || null
            }
            onChange={(event, newValue) => {
              setFormData({
                ...formData,
                work_order_type_id: newValue ? newValue.id : "",
              });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </FormControl>
        <TextField
          size='small'
          label="code"
          name="code"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.code}
          onChange={handleChange}
          required
          disabled={loading}
          helperText={activityType.error?.code}
        />
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
          disabled={loading}
          helperText={activityType.error?.name}
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
            to='/activity-types'
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
