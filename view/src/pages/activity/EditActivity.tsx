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
import { fetchActivity, updateActivity } from "../../store/slices/activitySlice";

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

const EditActivity = ({ entityState, setModalOpen,handleRefresh,editId }) => {
  
  const activity = useSelector((state: AppState) => state.activity.activity);
  const [error, setError] = useState(null);
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    description:activity.data?.description|| "" 
  });


  const getActivity= ()=>{
     dispatch(fetchActivity(Number(editId)))
  }
  useEffect(() => {
    // Ifactivity_id changes, update formData
    getActivity()
  }, [editId]);
  
  useEffect(()=>{

    setFormData((prev) => ({ ...prev,description:activity.data?.description|| "" }));
  },[activity])
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const id=editId.toString()
    await dispatch(updateActivity({id,formData})); // Uncomment if needed
    if(!activity.error){
      setModalOpen(false);
    }
    handleRefresh()
  };



  
  return (
    <Container sx={style} className="flex flex-col items-center justify-center">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Edit Activity
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        onChange={handleChange}
        className="form-gap"
      >
        <TextField
          label="Description"
          name="description"
          variant="outlined"
          fullWidth
          multiline
          minRows={3}
          value={formData?.description}
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
            "Edit"
          )}
        </Button>
      </Box>
    </Container>
  );
};

export default EditActivity;
