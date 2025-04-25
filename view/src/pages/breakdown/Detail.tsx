import { useState } from "react";
import { useSelector } from "react-redux";
import { fetchBreakdown } from "../../store/slices/breakdownSlice";
import { AppState } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import { Typography, Button, Modal } from "@mui/material";
import dayjs from "dayjs";
import CreateWorkOrder from "../../pages/breakdown/CreateWorkOrder";
import Update from "./Update";
const Detail = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.breakdown.breakdown,
    fetchDetailAction: fetchBreakdown,
  });
  const start = () => {
    return dayjs(
      `${entityState.data.start_date}T${entityState.data.start_time}`
    ).format("YYYY/MM/DD HH:mm a");
  };
  const end = () => {
    return dayjs(
      `${entityState.data.end_date}T${entityState.data.end_time}`
    ).format("YYYY/MM/DD HH:mm a");
  };

  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const handleUpdateModalOpen = () => setUpdateModalOpen(true);
  const handleUpdateModalClose = () => setUpdateModalOpen(false);

  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const renderButtons = () => (
    <>
      {entityState.data?.status !== "FIXED" && (
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
            sx={{ mr: 1 }}
          >
            Create Work Order
          </Button>
          {entityState.data?.status === "WORK-ORDER CREATED" && (
            <>
              <Modal
                open={updateModalOpen}
                onClose={handleUpdateModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Update
                  entityState={entityState}
                  setModalOpen={setUpdateModalOpen}
                />
              </Modal>
              <Button
                onClick={handleUpdateModalOpen}
                variant="contained"
                className="bg-slate-700"
                sx={{ mr: 1 }}
              >
                Update
              </Button>
            </>
          )}
        </>
      )}
    </>
  );

  const renderDetails = (data) => (
    <>
      <Typography variant="h6">Status:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.status}
      </Typography>
      <Typography variant="h6">Machine:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.machine.code} - {data.machine.name}
      </Typography>
      <Typography variant="h6">Equipment:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.equipment.code} - {data.equipment.name}
      </Typography>
      <Typography variant="h6">Start:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {start()}
      </Typography>
      {data.end_date && (
        <>
          <Typography variant="h6">End:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {end()}
          </Typography>
        </>
      )}
      <Typography variant="h6">Reason:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.reason}
      </Typography>
      {data.remark && (
        <>
          <Typography variant="h6">Remark:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data.remark}
          </Typography>
        </>
      )}
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
