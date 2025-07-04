import { useState } from "react";
import { useSelector } from "react-redux";
import { fetchPurchaseRequest } from "../../store/slices/purchaseRequestSlice";
import { AppState } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import { Typography, Button, Modal } from "@mui/material";
import { Link } from "react-router-dom";
import Receive from "../../pages/purchaseRequest/Receive";

const Detail = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.purchaseRequest.purchaseRequest,
    fetchDetailAction: fetchPurchaseRequest,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const renderButtons = () => (
    <>
      {entityState.data.status == "APPROVED" && (
        <>
          <Modal
            open={modalOpen}
            onClose={handleModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Receive id={entityState.data.id} setModalOpen={setModalOpen} />
          </Modal>
          <Button
            size='small'
            onClick={handleModalOpen}
            variant="contained"
            className="bg-slate-700"
          >
            Receive
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
          <Typography variant="h6">Item:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.item?.name}
          </Typography>

        </div>
        <div className="clmn">
          <Typography variant="h6">Unit of Measure:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.item?.uom?.name}
          </Typography>

        </div>
        <div className="clmn">
          <Typography variant="h6">Priority:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data?.priority}
          </Typography>

        </div>

        <div className="clmn">
          <>
            <Typography variant="h6">Requested By:</Typography>
            <Typography variant="body1" className="text-slate-500">
              {data?.requested_by?.username}
            </Typography>
          </>


        </div>
        <div className="clmn">
          <Typography variant="h6">Status:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data?.status}
          </Typography>
        </div>
        <div className="clmn">
          <Typography variant="h6">Approved By:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data?.approved_by?.username}
          </Typography>
        </div>
      </div>


      <h2>Timeline</h2>
      <div className="rw">
        <div className="clmn">
          <>
            <Typography variant="h6">Requested Date:</Typography>
            <Typography variant="body1" className="text-slate-500">
              {data?.requested_date}
            </Typography>
          </>


        </div>

        {data?.received_date && (<div className="clmn">

          <>
            <Typography variant="h6">Received Date:</Typography>
            <Typography variant="body1" className="text-slate-500">
              {data?.received_date}
            </Typography>
          </>

        </div>)
        }
      </div>

      <h2>Deatils</h2>
      <div className="rw">
        <div className="clmn">
          <Typography variant="h6">Requested Quantity:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data?.quantity}
          </Typography>

        </div>
        <div className="clmn">
          <Typography variant="h6">Received Quantity:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data?.received_quantity}
          </Typography>
        </div>
        {data?.location ?
          <div className="clmn">
            <Typography variant="h6">Received Location:</Typography>
            <Typography variant="body1" className="text-slate-500">
              {data?.location?.name}
            </Typography>
          </div> : ""}
        <div className="clmn">
          {data?.requested_by && (
            <>
              <Typography variant="h6">Requested By:</Typography>
              <Typography variant="body1" className="text-slate-500">
                {data?.requested_by?.username}
              </Typography>
            </>
          )}
        </div>
        <div className="clmn">
          {data?.approved_by ? (
            <>
              <Typography variant="h6">Approved By:</Typography>
              <Typography variant="body1" className="text-slate-500">
                {data?.approved_by.username}
              </Typography>
            </>
          ) :
            <Typography variant="body1" className="text-slate-500">
              Not Approved Yet
            </Typography>
          }
        </div>
      </div>






    </>
  );
  return (
    <GenericDetailPage
      titleBase="Purchase Request"
      id={entityState.id}
      entityState={entityState}
      renderButtons={renderButtons}
      renderDetails={renderDetails}
    />
  );
};

export default Detail;
