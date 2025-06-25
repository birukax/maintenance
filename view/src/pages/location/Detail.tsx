import React from "react";
import { useSelector } from "react-redux";
import { fetchLocation } from "../../store/slices/locationSlice";
import { AppState } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
const Detail = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.location.location,
    fetchDetailAction: fetchLocation,
  });
  const renderButtons = () => (
    <>
      <Button
        size='small'
        variant="contained"
        component={Link}
        startIcon={<EditIcon />}
        to={`/location/edit/${entityState.id}`}
        className="bg-slate-700"
      >
        Edit
      </Button>
    </>
  );

  const renderDetails = (data) => (
    <>
      <div className="rw">
        <div className="clmn">
          <Typography variant="h6">Code:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data.code}
          </Typography>
        </div>
        <div className="clmn">
          <Typography variant="h6">Name:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data.name}
          </Typography>
        </div>
      </div>


    </>
  );
  return (
    <GenericDetailPage
      titleBase="Location"
      id={entityState.id}
      entityState={entityState}
      renderButtons={renderButtons}
      renderDetails={renderDetails}
    />
  );
};

export default Detail;
