import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchMachine } from "../../store/slices/machineSlice";
import { AppState, AppDispatch } from "../../store/store";
import api from "../../utils/api";
import { Container, Button, Typography, CircularProgress } from "@mui/material";

const Detail = () => {
  const { tokens } = useSelector((state: AppState) => state.auth);
  const { machine } = useSelector((state: AppState) => state.machine);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (tokens && id) {
      dispatch(fetchMachine(id));
    }
  }, []);

  if (!tokens) {
    return <Typography>Please log in to view machines.</Typography>;
  }
  if (!id) {
    return <Typography>Machine not found.</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" className="mb-6 text-slate-800">
        Machine Detail
      </Typography>
      {machine.loading ? (
        <CircularProgress />
      ) : machine.data ? (
        <>
          <Button
            variant="contained"
            component={Link}
            to={`/machine/edit/${machine.data.id}`}
            className="bg-slate-700"
          >
            Edit
          </Button>
          <Typography variant="body2" className="text-slate-500">
            {machine.data.item.name}
          </Typography>
        </>
      ) : (
        machine.error
      )}
    </Container>
  );
};

export default Detail;
