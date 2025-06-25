import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createWorkOrderType } from "../../store/slices/workOrderTypeSlice";
import { toast } from "react-toastify";
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
  FormControlLabel,
  Switch,
  Box,
} from "@mui/material";
import { AppState } from "../../store/store";

const Create = () => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    scheduled: false,
    breakdown: false,
  });
  const workOrderType = useSelector((state: AppState) => state.workOrderType.workOrderType)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await dispatch(createWorkOrderType(formData)).unwrap();
      toast.success("Work Order Type created successfully");
      navigate("/work-order-types");
    } catch (err) {
      toast.error(workOrderType.error?.error || "Something Went Wrong");
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h5" color='primary' className="mb-2! ">
        Create Work Order Type
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <FormControlLabel
            labelPlacement="start"
            label="Scheduled"
            control={
              <Switch
                size='medium'
                name="scheduled"
                checked={formData.scheduled}
                onChange={(e) => {
                  if (formData.breakdown === true) {
                    setFormData({ ...formData, scheduled: e.target.checked, breakdown: false })
                  } else {
                    setFormData({ ...formData, scheduled: e.target.checked })
                  }
                }

                }
                disabled={loading}
              />
            }
          />
          <FormControlLabel
            labelPlacement="start"
            label="Breakdown"
            control={
              <Switch
                size='medium'

                name="breakdown"
                checked={formData.breakdown || false}
                onChange={(e) => {
                  if (formData.scheduled === true) {
                    setFormData({ ...formData, breakdown: e.target.checked, scheduled: false })
                  } else {
                    setFormData({ ...formData, breakdown: e.target.checked })
                  }
                }
                }
                disabled={loading}
              />
            }
          />
        </Box>
        <TextField
          size='small'
          label="Code"
          name="code"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.code}
          onChange={handleChange}
          required
          disabled={loading}
          helperText={workOrderType.error?.code}
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
          helperText={workOrderType.error?.name}

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
            to='/work-order-types'
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
