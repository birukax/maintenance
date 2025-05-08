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
  FormControlLabel,
  Switch,
  Box,
} from "@mui/material";
import {toast} from "react-toastify";
const Edit = () => {
  const [formData, setFormData] = useState({
    name: "",
    scheduled: false,
    breakdown: false,
  });
  const { id } = useParams();
  const { tokens } = useSelector((state: AppState) => state.auth);
  const { workOrderType } = useSelector(
    (state: AppState) => state.workOrderType
  );
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      dispatch(fetchWorkOrderType(id)).unwrap();
    }
    setFormData({
      name: workOrderType?.data?.name,
      scheduled: workOrderType?.data?.scheduled,
      breakdown: workOrderType?.data?.breakdown,
    });
  }, []);

  useEffect(()=>{
setFormData({
      name: workOrderType?.data?.name,
      scheduled: workOrderType?.data?.scheduled,
      breakdown: workOrderType?.data?.breakdown,
    });
  },[workOrderType])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // await api.patch(`/inventory/items/${item.data.id}/`, formData);
      await dispatch(updateWorkOrderType({ id, formData })).unwrap();
      toast.success("Work Order Type edited successfully");
      navigate(`/work-order-type/detail/${workOrderType.data.id}`);
    } catch (err) {
      toast.error("Error edit Work Order Type");
      // setError(err.response?.data.detail || err.message);
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
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
        className="form-gap"
      >
         <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <FormControlLabel
            labelPlacement="start"
            label="Scheduled"
            control={
              <Switch
                name="scheduled"
                checked={formData.scheduled}
                onChange={(e) =>{
                  if(formData.breakdown===true){
                    setFormData({ ...formData, scheduled: e.target.checked ,breakdown: false})
                  }else{
                    setFormData({ ...formData, scheduled: e.target.checked })
                                  }                }
                  
                }
                disabled={loading}
              />
            }
          />
          <FormControlLabel
            labelPlacement="start"
            label="Breakdown"
            control={
              <Switch
                name="breakdown"
                checked={formData.breakdown || false}
                onChange={(e) =>{
                  if(formData.scheduled===true){
                    setFormData({ ...formData, breakdown: e.target.checked ,scheduled: false})
                  }else{
                    setFormData({ ...formData, breakdown: e.target.checked })
                  }
                }
                }
                disabled={loading}
              />
            }
          />
        </Box>
        <TextField
          label="Name"
          name="name"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          className="mt-4"
        >
          {loading ? <CircularProgress size={24} /> : "Edit Work Order Type"}
        </Button>
        {error && (
          <Typography variant="body2" className="mt-4 text-red-500">
            {error}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Edit;
