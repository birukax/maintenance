import { useState } from "react";
import { useSelector } from "react-redux";
import { fetchPurchaseRequest } from "../../../store/slices/purchaseRequestSlice";
import { AppState } from "../../../store/store";
import { useEntityDetail } from "../../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../../components/GenericDetailPage";
import { Typography, Button, Modal, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Link } from "react-router-dom";
import Receive from "./Receive";

const Detail = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.purchaseRequest.purchaseRequest,
    fetchDetailAction: fetchPurchaseRequest,
  });
  // const [modalOpen, setModalOpen] = useState(false);
  // const handleModalOpen = () => setModalOpen(true);
  // const handleModalClose = () => setModalOpen(false);

  const renderButtons = () => (
    <>
      {entityState.data.status == "APPROVED" && (
        <>
          {/* <Modal
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
          </Button> */}
          {entityState?.data && entityState?.data?.request_items?.every(el => el.remaining_quantity < 1) ? "" : <Button
            size='small'
            component={Link}
            to={`/purchase-request/${entityState.data.id}/receive`}
            variant="contained"
            sx={{ mr: 1 }}
          >
            Receive
          </Button>}
        </>
      )}
    </>
  );



  const renderDetails = (data) => (
    <>

      <h2>Primary Information</h2>
      <div className="rw">
        <div className="clmn">
          <Typography variant="h6">ID:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.id}
          </Typography>

        </div>
        <div className="clmn">
          <Typography variant="h6">Priority:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data?.priority}
          </Typography>

        </div>

      </div>

      <h2>Details</h2>
      <div className="rw">

        <div className="clmn">
          <Typography variant="h6">Requested Date:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data?.requested_date}
          </Typography>
        </div>
        <div className="clmn">
          <Typography variant="h6">Requested By:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data?.requested_by?.username}
          </Typography>
        </div>
        <div className="clmn">
          <Typography variant="h6">Approved Date:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data?.approved_date}
          </Typography>
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
        <div className="clmn">
          <Typography variant="h6">Location:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data?.location?.name}
          </Typography>
        </div>

        <div className="clmn">
          <Typography variant="h6">Status:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data?.status}
          </Typography>
        </div>

      </div>
      <div className="rw">

        <div className="clmn activities-clmn">

          <Typography variant="h6">Requested Items:</Typography>
          <Table size='small' sx={{ width: "100%" }} className="table">
            <TableHead>
              <TableRow>
                <TableCell >
                  <Typography noWrap>Item ID</Typography>
                </TableCell>
                <TableCell >
                  <Typography noWrap>Item</Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap>UoM</Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap>Requested</Typography>
                </TableCell>

                <TableCell>
                  <Typography noWrap>Received</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.request_items?.map((item) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item?.item?.no}</TableCell>
                    <TableCell>{item?.item?.name}</TableCell>
                    <TableCell>{item?.item?.uom?.code}</TableCell>
                    <TableCell>{item?.requested_quantity}</TableCell>
                    <TableCell>{item?.received_quantity}</TableCell>
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
      titleBase="Purchase Request"
      id={entityState.id}
      entityState={entityState}
      renderButtons={renderButtons}
      renderDetails={renderDetails}
    />
  );
};

export default Detail;
