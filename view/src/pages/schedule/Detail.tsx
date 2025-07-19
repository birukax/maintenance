import { useState } from "react";
import { useSelector } from "react-redux";
import { fetchSchedule } from "../../store/slices/scheduleSlice";
import { AppState } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import { Typography, Button, Modal } from "@mui/material";
import { Link } from "react-router-dom";
import Create from "./workOrder/Create";

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
        <Create
          entityState={entityState}
          setModalOpen={setModalOpen}
        />
      </Modal>
      <div className='flex gap-2'>
        <Button
          size='small'
          onClick={handleModalOpen}
          variant="contained"
        >
          Create Work Order
        </Button>
        <Button
          size='small'
          component={Link}
          to={`/activities/${entityState.id}`}
          variant="contained"
        >
          Manage Activities
        </Button>
      </div>
    </>
  );

  const renderDetails = (data) => (
    <>
      <h2>Primary Information</h2>
      <div className="rw">
        <div className="clmn">
          <Typography variant="h6">Schedule Type:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.type}
          </Typography>
        </div>
        <div className="clmn">
          <Typography variant="h6">Machine:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.machine?.code} - {data?.machine?.name}
          </Typography>
        </div>
        <div className="clmn">
          <Typography variant="h6">Equipment:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.equipment?.code} - {data?.equipment?.name}
          </Typography>
        </div>
        <div className="clmn">
          <Typography variant="h6">Work Order Type:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.work_order_type?.code} - {data?.work_order_type?.name}
          </Typography>
        </div>
        <div className="clmn">
          <Typography variant="h6">Activity Type:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.activity_type?.code} - {data?.activity_type?.name}
          </Typography>
        </div>
      </div>

      <h2>Timeline</h2>

      <div className="rw">
        <div className="clmn">
          <Typography variant="h6">Planned Time:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.planned_time}
          </Typography>
        </div>
      </div>
      <h2>Details</h2>
      <div className="rw">
        <div className="clmn">
          <Typography variant="h6">Spareparts Required:</Typography>
          {data?.spareparts_required?.map((sparepart) => {
            return (
              <Typography
                key={sparepart.id}
                variant="body1"
                className="text-slate-500 mb-2"
              >
                <li className="boolean"></li> {sparepart.name}
              </Typography>
            );
          })}
        </div>
        <div className="clmn">
          <Typography variant="h6">Tools Required:</Typography>
          {data?.tools_required?.map((tool) => {
            return (
              <Typography
                key={tool.id}
                variant="body1"
                className="text-slate-500 mb-2"
              >
                <li className="boolean"></li> {tool?.name}
              </Typography>
            );
          })}
        </div>
      </div>
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
