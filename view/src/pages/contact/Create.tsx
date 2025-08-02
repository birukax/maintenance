import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createContact } from "../../store/slices/contactSlice";
import { AppState, AppDispatch } from "../../store/store";
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
const Create = () => {
  const contact = useSelector((state: AppState) => state.contact.contact)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_no: "",
    address: "",
  });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createContact(formData)).unwrap();
      toast.success("Contact created successfully");
      navigate("/contacts");
    } catch (err) {
      toast.error(contact.error?.error || "Something Went Wrong");
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h5" color='primary' className="mb-2! ">
        Create Contact
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
        <TextField
          size='small'
          label="Name"
          name="name"
          className="mb-2"
          variant="outlined"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          required
          disabled={contact.loading}
          helperText={contact?.error?.name || ""}

        />

        <TextField
          size='small'
          label="Email"
          name="email"
          type="email"
          className="mb-2"
          variant="outlined"
          fullWidth
          value={formData.email}
          onChange={handleChange}
          required
          disabled={contact.loading}
          helperText={contact?.error?.email || ""}

        />
        <TextField
          size='small'
          label="address"
          name="address"
          className="mb-2"
          variant="outlined"
          fullWidth
          value={formData.address}
          onChange={handleChange}
          required
          disabled={contact.loading}
          helperText={contact?.error?.address || ""}

        />

        <TextField
          size='small'
          label="Phone No."
          name="phone_no"
          className="mb-2"
          variant="outlined"
          fullWidth
          value={formData.phone_no}
          onChange={handleChange}
          required
          disabled={contact.loading}
          helperText={contact?.error?.phone_no || ""}
        />
        <div className='flex gap-4'>

          <Button
            size='small'
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={contact.loading}
            className="mt-4"
          >
            {contact.loading ? <CircularProgress size={24} /> : "Create"}
          </Button>
          <Button
            component={Link}
            to='/contacts'
            type='button'
            size='small'
            variant='outlined'
            fullWidth
            disabled={contact.loading}

          >
            Cancel
          </Button>
        </div>
      </Box>
    </Container>
  );
};

export default Create;
