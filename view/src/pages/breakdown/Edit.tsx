import { useState, useEffect, ChangeEvent, FormEvent } from "react";
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
import { type FormData } from '../../store/types';
import { toast } from "react-toastify";
const Edit = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
  });
  const breakdown = useSelector((state: AppState) => state.breakdown.breakdown);
  const { id } = useParams();
  const { tokens } = useSelector((state: AppState) => state.auth);
  const { workOrderType } = useSelector(
    (state: AppState) => state.workOrderType
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    if (tokens && id) {
      dispatch(fetchWorkOrderType(id));
    }
    setFormData({
      name: workOrderType.data?.name,
    });
  }, []);

  useEffect(() => {
    setFormData({
      name: workOrderType.data?.name,
    });
  }, [workOrderType])

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
    } catch (error) {
      toast.error(breakdown.error?.error || error || "Something Went Wrong");
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
          value={formData?.name}
          onChange={handleChange}
          required
          disabled={breakdown.loading}
          helperText={breakdown.error?.name || ""}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={breakdown.loading}
          className="mt-4"
        >
          {breakdown.loading ? <CircularProgress size={24} /> : "Edit Work Order Type"}
        </Button>
      </Box>
    </Container>
  );
};

export default Edit;
