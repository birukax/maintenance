import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  fetchUserProfile,
  resetPassword,
} from "../../../store/slices/profileSlice";
import { AppState, AppDispatch } from "../../../store/store";
import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import { type FormData } from '../../../store/types';

const Change = () => {
  const [formData, setFormData] = useState<FormData>({
    old_password: "",
    password: ""
  });
  const profile = useSelector((state: AppState) => state.profile.profile);
  const [comfirmpas, setComfirmPas] = useState("")

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, []);



  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (comfirmpas === formData.password) {

      try {
        // await api.patch(`/inventory/items/${item.data.id}/`, formData);
        await dispatch(resetPassword({ formData })).unwrap();
        toast.success("Profile edited successfully");
        navigate(`/profile/`);
      } catch (error) {
        toast.error(profile.error?.error || error || "Something Went Wrong");
      }
    } else {
      toast.error("Password and Comfirm Password must be similar");
    }
  };


  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h5" color='primary' className="mb-2! ">
        Reset Password
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
        <TextField
          size='small'
          label="Old Password"
          name="old_password"
          variant="outlined"
          fullWidth
          value={formData.old_password}
          onChange={handleChange}
          disabled={profile.loading}
          type="password"
          required
          helperText={profile.error?.old_password || ""}
        />
        <TextField
          size='small'
          label="Password"
          name="password"
          variant="outlined"
          fullWidth
          value={formData.password}
          onChange={handleChange}
          disabled={profile.loading}
          type="password"
          required
          helperText={profile.error?.password || ""}

        />
        {/* {(profile.error?.password && Array.isArray(profile.error?.password)) &&
          profile.error?.password?.map(el => {
            return <Typography variant="body1" color="error">{el}</Typography>
          })
        } */}
        <TextField
          size='small'
          label="Comfirm Password"
          name="comfirm_password"
          variant="outlined"
          fullWidth
          value={comfirmpas}
          onChange={(e) => setComfirmPas(e.target.value)}
          disabled={profile.loading}
          type="password"
          required
        // helperText={profile.error?.password || ""}
        /><div className='flex gap-4'>

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
            to={`/profile/`}
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

export default Change;
