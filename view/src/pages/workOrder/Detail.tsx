import React from "react";
import { useSelector } from "react-redux";
import { fetchWorkOrder } from "../../store/slices/workOrderSlice";
import { AppState } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Detail = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.workOrder.workOrder,
    fetchDetailAction: fetchWorkOrder,
  });
  const renderButtons = () => (
    <>
      <Button
        variant="contained"
        component={Link}
        to={`/work-order/edit/${entityState.id}`}
        className="bg-slate-700"
      >
        Edit
      </Button>
    </>
  );

  const renderDetails = (data) => (
    <>
      <Typography variant="h6">Machine:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.machine.code} - {data.machine.name}
      </Typography>
      <Typography variant="h6">Equipment:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.equipment.code} - {data.equipment.name}
      </Typography>
      <Typography variant="h6">Work Order Type:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.work_order_type.code} - {data.work_order_type.name}
      </Typography>
      <Typography variant="h6">Activity Type:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.activity_type.code} - {data.activity_type.name}
      </Typography>
      <Typography variant="h6">Spareparts Required:</Typography>
      {data.spareparts_required.map((sparepart) => {
        return (
          <Typography variant="body1" className="text-slate-500 mb-2">
            {sparepart.name}
          </Typography>
        );
      })}
      <Typography variant="h6">Tools Required:</Typography>
      {data.tools_required.map((tool) => {
        return (
          <Typography variant="body1" className="text-slate-500 mb-2">
            {tool.name}
          </Typography>
        );
      })}
      <Typography variant="h6">Total Time Required:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.total_time_required}
      </Typography>
    </>
  );
  return (
    <GenericDetailPage
      titleBase="Work Order Type"
      id={entityState.id}
      entityState={entityState}
      renderButtons={renderButtons}
      renderDetails={renderDetails}
    />
  );
};

export default Detail;
