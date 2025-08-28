import { useState, useEffect, Dispatch, FC, FormEvent, SetStateAction } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { completeWorkOrder } from '../../../store/slices/workOrderSlice';
import Row from './Rows';
import {
  Button,
  Typography,
  Container,
  CircularProgress,
  Box,
  Table,

} from "@mui/material";
import { toast } from "react-toastify";
import { EntityDetailState } from "../../../hooks/useEntityDetail";
import { type Data, type FormData } from '../../../store/types';

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

interface CompleteClearanceProps {
  entityState: EntityDetailState;
  setModalOpen: Dispatch<SetStateAction<boolean>>
}
const CompleteClearance: FC<CompleteClearanceProps> = ({ entityState, setModalOpen }) => {
  const id = entityState.data?.id;
  const [formData, setFormData] = useState<FormData>({
    work_order_clearances: [{}]
  });

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (entityState?.data?.work_order_clearances) {
      setFormData({
        work_order_clearances: entityState.data?.work_order_clearances?.map((wo_clearance: FormData) => ({
          id: wo_clearance.id,
          description: wo_clearance.description,
          value: wo_clearance.value,
          remark: wo_clearance.remark || "",
        }))
      });
    }

  }, [entityState?.data?.work_order_clearances])

  const handleRowChange = (id: string | number, field: string, fieldValue: string | boolean | null) => {
    setFormData(prev => ({
      work_order_clearances: prev.work_order_clearances.map((clearance: FormData) =>
        clearance?.id === id
          ? { ...clearance, [field]: fieldValue }
          : clearance
      )
    }));
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    console.log(formData)
    e.preventDefault();
    try {
      await dispatch(completeWorkOrder({ id, formData })).unwrap();
      toast.success("Work Order Completed successfully");
      setModalOpen(false);
    } catch (error) {
      toast.error(entityState?.error?.error || error || "Something Went Wrong");

    }
  };

  return (
    <Container sx={style} className="flex flex-col items-center justify-center">
      <Typography variant="h5" color='primary' className="mb-2! ">
        Complete Clearance
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="form-gap w-full"
        sx={{ minWidth: "100%" }}
      >
        <Table size='small' sx={{ width: '100%' }}>
          {formData.work_order_clearances &&
            formData.work_order_clearances?.map((wo_clearance: Data) => (
              <Row
                key={wo_clearance.id}
                row={wo_clearance}
                formData={formData}
                onRowChange={handleRowChange}
              />
            ))
          }

        </Table>


        <Button
          size='small'
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
            "Complete"
          )}
        </Button>
        {entityState?.error && (
          <Typography variant="body2" className="mt-4 text-red-500">
            {entityState?.error?.detail}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default CompleteClearance;
