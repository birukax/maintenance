import React from "react";
import { useSelector } from "react-redux";
import { fetchReturn } from "../../store/slices/returnSlice";
import { AppState } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Detail = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.return.return,
    fetchDetailAction: fetchReturn,
  });
  const renderButtons = () => (
    <>
      <Button
        variant="contained"
        component={Link}
        to={`/return/edit/${entityState.id}`}
        className="bg-slate-700"
      >
        Edit
      </Button>
    </>
  );

  const renderDetails = (data) => (
    <>
      <Typography variant="h6">Item:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.item.name}
      </Typography>
      <Typography variant="h6">UoM:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.item.uom.name}
      </Typography>
      <Typography variant="h6">Quantity:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.quantity}
      </Typography>
      <Typography variant="h6">Date:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.date}
      </Typography>
      <Typography variant="h6">Reason:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.reason}
      </Typography>
      <Typography variant="h6">Used:</Typography>
      <Typography variant="body1" className="text-slate-500">
        {data.used ? "Yes" : "No"}
      </Typography>
    </>
  );
  return (
    <GenericDetailPage
      titleBase="Return"
      id={entityState.id}
      entityState={entityState}
      renderButtons={renderButtons}
      renderDetails={renderDetails}
    />
  );
};

export default Detail;
