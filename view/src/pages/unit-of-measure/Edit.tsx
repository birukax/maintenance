import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchUnitOfMeasure,
  updateUnitOfMeasure,
} from "../../store/slices/unitOfMeasureSlice";
import { AppState, AppDispatch } from "../../store/store";
import api from "../../utils/api";
import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  Box,
} from "@mui/material";

const Edit = () => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
  });
  const { id } = useParams();
  const { tokens } = useSelector((state: AppState) => state.auth);
  const { unitOfMeasure } = useSelector(
    (state: AppState) => state.unitOfMeasure
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    if (tokens && id) {
      dispatch(fetchUnitOfMeasure(id));
    }
    setFormData({
      code: unitOfMeasure.data.code,
      name: unitOfMeasure.data.name,
    });
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
      dispatch(updateUnitOfMeasure({ id, formData }));
      navigate(`/unit-of-measure/detail/${unitOfMeasure.data.id}}`);
    } catch (err) {
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Edit Unit Of Measure
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-4"
      >
        {" "}
        <TextField
          label="Code"
          name="code"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.code}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <TextField
          label="Name"
          name="name"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.name}
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
          {loading ? <CircularProgress size={24} /> : "Edit Unit of Measure"}
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
