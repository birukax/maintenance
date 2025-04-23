import React from "react";
import { useSelector } from "react-redux";
import { fetchWorkOrderType } from "../../store/slices/workOrderTypeSlice";
import { AppState } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Detail = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.workOrderType.workOrderType,
    fetchDetailAction: fetchWorkOrderType,
  });
  const renderButtons = () => (
    <>
      <Button
        variant="contained"
        component={Link}
        to={`/work-order-type/edit/${entityState.id}`}
        className="bg-slate-700"
      >
        Edit
      </Button>
    </>
  );

  const renderDetails = (data) => (
    <>
      <Typography variant="h6">Scheduled:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {String(data.scheduled)}
      </Typography>
      <Typography variant="h6">Breakdown:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {String(data.breakdown)}
      </Typography>
      <Typography variant="h6">Code:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.code}
      </Typography>
      <Typography variant="h6">Name:</Typography>
      <Typography variant="body1" className="text-slate-500">
        {data.name}
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
