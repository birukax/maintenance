import React from "react";
import { useSelector } from "react-redux";
import { fetchItem } from "../../store/slices/itemSlice";
import { AppState } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Detail = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.item.item,
    fetchDetailAction: fetchItem,
  });
  const renderButtons = () => (
    <>
      <Button
        variant="contained"
        component={Link}
        to={`/item/edit/${entityState.id}`}
        className="bg-slate-700"
      >
        Edit
      </Button>
    </>
  );

  const renderDetails = (data) => (
    <>
      {" "}
      <Typography variant="h6">ID:</Typography>
      <Typography variant="body1" className="text-slate-500">
        {data.no}
      </Typography>
      <Typography variant="h6">Name:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.name}
      </Typography>
      <Typography variant="h6">Unit of Measure:</Typography>
      <Typography variant="body1" className="text-slate-500">
        {data.uom.name}
      </Typography>
      <Typography variant="h6">Type:</Typography>
      <Typography variant="body1" className="text-slate-500">
        {data.type}
      </Typography>
      <Typography variant="h6">Category:</Typography>
      <Typography variant="body1" className="text-slate-500">
        {data.category}
      </Typography>
    </>
  );
  return (
    <GenericDetailPage
      titleBase="Item"
      id={entityState.id}
      entityState={entityState}
      renderButtons={renderButtons}
      renderDetails={renderDetails}
    />
  );
};

export default Detail;
