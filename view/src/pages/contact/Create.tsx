import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createContact } from "../../store/slices/contactSlice";
import api from "../../utils/api";
import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
const Create = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_no: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await dispatch(createContact(formData)).unwrap();
      toast.success("Contact created successfully");
      navigate("/contacts");
    } catch (err) {
      toast.error("Error creating Contact");
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Create Contact
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
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.email}
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
          value={formData.address}
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
          value={formData.phone_no}
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
          {loading ? <CircularProgress size={24} /> : "Create Contact"}
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

export default Create;
