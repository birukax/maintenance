import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchReturn } from "../../store/slices/returnSlice";
import { AppState, AppDispatch } from "../../store/store";
import api from "../../utils/api";
import { Container, Button, Typography, CircularProgress } from "@mui/material";

const Detail = () => {
  const { tokens } = useSelector((state: AppState) => state.auth);
  const { ret } = useSelector((state: AppState) => state.return.return);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (tokens && id) {
      dispatch(fetchReturn(id));
    }
  }, []);

  if (!tokens) {
    return <Typography>Please log in to view returns.</Typography>;
  }
  if (!id) {
    return <Typography>Return not found.</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" className="mb-6 text-slate-800">
        Return Detail
      </Typography>
      {ret.loading ? (
        <CircularProgress />
      ) : ret.data ? (
        <>
          <Button
            variant="contained"
            component={Link}
            to={`/return/edit/${ret.data.id}`}
            className="bg-slate-700"
          >
            Edit
          </Button>
          <Typography variant="body2" className="text-slate-500">
            {ret.data.item.name}
          </Typography>
        </>
      ) : (
        ret.error
      )}
    </Container>
  );
};

export default Detail;
