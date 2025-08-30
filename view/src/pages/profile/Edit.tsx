import { useState, useEffect, ChangeEvent, FormEvent } from "react";
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
import { type FormData } from '../../store/types';

const Edit = () => {
  const [formData, setFormData] = useState<FormData>({
    old_password: "",
    password: "",
    phone_no: '',
  });
  const { id } = useParams();
  const profile = useSelector((state: AppState) => state.profile.profile);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      dispatch(fetchProfile(id));
    }
  }, []);



  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // await api.patch(`/inventory/items/${item.data.id}/`, formData);
      await dispatch(updateProfile({ id, formData })).unwrap();
      toast.success("Profile edited successfully");
      navigate(`/profile/${id}`);
    } catch (error) {
      toast.error(profile.error?.error || error || "Something Went Wrong");
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
          disabled={profile.loading}
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
          disabled={profile.loading}
          type="phone_no"
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
            {profile.loading ? <CircularProgress size={24} /> : "Save"}
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
