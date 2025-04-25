import { useState } from "react";
import { useSelector } from "react-redux";
import { fetchWorkOrder } from "../../store/slices/workOrderSlice";
import { AppState } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import { Typography, Button, Modal } from "@mui/material";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import AddActivity from "./AddActivity";
import AssignUsers from "./AssignUsers";

const Detail = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.workOrder.workOrder,
    fetchDetailAction: fetchWorkOrder,
  });
  const { tokens } = useSelector((state: AppState) => state.auth);
  
  const [assignmodalOpen, setAssignModalOpen] = useState(false);
  const handleAssignModalOpen = () => setAssignModalOpen(true);
  const handleAssignModalClose = () => setAssignModalOpen(false);

  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const handleActivitdyModalOpen = () => setActivityModalOpen(true);
  const handleActivityModalClose = () => setActivityModalOpen(false);
  
  const renderButtons = () => (
    <>
    {entityState.data?.assigned_users?.length<=0&&
    <>
    <Modal
      open={activityModalOpen}
      onClose={handleActivityModalClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <AddActivity entityState={entityState} setModalOpen={setActivityModalOpen} />
    </Modal>
    <Button
      onClick={handleActivitdyModalOpen}
      variant="contained"
      className="bg-slate-700"
      sx={{marginRight:".5rem"}}
    >
      Add Activity
    </Button>
    </>
  }
      
      
      <Modal
        open={assignmodalOpen}
        onClose={handleAssignModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <AssignUsers entityState={entityState} setModalOpen={setAssignModalOpen} />
      </Modal>
      <Button
        onClick={handleAssignModalOpen}
        variant="contained"
        className="bg-slate-700"
      >
        Assign User
      </Button>
    </>
  );

  const renderDetails = (data) => (
    <>
      {data.schedule && (
        <>
          <Typography variant="h6">Schedule:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data.schedule.type}
          </Typography>
        </>
      )}
      {data.breakdown && (
        <>
          <Typography variant="h6">Breakdown Reason:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data.breakdown.reason}
          </Typography>
        </>
      )}
      <Typography variant="h6">Start Date:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.start_date}
      </Typography>
      <Typography variant="h6">Start Time:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.start_time}
      </Typography>
      <Typography variant="h6">End Date:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.end_date}
      </Typography>
      <Typography variant="h6">End Time:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.end_time}
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
          <Typography variant="body1" className="text-slate-500 mb-2" key={sparepart.id}>
            {sparepart.name}
          </Typography>
        );
      })}
      <Typography variant="h6">Tools Required:</Typography>
      {data.tools_required.map((tool) => {
        return (
          <Typography variant="body1" className="text-slate-500 mb-2" key={tool.id}>
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
          <Typography variant="body1" className="text-slate-500 mb-2" key={work_order_activity.id}>
            * {work_order_activity.activity.name}
          </Typography>
        );
      })}
      <Typography variant="h6">Assigned Users:</Typography>
      {data.assigned_users.map((assigned_user) => {
        return (
          <Typography variant="body1" className="text-slate-500 mb-2" key={assigned_user.id}>
            * {assigned_user.username}
          </Typography>
        );
      })}
    </>
  );

  console.log(jwtDecode(tokens && tokens.access));
  
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
