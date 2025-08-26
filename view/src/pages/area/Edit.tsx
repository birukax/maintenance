import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  fetchArea,
  updateArea,
} from "../../store/slices/areaSlice";
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
    name: "",
  });
  const area = useSelector((state: AppState) => state.area.area);

  const { id } = useParams();
  const { tokens } = useSelector((state: AppState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    if (tokens && id) {
      dispatch(fetchArea(id));
    }
    setFormData({
      name: area.data?.name,
    });
  }, []);

  useEffect(() => {
    setFormData({
      name: area.data?.name,
    });
  }, [area])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // await api.patch(`/inventory/items/${item.data.id}/`, formData);
      await dispatch(updateArea({ id, formData })).unwrap();
      toast.success("Area edited successfully");
      navigate(`/area/detail/${area.data?.id}`);
    } catch (err) {
      toast.error(area.error?.error || "Something Went Wrong");
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <div className='flex gap-4 '>
        <Typography variant="h5" color='primary' className="mb-2! ">
          Edit Area
        </Typography>
        <Typography variant="h5" color='warning' >
          {area?.data?.code}

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
          disabled={area.loading}
          helperText={area.error?.name || ""}
        />
        <div className='flex gap-4'>

          <Button
            size='small'
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={area.loading}
            className="mt-4"
          >
            {area.loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
          <Button
            component={Link}
            to={`/area/detail/${id}`}
            type='button'
            size='small'
            variant='outlined'
            fullWidth
            disabled={area.loading}

          >
            Cancel
          </Button>
        </div>
      </Box>
    </Container>
  );
};

export default Edit;
