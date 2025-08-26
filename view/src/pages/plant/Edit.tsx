import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  fetchPlant,
  updatePlant,
} from "../../store/slices/plantSlice";
import { AppState, AppDispatch } from "../../store/store";
import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
const Edit = () => {
  const [formData, setFormData] = useState({
    name: "",
  });
  const plant = useSelector((state: AppState) => state.plant.plant)
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchPlant(id));

    setFormData({
      name: plant.data?.name,
    });
  }, []);

  useEffect(() => {
    setFormData({
      name: plant.data?.name,
    });
  }, [plant])
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // await api.patch(`/inventory/items/${item.data.id}/`, formData);
      await dispatch(updatePlant({ id, formData })).unwrap();
      toast.success("Plant edited successfully");
      navigate(`/plant/detail/${plant.data?.id}`);
    } catch (err) {
      toast.error(plant.error?.error || "Something Went Wrong");
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <div className='flex gap-4 '>
        <Typography variant="h5" color='primary' className="mb-2! ">
          Edit Plant
        </Typography>
        <Typography variant="h5" color='warning' >
          {plant?.data?.code}

        </Typography>
      </div>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
        <TextField
          size='small'
          label="Name"
          name="name"
          variant="outlined"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          required
          disabled={plant.loading}
          helperText={plant.error?.name || ""}
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
            {plant.loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
          <Button
            component={Link}
            to={`/plant/detail/${id}`}
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

export default Edit;
