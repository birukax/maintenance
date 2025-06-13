import React from "react";
import { useSelector } from "react-redux";
import { fetchMachine } from "../../store/slices/machineSlice";
import { AppState } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Detail = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.machine.machine,
    fetchDetailAction: fetchMachine,
  });
  const renderButtons = () => (
    <>
      <Button
        variant="contained"
        component={Link}
        to={`/machine/edit/${entityState.id}`}
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
            {data?.code}
          </Typography>
        </div>
        <div className="clmn">
          <Typography variant="h6">Name:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.name}
          </Typography></div>
      </div>
      <div className="rw">
        <div className="clmn">
          <Typography variant="h6">Plant:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data?.area?.plant?.name}
          </Typography>
          </div>
        <div className="clmn">
          <Typography variant="h6">Area:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data?.area?.name}
          </Typography>
          </div>
      </div>


    </>
  );
  return (
    <GenericDetailPage
      titleBase="Machine"
      id={entityState.id}
      entityState={entityState}
      renderButtons={renderButtons}
      renderDetails={renderDetails}
    />
  );
};

export default Detail;
