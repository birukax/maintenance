import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchProfile,
  updateProfile,
  fetchProfiles,
} from "../../store/slices/profileSlice";
import { AppState, AppDispatch } from "../../store/store";
import api from "../../utils/api";
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
  FormHelperText,
} from "@mui/material";
import { toast } from "react-toastify";
import { Roles } from "../../utils/choices";

const Edit = () => {
  const [formData, setFormData] = useState({
    password:"",
  });
  const { id } = useParams();
  const { tokens } = useSelector((state: AppState) => state.auth);
  const profile = useSelector((state: AppState) => state.profile.profile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comfirmpas,setComfirmPas]=useState("")

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
    if(comfirmpas===formData.password){

    try {
      // await api.patch(`/inventory/items/${item.data.id}/`, formData);
      await dispatch(updateProfile({ id, formData })).unwrap();
      toast.success("Profile edited successfully");
      navigate(`/profile/${id}`);
    } catch (err) {
      toast.error(profile.error?.error||"Something Went Wrong");
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
    }}else{
      toast.error("Password and Comfirm Password must be similar");
      setLoading(false);
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Reset Password
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap"
      >
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
          helperText={profile.error?.password||""}
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
          helperText={profile.error?.password||""}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          className="mt-4"
        >
          {loading ? <CircularProgress size={24} /> : "Edit Profile"}
        </Button>
         
      </Box>
    </Container>
  );
};

export default Edit;
