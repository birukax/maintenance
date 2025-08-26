import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchShelf,
  updateShelf,
} from "../../store/slices/shelfSlice";
import { AppState, AppDispatch } from "../../store/store";
import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
const Edit = () => {
  const [formData, setFormData] = useState({
    name: "",
  });
  const shelf = useSelector((state: AppState) => state.shelf.shelf)
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      dispatch(fetchShelf(id));
    }
    setFormData({
      name: shelf.data?.name,
    });
  }, []);

  useEffect(() => {
    setFormData({
      name: shelf.data?.name,
    });
  }, [shelf])
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // await api.patch(`/inventory/items/${item.data.id}/`, formData);
      await dispatch(updateShelf({ id, formData })).unwrap();
      toast.success("Shelf edited successfully");
      navigate(`/shelf/detail/${shelf.data?.id}`);
    } catch (err) {
      toast.error(shelf.error?.error || "Something Went Wrong");
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <div className='flex gap-4 '>
        <Typography variant="h5" color='primary' className="mb-4! ">
          Edit Shelf
        </Typography>
        <Typography variant="h5" color='warning' >
          {shelf?.data?.code}
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
          value={formData.name}
          onChange={handleChange}
          required
          disabled={shelf.loading}
          helperText={shelf.error?.name || ""}
        />

        <div className='flex gap-4'>
          <Button
            size='small'
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={shelf.loading}
            className="mt-4"
          >
            {shelf.loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
          <Button
            component={Link}
            to={`/shelf/detail/${id}`}
            type='button'
            size='small'
            variant='outlined'
            fullWidth
            disabled={shelf.loading}

          >
            Cancel
          </Button>

        </div>
      </Box>
    </Container>
  );
};

export default Edit;
