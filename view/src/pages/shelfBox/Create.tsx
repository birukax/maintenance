import { useState, useEffect } from "react";
import { useDispatch,useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import { createShelfBox } from "../../store/slices/shelfBoxSlice";
import { AppState, AppDispatch } from "../../store/store";
import { fetchShelfRows } from "../../store/slices/shelfRowSlice";

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
    row_id:"",
    code: "",
    name: "",
  });
  const shelfBox = useSelector((state:AppState)=>state.shelfBox.shelfBox)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const { shelfRows } = useSelector((state: AppState) => state.shelfRow);
  const { tokens } = useSelector((state: AppState) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await dispatch(createShelfBox(formData)).unwrap();
      toast.success("ShelfBox created successfully");
      navigate("/shelf-boxes");
    } catch (err) {
      toast.error(shelfBox.error?.error||"Something Went Wrong");
      setError(err.response?.data.detail || err.message);
    } finally {
      setLoading(false);
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
      <Typography variant="h4" className="mb-6 text-gray-800">
        Create Shelf Box
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap"
      >
        <FormControl fullWidth variant="outlined" required disabled={loading}>
          <Autocomplete
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
            onChange={(event, newValue) => {
              setFormData({ ...formData, row_id: newValue ? newValue.id : "" });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            disabled={loading}
          />
        </FormControl>
        <TextField
          label="Code"
          name="code"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.code}
          onChange={handleChange}
          required
          disabled={loading}
          helperText={shelfBox?.error?.code}
        />

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
          helperText={shelfBox?.error?.name}

        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          className="mt-4"
        >
          {loading ? <CircularProgress size={24} /> : "Create ShelfBox"}
        </Button>
         
      </Box>
    </Container>
  );
};

export default Create;
