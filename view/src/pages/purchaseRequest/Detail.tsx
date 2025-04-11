import { useState } from "react";
import { useSelector } from "react-redux";
import { fetchPurchaseRequest } from "../../store/slices/purchaseRequestSlice";
import { AppState } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import { Typography, Button, Modal } from "@mui/material";
import { Link } from "react-router-dom";
import Receive from "../../pages/purchaseRequest/Receive";

const Detail = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.purchaseRequest.purchaseRequest,
    fetchDetailAction: fetchPurchaseRequest,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const renderButtons = () => (
    <>
      {entityState.data.status == "APPROVED" && (
        <>
          <Modal
            open={modalOpen}
            onClose={handleModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Receive id={entityState.data.id} setModalOpen={setModalOpen} />
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
    </>
  );

  const renderDetails = (data) => (
    <>
      <Typography variant="h6">Item:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.item.name}
      </Typography>
      <Typography variant="h6">Unit of Measure:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.item.uom.name}
      </Typography>
      <Typography variant="h6">Priority:</Typography>
      <Typography variant="body1" className="text-slate-500">
        {data.priority}
      </Typography>
      <Typography variant="h6">Status:</Typography>
      <Typography variant="body1" className="text-slate-500">
        {data.status}
      </Typography>
      <Typography variant="h6">Requested Quantity:</Typography>
      <Typography variant="body1" className="text-slate-500">
        {data.quantity}
      </Typography>
      <Typography variant="h6">Received Quantity:</Typography>
      <Typography variant="body1" className="text-slate-500">
        {data.received_quantity}
      </Typography>
      {data.requested_by && (
        <>
          <Typography variant="h6">Requested By:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data.requested_by.username}
          </Typography>
        </>
      )}

      {data.approved_by && (
        <>
          <Typography variant="h6">Approved By:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data.approved_by.username}
          </Typography>
        </>
      )}
      {data.received_date && (
        <>
          <Typography variant="h6">Received Date:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data.received_date}
          </Typography>
        </>
      )}
    </>
  );
  return (
    <GenericDetailPage
      titleBase="Purchase Request"
      id={entityState.id}
      entityState={entityState}
      renderButtons={renderButtons}
      renderDetails={renderDetails}
    />
  );
};

export default Detail;
