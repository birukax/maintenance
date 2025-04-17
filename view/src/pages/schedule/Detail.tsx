import { useState } from "react";
import { useSelector } from "react-redux";
import { fetchSchedule } from "../../store/slices/scheduleSlice";
import { AppState } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import { Typography, Button, Modal } from "@mui/material";
import { Link } from "react-router-dom";
import CreateWorkOrder from "../../pages/schedule/CreateWorkOrder";

const Detail = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.schedule.schedule,
    fetchDetailAction: fetchSchedule,
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
      <Typography variant="h6">Work Order Type:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.work_order_type.code} - {data.work_order_type.name}
      </Typography>
      <Typography variant="h6">Activity Type:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.activity_type.code} - {data.activity_type.name}
      </Typography>
      <Typography variant="h6">Spareparts Required:</Typography>
      {data.spareparts_required.map((sparepart) => {
        return (
          <Typography
            key={sparepart.id}
            variant="body1"
            className="text-slate-500 mb-2"
          >
            {sparepart.name}
          </Typography>
        );
      })}
      <Typography variant="h6">Tools Required:</Typography>
      {data.tools_required.map((tool) => {
        return (
          <Typography
            key={tool.id}
            variant="body1"
            className="text-slate-500 mb-2"
          >
            {tool.name}
          </Typography>
        );
      })}
      <Typography variant="h6">Planned Time (hh:mm:ss):</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.planned_time}
      </Typography>
    </>
  );
  return (
    <GenericDetailPage
      titleBase="Schedule"
      id={entityState.id}
      entityState={entityState}
      renderButtons={renderButtons}
      renderDetails={renderDetails}
    />
  );
};

export default Detail;
