import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState, AppDispatch } from "../../../store/store";
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



const CompleteClearance = ({ entityState, setModalOpen }) => {
  const id = entityState.data.id;
  const [formData, setFormData] = useState({
    work_order_clearances: [{}]
  });

  const dispatch = useDispatch<AppDispatch>();
  const params = {
    no_pagination: "true",
  };

  useEffect(() => {
    if (entityState?.data?.work_order_clearances) {
      setFormData({
        work_order_clearances: entityState.data?.work_order_clearances?.map(wo_clearance => ({
          id: wo_clearance.id,
          description: wo_clearance.description,
          value: wo_clearance.value,
          remark: wo_clearance.remark || "",
        }))
      });
    }

  }, [entityState?.data?.work_order_clearances])

  const handleRowChange = (id, field, fieldValue) => {
    setFormData(prev => ({
      work_order_clearances: prev.work_order_clearances.map(clearance =>
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
    } catch (err) {
      toast.error(entityState?.error?.error || "Something Went Wrong");

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
            formData.work_order_clearances?.map((wo_clearance) => (
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
