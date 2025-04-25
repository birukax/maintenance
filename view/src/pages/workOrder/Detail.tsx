import { useState } from "react";
import { useSelector } from "react-redux";
import { fetchWorkOrder } from "../../store/slices/workOrderSlice";
import { AppState } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import { Typography, Button, Modal } from "@mui/material";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import AddActivity from "./AddActivity";
import AssignUsers from "./AssignUsers";

const Detail = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.workOrder.workOrder,
    fetchDetailAction: fetchWorkOrder,
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
  const [assignmodalOpen, setAssignModalOpen] = useState(false);
  const handleAssignModalOpen = () => setAssignModalOpen(true);
  const handleAssignModalClose = () => setAssignModalOpen(false);

  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const handleActivitdyModalOpen = () => setActivityModalOpen(true);
  const handleActivityModalClose = () => setActivityModalOpen(false);

  const renderButtons = () => (
    <>
      {entityState.data?.status === "Created" &&
        entityState.data?.work_order_activities.length === 0 && (
          <>
            <Modal
              open={activityModalOpen}
              onClose={handleActivityModalClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <AddActivity
                entityState={entityState}
                setModalOpen={setActivityModalOpen}
              />
            </Modal>
            <Button
              onClick={handleActivitdyModalOpen}
              variant="contained"
              className="bg-slate-700"
              sx={{ mr: 1 }}
            >
              Add Activity
            </Button>
          </>
        )}
      {(entityState.data?.status === "Created" ||
        entityState.data?.status === "Assigned") && (
        <>
          <Modal
            open={assignmodalOpen}
            onClose={handleAssignModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <AssignUsers
              entityState={entityState}
              setModalOpen={setAssignModalOpen}
            />
          </Modal>
          <Button
            onClick={handleAssignModalOpen}
            variant="contained"
            className="bg-slate-700"
            sx={{ mr: 1 }}
          >
            Assign User
          </Button>
        </>
      )}
      {entityState.data?.status === "Assigned" && (
        <>
          <Button
            component={Link}
            to={`/work-order/check-list/${entityState.id}`}
            variant="contained"
            sx={{ mr: 1 }}
          >
            Check-List
          </Button>
        </>
      )}
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
      <Typography variant="h6">Status:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.status}
      </Typography>
      {data.completed_by && (
        <>
          <Typography variant="h6">Completed By:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data.completed_by.username}
          </Typography>
        </>
      )}

      <Typography variant="h6">Start:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {start()}
      </Typography>
      <Typography variant="h6">End:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {end()}
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
          <Typography
            variant="body1"
            className="text-slate-500 mb-2"
            key={sparepart.id}
          >
            {sparepart.name}
          </Typography>
        );
      })}
      <Typography variant="h6">Tools Required:</Typography>
      {data.tools_required.map((tool) => {
        return (
          <Typography
            variant="body1"
            className="text-slate-500 mb-2"
            key={tool.id}
          >
            {tool.name}
          </Typography>
        );
      })}
      <Typography variant="h6">Total Time Required (H:M:S):</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.total_time_required}
      </Typography>
      <Typography variant="h6">Total Time Taken (H:M:S):</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.total_time_taken}
      </Typography>
      <Typography variant="h6">Work Order Activities:</Typography>
      {data.work_order_activities.map((work_order_activity) => {
        return (
          <Typography
            variant="body1"
            className="text-slate-500 mb-2"
            key={work_order_activity.id}
          >
            * {work_order_activity.activity.name} -{" "}
            {JSON.stringify(work_order_activity.value)}
          </Typography>
        );
      })}
      {data.assigned_users.length > 0 && (
        <>
          <Typography variant="h6">Assigned Users:</Typography>
          {data.assigned_users.map((assigned_user) => {
            return (
              <Typography
                variant="body1"
                className="text-slate-500 mb-2"
                key={assigned_user.id}
              >
                * {assigned_user.username}
              </Typography>
            );
          })}
        </>
      )}
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
