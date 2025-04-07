import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";
import { Container, Typography, CircularProgress } from "@mui/material";

const Detail = () => {
  const [contact, setContact] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/inventory/contacts/${id}/`);
        setContact(response.data);
      } catch (err) {
        setError(err.response?.data.detail || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, [id]);
  return (
    <Container>
      <Typography variant="h4" className="mb-6 text-gray-800">
        Contact Detail
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : contact ? (
        <Typography variant="body2" className="text-gray-500">
          {contact.name}
        </Typography>
      ) : (
        error
      )}
    </Container>
  );
};

export default Detail;
