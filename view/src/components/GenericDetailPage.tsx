// src/components/GenericDetailPage.tsx
import { Container, Typography, CircularProgress, Box } from "@mui/material";
import { useSelector } from "react-redux";
import { AppState } from "../store/store";

export function GenericDetailPage({
  titleBase,
  entityState,
  id,
  renderButtons,
  renderDetails,
  formDetail = false,
}) {
  const { tokens } = useSelector((state: AppState) => state.auth);

  if (!tokens) {
    return <Typography>Unauthorized</Typography>;
  }

  if (!id) {
    return <Typography>Error: ID parameter is missing.</Typography>;
  }


  return (
    <Container>
      <Typography variant="h6" color='warning' className="mb-2! uppercase tracking-tight!">
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
