import { useState } from "react";
import { useSelector } from "react-redux";
import { fetchWorkOrder } from "../../store/slices/workOrderSlice";
import { AppState } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import { Typography, Button, Modal, Checkbox, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import AddActivityModal from "./AddActivityModal";
import AssignUsers from "./AssignUsers";

const Detail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
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
  const handleActivityModalOpen = () => setActivityModalOpen(true);
  const handleActivityModalClose = () => setActivityModalOpen(false);



  const renderButtons = () => (
    <>
      {entityState.data?.status === "Created" &&
        entityState.data?.work_order_activities.length === 0 && (
          <>

            {

              entityState.data.work_order_type?.scheduled === false &&
              <Button
                size='small'
                onClick={() => navigate(`/work-order/${id}/add-activities`)}
                variant="contained"
                className="bg-slate-700"
                sx={{ mr: 1 }}
              >
                Add Activity
              </Button>
            }

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
              size='small'
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

      <h2>Primary Information</h2>
      <div className="rw">
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

        <div className="clmn">
          <Typography variant="h6">Status:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.status}
          </Typography>
        </div>

        {data.breakdown && (
          <div className="clmn">
            <Typography variant="h6">Breakdown Reason:</Typography>
            <Typography variant="body1" className="text-slate-500 mb-2">
              {data?.breakdown?.reason}
            </Typography>
          </div>
        )}


        {data.schedule && (
          <div className="clmn">
            <Typography variant="h6">Schedule:</Typography>
            <Typography variant="body1" className="text-slate-500 mb-2">
              {data?.schedule?.type}
            </Typography>
          </div>
        )}
      </div>


      <h2>Timeline</h2>
      <div className="rw timeline">
        <div className="clmn">

          <Typography variant="h6">Start:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {entityState?.data?.start_date}
          </Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {entityState?.data?.start_time}

          </Typography>
        </div>

        {
          entityState?.data?.end_date ?
            <div className="clmn">

              <Typography variant="h6">End:</Typography>
              <Typography variant="body1" className="text-slate-500 mb-2">
                {entityState?.data?.end_date}
              </Typography>
              <Typography variant="body1" className="text-slate-500 mb-2">
                {entityState?.data?.end_time}

              </Typography>
            </div> :
            ""}


        <div className="clmn">

          <Typography variant="h6">Total Time Required:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.total_time_required}
          </Typography>
        </div>

        {data?.total_time_taken ?
          <div className="clmn">

            <Typography variant="h6">Total Time Taken:</Typography>
            <Typography variant="body1" className="text-slate-500 mb-2">
              {data?.total_time_taken}
            </Typography>
          </div> : ""}


      </div>

      <h2>Work Details</h2>
      <div className="rw">





        {data?.assigned_users?.length > 0 && (
          <div className="clmn">
            <Typography variant="h6">Assigned Users:</Typography>
            {data?.assigned_users?.map((assigned_user) => {
              return (
                <Typography
                  variant="body1"
                  className="text-slate-500 mb-2"
                  key={assigned_user.id}
                >
                  <li className="boolean"></li> {assigned_user.username}
                </Typography>
              );
            })}
          </div>
        )}

        <div className="clmn">

          <Typography variant="h6">Spareparts Required:</Typography>
          {data?.spareparts_required?.map((sparepart) => {
            return (
              <Typography
                variant="body1"
                className="text-slate-500 mb-2"
                key={sparepart.id}
              >
                <li className="boolean"></li> {sparepart?.name}
              </Typography>
            );
          })}
        </div>
        <div className="clmn">

          <Typography variant="h6">Tools Required:</Typography>
          {data?.tools_required?.map((tool) => {
            return (
              <Typography
                variant="body1"
                className="text-slate-500 mb-2"
                key={tool.id}
              >
                <li className="boolean"></li> {tool?.name}
              </Typography>
            );
          })}
        </div>
        {data.completed_by && (
          <div className="clmn">
            <Typography variant="h6">Completed By:</Typography>
            <Typography variant="body1" className="text-slate-500 mb-2">
              {data?.completed_by?.username}
            </Typography>
          </div>
        )}
      </div>

      <div className="rw">

        <div className="clmn activities-clmn">

          <Typography variant="h6">Work Order Activities:</Typography>
          <Table sx={{ width: "100%" }} className="table">
            <TableHead>
              <TableRow>
                <TableCell >
                  <Typography noWrap>Activity Description</Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap>Value</Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap>Remark</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.work_order_activities?.map((work_order_activity) => {
                return (
                  <TableRow key={work_order_activity.id}>
                    <TableCell>{work_order_activity?.description}</TableCell>
                    <TableCell>{work_order_activity?.value ? <Typography color='success'>Checked</Typography> : <Typography color='error'>Not Checked</Typography>}</TableCell>
                    <TableCell>{work_order_activity?.remark}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>



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
