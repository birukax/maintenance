import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchActivityType,
  updateActivityType,
} from "../../store/slices/activityTypeSlice";
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
import { Link } from "react-router-dom";
import { FormData } from '../../store/types';
const Edit = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
  });
  const activityType = useSelector((state: AppState) => state.activityType.activityType)

  const { id } = useParams();
  const { tokens } = useSelector((state: AppState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    if (tokens && id) {
      dispatch(fetchActivityType(id));
    }
    setFormData({
      name: activityType.data?.name,
    });
  }, []);

  useEffect(() => {
    setFormData({
      name: activityType.data?.name,
    });
  }, [activityType])
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // await api.patch(`/inventory/items/${item.data.id}/`, formData);
      await dispatch(updateActivityType({ id, formData })).unwrap();
      toast.success("Activity Type edited successfully");
      navigate(`/activity-type/detail/${activityType.data?.id}`);
    } catch (error) {
      toast.error(activityType.error?.error || error || "Something Went Wrong");
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <div className='flex gap-4 '>
        <Typography variant="h5" color='primary' className="mb-2! ">
          Edit Activity Type
        </Typography>
        <Typography variant="h5" color='warning' >
          {activityType?.data?.code}

        </Typography>
      </div>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
        <TextField
          size='small'
          label="Name"
          name="name"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData?.name}
          onChange={handleChange}
          required
          disabled={activityType.loading}
          helperText={activityType.error?.name || ""}
        />
        <div className='flex gap-4'>

          <Button
            size='small'
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={activityType.loading}
            className="mt-4"
          >
            {activityType.loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
          <Button
            component={Link}
            to={`/activity-type/detail/${id}`}
            type='button'
            size='small'
            variant='outlined'
            fullWidth
            disabled={activityType.loading}

          >
            Cancel
          </Button>

        </div>
      </Box>
    </Container>
  );
};

export default Edit;
