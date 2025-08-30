import { useState } from "react";
import { fetchBreakdown } from "../../store/slices/breakdownSlice";
import { AppState } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import { Typography, Button, Modal } from "@mui/material";
import dayjs from "dayjs";
import CreateWorkOrder from "./workOrder/Create";
import Update from "./Update";
import { Data } from "../../store/types";
const Detail = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.breakdown.breakdown,
    fetchDetailAction: fetchBreakdown,
  });
  const start = () => {
    return dayjs(
      `${entityState.data?.start_date}T${entityState.data?.start_time}`
    ).format("YYYY/MM/DD HH:mm a");
  };
  const end = () => {
    return dayjs(
      `${entityState.data?.end_date}T${entityState.data?.end_time}`
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
          {entityState.data?.has_active_work_order === false &&
            (<>
              <Modal
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="create-wo-modal-title"
                aria-describedby="create-wo-modal-description"
              >
                <CreateWorkOrder
                  entityState={entityState}
                  setModalOpen={setModalOpen}
                />
              </Modal>
              <Button
                size='small'
                onClick={handleModalOpen}
                variant="contained"
                sx={{ mr: 1 }}

              >
                Create Work Order
              </Button>
            </>)
          }
          {(entityState?.data?.status === "WORK-ORDER CREATED" && entityState?.data?.has_active_work_order === false) ? (
            <>
              <Modal
                open={updateModalOpen}
                onClose={handleUpdateModalClose}
                aria-labelledby="update-breakdown-modal-title"
                aria-describedby="update-breakdown-modal-description"
              >
                <Update
                  entityState={entityState}
                  setModalOpen={setUpdateModalOpen}
                />
              </Modal>
              <Button
                size='small'
                onClick={handleUpdateModalOpen}
                variant="contained"
              >
                Update
              </Button>
            </>
          )
            : <></>
          }
        </>
      )}
    </>
  );

  const renderDetails = (data: Data) => (
    <>

      <h2>
        Primary Information
      </h2>
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
          <Typography variant="h6">Status:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.status}
          </Typography>
        </div>
      </div>

      <h2>
        Timeline
      </h2>

      <div className="rw">
        <div className="clmn">
          <Typography variant="h6">Start:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {start()}
          </Typography>
        </div>
        <div className="clmn">
          {data?.end_date && (
            <>
              <Typography variant="h6">End:</Typography>
              <Typography variant="body1" className="text-slate-500 mb-2">
                {end()}
              </Typography>
            </>
          )}
        </div>
      </div>

      <h2>Detail</h2>
      <div className="rw">
        <div className="clmn">

          <Typography variant="h6">Reason:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.reason}
          </Typography>
        </div>
        <div className="clmn">
          {data?.remark && (
            <>
              <Typography variant="h6">Remark:</Typography>
              <Typography variant="body1" className="text-slate-500 mb-2">
                {data?.remark}
              </Typography>
            </>
          )}
        </div>
      </div>


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
