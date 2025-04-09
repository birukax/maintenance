import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchPurchaseRequest } from "../../store/slices/purchaseRequestSlice";
import { AppState, AppDispatch } from "../../store/store";
import api from "../../utils/api";
import { Container, Button, Typography, CircularProgress } from "@mui/material";

const Detail = () => {
  const { tokens } = useSelector((state: AppState) => state.auth);
  const { purchaseRequest } = useSelector(
    (state: AppState) => state.purchaseRequest
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (tokens && id) {
      dispatch(fetchPurchaseRequest(id));
    }
  }, []);

  if (!tokens) {
    return <Typography>Please log in to view Purchase Requests.</Typography>;
  }
  if (!id) {
    return <Typography>Purchase Request not found.</Typography>;
  }
  return (
    <Container>
      <Typography variant="h4" className="mb-6 text-slate-800">
        Purchase Request Detail
      </Typography>
      {purchaseRequest.loading ? (
        <CircularProgress />
      ) : purchaseRequest.data ? (
        <>
          <Button
            variant="contained"
            component={Link}
            to={`/purchase-request/edit/${purchaseRequest.data.id}`}
            className="bg-slate-700"
          >
            Edit
          </Button>
          <Typography variant="body2" className="text-slate-500">
            {purchaseRequest.data.item.name}
          </Typography>
        </>
      ) : (
        purchaseRequest.error
      )}
    </Container>
  );
};

export default Detail;
