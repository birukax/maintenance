import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppState, AppDispatch } from "../../../store/store";
import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  Box,
} from "@mui/material";
import { createWorkOrderActivity } from "../../../store/slices/workOrderActivitySlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const CreateActivity = ({ entityState, setModalOpen, handleRefresh }) => {
  const { id: work_order_id } = useParams();
  const [formData, setFormData] = useState({
    work_order_id: work_order_id || "",
    description: "",
  });
  const activity = useSelector((state: AppState) => state.activity.activity);
  const [error, setError] = useState(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // If work_order_id changes, update formData
    setFormData((prev) => ({ ...prev, work_order_id: work_order_id || "" }));
  }, [work_order_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    await dispatch(createWorkOrderActivity(formData)); // Uncomment if needed
    if (!activity.error) {
      setModalOpen(false);
    }
    handleRefresh()
  };



  return (
    <Container sx={style} className="flex flex-col items-center justify-center">
      <Typography variant="h5" color='primary' className="mb-2! ">
        Create WorkOrder Activity
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
        <TextField
          size='small'
          label="Description"
          name="description"
          variant="outlined"
          className='mb-3!'
          fullWidth
          multiline
          minRows={2}
          value={formData.description}
          onChange={handleChange}
          required
          disabled={activity.loading}
          helperText={activity.error?.description || ""}
        />
        <Button
          size='small'
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={activity.loading}
          className="mt-4"
        >
          {activity.loading ? (
            <CircularProgress size={24} />
          ) : (
            "Create"
          )}
        </Button>
      </Box>
    </Container>
  );
};

export default CreateActivity;
