import React from "react";
import { useSelector } from "react-redux";
import { fetchContact } from "../../store/slices/contactSlice";
import { AppState } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
const Detail = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.contact.contact,
    fetchDetailAction: fetchContact,
  });
  const renderButtons = () => (
    <>
      <Button
        size='small'
        variant="contained"
        component={Link}
        startIcon={<EditIcon />}
        to={`/contact/edit/${entityState.id}`}
      >
        Edit
      </Button>
    </>
  );

  const renderDetails = (data) => (
    <>
      <div className="rw">
        <div className="clmn">
          <Typography variant="h6">Name:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data.name}
          </Typography>

        </div>
        <div className="clmn">
          <Typography variant="h6">Phone No:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data.phone_no}
          </Typography>

        </div>
      </div>

      <div className="rw">
        <div className="clmn">
          <Typography variant="h6">Email:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data.email}
          </Typography>
        </div>
        <div className="clmn">
          <Typography variant="h6">address:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data.address}
          </Typography>
        </div>
      </div>

    </>
  );
  return (
    <GenericDetailPage
      titleBase="Contact"
      id={entityState.id}
      entityState={entityState}
      renderButtons={renderButtons}
      renderDetails={renderDetails}
    />
  );
};

export default Detail;
