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
    role:"",
    is_active: false,
  });
  const { id } = useParams();
  const { tokens } = useSelector((state: AppState) => state.auth);
  const { profile } = useSelector((state: AppState) => state.profile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    if (tokens && id) {
      dispatch(fetchProfile(id));
    }
    setFormData({
      role: profile.data?.role,
      is_active: profile.data?.user?.is_active,
    });
  }, []);

  useEffect(()=>{
setFormData({
      role: profile.data?.role,
      is_active: profile.data?.user?.is_active,
    });
  },[profile])
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
      await dispatch(updateProfile({ id, formData })).unwrap();
      toast.success("Profile edited successfully");
      navigate(`/profile/detail/${profile.data.id}`);
    } catch (err) {
      toast.error("Error editing Profile");
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Edit Profile
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap"
      >
         <FormControlLabel
                    labelPlacement="start"
                    label="Is Active"
                    control={
                      <Switch
                        name="is_active"
                        checked={formData.is_active}
                        onChange={(e) =>{
                          
                          if(formData.is_active===true){
                            setFormData({ ...formData, is_active: e.target.checked})
                          }else{
                            setFormData({ ...formData, is_active: e.target.checked })
                                          }                }
                          
                        }
                        disabled={loading}
                      />
                    }
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
        {error && (
          <Typography variant="body2" className="mt-4 text-red-500">
            {error}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Edit;
