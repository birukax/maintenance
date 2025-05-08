import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchContact,
  updateContact,
  fetchContacts,
} from "../../store/slices/contactSlice";
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
import { toast } from "react-toastify";
const Edit = () => {
  const [formData, setFormData] = useState({
    email: "",
    phone_no: "",
    address: "",
  });
  const { id } = useParams();
  const { tokens } = useSelector((state: AppState) => state.auth);
  const { contact } = useSelector((state: AppState) => state.contact);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    if (tokens && id) {
      dispatch(fetchContact(id));
    }
    setFormData({
      email: contact.data?.email,
      phone_no: contact.data?.phone_no,
      address: contact.data?.address,
    });
  }, []);

  useEffect(()=>{
setFormData({
      email: contact.data?.email,
      phone_no: contact.data?.phone_no,
      address: contact.data?.address,
    });
  },[contact])
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
      await dispatch(updateContact({ id, formData })).unwrap();
      toast.success("Contact edited successfully");
      navigate(`/contact/detail/${contact.data.id}`);
    } catch (err) {
      toast.error("Error editing Contact");
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Edit Contact
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap"
      >
        <TextField
          label="Email"
          name="email"
          type="email"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData?.email}
          onChange={handleChange}
          required
          disabled={loading}
        />
        
        <TextField
          label="address"
          name="address"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData?.address}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <TextField
          label="Phone No."
          name="phone_no"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData?.phone_no}
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
          {loading ? <CircularProgress size={24} /> : "Edit Contact"}
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
