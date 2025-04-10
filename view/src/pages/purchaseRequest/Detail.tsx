import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchPurchaseRequest } from "../../store/slices/purchaseRequestSlice";
import { AppState, AppDispatch } from "../../store/store";
import Receive from "../../pages/purchaseRequest/Receive";
import {
  Container,
  Button,
  Typography,
  CircularProgress,
  Modal,
} from "@mui/material";

const Detail = () => {
  const { tokens } = useSelector((state: AppState) => state.auth);

  const { purchaseRequest } = useSelector(
    (state: AppState) => state.purchaseRequest
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

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
          {purchaseRequest.data.status == "APPROVED" && (
            <>
              <Modal
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Receive id={id} setModalOpen={setModalOpen} />
              </Modal>
              <Button
                onClick={handleModalOpen}
                variant="contained"
                className="bg-slate-700"
              >
                Receive
              </Button>
            </>
          )}
          <Typography variant="body2" className="text-slate-500">
            {purchaseRequest.data.item.name}
          </Typography>
          <Typography variant="body2" className="text-slate-500">
            {purchaseRequest.data.quantity}
          </Typography>
          <Typography variant="body2" className="text-slate-500">
            {purchaseRequest.data.received_quantity}
          </Typography>
          <Typography variant="body2" className="text-slate-500">
            {purchaseRequest.data.received_date}
          </Typography>
        </>
      ) : (
        purchaseRequest.error
      )}
    </Container>
  );
};

export default Detail;
