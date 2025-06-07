import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProfile } from "../../store/slices/profileSlice";
import { Roles } from "../../utils/choices";

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
import { AppState } from "../../store/store";
const Create = () => {
  const [countryCode,setCountryCode]=useState("+251")
  const [formData, setFormData] = useState({
    username: "",
    phone_no: "",
    email:"",
    role: "ENGINEER",
    password:""
  });
  const profile = useSelector((state:AppState)=>state.profile.profile)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comfirmpas,setComfirmPas]=useState("")
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value,type } = e.target;
    
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if(comfirmpas===formData.password){
      try {
      await dispatch(createProfile({...formData,phone_no:countryCode+formData.phone_no})).unwrap();
      toast.success("Profile created successfully");
      navigate("/profiles");
    } catch (err) {
      toast.error("Error creating Profile");
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
    }
    }else{
      toast.error("Password and Comfirm Password must be similar");
      setLoading(false);
    }
    
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Create User
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap"
      >
        <TextField
          label="Username"
          name="username"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.username}
          onChange={handleChange}
          required
          disabled={loading}
          helperText={profile?.error?.username}
        />

        <FormControl fullWidth className="mb-8" disabled={loading}>
  <Box display="flex" alignItems="center" gap={2}>
    {/* Country Code Selection */}
    <FormControl variant="outlined" sx={{ minWidth: 120 }}>
      <InputLabel id="country-code-label">Code</InputLabel>
      <Select
        labelId="country-code-label"
        id="country-code-select"
        name="countryCode"
        value={countryCode} // Default to +1 (US)
        onChange={(e)=>setCountryCode(e.target.value)}
        label="Code"
      >
        <MenuItem value="+251">+251 (Eth)</MenuItem>
        {/* <MenuItem value="+1">+1 (US)</MenuItem>
        <MenuItem value="+44">+44 (UK)</MenuItem>
        <MenuItem value="+91">+91 (India)</MenuItem>
        <MenuItem value="+61">+61 (Australia)</MenuItem> */}
        {/* Add more country codes as needed */}
      </Select>
    </FormControl>

    {/* Phone Number Input */}
    <TextField
      label="Phone Number"
      name="phone_no"
      variant="outlined"
      fullWidth
      value={`${formData.phone_no}`}
      onChange={handleChange}
      disabled={loading}
      type="tel"
      helperText={profile?.error?.phone_no}

    />
  </Box>
</FormControl>

        <TextField
          label="Email"
          name="email"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
          type="email"
          helperText={profile?.error?.email}

        />

        <FormControl fullWidth variant="outlined" required disabled={loading}>
                  <InputLabel id="role">Role</InputLabel>
                  <Select
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
          label="Password"
          name="password"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
          type="password"
          required
          helperText={profile?.error?.password}

        />
        <TextField
          label="Comfirm Password"
          name="comfirm_password"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={comfirmpas}
          onChange={(e)=>setComfirmPas(e.target.value)}
          disabled={loading}
          type="password"
          required
          helperText={profile?.error?.password}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          className="mt-4"
        >
          {loading ? <CircularProgress size={24} /> : "Create User"}
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
