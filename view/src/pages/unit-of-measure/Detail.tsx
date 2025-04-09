import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchContact } from "../../store/slices/contactSlice";
import { AppState, AppDispatch } from "../../store/store";
import api from "../../utils/api";
import { Container, Button, Typography, CircularProgress } from "@mui/material";

const Detail = () => {
  const { tokens } = useSelector((state: AppState) => state.auth);
  const { contact } = useSelector((state: AppState) => state.contact);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (tokens && id && !contact.data && !contact.loading) {
      dispatch(fetchContact(id));
    }
  }, [tokens, dispatch, id]);

  if (!tokens) {
    return <Typography>Please log in to view contacts.</Typography>;
  }
  if (!id) {
    return <Typography>Contact not found.</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" className="mb-6 text-slate-800">
        Contact Detail
      </Typography>
      {contact.loading ? (
        <CircularProgress />
      ) : contact.data ? (
        <>
          <Button
            variant="contained"
            component={Link}
            to={`/contact/edit/${contact.data.id}`}
            className="bg-slate-700"
          >
            Edit Contact
          </Button>
          <Typography variant="body2" className="text-slate-500">
            {contact.data.name}
          </Typography>
        </>
      ) : (
        contact.error
      )}
    </Container>
  );
};

export default Detail;
