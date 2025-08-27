import { FC, useState, FormEvent, Dispatch, SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";
import { approvePurchaseApproval, rejectPurchaseApproval, fetchPurchaseApproval } from "../../../store/slices/purchaseApprovalSlice";
import { AppState, AppDispatch } from "../../../store/store";
import {
  Button,
  Typography,
  Container,
  CircularProgress,
  TextField,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import { type Data, type FormData } from '../../../store/types';
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

interface ActionProps {
  entityState: Data,
  setModalOpen: Dispatch<SetStateAction<boolean>>
}

const Action: FC<ActionProps> = ({ entityState, setModalOpen }) => {
  const id = entityState.data.id;
  const [action, setAction] = useState('');
  const [formData, setFormData] = useState<FormData>({
    remark: ''
  });
  const { purchaseApproval } = useSelector((state: AppState) => state.purchaseApproval);

  const dispatch = useDispatch<AppDispatch>();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (action === 'approve') {

        await dispatch(approvePurchaseApproval({ id, formData })).unwrap();
      }
      if (action === 'reject') {
        await dispatch(rejectPurchaseApproval({ id, formData })).unwrap();
      }
      await dispatch(fetchPurchaseApproval(id)).unwrap();
      setModalOpen(false);
      toast.success("Action completed successfully.");
    } catch (error) {
      toast.error(purchaseApproval.error?.error || error || "Something Went Wrong");

    }
  };
  return (
    <Container sx={style} className="flex flex-col items-center justify-center">
      <Typography variant="h5" color='primary' className="mb-2!">
        Approval Actions
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
      >

        <TextField
          size='small'
          multiline
          label="Remark"
          name="remark"
          className="mb-8"
          variant="outlined"
          fullWidth
          value={formData.remark}
          onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
          required
          disabled={purchaseApproval.loading}
          helperText={purchaseApproval?.error?.remark}
        />

        <div className='flex gap-4'>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => setAction('approve')}
            disabled={purchaseApproval.loading}
            className="mt-4"
          >
            {purchaseApproval.loading ? (
              <CircularProgress size={24} />
            ) : (
              "Approve"
            )}
          </Button>
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            fullWidth
            onClick={() => setAction('reject')}
            disabled={purchaseApproval.loading}
            className="mt-4"
          >
            {purchaseApproval.loading ? (
              <CircularProgress size={24} />
            ) : (
              "Reject"
            )}
          </Button></div>

      </Box>
    </Container>
  );
};

export default Action;
