import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchEquipment,
  updateEquipment,
  fetchEquipments,
} from "../../store/slices/equipmentSlice";
import { fetchMachines } from "../../store/slices/machineSlice";
import { AppState, AppDispatch } from "../../store/store";
import api from "../../utils/api";
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
    machine_id: "",
  });
  const { id } = useParams();
  const { tokens } = useSelector((state: AppState) => state.auth);
  const { machines } = useSelector((state: AppState) => state.machine);
  const { equipment } = useSelector((state: AppState) => state.equipment);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    if (tokens && id) {
      dispatch(fetchEquipment(id));
    }
    setFormData({
      name: equipment.data?.name,
      machine_id: equipment.data?.machine.id,
    });
  }, []);

  useEffect(()=>{
setFormData({
      name: equipment.data?.name,
      machine_id: equipment.data?.machine.id,
    });
  },[equipment])
  useEffect(() => {
    if (tokens) {
      dispatch(fetchMachines());
    }
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
      // await api.patch(`/inventory/items/${item.data.id}/`, formData);
      await dispatch(updateEquipment({ id, formData })).unwrap();
      toast.success("Equipment edited successfully");
      navigate(`/equipment/detail/${equipment.data.id}`);
    } catch (err) {
      toast.error("Error editing Equipment");
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
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
        <FormControl fullWidth variant="outlined" required disabled={loading}>
          <InputLabel id="machine-select-label">Machine</InputLabel>
          <Select
            labelId="machine-select-label"
            id="machine-select"
            name="machine_id"
            value={formData?.machine_id}
            onChange={handleChange}
            label="Machine"
          >
            {machines.data &&
              machines.data.map((machine) => (
                <MenuItem key={machine.id} value={machine?.id}>
                  {machine?.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

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
          disabled={loading}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          className="mt-4"
        >
          {loading ? <CircularProgress size={24} /> : "Edit Equipment"}
        </Button>
        {error && (
          <Typography variant="body2" className="mt-4 text-red-500">
            {error}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Edit;
