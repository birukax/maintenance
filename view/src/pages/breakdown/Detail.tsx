import { useState } from "react";
import { useSelector } from "react-redux";
import { fetchBreakdown } from "../../store/slices/breakdownSlice";
import { AppState } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import { Typography, Button, Modal } from "@mui/material";
import { Link } from "react-router-dom";
import CreateWorkOrder from "../../pages/breakdown/CreateWorkOrder";

const Detail = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.breakdown.breakdown,
    fetchDetailAction: fetchBreakdown,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const renderButtons = () => (
    <>
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <CreateWorkOrder
          entityState={entityState}
          setModalOpen={setModalOpen}
        />
      </Modal>
      <Button
        onClick={handleModalOpen}
        variant="contained"
        className="bg-slate-700"
      >
        Create Work Order
      </Button>
    </>
  );

  const renderDetails = (data) => (
    <>
      <Typography variant="h6">Machine:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.machine.code} - {data.machine.name}
      </Typography>
      <Typography variant="h6">Equipment:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.equipment.code} - {data.equipment.name}
      </Typography>
      <Typography variant="h6">Start Date:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.start_date}
      </Typography>
      <Typography variant="h6">Start Time:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.start_time}
      </Typography>
      <Typography variant="h6">Reason:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.reason}
      </Typography>
      
    </>
  );
  return (
    <GenericDetailPage
      titleBase="Breakdown"
      id={entityState.id}
      entityState={entityState}
      renderButtons={renderButtons}
      renderDetails={renderDetails}
    />
  );
};

export default Detail;
