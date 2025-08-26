import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { createPlant } from "../../store/slices/plantSlice";
import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import { AppState, AppDispatch } from "../../store/store";
const Create = () => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
  });
  const plant = useSelector((state: AppState) => state.plant.plant)
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(createPlant(formData)).unwrap();
      toast.success("Plant created successfully");
      navigate("/plants");
    } catch (err) {
      toast.error(plant.error?.error || "Something Went Wrong");
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h5" color='primary' className="mb-2! ">
        Create Plant
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
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
          disabled={plant.loading}
          helperText={plant?.error?.code}
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
          disabled={plant.loading}
          helperText={plant?.error?.name}
        />
        <div className='flex gap-4'>

          <Button
            size='small'
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={plant.loading}
            className="mt-4"
          >
            {plant.loading ? <CircularProgress size={24} /> : "Create"}
          </Button>
          <Button
            component={Link}
            to='/plants'
            type='button'
            size='small'
            variant='outlined'
            fullWidth
            disabled={plant.loading}

          >
            Cancel
          </Button>
        </div>
      </Box>
    </Container>
  );
};

export default Create;
