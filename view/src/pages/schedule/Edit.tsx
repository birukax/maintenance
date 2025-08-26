import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchWorkOrderType,
  updateWorkOrderType,
} from "../../store/slices/workOrderTypeSlice";
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
  const { id } = useParams();
  const schedule = useSelector((state: AppState) => state.schedule.schedule)
  const { workOrderType } = useSelector(
    (state: AppState) => state.workOrderType
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(fetchWorkOrderType(id));
    }
    setFormData({
      name: workOrderType?.data?.name,
    });
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // await api.patch(`/inventory/items/${item.data.id}/`, formData);
      await dispatch(updateWorkOrderType({ id, formData })).unwrap();
      toast.success("Work Order Type edited successfully");
      navigate(`/work-order-type/detail/${workOrderType.data?.id}`);
    } catch (err) {
      toast.error(schedule.error?.error || "Something Went Wrong");
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Edit WorkOrderType
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
        <TextField
          label="Name"
          name="name"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          required
          disabled={schedule.loading}
          helperText={schedule.error?.name || ""}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={schedule.loading}
          className="mt-4"
        >
          {schedule.loading ? <CircularProgress size={24} /> : "Edit Work Order Type"}
        </Button>

      </Box>
    </Container>
  );
};

export default Edit;
