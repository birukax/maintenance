// src/components/GenericDetailPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Container, Typography, CircularProgress, Box } from "@mui/material";

export function GenericDetailPage({
  titleBase,
  entityState,
  id,
  renderButtons,
  renderDetails,
}) {
  if (!id) {
    return <Typography>Error: ID parameter is missing.</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" className="mb-6 text-slate-800">
        {titleBase} Detail
      </Typography>

      {entityState.loading && <CircularProgress />}

      {entityState.error && (
        <Typography color="error">
          {typeof entityState.error === "string"
            ? entityState.error
            : JSON.stringify(entityState.error)}
        </Typography>
      )}

      {!entityState.loading && !entityState.error && entityState.data && (
        <>
          <Box>{renderButtons()}</Box>
          <Box>{renderDetails(entityState.data)}</Box>
        </>
      )}

      {!entityState.loading && !entityState.error && !entityState.data && (
        <Typography> {titleBase} not found.</Typography>
      )}
    </Container>
  );
}
