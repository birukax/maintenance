import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { AppDispatch, AppState } from "../../store/store";
import { createWorkOrderActivities } from "../../store/slices/workOrderSlice";
import IconButton from '@mui/material/IconButton';
import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  Box,
} from "@mui/material";

import { toast } from "react-toastify";
import AddIcon from '@mui/icons-material/Add';

const AddActivityPage = () => {
  const [formData, setFormData] = useState({
    description_list: [""]
  })
  const workOrder = useSelector((state: AppState) => state.workOrder.workOrder)
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // await api.patch(`/inventory/items/${item.data.id}/`, formData);
      await dispatch(createWorkOrderActivities({ id, formData })).unwrap();
      toast.success("Work Order Activities created successfully");
      navigate(`/work-order/detail/${id}`)
    } catch (err) {
      toast.error(workOrder.error?.error || "Something Went Wrong");
      setError(
        err.response?.data.detail || "Failed to create work order activities."
      );
    }
  };


  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h5" color='primary' className="mb-2! ">
        Add Work Order Activity
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
        <>
          {
            formData?.description_list?.map((el, index) => {
              return <TextField
                key={index}
                name="remark"
                required
                label="Activity Description"
                sx={{ width: "100%" }}
                value={el}
                size="small"
                helperText={workOrder.error?.remark || ""}
                onChange={(e) => {
                  setFormData(prev => {
                    return {
                      ...prev,
                      description_list: prev.description_list.map((item, i) => i === index ? e.target.value : item)
                    }
                  })
                }}

              />
            })
          }</>

        <IconButton
          size='small'
          type="button"
          color="primary"
          disabled={loading}
          onClick={() => setFormData(prev => {
            return {
              ...prev,
              description_list: [...prev.description_list, ""]
            }
          })}
        >
          {loading ? <CircularProgress size={24} /> : <AddIcon sx={{ fontSize: 30 }} />}
        </IconButton>

        <div className='flex gap-4'>

          <Button
            size='small'
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={workOrder.loading}
            className="mt-4"
          >
            {loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
          <Button
            component={Link}
            to={`/work-order/detail/${id}`}
            type='button'
            size='small'
            variant='outlined'
            fullWidth
            disabled={workOrder.loading}

          >
            Cancel
          </Button>

        </div>
      </Box>
    </Container>
  );
};

export default AddActivityPage;
