import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchUnitOfMeasure } from "../../store/slices/unitOfMeasureSlice";
import { AppState, AppDispatch } from "../../store/store";
import api from "../../utils/api";
import { Container, Button, Typography, CircularProgress } from "@mui/material";

const Detail = () => {
  const { tokens } = useSelector((state: AppState) => state.auth);
  const { unitOfMeasure } = useSelector(
    (state: AppState) => state.unitOfMeasure
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (tokens && id && !unitOfMeasure.data && !unitOfMeasure.loading) {
      dispatch(fetchUnitOfMeasure(id));
    }
  }, [tokens, dispatch, id]);

  if (!tokens) {
    return <Typography>Please log in to view Unit Of Measures.</Typography>;
  }
  if (!id) {
    return <Typography>Unit Of Measure not found.</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" className="mb-6 text-slate-800">
        Unit of Measure Detail
      </Typography>
      {unitOfMeasure.loading ? (
        <CircularProgress />
      ) : unitOfMeasure.data ? (
        <>
          <Button
            variant="contained"
            component={Link}
            to={`/unit-of-measure/edit/${unitOfMeasure.data.id}`}
            className="bg-slate-700"
          >
            Edit
          </Button>
          <Typography variant="body2" className="text-slate-500">
            {unitOfMeasure.data.name}
          </Typography>
        </>
      ) : (
        unitOfMeasure.error
      )}
    </Container>
  );
};

export default Detail;
