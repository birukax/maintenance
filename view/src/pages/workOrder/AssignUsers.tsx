import { useState, useEffect,useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProfiles,assignWorkOrderUsers } from "../../store/slices/profileSlice";
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
  TextField,
  Box,
  Autocomplete,

} from "@mui/material";
import { toast } from "react-toastify";
const style = {
  boxSizing: "border-box",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 300,
  width:"40%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const AssignUsers = ({ entityState, setModalOpen }) => {
  const id = entityState.data.id;
  const [formData, setFormData] = useState({
    user_ids: [],
  });
  const { profiles } = useSelector((state: AppState) => state.profile);
  const [inputs, setInputs] = useState(5);
  const [error, setError] = useState(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProfiles());
  }, []);

  const userOptions = useMemo(() => {
      return profiles.data
        ? profiles.data.filter(
          (profile) =>
            profile.role ==="ENGINEER"
        )
        : [];
    }, [profiles.data]);

    const selectedUsers = useMemo(() => {
        return userOptions.filter((option) =>
          formData.user_ids.includes(option.id)
        );
      }, [formData.user_ids, userOptions]);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  const handleAutocompleteChange = (fieldName, newValue) => {
    // Extract only the IDs from the selected objects
    const selectedIds = newValue.map((item) => item.id);
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: selectedIds,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // await api.patch(`/inventory/items/${item.data.id}/`, formData);
      await dispatch(assignWorkOrderUsers({ id, formData })).unwrap();
      toast.success("Users assigned successfully");
      setModalOpen(false);
    } catch (err) {
      toast.error("Error assigning Users");
      setError(
        err.response?.data.detail || "Failed to assign Users."
      );
    }
  };

  return (
    <Container sx={style} className="flex flex-col items-center justify-center">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Assign Users
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap"
        sx={{minWidth:"90%"}}
      >
        <FormControl fullWidth variant="outlined" disabled={entityState.loading}>
                        <Autocomplete
                          multiple
                          options={userOptions}
                          getOptionLabel={(option) => option.user.username}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              label="Users"
                              placeholder="Search users..."
                            />
                          )}
                          id="user-autocomplete"
                          value={selectedUsers}
                          onChange={(event, newValue) =>
                            handleAutocompleteChange("user_ids", newValue)
                          }
                        ></Autocomplete>
                      </FormControl>
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
            "ASsign Users"
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

export default AssignUsers;
