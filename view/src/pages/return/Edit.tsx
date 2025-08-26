import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchReturn,
  updateReturn,
} from "../../store/slices/returnSlice";
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
    email: "",
    phone_no: "",
    location: "",
  });

  const { id } = useParams();
  const { ret } = useSelector((state: AppState) => state.ret.return);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      dispatch(fetchReturn(id));
    }
    setFormData({
      email: ret.data.email,
      phone_no: ret.data.phone_no,
      location: ret.data.location,
    });
  }, []);


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // await api.patch(`/inventory/items/${item.data.id}/`, formData);
      await dispatch(updateReturn({ id, formData })).unwrap();
      toast.success("Return edited successfully");
      navigate(`/return/detail/${ret.data.id}`);
    } catch (err) {
      toast.error(ret.error?.error || "Something Went Wrong");
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Edit Return
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
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
          disabled={ret.loading}
          helperText={ret.error?.email || ""}
        />
        <TextField
          label="Location"
          name="location"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData?.location}
          onChange={handleChange}
          required
          disabled={ret.loading}
          helperText={ret.error?.location_id || ""}

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
          disabled={ret.loading}
          helperText={ret.error?.phone_no || ""}

        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={ret.loading}
          className="mt-4"
        >
          {ret.loading ? <CircularProgress size={24} /> : "Edit Return"}
        </Button>

      </Box>
    </Container>
  );
};

export default Edit;
