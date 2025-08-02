import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchEquipment,
  updateEquipment,
} from "../../store/slices/equipmentSlice";
import { AppState, AppDispatch } from "../../store/store";
import {
  Button,
  Typography,
  Container,
  CircularProgress,
  TextField,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
const Edit = () => {
  const [formData, setFormData] = useState({
    name: "",
  });
  const equipment = useSelector((state: AppState) => state.equipment.equipment)
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      dispatch(fetchEquipment(id));
    }
    setFormData({
      name: equipment?.data?.name,
    });
  }, []);

  useEffect(() => {
    setFormData({
      name: equipment?.data?.name,
    });
  }, [equipment])


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // await api.patch(`/inventory/items/${item.data.id}/`, formData);
      await dispatch(updateEquipment({ id, formData })).unwrap();
      toast.success("Equipment edited successfully");
      navigate(`/equipment/detail/${id}`);
    } catch (err) {
      toast.error(equipment?.error?.error || "Something Went Wrong");
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <div className='flex gap-4 '>
        <Typography variant="h5" color='primary' className="mb-2! ">
          Edit Equipment
        </Typography>
        <Typography variant="h5" color='warning' >
          {equipment?.data?.code}

        </Typography>
      </div>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
        <TextField
          size='small'
          multiline
          label="Name"
          name="name"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData?.name}
          onChange={handleChange}
          required
          disabled={equipment.loading}
          helperText={equipment?.error?.name || ""}
        />
        <div className='flex gap-4'>

          <Button
            size='small'
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={equipment.loading}
            className="mt-4"
          >
            {equipment.loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
          <Button
            component={Link}
            to={`/equipment/detail/${id}`}
            type='button'
            size='small'
            variant='outlined'
            fullWidth
            disabled={equipment.loading}

          >
            Cancel
          </Button>

        </div>
      </Box>
    </Container>
  );
};

export default Edit;
