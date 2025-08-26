import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchShelfBox,
  updateShelfBox,
} from "../../../store/slices/shelfBoxSlice";

import { AppState, AppDispatch } from "../../../store/store";
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
  const { id } = useParams();
  const shelfBox = useSelector((state: AppState) => state.shelfBox.shelfBox);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      dispatch(fetchShelfBox(id));
    }
    setFormData({
      name: shelfBox.data?.name,
    });
  }, []);

  useEffect(() => {
    setFormData({
      name: shelfBox.data?.name,
    });
  }, [shelfBox])
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // await api.patch(`/inventory/items/${item.data.id}/`, formData);
      await dispatch(updateShelfBox({ id, formData })).unwrap();
      toast.success("Shelf edited successfully");
      navigate(`/shelf-box/detail/${shelfBox.data?.id}`);
    } catch (err) {
      toast.error(shelfBox.error?.error || "Something Went Wrong");
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <div className='flex gap-4 '>
        <Typography variant="h5" color='primary' className="mb-2! ">
          Edit Shelf Box
        </Typography>
        <Typography variant="h5" color='warning' >
          {shelfBox?.data?.code}

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
          disabled={shelfBox.loading}
          helperText={shelfBox.error?.name || ""}
        />
        <div className='flex gap-4'>

          <Button
            size='small'
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={shelfBox.loading}
            className="mt-4"
          >
            {shelfBox.loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
          <Button
            component={Link}
            to={`/shelf-box/detail/${id}`}
            type='button'
            size='small'
            variant='outlined'
            fullWidth
            disabled={shelfBox.loading}

          >
            Cancel
          </Button>

        </div>
      </Box>
    </Container>
  );
};

export default Edit;
