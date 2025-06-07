import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppState, AppDispatch } from "../../store/store";
import { createWorkOrder } from "../../store/slices/workOrderSlice";
import { fetchItems } from "../../store/slices/itemSlice";
import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Autocomplete,
  Card,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast } from "react-toastify";
import { fetchLocations } from "../../store/slices/locationSlice";
import { createTransfer } from "../../store/slices/transferSlice";
const Create = () => {
  const [formData, setFormData] = useState({
    from_location_id:null,
    to_location_id:null,
    requested_items:[]
  });
    const transfer = useSelector((state:AppState)=>state.transfer.transfer)

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { items } = useSelector((state: AppState) => state.item);
  const { locations } = useSelector((state: AppState) => state.location);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
const params = {
    no_pagination: "true",
  };
  useEffect(() => {
    dispatch(fetchLocations(params));
    dispatch(fetchItems(params));
  }, []);


 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

      try {
      await dispatch(createTransfer(formData)).unwrap();
      toast.success("Transfer created successfully");
      navigate("/transfers");
    } catch (err) {
      toast.error("Error creating Transfer");
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
    }
    

    
  };

const selectedItems=formData.requested_items.length>0?
          formData.requested_items.map(el=>{
            return items.data.filter(item=>item.id===el.item_id)
          })
          :[]

  
  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Create Transfer
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap"
      >
        <FormControl fullWidth variant="outlined" required disabled={loading}>
          <Autocomplete
            options={Array.isArray(locations.data) ? locations.data.filter(el=>el.id!==formData.to_location_id)  : []}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="From Location"
                placeholder="Search locations..."
                required
                helperText={transfer.error?.from_location_id}

              />
            )}
            id="location-select"
            value={
              Array.isArray(locations.data)
                ? locations.data.find((location) => location.id === formData.from_location_id)
                : null
            }
            onChange={(event, newValue) => {
              setFormData({ ...formData, from_location_id: newValue ? newValue.id : "" });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            disabled={loading}
          />
        </FormControl>
        <FormControl fullWidth variant="outlined" required disabled={loading}>
          <Autocomplete
            options={Array.isArray(locations.data) ? locations.data.filter(el=>el.id!==formData.from_location_id) : []}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="To Location"
                placeholder="Search locations..."
                required
                helperText={transfer.error?.to_location_id}

              />
            )}
            id="location-select"
            value={
              Array.isArray(locations.data)
                ? locations.data.find((location) => location.id === formData.to_location_id)
                : null
            }
            onChange={(event, newValue) => {
              setFormData({ ...formData, to_location_id: newValue ? newValue.id : "" });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            disabled={loading}
          />
        </FormControl>
  <FormControl fullWidth variant="outlined" disabled={loading}>
          <Autocomplete
            multiple
            options={Array.isArray(items.data)?items.data: []}
            getOptionLabel={(option) => option.name || ""}
            value={
              Array.isArray(items.data)
          ? items.data.filter((item) =>
              formData.requested_items.map(el=>el.item_id).includes(item.id)
            )
          : []
            }
            onChange={(_, newValue) => {
              setFormData({
          ...formData,
          requested_items: newValue.map((item) => {return {item_id:item.id,quantity:null}}),
              });
            }}
            renderInput={(params) => (
              <TextField
          {...params}
          variant="outlined"
          label="Requested Items"
          placeholder="Search Items..."
          helperText={transfer.error?.requested_items}
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            disabled={loading}
          />
        </FormControl>
        {
          selectedItems?.map(item=><Card key={item[0].id} sx={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:".5rem"}}>{item[0]?.name} <TextField
                variant="outlined"
                label="Qty"
                type="number"
                value={formData.requested_items.filter(el=>(el.item_id===item[0].id))[0]?.quantity}
                required
                sx={{width:"90px",padding:"0"}}
                size="small"
                inputProps={{ min: 1 }}
                onChange={(e)=>setFormData(prev=>{
                  return{
                    ...prev,
                    requested_items:[...prev.requested_items.filter(el=>{
                      if(el.item_id===item[0].id){
                        el.quantity=Number(e.target.value)
                      }
                      return el
                    })]
                  }
                })}
              /></Card>)
        }
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          className="mt-4"
        >
          {loading ? <CircularProgress size={24} /> : "Create Transfer"}
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

export default Create;
