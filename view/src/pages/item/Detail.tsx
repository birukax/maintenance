import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchItem } from "../../store/slices/itemSlice";
import { AppState, AppDispatch } from "../../store/store";
import api from "../../utils/api";
import { Container, Button, Typography, CircularProgress } from "@mui/material";

const Detail = () => {
  const { tokens } = useSelector((state: AppState) => state.auth);
  const { item } = useSelector((state: AppState) => state.item.item);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (tokens && !item.data && !item.loading) {
      dispatch(fetchItem(id));
    }
  }, [tokens, item.data, item.loading, dispatch, id]);

  if (!tokens) {
    return <Typography>Please log in to view items.</Typography>;
  }
  return (
    <Container>
      <Typography variant="h4" className="mb-6 text-gray-800">
        Item Detail
      </Typography>
      {item.loading ? (
        <CircularProgress />
      ) : item.data ? (
        <>
          <Button component={Link} to={`/item/edit/${item.data.id}`}>
            Edit Item
          </Button>
          <Typography variant="body2" className="text-gray-500">
            {item.data.name}
          </Typography>
        </>
      ) : (
        item.error
      )}
    </Container>
  );
};

export default Detail;
