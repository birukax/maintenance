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
      
    </>
  );

  const renderDetails = (data) => (
    <>
    <h2>Primary Information</h2>
    <div className="rw">
      <div className="clmn">
      <Typography variant="h6">Item:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.item?.name}
      </Typography>
      
      </div>
      <div className="clmn">
      <Typography variant="h6">UoM:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data?.item?.uom?.name}
      </Typography>
      
      </div>
      <div className="clmn">
      <Typography variant="h6">Quantity:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.quantity}
      </Typography>
      </div>
    </div>

    <h2>Timeline</h2>
    <div className="rw">
      <div className="clmn">
      <Typography variant="h6">Date:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.date}
      </Typography>
      </div>
    </div>

    <h2>Details</h2>
    <div className="rw">
      
      <div className="clmn">
<Typography variant="h6">Reason:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.reason}
      </Typography>
      
      </div>
      <div className="clmn">
<Typography variant="h6">Used:</Typography>
      <Typography variant="body1" className="text-slate-500">
            {data?.used ? "Yes" : "No"}
      </Typography>
      </div>
    </div>
      
     
      
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
