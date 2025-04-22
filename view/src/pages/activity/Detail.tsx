import React from "react";
import { useSelector } from "react-redux";
import { fetchActivity } from "../../store/slices/activitySlice";
import { AppState } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Detail = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.activity.activity,
    fetchDetailAction: fetchActivity,
  });
  const renderButtons = () => (
    <>
      <Button
        variant="contained"
        component={Link}
        to={`/activity/edit/${entityState.id}`}
        className="bg-slate-700"
      >
        Edit
      </Button>
    </>
  );

  const renderDetails = (data) => (
    <>
      <Typography variant="h6">Code:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.code}
      </Typography>
      <Typography variant="h6">Name:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.name}
      </Typography>
      <Typography variant="h6">Activity Type:</Typography>
      <Typography variant="body1" className="text-slate-500">
        {data.activity_type.code} - {data.activity_type.name}
      </Typography>
      <Typography variant="h6">Description:</Typography>
      <Typography variant="body1" className="text-slate-500">
        {data.description}
      </Typography>
    </>
  );
  return (
    <GenericDetailPage
      titleBase="Activity"
      id={entityState.id}
      entityState={entityState}
      renderButtons={renderButtons}
      renderDetails={renderDetails}
    />
  );
};

export default Detail;
