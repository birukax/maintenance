import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchActivities } from "../../store/slices/activitySlice";
import { fetchWorkOrder } from "../../store/slices/workOrderSlice";

import { AppState, AppDispatch } from "../../store/store";
import {
  Button,
  Typography,
  Container,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const AddActivity = ({ entityState, setModalOpen }) => {
  const id = entityState.data.id;
  const [fields, setFields] = useState([]);
  const [inputId, setInputId] = useState(0);
  const { activities } = useSelector((state: AppState) => state.activity);
  const [error, setError] = useState(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchActivities());
  }, []);

  const handleAddField = () => {
    setFields([...fields, { id: inputId }]);
    setInputId(inputId + 1);
  };

  const handleChange = (id, value) => {
    setFields(
      fields.map((field) => (field.id === id ? { ...field, value } : field))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // await api.patch(`/inventory/items/${item.s.id}/`, fieldS);
      await dispatch(addWorkOrderActivity({ id, fields })).unwrap();
      setModalOpen(false);
    } catch (err) {
      setError(err.response?.data.detail || "Failed to receive the item.");
    }
  };
  return (
    <Container sx={style} className="flex flex-col items-center justify-center">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Add Activity
      </Typography>
      <Button
        variant="contained"
        onClick={handleAddField}
        className="bg-blue-600 hover:bg-blue-700"
      >
        Add Field
      </Button>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-4"
      >
        {fields.map((field) => (
          <FormControl
            key={field.id}
            fullWidth
            variant="outlined"
            required
            disabled={entityState.loading}
          >
            <InputLabel id={`activity-select-label-${field.id}`}>
              Activity
            </InputLabel>
            <Select
              key={field.id}
              labelId={`activity-select-label-${field.id}`}
              id={`activity-select-${field.id}`}
              name={`activity-${field.id}`}
              value={field.value || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              label="Activity"
            >
              {activities.data &&
                activities.data.map((activity) => (
                  <MenuItem key={activity.id} value={activity.id}>
                    {activity.code}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        ))}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={entityState.loading}
          className="mt-4"
        >
          {entityState.loading ? (
            <CircularProgress size={24} />
          ) : (
            "Add Activity"
          )}
        </Button>
        {error && (
          <Typography variant="body2" className="mt-4 text-red-500">
            {error.detail}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default AddActivity;
