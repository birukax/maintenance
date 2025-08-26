import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createClearance } from "../../store/slices/clearanceSlice";
import { AppState, AppDispatch } from "../../store/store";
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  Box,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { toast } from "react-toastify";
const Create = () => {
  const clearance = useSelector((state: AppState) => state.clearance.clearance)
  const [formData, setFormData] = useState({
    description: "",
    breakdown: false,
    scheduled: false,
  });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(createClearance(formData)).unwrap();
      toast.success("Clearance created successfully");
      navigate("/clearances");
    } catch (err) {
      toast.error(clearance.error?.error || "Something Went Wrong");
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h5" color='primary' className="mb-2! ">
        Create Clearance
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
        <TextField
          size='small'
          label="Description"
          name="description"
          className="mb-2"
          variant="outlined"
          fullWidth
          value={formData.description}
          onChange={handleChange}
          required
          disabled={clearance.loading}
          helperText={clearance?.error?.description || ""}

        />
        <FormControlLabel
          labelPlacement="start"
          label="Scheduled"
          control={
            <Switch
              size='medium'
              name="scheduled"
              checked={formData.scheduled}
              onChange={handleChange}
              disabled={clearance.loading}
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
              onChange={handleChange}
              disabled={clearance.loading}
            />
          }
        />

        <div className='flex gap-4'>

          <Button
            size='small'
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={clearance.loading}
            className="mt-4"
          >
            {clearance.loading ? <CircularProgress size={24} /> : "Create"}
          </Button>
          <Button
            component={Link}
            to='/clearances'
            type='button'
            size='small'
            variant='outlined'
            fullWidth
            disabled={clearance.loading}

          >
            Cancel
          </Button>
        </div>
      </Box>
    </Container>
  );
};

export default Create;
