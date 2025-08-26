import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { createShelfRow } from "../../../store/slices/shelfRowSlice";
import { AppState, AppDispatch } from "../../../store/store";
import { fetchShelves } from "../../../store/slices/shelfSlice";
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
} from "@mui/material";
import { toast } from "react-toastify";
const Create = () => {
  const [formData, setFormData] = useState({
    shelf_id: "",
    code: "",
    name: "",
  });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const shelfRow = useSelector((state: AppState) => state.shelfRow.shelfRow);
  const { shelves } = useSelector((state: AppState) => state.shelf);

  const params = {
    no_pagination: "true",
  };

  useEffect(() => {
    dispatch(fetchShelves(params));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(createShelfRow(formData)).unwrap();
      toast.success("ShelfRow created successfully");
      navigate("/shelf-rows");
    } catch (err) {
      toast.error(shelfRow.error?.error || "Something Went Wrong");
    }
  };

  return (
    <Container className="flex flex-col items-center justify-center min-h-full ">
      <Typography variant="h5" color='primary' className="mb-2! ">
        Create Shelf Row
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >
        <FormControl fullWidth variant="outlined" required disabled={shelves.loading}>
          <Autocomplete size='small'
            options={Array.isArray(shelves.data) ? shelves.data : []}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Shelf"
                placeholder="Search shelves..."
                required
                helperText={shelfRow?.error?.shelf_id}
              />
            )}
            id="shelf-select"
            value={
              Array.isArray(shelves.data)
                ? shelves.data.find((shelf) => shelf.id === formData.shelf_id)
                : null
            }
            onChange={(event, newValue) => {
              setFormData({ ...formData, shelf_id: newValue ? newValue.id : "" });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            disabled={shelves.loading}
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
          disabled={shelves.loading}
          helperText={shelfRow?.error?.code}
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
          disabled={shelves.loading}
          helperText={shelfRow?.error?.name}
        />
        <div className='flex gap-4'>

          <Button
            size='small'
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={shelves.loading}
            className="mt-4"
          >
            {shelves.loading ? <CircularProgress size={24} /> : "Create"}
          </Button>
          <Button
            component={Link}
            to='/shelf-rows'
            type='button'
            size='small'
            variant='outlined'
            fullWidth
            disabled={shelves.loading}

          >
            Cancel
          </Button>
        </div>
      </Box>
    </Container>
  );
};

export default Create;
