import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchConsumption } from "../../store/slices/consumptionSlice";
import { AppState, AppDispatch } from "../../store/store";
import api from "../../utils/api";
import { Container, Button, Typography, CircularProgress } from "@mui/material";

const Detail = () => {
  const { tokens } = useSelector((state: AppState) => state.auth);
  const { consumption } = useSelector((state: AppState) => state.consumption);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (tokens && id) {
      dispatch(fetchConsumption(id));
    }
  }, []);

  if (!tokens) {
    return <Typography>Please log in to view consumptions.</Typography>;
  }
  if (!id) {
    return <Typography>Consumption not found.</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" className="mb-6 text-slate-800">
        Consumption Detail
      </Typography>
      {consumption.loading ? (
        <CircularProgress />
      ) : consumption.data ? (
        <>
          <Button
            variant="contained"
            component={Link}
            to={`/consumption/edit/${consumption.data.id}`}
            className="bg-slate-700"
          >
            Edit
          </Button>
          <Typography variant="body2" className="text-slate-500">
            {consumption.data.item.name}
          </Typography>
        </>
      ) : (
        consumption.error
      )}
    </Container>
  );
};

export default Detail;
