import { useState, FormEvent } from "react";
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
  Card,
} from "@mui/material";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { toast } from "react-toastify";
import AddIcon from '@mui/icons-material/Add';

const AddActivityPage = () => {
  const [formData, setFormData] = useState({
    description_list: [""]
  })
  const workOrder = useSelector((state: AppState) => state.workOrder.workOrder)
  const navigate = useNavigate()
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // await api.patch(`/inventory/items/${item.data.id}/`, formData);
      await dispatch(createWorkOrderActivities({ id, formData })).unwrap();
      toast.success("Work Order Activities created successfully");
      navigate(`/work-order/detail/${id}`)
    } catch (error) {
      toast.error(workOrder.error?.error || error || "Something Went Wrong");
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
              return <Card className="flex gap-1" elevation={0}>
                <TextField
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
                <IconButton onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    description_list: prev.description_list.filter((_, i) => i !== index)
                  }))
                }}>
                  <CloseOutlinedIcon />
                </IconButton>
              </Card>
            })
          }</>

        <IconButton
          size='small'
          type="button"
          color="primary"
          disabled={workOrder.loading}
          onClick={() => setFormData(prev => {
            return {
              ...prev,
              description_list: [...prev.description_list, ""]
            }
          })}
        >
          {workOrder.loading ? <CircularProgress size={24} /> : <AddIcon sx={{ fontSize: 30 }} />}
        </IconButton>

        <div className='flex gap-4'>

          <Button
            size='small'
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={workOrder.loading || formData.description_list?.length <= 0 || formData.description_list.some(el => el === "")}
            className="mt-4"
          >
            {workOrder.loading ? <CircularProgress size={24} /> : "Save"}
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
