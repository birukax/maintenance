import { useState } from "react";
import { fetchWorkOrder } from "../../store/slices/workOrderSlice";
import { AppState } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import { Typography, Button, Modal, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import AssignUsers from "./user/Assign";
import CompleteClearance from './clearance/Complete';
import { Data } from "../../store/types";
const Detail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.workOrder.workOrder,
    fetchDetailAction: fetchWorkOrder,
  });
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const handleAssignModalOpen = () => setAssignModalOpen(true);
  const handleAssignModalClose = () => setAssignModalOpen(false);

  const [clearanceModalOpen, setClearanceModalOpen] = useState(false);
  const handleClearanceModalOpen = () => setClearanceModalOpen(true);
  const handleClearanceModalClose = () => setClearanceModalOpen(false);
  const renderButtons = () => (
    <>

      {
        (entityState?.data && !['Completed', 'Checked', ''].includes(entityState.data?.status)) &&
        <>
          <Button
            size='small'
            disabled={['Completed', 'Checked', ''].includes(entityState?.data?.status)}
            onClick={() => navigate(`/work-order/${id}/manage-activities`)}
            variant="contained"
            className="bg-slate-700"
            sx={{ mr: 1 }}
          >
            Manage Activities
          </Button>

        </>

      }

      {
        (entityState?.data && ['Assigned', 'Created'].includes(entityState.data?.status)) &&
        <>
          <Modal
            open={assignModalOpen}
            onClose={handleAssignModalClose}
            aria-labelledby="assign-user-modal-title"
            aria-describedby="assign-user-modal-description"
          >
            <AssignUsers
              entityState={entityState}
              setModalOpen={setAssignModalOpen}
            />
          </Modal>
          <Button
            disabled={entityState?.data?.work_order_activities?.length === 0 ||
              !(['Assigned', 'Created'].includes(entityState?.data?.status))
            }
            size='small'
            onClick={handleAssignModalOpen}
            variant="contained"
            className="bg-slate-700"
            sx={{ mr: 1 }}
          >
            Assign User
          </Button>

        </>
      }
      {
        (entityState?.data && entityState.data?.status === 'Checked') &&
        <>
          <Modal
            open={clearanceModalOpen}
            onClose={handleClearanceModalClose}
            aria-labelledby="clearance-modal-title"
            aria-describedby="clearance-modal-description"
          >
            <CompleteClearance
              entityState={entityState}
              setModalOpen={setClearanceModalOpen}
            />
          </Modal>
          <Button
            disabled={!(entityState.data?.status === 'Checked')}
            size='small'
            onClick={handleClearanceModalOpen}
            variant="contained"
            className="bg-slate-700"
            sx={{ mr: 1 }}
          >
            WO Clearance
          </Button>
        </>
      }


      {(entityState.data && entityState.data?.status === 'Assigned') &&
        <>
          <Button
            disabled={entityState.data?.status !== "Assigned"}
            size='small'
            component={Link}
            to={`/work-order/check-list/${entityState.id}`}
            variant="contained"
            sx={{ mr: 1 }}
          >
            Checklist
          </Button>
        </>
      }

    </>
  );

  const renderDetails = (data: Data) => (
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

        {data?.breakdown?.id && (
          <div className="clmn">
            <Typography variant="h6">Breakdown Reason:</Typography>
            <Typography variant="body1" className="text-slate-500 mb-2">
              {data?.breakdown?.reason}
            </Typography>
          </div>
        )}


        {data?.schedule?.id && (
          <div className="clmn">
            <Typography variant="h6">Schedule (id):</Typography>
            <Typography variant="body1" className="text-slate-500 mb-2">
              {data?.schedule?.type} ({data?.schedule?.id})
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
            {data?.assigned_users?.map((assigned_user: Data) => {
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
          {data?.spareparts_required?.map((sparepart: Data) => {
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
          {data?.tools_required?.map((tool: Data) => {
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
        {data?.completed_by && (
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
          <Table size='small' sx={{ width: "100%" }} className="table">
            <TableHead>
              <TableRow>
                <TableCell >
                  <Typography noWrap>Activity</Typography>
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
              {data?.work_order_activities?.length > 0 ? data?.work_order_activities?.map((work_order_activity: Data) => {
                return (
                  <TableRow key={work_order_activity?.id}>
                    <TableCell>{work_order_activity?.description}</TableCell>
                    <TableCell>{work_order_activity?.value ? <Typography color='success'>Checked</Typography> : <Typography color='error'>Not Checked</Typography>}</TableCell>
                    <TableCell>{work_order_activity?.remark}</TableCell>
                  </TableRow>
                );
              })
                : <TableRow>
                  <TableCell className='border-none!'>
                    <Typography color='primary' className='ml-6! '>
                      There are no activities assigned to this work order.
                    </Typography>
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </div>
      </div>

      {data?.status === 'Completed' &&
        <div className="rw">
          <div className="clmn activities-clmn">
            <Typography variant="h6">Work Order Clearance:</Typography>
            <Table size='small' sx={{ width: "100%" }} className="table">
              <TableHead>
                <TableRow>
                  <TableCell >
                    <Typography noWrap>Clearance</Typography>
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
                {data?.work_order_clearances?.length > 0 ? data?.work_order_clearances?.map((work_order_clearance: Data) => {
                  return (
                    <TableRow key={work_order_clearance?.id}>
                      <TableCell>{work_order_clearance?.description}</TableCell>
                      <TableCell>{work_order_clearance?.value ? <Typography color='success'>Checked</Typography> : <Typography color='error'>Not Checked</Typography>}</TableCell>
                      <TableCell>{work_order_clearance?.remark}</TableCell>
                    </TableRow>
                  );
                })
                  : <TableRow>
                    <TableCell className='border-none!'>
                      <Typography color='primary' className='ml-6! '>
                        There are no clearances for this work order.
                      </Typography>
                    </TableCell>
                  </TableRow>
                }
              </TableBody>
            </Table>
          </div>
        </div>
      }


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
