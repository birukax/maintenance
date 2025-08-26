import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  fetchContact,
  updateContact,
} from "../../store/slices/contactSlice";
import { AppState, AppDispatch } from "../../store/store";
import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  Box,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { toast } from "react-toastify";
import { fetchClearance, updateClearance } from "../../store/slices/clearanceSlice";
const Edit = () => {
  const [formData, setFormData] = useState({
    active: Boolean
  });
  const clearance = useSelector((state: AppState) => state.clearance.clearance)
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      dispatch(fetchClearance(id));
    }
    setFormData({
      active: clearance?.data?.active
    });
  }, []);

  useEffect(() => {
    setFormData({
      active: clearance?.data?.active
    });
  }, [clearance])
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("changing", typeof (e.target.value), e.target.value);

    const { name, checked } = e.target;
    setFormData({ active: checked });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log("submitting");
      // await api.patch(`/inventory/items/${item.data.id}/`, formData);
      await dispatch(updateClearance({ id, formData })).unwrap();
      toast.success("Clearance edited successfully");
      navigate(`/clearance/detail/${clearance.data.id}`);
    } catch (err) {
      toast.error(clearance.error?.error || "Something Went Wrong");
    }
  };

  console.log(formData);

  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <div className='flex gap-4 '>

        <Typography variant="h5" color='primary' className="mb-4! ">
          Edit Clearance
        </Typography>
        <Typography variant="h5" color='warning' >
          {clearance?.data?.name}

        </Typography>
      </div>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
        <FormControlLabel
          labelPlacement="start"
          label="Active"
          control={
            <Switch
              size='medium'
              name="active"
              checked={formData.active}
              onChange={handleChange}
              disabled={clearance.loading}
            />
          }
        />
        <div className='flex gap-4'>

          <Button
            type="submit"
            size='small'
            variant="contained"
            color="primary"
            fullWidth
            disabled={clearance.loading}
          >
            {clearance.loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
          <Button
            component={Link}
            to={`/clearance/detail/${id}`}
            type='button'
            size='small'
            variant='outlined'
            fullWidth
            disabled={clearance.loading}

          >
            Cancel
          </Button>

        </div>
      </Box>
    </Container>
  );
};

export default Edit;
