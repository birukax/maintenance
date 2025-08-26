import { useState, ChangeEvent } from "react";
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
  FormControlLabel,
  Switch,
  Box,
} from "@mui/material";
import { AppState, AppDispatch } from "../../store/store";

const Create = () => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    scheduled: false,
    breakdown: false,
  });
  const workOrderType = useSelector((state: AppState) => state.workOrderType.workOrderType)
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createWorkOrderType(formData)).unwrap();
      toast.success("Work Order Type created successfully");
      navigate("/work-order-types");
    } catch (err) {
      toast.error(workOrderType.error?.error || "Something Went Wrong");
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
                disabled={workOrderType.loading}
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
                disabled={workOrderType.loading}
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
          disabled={workOrderType.loading}
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
          disabled={workOrderType.loading}
          helperText={workOrderType.error?.name}

        />
        <div className='flex gap-4'>

          <Button
            size='small'
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={workOrderType.loading}
            className="mt-4"
          >
            {workOrderType.loading ? <CircularProgress size={24} /> : "Create"}
          </Button>
          <Button
            component={Link}
            to='/work-order-types'
            type='button'
            size='small'
            variant='outlined'
            fullWidth
            disabled={workOrderType.loading}

          >
            Cancel
          </Button>
        </div>
      </Box>
    </Container>
  );
};

export default Create;
