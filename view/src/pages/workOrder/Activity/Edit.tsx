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
import { fetchWorkOrderActivity, updateWorkOrderActivity } from "../../../store/slices/workOrderActivitySlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const Edit = ({ entityState, setModalOpen, handleRefresh, editId }) => {

  const activity = useSelector((state: AppState) => state.workOrderActivity.workOrderActivity);
  const [error, setError] = useState(null);
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    description: activity.data?.description || ""
  });


  const getActivity = () => {
    dispatch(fetchWorkOrderActivity(Number(editId)))
  }
  useEffect(() => {
    // Ifactivity_id changes, update formData
    getActivity()
  }, [editId]);

  useEffect(() => {

    setFormData((prev) => ({ ...prev, description: activity.data?.description || "" }));
  }, [activity])
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const id = editId.toString()
    await dispatch(updateWorkOrderActivity({ id, formData })); // Uncomment if needed
    if (!activity.error) {
      setModalOpen(false);
    }
    handleRefresh()
  };




  return (
    <Container sx={style} className="flex flex-col items-center justify-center">
      <Typography variant="h5" color='primary' className="mb-2! ">
        Edit WorkOrder Activity
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        onChange={handleChange}
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
          value={formData?.description}
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
            "Edit"
          )}
        </Button>
      </Box>
    </Container>
  );
};

export default Edit;
