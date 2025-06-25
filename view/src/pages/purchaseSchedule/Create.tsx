import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppState, AppDispatch } from "../../store/store";
import { createAnnualSchedule } from "../../store/slices/purchaseScheduleSlice";
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  // FormControl,
  // InputLabel,
  // Select,
  // MenuItem,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import { fetchYears } from "../../store/slices/purchaseScheduleSlice";
const Create = () => {
  const year = new Date().getFullYear();
  const [formData, setFormData] = useState({
    year: ""
  });
  const purchase_schedule = useSelector((state: AppState) => state.purchaseSchedule.purchaseSchedule)
  const years = useSelector((state: AppState) => state.purchaseSchedule.years)
  const { tokens } = useSelector((state: AppState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const params = {
    no_pagination: "true",
  };

  useEffect(() => {
    dispatch(fetchYears(params))
  }, [])
  useEffect(() => {

    let current = years?.data;
    let plan = current[0]
    setFormData(prev => {
      return {
        ...prev,
        year: plan ? plan.no + 1 : new Date().getFullYear()
      }
    })
  }, [years?.data])


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await dispatch(createAnnualSchedule({ formData })).unwrap();
      toast.success("Purchase Schedule created successfully");
      navigate("/purchase-schedules");
    } catch (err) {
      toast.error(purchase_schedule.error?.error || "Something Went Wrong");
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container className="flex flex-col items-center justify-center min-h-full  ">
      <Typography variant="h5" color='primary' className="mb-2! ">
        Create Annual Purchase Schedule
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
        <TextField
          size='small'
          label="Year"
          name="year"
          type="number"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.year}
          helperText={purchase_schedule.error?.year}
          onChange={(e) => {
            const currentYear = years.data?.length > 0 && years.data[0]["no"] ? years.data[0]["no"] + 1 : new Date().getFullYear();
            const selectedYear = parseInt(e.target.value, 10);
            if (selectedYear >= currentYear && selectedYear <= 9999) {
              setFormData({ ...formData, year: Number(e.target.value) });
            }
          }}
          inputProps={{
            min: new Date().getFullYear(),
            step: 1,
          }}
          required
          disabled={loading}
        />

        <div className='flex gap-4 w-full'>

          <Button
            size='small'
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            className="mt-4"
          >
            {loading ? <CircularProgress size={24} /> : "Create"}
          </Button>
          <Button
            component={Link}
            to='/purchase-schedules'
            type='button'
            size='small'
            variant='outlined'
            fullWidth
            disabled={loading}

          >
            Cancel
          </Button>
        </div>
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
