import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  fetchShelfRow,
  updateShelfRow,
} from "../../../store/slices/shelfRowSlice";
import { AppState, AppDispatch } from "../../../store/store";
import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  Box,
} from "@mui/material";
import { type FormData } from '../../../store/types';
import { toast } from "react-toastify";
const Edit = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
  });
  const shelfRow = useSelector((state: AppState) => state.shelfRow.shelfRow);

  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      dispatch(fetchShelfRow(id));
    }
    setFormData({
      name: shelfRow.data?.name,
    });
  }, []);

  useEffect(() => {
    setFormData({
      name: shelfRow.data?.name,
    });
  }, [shelfRow])
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // await api.patch(`/inventory/items/${item.data.id}/`, formData);
      await dispatch(updateShelfRow({ id, formData })).unwrap();
      toast.success("Shelf edited successfully");
      navigate(`/shelf-row/detail/${shelfRow.data?.id}`);
    } catch (error) {
      toast.error(shelfRow.error?.error || error || "Something Went Wrong");
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full">
      <div className='flex gap-4 '>
        <Typography variant="h5" color='primary' className="mb-2! ">
          Edit Shelf Row
        </Typography>
        <Typography variant="h5" color='warning' >
          {shelfRow?.data?.code}

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
          disabled={shelfRow.loading}
          helperText={shelfRow.error?.name || ""}
        />
        <div className='flex gap-4'>

          <Button
            size='small'
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={shelfRow.loading}
            className="mt-4"
          >
            {shelfRow.loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
          <Button
            component={Link}
            to={`/shelf-row/detail/${id}`}
            type='button'
            size='small'
            variant='outlined'
            fullWidth
            disabled={shelfRow.loading}

          >
            Cancel
          </Button>

        </div>
      </Box>
    </Container>
  );
};

export default Edit;
