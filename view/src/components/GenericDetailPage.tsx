// src/components/GenericDetailPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Container, Typography, CircularProgress, Box } from "@mui/material";
import { useSelector } from "react-redux";
import { AppState } from "../store/store";
import { toast } from "react-toastify";

export function GenericDetailPage({
  titleBase,
  entityState,
  id,
  renderButtons,
  renderDetails,
  formDetail=false,
}) {
  const { tokens } = useSelector((state: AppState) => state.auth);

  if (!tokens) {
    return <Typography>Unauthorized</Typography>;
  }

  if (!id) {
    return <Typography>Error: ID parameter is missing.</Typography>;
  }

  // if(entityState.error) {
  //   if(typeof(entityState.error) === "string"){
  //      toast.error(entityState.error?.response?.detail)
  //     }else{
  //       toast.error(JSON.stringify(entityState.error?.detail))
  //     }
            
  // }
  return (
    <Container>
      <Typography variant="h4" className="mb-6 text-slate-800">
        {titleBase} Detail
      </Typography>

      {(entityState.loading && !formDetail) && <CircularProgress />}

      {(!entityState.loading || formDetail) && !entityState.error && entityState.data && (
        <>
          <Box>{renderButtons()}</Box>
          <Box className="detail-container">{renderDetails(entityState.data)}</Box>
        </>
      )}

      {!entityState.loading && !entityState.error && !entityState.data && (
        <Typography> {titleBase} not found.</Typography>
      )}
    </Container>
  );
}
