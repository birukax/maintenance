import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  useNavigate, useParams } from "react-router-dom";
import {  AppDispatch, AppState } from "../../store/store";
import { createWorkOrderActivities } from "../../store/slices/workOrderSlice";

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
  const [formData,setFormData]=useState({
    description_list:[""]
  })
    const workOrder = useSelector((state:AppState)=>state.workOrder.workOrder)
  const navigate=useNavigate()
  const {id}=useParams()
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
        toast.error(workOrder.error?.error||"Something Went Wrong");
        setError(
          err.response?.data.detail || "Failed to create work order activities."
        );
      }
    };


  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Create Work Order
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap"
      >
        {
            formData?.description_list?.map((el,index)=>{
                return <TextField
                key={index}
                  name="remark"
                  required
                  label="Activity Description"
                  sx={{width:"100%"}}
                value={el}
                  size="small"
                  helperText={workOrder.error?.remark||""}
                  onChange={(e)=>{
                    setFormData(prev=>{
                        return {
                            ...prev,
                            description_list:prev.description_list.map((item, i) => i === index ? e.target.value: item)
                        }
                    })
                  }}
                
                />
            })
        }
        
        <Button
          type="button"
          variant="contained"
          color="primary"
          sx={{width:"30px",height:"60px",padding:"0px",borderRadius:"50%"}}
          disabled={loading}
          onClick={()=>setFormData(prev=>{
            return {
                ...prev,
                description_list:[...prev.description_list,""]
            }
          })}
        >
          {loading ? <CircularProgress size={24} /> : <AddIcon sx={{fontSize:30}}/>}
        </Button>
        

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          className="mt-4"
        >
          {loading ? <CircularProgress size={24} /> : "Add Work Order Activities"}
        </Button>
         
      </Box>
    </Container>
  );
};

export default AddActivityPage;
