import { useState, useEffect, useMemo, Dispatch, FC, FormEvent, SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivities } from "../../store/slices/activitySlice";
import { createWorkOrderActivities } from "../../store/slices/workOrderSlice";
import { AppState, AppDispatch } from "../../store/store";
import {
  Button,
  Typography,
  Container,
  CircularProgress,
  FormControl,
  TextField,
  Box,
  Autocomplete,

} from "@mui/material";
import { toast } from "react-toastify";
import { type FormData } from '../../store/types';
import { EntityDetailState } from "../../hooks/useEntityDetail";
const style = {
  boxSizing: "border-box",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 300,
  width: "40%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface AddActivityProps {
  entityState: EntityDetailState;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

const AddActivity: FC<AddActivityProps> = ({ entityState, setModalOpen }) => {
  const id = entityState.data?.id;
  const [formData, setFormData] = useState<FormData>({
    activity_ids: [],
  });
  const workOrder = useSelector((state: AppState) => state.workOrder.workOrder)

  const { activities } = useSelector((state: AppState) => state.activity);
  const dispatch = useDispatch<AppDispatch>();
  const params = {
    no_pagination: "true",
  };
  useEffect(() => {
    dispatch(fetchActivities(params));
  }, []);

  const activityOptions = useMemo(() => {
    return Array.isArray(activities?.data)
      ? activities?.data?.filter(
        (activity) =>
          activity.activity_type?.id ===
          entityState.data?.activity_type?.id
      )
      : [];
  }, [activities.data]);

  const selectedActivities = useMemo(() => {
    return activityOptions.filter((option) =>
      formData.activity_ids.includes(option.id)
    );
  }, [formData.activity_ids, activityOptions]);


  const handleAutocompleteChange = (fieldName: string, value: any) => {
    // Extract only the IDs from the selected objects
    const selectedIds = value.map((item: FormData) => item.id);
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: selectedIds,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // await api.patch(`/inventory/items/${item.data.id}/`, formData);
      await dispatch(createWorkOrderActivities({ id, formData })).unwrap();
      toast.success("Work Order Activities created successfully");
      setModalOpen(false);
    } catch (error) {
      toast.error(workOrder.error?.error || error || "Something Went Wrong");

    }
  };

  return (
    <Container sx={style} className="flex flex-col items-center justify-center">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Add Activities
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
        sx={{ minWidth: "90%" }}
      >
        <FormControl fullWidth variant="outlined" disabled={entityState.loading}>
          <Autocomplete
            multiple
            options={activityOptions}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Activities"
                placeholder="Search activities..."
                helperText={workOrder.error?.activity_ids || ""}
              />
            )}
            id="activity-autocomplete"
            value={selectedActivities}
            onChange={(_event, value) =>
              handleAutocompleteChange("activity_ids", value)
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
            "Add Activity"
          )}
        </Button>
        {workOrder.error && (
          <Typography variant="body2" className="mt-4 text-red-500">
            {workOrder.error?.detail}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default AddActivity;
