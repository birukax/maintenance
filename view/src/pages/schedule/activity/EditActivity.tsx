import { FC, useState, useEffect, ChangeEvent, FormEvent, Dispatch, SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState, AppDispatch } from "../../../store/store";
import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  Box,
} from "@mui/material";
import { fetchActivity, updateActivity } from "../../../store/slices/activitySlice";
import { type FormData } from '../../../store/types';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

interface EditActivityProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  handleRefresh: () => void;
  editId: string | number | undefined;
}

const EditActivity: FC<EditActivityProps> = ({ setModalOpen, handleRefresh, editId }) => {

  const activity = useSelector((state: AppState) => state.activity.activity);
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<FormData>({
    description: activity.data?.description || ""
  });


  const getActivity = () => {
    dispatch(fetchActivity(Number(editId)))
  }
  useEffect(() => {
    getActivity()
  }, [editId]);

  useEffect(() => {

    setFormData((prev) => ({ ...prev, description: activity.data?.description || "" }));
  }, [activity])
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editId) {

      const id = editId.toString()
      await dispatch(updateActivity({ id, formData })); // Uncomment if needed
      if (!activity.error) {
        setModalOpen(false);
      }
      handleRefresh()
    }
  };




  return (
    <Container sx={style} className="flex flex-col items-center justify-center">
      <Typography variant="h5" color='primary' className="mb-2! ">
        Edit Activity
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        // onChange={handleChange}
        className="form-gap w-full"
      >
        <TextField
          size='small'
          label="Description"
          name="description"
          variant="outlined"
          className='mb-3!'
          fullWidth
          multiline
          minRows={2}
          value={formData?.description}
          onChange={handleChange}
          required
          disabled={activity.loading}
          helperText={activity.error?.description || ""}
        />
        <Button
          size='small'
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={activity.loading}
          className="mt-4"
        >
          {activity.loading ? (
            <CircularProgress size={24} />
          ) : (
            "Edit"
          )}
        </Button>
      </Box>
    </Container>
  );
};

export default EditActivity;
