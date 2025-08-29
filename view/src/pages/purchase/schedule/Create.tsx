import { useState, useEffect, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppState, AppDispatch } from "../../../store/store";
import { createAnnualSchedule } from "../../../store/slices/purchaseScheduleSlice";
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  Box,
} from "@mui/material";
import { type Data, type FormData } from '../../../store/types';
import { toast } from "react-toastify";
import { fetchYears } from "../../../store/slices/yearSlice";
const Create = () => {
  const [formData, setFormData] = useState<FormData>({
    year: ""
  });
  const purchaseSchedule = useSelector((state: AppState) => state.purchaseSchedule.purchaseSchedule)
  const years = useSelector((state: AppState) => state.year.years);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const params = {
    no_pagination: "true",
  };

  useEffect(() => {
    dispatch(fetchYears(params))
  }, [])
  useEffect(() => {
    const current: Data | any = years?.data;
    const plan = current[0]
    setFormData(prev => {
      return {
        ...prev,
        year: plan ? plan.no + 1 : new Date().getFullYear()
      }
    })
  }, [years?.data])


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(createAnnualSchedule({ formData })).unwrap();
      toast.success("Purchase Schedule created successfully");
      navigate("/purchase-schedules");
    } catch (error) {
      toast.error(purchaseSchedule.error?.error || error || "Something Went Wrong");
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
          helperText={purchaseSchedule.error?.year}
          onChange={(e) => {
            if (Array.isArray(years.data)) {
              const currentYear = years.data?.length > 0 && years.data[0]["no"] ? years.data[0]["no"] + 1 : new Date().getFullYear();
              const selectedYear = parseInt(e.target.value, 10);
              if (selectedYear >= currentYear && selectedYear <= 9999) {
                setFormData({ ...formData, year: Number(e.target.value) });
              }
            }
          }}
          inputProps={{
            min: new Date().getFullYear(),
            step: 1,
          }}
          required
          disabled={purchaseSchedule.loading}
        />

        <div className='flex gap-4 w-full'>

          <Button
            size='small'
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={purchaseSchedule.loading}
            className="mt-4"
          >
            {purchaseSchedule.loading ? <CircularProgress size={24} /> : "Create"}
          </Button>
          <Button
            component={Link}
            to='/purchase-schedules'
            type='button'
            size='small'
            variant='outlined'
            fullWidth
            disabled={purchaseSchedule.loading}

          >
            Cancel
          </Button>
        </div>

      </Box>
    </Container>
  );
};

export default Create;
