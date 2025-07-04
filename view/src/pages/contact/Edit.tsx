import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
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
  const contact = useSelector((state: AppState) => state.contact.contact)
  const { id } = useParams();
  const { tokens } = useSelector((state: AppState) => state.auth);
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

  useEffect(() => {
    setFormData({
      email: contact.data?.email,
      phone_no: contact.data?.phone_no,
      address: contact.data?.address,
    });
  }, [contact])
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
      toast.error(contact.error?.error || "Something Went Wrong");
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <div className='flex gap-4 '>

        <Typography variant="h5" color='primary' className="mb-4! ">
          Edit Contact
        </Typography>
        <Typography variant="h5" color='warning' >
          {contact?.data?.name}

        </Typography>
      </div>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
        <TextField
          size='small'
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
          helperText={contact.error?.email || ""}
        />

        <TextField
          size='small'
          label="address"
          name="address"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData?.address}
          onChange={handleChange}
          required
          disabled={loading}
          helperText={contact.error?.address || ""}
        />

        <TextField
          size='small'
          label="Phone No."
          name="phone_no"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData?.phone_no}
          onChange={handleChange}
          required
          disabled={loading}
          helperText={contact.error?.phone_no || ""}
        />

        <div className='flex gap-4'>

          <Button
            type="submit"
            size='small'
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
          <Button
            component={Link}
            to={`/contact/detail/${id}`}
            type='button'
            size='small'
            variant='outlined'
            fullWidth
            disabled={loading}

          >
            Cancel
          </Button>

        </div>
      </Box>
    </Container>
  );
};

export default Edit;
