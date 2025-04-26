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
    <h2>Primary Information</h2>
    <div className="rw">
      <div className="clmn">
      <Typography variant="h6">Scheduled:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {String(data.scheduled)}
      </Typography>
      
      </div>
      <div className="clmn">
      <Typography variant="h6">Breakdown:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {String(data.breakdown)}
      </Typography>
      
      </div>
    </div>

    <h2>Details</h2>
    <div className="rw">
      <div className="clmn">
      <Typography variant="h6">Code:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.code}
      </Typography>
      </div>
      <div className="clmn">

      <Typography variant="h6">Name:</Typography>
      <Typography variant="body1" className="text-slate-500">
        {data.name}
      </Typography>
      </div>
    </div>
      
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
