import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchLocation } from "../../store/slices/locationSlice";
import { AppState, AppDispatch } from "../../store/store";
import api from "../../utils/api";
import { Container, Button, Typography, CircularProgress } from "@mui/material";

const Detail = () => {
  const { tokens } = useSelector((state: AppState) => state.auth);
  const { location } = useSelector((state: AppState) => state.location);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (tokens && id) {
      dispatch(fetchLocation(id));
    }
  }, []);

  if (!tokens) {
    return <Typography>Please log in to view locations.</Typography>;
  }
  if (!id) {
    return <Typography>Location not found.</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" className="mb-6 text-slate-800">
        Location Detail
      </Typography>
      {location.loading ? (
        <CircularProgress />
      ) : location.data ? (
        <>
          <Button
            variant="contained"
            component={Link}
            to={`/location/edit/${location.data.id}`}
            className="bg-slate-700"
          >
            Edit
          </Button>
          <Typography variant="body2" className="text-slate-500">
            {location.data.name}
          </Typography>
        </>
      ) : (
        location.error
      )}
    </Container>
  );
};

export default Detail;
