import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { createProfile } from "../../store/slices/profileSlice";
import { Roles } from "../../utils/choices";
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
import { AppState } from "../../store/store";
const Create = () => {
  const [countryCode, setCountryCode] = useState("+251")
  const [formData, setFormData] = useState({
    username: "",
    phone_no: "",
    email: "",
    role: "ENGINEER",
    password: ""
  });
  const profile = useSelector((state: AppState) => state.profile.profile)
  const [comfirmpas, setComfirmPas] = useState("")
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comfirmpas === formData.password) {
      setFormData({ ...formData, phone_no: countryCode + formData.phone_no })
      try {
        await dispatch(createProfile(formData)).unwrap();
        toast.success("Profile created successfully");
        navigate("/users");
      } catch (err) {
        toast.error(profile?.error?.error || "Something Went Wrong");
      }
    } else {
      toast.error("Password and Comfirm Password must be similar");
    }

  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h5" color='primary' className="mb-2! ">
        Create User
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
        <TextField
          size='small'
          label="Username"
          name="username"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.username}
          onChange={handleChange}
          required
          disabled={profile.loading}
          helperText={profile?.error?.username}
        />

        <FormControl size='small' fullWidth className="mb-8" disabled={profile.loading}>
          <Box display="flex" alignItems="center" gap={1}>
            {/* Country Code Selection */}
            <FormControl className='w-20' size='small' variant="outlined">

              <TextField value="+251" size="small" disabled />
            </FormControl>

            {/* Phone No. Input */}
            <TextField
              size='small'
              label="Phone No."
              name="phone_no"
              variant="outlined"
              fullWidth
              value={`${formData.phone_no}`}
              onChange={handleChange}
              disabled={profile.loading}
              type="tel"
              helperText={profile?.error?.phone_no}

            />
          </Box>
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
          disabled={profile.loading}
          type="email"
          helperText={profile?.error?.email}

        />

        <FormControl size='small' fullWidth variant="outlined" required disabled={profile.loading}>
          <InputLabel id="role">Role</InputLabel>
          <Select
            size='small'
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
          label="Password"
          name="password"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.password}
          onChange={handleChange}
          disabled={profile.loading}
          type="password"
          required
          helperText={profile?.error?.password}

        />
        <TextField
          size='small'
          label="Comfirm Password"
          name="comfirm_password"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={comfirmpas}
          onChange={(e) => setComfirmPas(e.target.value)}
          disabled={profile.loading}
          type="password"
          required
        // helperText={profile?.error?.password}
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
            {profile.loading ? <CircularProgress size={24} /> : "Create"}
          </Button>
          <Button
            component={Link}
            to='/users'
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

export default Create;
