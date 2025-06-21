import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppState, AppDispatch } from "../../store/store";
import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  Box,
} from "@mui/material";
import { createActivity } from "../../store/slices/activitySlice";

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

const CreateActivity = ({ entityState, setModalOpen,handleRefresh }) => {
  const { id: schedule_id } = useParams();
  const [formData, setFormData] = useState({
    schedule_id: schedule_id || "",
    description: ""
  });
  const activity = useSelector((state: AppState) => state.activity.activity);
  const [error, setError] = useState(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // If schedule_id changes, update formData
    setFormData((prev) => ({ ...prev, schedule_id: schedule_id || "" }));
  }, [schedule_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log(e);
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    await dispatch(createActivity(formData)); // Uncomment if needed
    if(!activity.error){
      setModalOpen(false);
    }
    handleRefresh()
  };


  console.log(formData);
  
  return (
    <Container sx={style} className="flex flex-col items-center justify-center">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Create Activity
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap"
      >
        <TextField
          label="Description"
          name="description"
          variant="outlined"
          fullWidth
          multiline
          minRows={3}
          value={formData.description}
          onChange={handleChange}
          required
          disabled={activity.loading}
          helperText={activity.error?.description || ""}
        />
        <Button
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
