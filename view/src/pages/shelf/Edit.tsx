import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchShelf,
  updateShelf,
} from "../../store/slices/shelfSlice";
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
  const shelf = useSelector((state:AppState)=>state.shelf.shelf)
  const { id } = useParams();
  const { tokens } = useSelector((state: AppState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    if (tokens && id) {
      dispatch(fetchShelf(id));
    }
    setFormData({
      name: shelf.data?.name,
    });
  }, []);

  useEffect(()=>{
setFormData({
      name: shelf.data?.name,
    });
  },[shelf])
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
      await dispatch(updateShelf({ id, formData })).unwrap();
      toast.success("Shelf edited successfully");
      navigate(`/shelf/detail/${shelf.data.id}`);
    } catch (err) {
      toast.error(shelf.error?.error||"Something Went Wrong");
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Edit Shelf
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
          helperText={shelf.error?.name||""}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          className="mt-4"
        >
          {loading ? <CircularProgress size={24} /> : "Edit Shelf"}
        </Button>
         
      </Box>
    </Container>
  );
};

export default Edit;
