import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createShelfBox } from "../../../store/slices/shelfBoxSlice";
import { AppState, AppDispatch } from "../../../store/store";
import { fetchShelfRows } from "../../../store/slices/shelfRowSlice";
import { Link } from "react-router-dom";

import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  FormControl,
  Box,
  Autocomplete,
} from "@mui/material";
import { toast } from "react-toastify";
import { type FormData } from '../../../store/types';

const Create = () => {
  const [formData, setFormData] = useState<FormData>({
    row_id: "",
    code: "",
    name: "",
  });
  const shelfBox = useSelector((state: AppState) => state.shelfBox.shelfBox);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { shelfRows } = useSelector((state: AppState) => state.shelfRow);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(createShelfBox(formData)).unwrap();
      toast.success("ShelfBox created successfully");
      navigate("/shelf-boxes");
    } catch (error) {
      toast.error(shelfBox.error?.error || error || "Something Went Wrong");
    }
  };
  useEffect(() => {
    const params = {
      no_pagination: "true",
    };
    dispatch(fetchShelfRows(params));
  }, []);

  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h5" color='primary' className="mb-2! ">
        Create Shelf Box
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
        <FormControl fullWidth variant="outlined" required disabled={shelfBox.loading}>
          <Autocomplete size='small'
            options={Array.isArray(shelfRows.data) ? shelfRows.data : []}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Shelf Row"
                placeholder="Search shelf rows..."
                required
                helperText={shelfBox?.error?.row_id}
              />
            )}
            id="shelf-row-select"
            value={
              Array.isArray(shelfRows.data)
                ? shelfRows.data.find((row) => row.id === formData.row_id)
                : null
            }
            onChange={(_event, newValue) => {
              setFormData({ ...formData, row_id: newValue ? newValue.id : "" });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            disabled={shelfBox.loading}
          />
        </FormControl>
        <TextField
          size='small'
          label="Code"
          name="code"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.code}
          onChange={handleChange}
          required
          disabled={shelfBox.loading}
          helperText={shelfBox?.error?.code}
        />

        <TextField
          size='small'
          label="Name"
          name="name"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          required
          disabled={shelfBox.loading}
          helperText={shelfBox?.error?.name}

        />
        <div className='flex gap-4'>

          <Button
            size='small'
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={shelfBox.loading}
            className="mt-4"
          >
            {shelfBox.loading ? <CircularProgress size={24} /> : "Create"}
          </Button>
          <Button
            component={Link}
            to='/shelf-boxes'
            type='button'
            size='small'
            variant='outlined'
            fullWidth
            disabled={shelfBox.loading}

          >
            Cancel
          </Button>
        </div>
      </Box>
    </Container>
  );
};

export default Create;
