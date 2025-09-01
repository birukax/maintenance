import { useState } from "react";
import { fetchTransfer } from "../../store/slices/transferSlice";
import { AppState } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import { Typography, Button, Modal, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { Link } from "react-router-dom";
import ReceiveModal from "./receive/Modal"
import { type Data } from '../../store/types';

const Detail = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.transfer.transfer,
    fetchDetailAction: fetchTransfer,
  });
  const [receivemodalOpen, setReceiveModalOpen] = useState(false)

  const renderButtons = () => (
    <>
      {
        entityState?.data?.status === 'APPROVED' &&
        <>
          <>
            <Modal
              open={receivemodalOpen}
              onClose={() => setReceiveModalOpen(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <ReceiveModal
                entityState={entityState}
                setReceiveModalOpen={setReceiveModalOpen}
              />
            </Modal>
          </>
          {entityState?.data && (entityState?.data?.transfer_items?.every((el: Data) => Number(el.requested_quantity) > Number(el.received_quantity))) &&
            <Button
              size='small'
              onClick={() => setReceiveModalOpen(true)}
              variant="contained"
              sx={{ mr: 1 }}
              disabled={entityState?.data && (entityState?.data?.transfer_items?.every((el: Data) => Number(el.requested_quantity) === Number(el.received_quantity)) || entityState?.data?.transfer_items?.every((el: Data) => el.shipped_quantity === 0)) ? true : false}
            >
              Receive
            </Button>}

          {entityState?.data && (entityState?.data?.transfer_items?.every((el: Data) => (el.remaining_quantity <= 0)) || entityState?.data?.transfer_items?.every((el: Data) => ((el.requested_quantity - el.shipped_quantity - el.total_shipped_quantity) <= 0))) ? <> </> : <Button
            size='small'
            component={Link}
            to={`/transfer/${entityState.data.id}/ship`}
            variant="contained"
            sx={{ mr: 1 }}
          >
            Ship
          </Button>}
        </>
      }
    </>
  );



  const renderDetails = (data: Data) => (
    <>

      <h2>Primary Information</h2>
      <div className="rw">
        <div className="clmn">
          <Typography variant="h6">Requested Date:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.requested_date}
          </Typography>
        </div>
        <div className="clmn">
          <Typography variant="h6">Requested By:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.requested_by?.username}
          </Typography>
        </div>

        <div className="clmn">
          <Typography variant="h6">Transfer Location:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.from_location?.name} - {data?.to_location?.name}
          </Typography>
        </div>


        <div className="clmn">
          <Typography variant="h6">Status:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.status}
          </Typography>
        </div>
        {data?.approved_by?.name ?
          <div className="clmn">

            <Typography variant="h6">Approved By:</Typography>
            <Typography
              variant="body1"
              className="text-slate-500 mb-2"
            >
              {data?.approved_by?.name}
            </Typography>

          </div> : ""}
        {data?.approved_date ?
          <div className="clmn">

            <Typography variant="h6">Approved Date:</Typography>
            <Typography
              variant="body1"
              className="text-slate-500 mb-2"
            >
              {data?.approved_date}
            </Typography>

          </div> : ""}
      </div>


      <h2>Timeline</h2>
      <div className="rw timeline">
        {
          data?.shipment_date ?
            <div className="clmn">

              <Typography variant="h6">Shipment Date:</Typography>
              <Typography variant="body1" className="text-slate-500 mb-2">
                {data?.shipment_date}
              </Typography>
            </div> :
            ""}

        {data?.total_time_taken ?
          <div className="clmn">

            <Typography variant="h6">Total Time Taken:</Typography>
            <Typography variant="body1" className="text-slate-500 mb-2">
              {data?.total_time_taken}
            </Typography>
          </div> : ""}
      </div>
      <div className="rw">
        <div className="clmn activities-clmn">
          <Typography variant="h6">Transfer Requested Items:</Typography>
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
                  <Typography noWrap>Available</Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap>Requested</Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap>Shipped</Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap>Shipped not Received</Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap>Received</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.transfer_items?.map((item: Data) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item?.item?.no}</TableCell>
                    <TableCell>{item?.item?.name}</TableCell>
                    <TableCell>{item?.available_balance}</TableCell>
                    <TableCell>{item?.requested_quantity}</TableCell>
                    <TableCell>{item?.total_shipped_quantity}</TableCell>
                    <TableCell>{item?.shipped_quantity}</TableCell>
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
      titleBase="Transfer"
      id={entityState.id}
      entityState={entityState}
      renderButtons={renderButtons}
      renderDetails={renderDetails}
    />
  );
};

export default Detail;
