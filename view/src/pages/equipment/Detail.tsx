import React from "react";
import { useSelector } from "react-redux";
import { fetchEquipment } from "../../store/slices/equipmentSlice";
import { AppState } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Detail = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.equipment.equipment,
    fetchDetailAction: fetchEquipment,
  });
  const renderButtons = () => (
    <>
      <Button
        variant="contained"
        component={Link}
        to={`/equipment/edit/${entityState.id}`}
        className="bg-slate-700"
      >
        Edit
      </Button>
    </>
  );

  const renderDetails = (data) => (
    <>
      <Typography variant="h6">Code:</Typography>
      <Typography variant="body1" className="text-slate-500">
        {data.code}
      </Typography>
      <Typography variant="h6">Name:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.name}
      </Typography>
      <Typography variant="h6">Location:</Typography>
      <Typography variant="body1" className="text-slate-500">
        {data.location.name}
      </Typography>
    </>
  );
  return (
    <GenericDetailPage
      titleBase="Equipment"
      id={entityState.id}
      entityState={entityState}
      renderButtons={renderButtons}
      renderDetails={renderDetails}
    />
  );
};

export default Detail;
