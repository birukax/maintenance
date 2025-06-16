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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
const Edit = () => {
  const [formData, setFormData] = useState({
    name: "",
  });
  const equipment = useSelector((state: AppState) => state.equipment.equipment)
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const params = {
    no_pagination: "true",
  };
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
      <Typography variant="h4" className="mb-6 text-gray-800">
        Edit Equipment
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap"
      >
        <TextField
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={equipment.loading}
          className="mt-4"
        >
          {equipment.loading ? <CircularProgress size={24} /> : "Edit Equipment"}
        </Button>

      </Box>
    </Container>
  );
};

export default Edit;
