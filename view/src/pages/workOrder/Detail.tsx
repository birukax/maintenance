import { useState } from "react";
import { useSelector } from "react-redux";
import { fetchWorkOrder } from "../../store/slices/workOrderSlice";
import { AppState } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import { Typography, Button, Modal } from "@mui/material";
import { Link } from "react-router-dom";
import AddActivity from "./AddActivity";

const Detail = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.workOrder.workOrder,
    fetchDetailAction: fetchWorkOrder,
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
        <AddActivity entityState={entityState} setModalOpen={setModalOpen} />
      </Modal>
      <Button
        onClick={handleModalOpen}
        variant="contained"
        className="bg-slate-700"
      >
        Add Activity
      </Button>
    </>
  );

  const renderDetails = (data) => (
    <>
      {data.schedule && (
        <>
          <Typography variant="h6">Schedule:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data.schedule.id}
          </Typography>
        </>
      )}
      <Typography variant="h6">Date:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.date}
      </Typography>
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
          <Typography variant="body1" className="text-slate-500 mb-2">
            {sparepart.name}
          </Typography>
        );
      })}
      <Typography variant="h6">Tools Required:</Typography>
      {data.tools_required.map((tool) => {
        return (
          <Typography variant="body1" className="text-slate-500 mb-2">
            {tool.name}
          </Typography>
        );
      })}
      <Typography variant="h6">Total Time Required (hh:mm:ss):</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.total_time_required}
      </Typography>
      <Typography variant="h6">Work Order Activities:</Typography>
      {data.work_order_activities.map((work_order_activity) => {
        return (
          <Typography variant="body1" className="text-slate-500 mb-2">
            * {work_order_activity.activity.name}
          </Typography>
        );
      })}
    </>
  );
  return (
    <GenericDetailPage
      titleBase="Work Order"
      id={entityState.id}
      entityState={entityState}
      renderButtons={renderButtons}
      renderDetails={renderDetails}
    />
  );
};

export default Detail;
