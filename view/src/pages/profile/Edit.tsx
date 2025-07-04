import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  fetchProfile,
  updateProfile,
} from "../../store/slices/profileSlice";
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
      old_password: "",
      password: ""
  });
  const { id } = useParams();
  const { tokens } = useSelector((state: AppState) => state.auth);
  const profile = useSelector((state: AppState) => state.profile.profile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comfirmpas, setComfirmPas] = useState("")

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    if (tokens && id) {
      dispatch(fetchProfile(id));
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
    if (comfirmpas === formData.password) {

      try {
        // await api.patch(`/inventory/items/${item.data.id}/`, formData);
          await dispatch(updateProfile({ formData })).unwrap();
        toast.success("Profile edited successfully");
        navigate(`/profile/${id}`);
      } catch (err) {
        toast.error(profile.error?.error || "Something Went Wrong");
        setError(err.response?.data.detail || err.message);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Password and Comfirm Password must be similar");
      setLoading(false);
    }
  };


  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h5" color='primary' className="mb-2! ">
              Change Information
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
        <TextField
          size='small'
                  label="Email"
                  name="email"
          variant="outlined"
          fullWidth
                  value={formData.old_password}
          onChange={handleChange}
          disabled={loading}
                  type="email"
          required
                  helperText={profile.error?.email || ""}
        />
        <TextField
          size='small'
                  label="Phone No."
                  name="phone_no"
          variant="outlined"
          fullWidth
                  value={formData.phone_no}
                  onChange={handleChange}
          disabled={loading}
                  type="phone_no"
          required
                  helperText={profile.error?.phone_no || ""}
              />
              <div className='flex gap-4'>

          <Button
            size='small'
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={profile.loading}
            className="mt-4"
          >
            {loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
          <Button
            component={Link}
            to={`/profile/${id}`}
            type='button'
            size='small'
            variant='outlined'
            fullWidth
            disabled={profile.loading}

          >
            Cancel
          </Button>

        </div>

      </Box>
    </Container>
  );
};

export default Edit;
