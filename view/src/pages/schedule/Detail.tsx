import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSchedule } from "../../store/slices/scheduleSlice";
import { fetchWorkOrders } from "../../store/slices/workOrderSlice";
import { AppState, AppDispatch } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import { Typography, Button, Modal, Table, TableBody, TableRow, TableCell, TableHead } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import Create from "./workOrder/Create";

const Detail = () => {
  const { id } = useParams()
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.schedule.schedule,
    fetchDetailAction: fetchSchedule,
  });
  const dispatch = useDispatch<AppDispatch>();
  const work_orders = useSelector(
    (state: AppState) => state.workOrder.workOrders
  );
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  const params = {
    no_pagination: true,
    schedule__id: id
  }


  useEffect(() => {
    dispatch(fetchWorkOrders(params))
  }, [])
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
          params={params}
        />
      </Modal>
      <div className='flex gap-2'>
        <Button
          size='small'
          onClick={handleModalOpen}
          variant="contained"
          disabled={entityState?.data?.activities?.filter((activity) => activity.active === true).length === 0}
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


      <div className="rw">
        <div className="clmn activities-clmn" style={{ maxHeight: "500px" }}>
          <Typography variant="h6">Activities:</Typography>
          <Table size='small' sx={{ width: "100%" }} className="table">
            <TableHead>
              <TableRow>
                <TableCell >
                  <Typography noWrap>ID</Typography>
                </TableCell>
                <TableCell >
                  <Typography noWrap>Description</Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap>Status</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.activities?.length > 0 ? data?.activities?.map((activity) => {
                return (
                  <TableRow key={activity?.id}>
                    <TableCell><Link to={`/work-order/detail/${activity?.id}`} type="link"> {activity?.id}</Link></TableCell>
                    <TableCell>{activity?.description}</TableCell>
                    <TableCell>{activity?.active ? 'Active' : 'Inactive'}</TableCell>
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


      <div className="rw">
        <div className="clmn activities-clmn" style={{ maxHeight: "500px" }}>
          <Typography variant="h6">Work Orders:</Typography>
          <Table size='small' sx={{ width: "100%" }} className="table">
            <TableHead>
              <TableRow>
                <TableCell >
                  <Typography noWrap>ID</Typography>
                </TableCell>
                <TableCell >
                  <Typography noWrap>Start Date</Typography>
                </TableCell>
                <TableCell >
                  <Typography noWrap>End Date</Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap>Status</Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap>Remark</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {work_orders?.data?.length > 0 ? work_orders?.data?.map((work_order) => {
                return (
                  <TableRow key={work_order?.id}>
                    <TableCell><Link to={`/work-order/detail/${work_order?.id}`} type="link"> {work_order?.id}</Link></TableCell>
                    <TableCell>{work_order?.start_date}</TableCell>
                    <TableCell>{work_order?.end_date}</TableCell>
                    <TableCell>{work_order?.status}</TableCell>
                    <TableCell>{work_order?.remark}</TableCell>
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
