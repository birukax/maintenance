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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { toast } from "react-toastify";
import { Roles } from "../../utils/choices";

const Edit = () => {
  const [formData, setFormData] = useState({
    role: "",
    email: "",
    phone_no: "",
    is_active: false,
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

  useEffect(() => {
    setFormData({
      role: profile.data?.role,
      email: profile.data?.user?.email,
      phone_no: profile.data?.phone_no,
      is_active: profile.data?.user?.is_active,
    });
  }, [profile.data])
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // await api.patch(`/inventory/items/${item.data.id}/`, formData);
      await dispatch(updateProfile({ id, formData })).unwrap();
      toast.success("Profile edited successfully");
      navigate(`/user/detail/${profile.data?.id}`);
    } catch (err) {
      toast.error(profile.error?.error || "Something Went Wrong");
    }
  };


  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <div className='flex gap-4 '>
        <Typography variant="h5" color='primary' className="mb-2! ">
          Edit User
        </Typography>
        <Typography variant="h5" color='warning' >
          {profile?.data?.user?.username}

        </Typography>
      </div>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
        <FormControlLabel
          labelPlacement="start"
          label="Is Active"
          control={
            <Switch
              name="is_active"
              checked={formData.is_active}
              onChange={(e) => {

                if (formData.is_active === true) {
                  setFormData({ ...formData, is_active: e.target.checked })
                } else {
                  setFormData({ ...formData, is_active: e.target.checked })
                }
              }

              }
              disabled={profile.loading}

            />
          }
        />
        <FormControl fullWidth variant="outlined" required disabled={profile.loading}>
          <InputLabel id="role">Role</InputLabel>
          <Select
            size="small"
            labelId="role"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            label="Role"

          >
            {Roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          size='small'
          label="Email"
          name="email"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.email}
          onChange={handleChange}
          required
          disabled={profile.loading}
          helperText={profile?.error?.email}
          type="email"
        />
        <TextField
          size='small'
          label="Phone No."
          name="phone_no"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.phone_no}
          onChange={handleChange}
          required
          disabled={profile.loading}
          helperText={profile?.error?.phone_no}
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
            to={`/user/detail/${id}`}
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
