import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchUnitOfMeasure,
  updateUnitOfMeasure,
} from "../../store/slices/unitOfMeasureSlice";
import { AppState, AppDispatch } from "../../store/store";
import { toast } from "react-toastify";
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
    name: "",
  });
  const { id } = useParams();
  const { tokens } = useSelector((state: AppState) => state.auth);
  const { unitOfMeasure } = useSelector(
    (state: AppState) => state.unitOfMeasure
  );
  const uom = useSelector((state:AppState)=>state.unitOfMeasure.unitOfMeasure)

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    if (tokens && id) {
      dispatch(fetchUnitOfMeasure(id));
    }
    setFormData({
      name: unitOfMeasure.data?.name,
    });
  }, []);

  useEffect(()=>{
setFormData({
      name: unitOfMeasure.data?.name,
    });
  },[unitOfMeasure])

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
      await dispatch(updateUnitOfMeasure({ id, formData })).unwrap();
      toast.success("Unit of Measure edited successfully");
      navigate(`/unit-of-measure/detail/${unitOfMeasure.data.id}`);
    } catch (err) {
      toast.error(uom.error?.error||"Something Went Wrong");

      // setError(err.response?.data.detail || err.message);
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
        className="form-gap"
      >
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
          helperText={uom.error?.name||""}
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
         
      </Box>
    </Container>
  );
};

export default Edit;
