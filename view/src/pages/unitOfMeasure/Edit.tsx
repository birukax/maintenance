import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchUnitOfMeasure,
  updateUnitOfMeasure,
} from "../../store/slices/unitOfMeasureSlice";
import { AppState, AppDispatch } from "../../store/store";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  Box,
} from "@mui/material";
import { type FormData } from '../../store/types';

const Edit = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
  });
  const { id } = useParams();
  const { unitOfMeasure } = useSelector(
    (state: AppState) => state.unitOfMeasure
  );
  const uom = useSelector((state: AppState) => state.unitOfMeasure.unitOfMeasure)

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      dispatch(fetchUnitOfMeasure(id));
    }
    setFormData({
      name: unitOfMeasure.data?.name,
    });
  }, []);

  useEffect(() => {
    setFormData({
      name: unitOfMeasure.data?.name,
    });
  }, [unitOfMeasure])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // await api.patch(`/inventory/items/${item.data.id}/`, formData);
      await dispatch(updateUnitOfMeasure({ id, formData })).unwrap();
      toast.success("Unit of Measure edited successfully");
      navigate(`/unit-of-measure/detail/${unitOfMeasure.data?.id}`);
    } catch (error) {
      toast.error(uom.error?.error || error || "Something Went Wrong");
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <div className='flex gap-4 '>
        <Typography variant="h5" color='primary' className="mb-2! ">
          Edit Unit of Measure
        </Typography>
        <Typography variant="h5" color='warning' >
          {unitOfMeasure?.data?.code}

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
          disabled={uom.loading}
          helperText={uom.error?.name || ""}
        />
        <div className='flex gap-4'>

          <Button
            size='small'
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={uom.loading}
            className="mt-4"
          >
            {uom.loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
          <Button
            component={Link}
            to={`/unit-of-measure/detail/${id}`}
            type='button'
            size='small'
            variant='outlined'
            fullWidth
            disabled={uom.loading}

          >
            Cancel
          </Button>

        </div>
      </Box>
    </Container>
  );
};

export default Edit;
